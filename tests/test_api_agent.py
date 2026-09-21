import importlib.util
import json
import shutil
import subprocess
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("api_agent", ROOT / "evals/scripts/api_agent.py")
api = importlib.util.module_from_spec(spec)
spec.loader.exec_module(api)
SKILL = "vchart-development-assistant"


@pytest.fixture
def workspace(tmp_path):
    root = tmp_path / "case/workspace"
    shutil.copytree(ROOT / "skills" / SKILL, root / ".agents/skills" / SKILL)
    (root / "inputs").mkdir()
    (root / "outputs").mkdir()
    return root


@pytest.fixture
def config(tmp_path, monkeypatch):
    path = tmp_path / "model.json"
    path.write_text(json.dumps({"base_url": "https://example.invalid/v1", "model": "test-model"}))
    monkeypatch.setenv("SKILLS_EVAL_API_KEY", "fixture-secret-do-not-log")
    return api.load_config(path)


def response(*calls, answer="Done", finish=None, tokens=10):
    message = {"role": "assistant", "content": None if calls else answer}
    if calls:
        message["tool_calls"] = [
            {
                "id": f"call-{i}",
                "type": "function",
                "function": {"name": name, "arguments": json.dumps(args)},
            }
            for i, (name, args) in enumerate(calls)
        ]
    return {
        "choices": [
            {"message": message, "finish_reason": finish or ("tool_calls" if calls else "stop")}
        ],
        "usage": {"prompt_tokens": tokens - 2, "completion_tokens": 2, "total_tokens": tokens},
    }


def test_api_config_rejects_embedded_credentials_and_unknown_options(tmp_path):
    path = tmp_path / "model.json"
    for extra in [
        {"api_key": "do-not-store"},
        {"base_url": "https://user:secret@example.invalid/v1"},
        {"limits": {"max_requests": 0}},
        {"request_options": {"messages": []}},
    ]:
        path.write_text(
            json.dumps({"base_url": "https://example.invalid/v1", "model": "test", **extra})
        )
        with pytest.raises(ValueError):
            api.load_config(path)


def test_api_config_supports_model_override_and_legacy_token_parameter(tmp_path):
    path = tmp_path / "model.json"
    path.write_text(
        json.dumps(
            {
                "base_url": "https://example.invalid/v1/",
                "model": "MODEL_ID",
                "output_token_parameter": "max_tokens",
            }
        )
    )
    config = api.load_config(path, "override")
    assert (config["model"], config["base_url"], config["output_token_parameter"]) == (
        "override",
        "https://example.invalid/v1",
        "max_tokens",
    )


def test_tools_confine_reads_and_writes_and_reject_symlink_escape(workspace, tmp_path):
    tools = api.WorkspaceTools(workspace, SKILL, 100)
    (workspace / "outputs/escape").symlink_to(tmp_path, target_is_directory=True)
    for name, write in [
        ("../expectations.json", False),
        ("outputs/escape/secret", False),
        (f".agents/skills/{SKILL}/SKILL.md", True),
        ("inputs/data.csv", True),
    ]:
        with pytest.raises(ValueError, match="outside"):
            tools.path(name, write=write)


def test_read_tool_can_retrieve_complete_data_in_bounded_chunks(workspace):
    (workspace / "inputs/data.txt").write_text("abcdefghij")
    tools = api.WorkspaceTools(workspace, SKILL, 6)
    first = tools.call("read_file", {"path": "inputs/data.txt"}, 10)
    second = tools.call(
        "read_file", {"path": "inputs/data.txt", "offset": first["next_offset"]}, 10
    )
    assert (first["text"] + second["text"], first["truncated"], second["truncated"]) == (
        "abcdefghij",
        True,
        False,
    )


def test_script_tool_runs_real_generator_and_rejects_arbitrary_execution(workspace):
    tools = api.WorkspaceTools(workspace, SKILL, 2000)
    tools.call(
        "write_file",
        {"path": "outputs/spec.js", "content": "const spec = { type: 'bar', data: [] };"},
        10,
    )
    result = tools.call(
        "run_skill_script",
        {"script": "generate_demo_html.py", "args": ["--spec-file", "outputs/spec.js"]},
        10,
    )
    assert result["exit_code"] == 0 and (workspace / "outputs/demo.html").is_file()
    with pytest.raises(ValueError):
        tools.call("run_skill_script", {"script": "../../other.py", "args": []}, 10)
    with pytest.raises(ValueError):
        tools.call(
            "run_skill_script",
            {"script": "generate_demo_html.py", "args": ["--output", "../escaped.html"]},
            10,
        )


def test_loop_executes_tools_tracks_usage_and_redacts_logs(workspace, config, capsys):
    payloads = []
    replies = iter(
        [
            response(("write_file", {"path": "outputs/spec.js", "content": "const spec = {};"})),
            response(answer="Done fixture-secret-do-not-log"),
        ]
    )

    def transport(config, key, payload, timeout):
        payloads.append(json.loads(json.dumps(payload)))
        return next(replies)

    api.run(config, workspace, SKILL, "Generate a chart", 30, transport)
    usage = json.loads((workspace.parent / "usage.json").read_text())
    assert (usage["requests"], usage["toolCalls"], usage["totalTokens"], usage["status"]) == (
        2,
        1,
        20,
        "completed",
    )
    assert (workspace / ".agents/skills" / SKILL / "SKILL.md").read_text() in payloads[0][
        "messages"
    ][0]["content"]
    assert payloads[1]["messages"][-1]["tool_call_id"] == "call-0"
    assert "fixture-secret-do-not-log" not in capsys.readouterr().out
    assert "fixture-secret-do-not-log" not in (workspace.parent / "response-002.json").read_text()


@pytest.mark.parametrize(
    "limit,value,error",
    [
        ("max_requests", 1, "request limit"),
        ("max_total_tokens", 5, "token budget"),
        ("max_tool_calls", 1, "Tool-call limit"),
    ],
)
def test_loop_stops_at_budgets(workspace, config, limit, value, error):
    config["limits"][limit] = value
    reply = response(("list_files", {"path": "inputs"}), ("list_files", {"path": "outputs"}))
    with pytest.raises(RuntimeError, match=error):
        api.run(config, workspace, SKILL, "Task", 30, lambda *args: reply)
    assert json.loads((workspace.parent / "usage.json").read_text())["status"] == "failed"


@pytest.mark.parametrize("kind", ["missing-usage", "length", "transport"])
def test_incomplete_api_execution_is_not_a_success(workspace, config, kind):
    def transport(*args):
        if kind == "transport":
            raise TimeoutError("connection lost")
        reply = response(finish="length" if kind == "length" else "stop")
        if kind == "missing-usage":
            reply.pop("usage")
        return reply

    with pytest.raises((RuntimeError, TimeoutError)):
        api.run(config, workspace, SKILL, "Task", 30, transport)
    usage = json.loads((workspace.parent / "usage.json").read_text())
    assert usage["status"] == "failed"
    assert usage["complete"] is (kind == "length")


def test_image_input_is_sent_but_base64_is_not_persisted(workspace, config):
    image = ROOT / "evals/cases/vchart-development-assistant/inputs/reference-bars.png"
    # Find by fixture name to keep the input directory layout independent of this test.
    image = next((ROOT / "evals/cases").rglob(image.name))
    shutil.copyfile(image, workspace / "inputs/reference.png")
    payloads = []

    def transport(config, key, payload, timeout):
        payloads.append(payload)
        return response()

    api.run(config, workspace, SKILL, "Use image", 30, transport)
    assert payloads[0]["messages"][1]["content"][1]["image_url"]["url"].startswith(
        "data:image/png;base64,"
    )
    logged = (workspace.parent / "request-001.json").read_text()
    assert "data:image/png;base64," not in logged and '"dataUrlOmitted": true' in logged


@pytest.mark.parametrize("custom", [False, True])
@pytest.mark.parametrize("azure_headers", [False, True])
def test_default_runner_uses_http_api_without_codex(tmp_path, monkeypatch, custom, azure_headers):
    runner_spec = importlib.util.spec_from_file_location(
        "http_test_runner", ROOT / "evals/scripts/run.py"
    )
    runner = importlib.util.module_from_spec(runner_spec)
    runner_spec.loader.exec_module(runner)
    monkeypatch.syspath_prepend(str(ROOT / "evals/scripts"))
    monkeypatch.setattr(runner, "ROOT", tmp_path)
    (tmp_path / "evals").mkdir()
    (tmp_path / "evals/scripts").symlink_to(ROOT / "evals/scripts", target_is_directory=True)
    (tmp_path / "skills").symlink_to(ROOT / "skills", target_is_directory=True)
    monkeypatch.setenv("SKILLS_EVAL_API_KEY", "http-fixture-key")
    seen = []

    class Handler(BaseHTTPRequestHandler):
        def do_POST(self):
            seen.append(
                (
                    self.path,
                    self.headers.get("api-key")
                    if azure_headers
                    else self.headers.get("Authorization"),
                    json.loads(self.rfile.read(int(self.headers["Content-Length"]))),
                )
            )
            reply = (
                response(("list_files", {"path": "inputs"}))
                if len(seen) == 1
                else response(answer="Enable label.visible in the chart configuration.")
            )
            data = json.dumps(reply).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)

        def log_message(self, *args):
            pass

    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    config_path = tmp_path / "model.json"
    config_path.write_text(
        json.dumps(
            {
                "base_url": f"http://127.0.0.1:{server.server_port}/v1",
                "model": "local-fixture",
                **(
                    {"api_key_header": "api-key", "api_version": "2024-03-01-preview"}
                    if azure_headers
                    else {}
                ),
            }
        )
    )
    selection = ["--case", "vchart-qa-label"]
    if custom:
        prompt_file = tmp_path / "prompt.md"
        prompt_file.write_text("Explain how to show labels for my supplied data.")
        input_file = tmp_path / "sales.csv"
        input_file.write_text("region,sales\nNorth,12\n")
        selection = [
            "--skill",
            SKILL,
            "--prompt-file",
            str(prompt_file),
            "--input",
            str(input_file),
        ]
    monkeypatch.setattr(sys, "argv", ["run.py", "--config", str(config_path), *selection])
    try:
        with pytest.raises(SystemExit) as completed:
            runner.main()
        assert completed.value.code == 0
    finally:
        server.shutdown()
        server.server_close()
        thread.join()
    directory = next((tmp_path / "evals/runs").glob("*/custom" if custom else "*/vchart-qa-label"))
    assert json.loads((directory / "metadata.json").read_text())["runner"] == "api"
    assert json.loads((directory / "result.json").read_text())["status"] == "needs-review"
    assert json.loads((directory / "usage.json").read_text())["totalTokens"] == 20
    assert seen[0][:2] == (
        "/v1/chat/completions?api-version=2024-03-01-preview"
        if azure_headers
        else "/v1/chat/completions",
        "http-fixture-key" if azure_headers else "Bearer http-fixture-key",
    )
    assert seen[1][2]["messages"][-1]["role"] == "tool"
    if custom:
        assert (directory / "workspace/inputs/sales.csv").read_bytes() == input_file.read_bytes()
        assert "inputs/sales.csv" in (directory / "prompt.txt").read_text()
        assert json.loads((directory / "expectations.json").read_text())["artifacts"] == []
    assert "http-fixture-key" not in "".join(p.read_text() for p in directory.glob("*.json*"))


def test_listing_does_not_need_model_config_or_credentials(tmp_path):
    result = subprocess.run(
        [
            sys.executable,
            str(ROOT / "evals/scripts/run.py"),
            "--config",
            str(tmp_path / "missing.json"),
            "--group",
            "all",
            "--list",
        ],
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0 and len(result.stdout.splitlines()) == 36
