"""Run fixed or custom Skill tasks via a model API or an optional Codex CLI."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import signal
import subprocess
import sys
import threading
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CASES = ROOT / "evals/cases"
SKILLS = sorted(path.parent.name for path in (ROOT / "skills").glob("*/SKILL.md"))
DEFAULT_SKILL = "vchart-development-assistant"


def load_tasks() -> list[dict]:
    tasks = []
    ids = set()
    for catalog in sorted(CASES.glob("*/tasks.json")):
        skill = catalog.parent.name
        if skill not in SKILLS:
            raise ValueError(f"Case catalog has no matching runtime Skill: {skill}")
        for task in json.loads(catalog.read_text(encoding="utf-8")):
            if task["skill"] != skill:
                raise ValueError(f"Case {task['id']} does not belong to catalog {skill}")
            if task["id"] in ids:
                raise ValueError(f"Duplicate case id: {task['id']}")
            ids.add(task["id"])
            tasks.append(task)
    return tasks


def select_tasks(
    tasks: list[dict], skill: str | None, cases: list[str] | None, group: str | None
) -> list[dict]:
    if skill:
        tasks = [task for task in tasks if task["skill"] == skill]
    if cases:
        unknown = set(cases) - {task["id"] for task in tasks}
        if unknown:
            raise ValueError(f"Unknown case ids for selected Skill(s): {sorted(unknown)}")
        tasks = [task for task in tasks if task["id"] in cases]
    elif group != "all":
        tasks = [
            task
            for task in tasks
            if task["skill"] == (skill or DEFAULT_SKILL) and task["group"] == (group or "core")
        ]
    if not tasks:
        raise ValueError("No cases match the selected Skill/group; use --group all --list")
    return tasks


def load_expectations(task: dict) -> dict:
    path = CASES / task["skill"] / "expectations.json"
    return json.loads(path.read_text(encoding="utf-8"))[task["id"]]


def custom_task(skill: str, prompt_file: Path, inputs: list[Path], html: str | None) -> dict:
    prompt = prompt_file.read_text(encoding="utf-8").strip()
    if not prompt:
        raise ValueError("Prompt file must not be empty")
    sources = {}
    for source in inputs:
        source = source.resolve()
        if not source.is_file():
            raise ValueError(f"Input must be a file: {source}")
        if source.name in sources:
            raise ValueError(f"Duplicate input filename: {source.name}")
        sources[source.name] = str(source)
    if html and (
        Path(html).is_absolute() or ".." in Path(html).parts or Path(html).suffix != ".html"
    ):
        raise ValueError("--html must be a relative .html path inside outputs/")
    return {
        "id": "custom",
        "skill": skill,
        "prompt": prompt,
        "inputs": list(sources),
        "inputSources": sources,
        "promptSource": str(prompt_file.resolve()),
    }


def write_json(path: Path, value) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def redact(text: str) -> str:
    # Do not persist environment values or common credential forms in event/tool logs.
    for key, value in os.environ.items():
        if re.search(r"TOKEN|SECRET|PASSWORD|API_KEY|COOKIE", key, re.I) and len(value) >= 8:
            text = text.replace(value, "[REDACTED]")
    text = re.sub(r"(?i)(Bearer\s+)[A-Za-z0-9._~+/=-]+", r"\1[REDACTED]", text)
    return re.sub(
        r'(?i)(["\']?(?:api[_-]?key|access[_-]?token|authorization|password)["\']?\s*[:=]\s*["\']?)[^\s"\',}]+',
        r"\1[REDACTED]",
        text,
    )


def prepare(task: dict, destination: Path, previous_workspace: Path | None = None) -> Path:
    workspace = destination / "workspace"
    if previous_workspace is not None:
        shutil.copytree(previous_workspace, workspace)
        return workspace
    installed = workspace / ".agents/skills" / task["skill"]
    shutil.copytree(
        ROOT / "skills" / task["skill"],
        installed,
        ignore=shutil.ignore_patterns("__pycache__", "*.pyc", "out"),
    )
    (workspace / "inputs").mkdir(parents=True)
    (workspace / "outputs").mkdir()
    for filename in task["inputs"]:
        if Path(filename).name != filename:
            raise ValueError(f"Input must be a simple filename: {filename}")
        source = task.get("inputSources", {}).get(
            filename, CASES / task["skill"] / "inputs" / filename
        )
        shutil.copy2(source, workspace / "inputs" / filename)
    return workspace


def capture(command: list[str], prompt: str, directory: Path, timeout: int) -> dict:
    started = time.monotonic()
    process = subprocess.Popen(
        command,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        start_new_session=True,
    )

    def drain(stream, filename):
        with (directory / filename).open("w", encoding="utf-8") as output:
            for line in stream:
                output.write(redact(line))
                output.flush()

    workers = [
        threading.Thread(target=drain, args=(process.stdout, "events.jsonl")),
        threading.Thread(target=drain, args=(process.stderr, "stderr.log")),
    ]
    for worker in workers:
        worker.start()
    timed_out = False
    try:
        process.stdin.write(prompt)
        process.stdin.close()
        process.wait(timeout=timeout)
    except subprocess.TimeoutExpired:
        timed_out = True
        os.killpg(process.pid, signal.SIGTERM)
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            os.killpg(process.pid, signal.SIGKILL)
            process.wait()
    finally:
        for worker in workers:
            worker.join(timeout=10)
    return {
        "exitCode": process.returncode,
        "timedOut": timed_out,
        "durationSeconds": round(time.monotonic() - started, 2),
    }


def evaluate_files(task: dict, directory: Path, execution: dict) -> dict:
    snapshot = directory / "expectations.json"
    expected = json.loads(snapshot.read_text()) if snapshot.exists() else load_expectations(task)
    outputs = directory / "workspace/outputs"
    checks = [
        {
            "name": "agentExecution",
            "passed": execution.get("exitCode") == 0 and not execution.get("timedOut"),
        }
    ]
    for filename in expected.get("artifacts", ["spec.js", expected.get("html", "demo.html")]):
        file = outputs / filename
        checks.append(
            {"name": f"artifact:{filename}", "passed": file.is_file() and file.stat().st_size > 0}
        )
    if expected.get("answerOnly") or expected.get("requireAnswer"):
        answer = directory / "final-response.md"
        checks.append(
            {
                "name": "nonemptyAnswer",
                "passed": answer.exists() and bool(answer.read_text().strip()),
            }
        )
    if expected.get("answerOnly"):
        checks.append(
            {
                "name": "noGeneratedArtifacts",
                "passed": not any(p.is_file() for p in outputs.rglob("*")),
            }
        )
    previous = execution.get("previousArtifacts")
    if previous is not None:
        checks.append(
            {
                "name": "editedSource",
                "passed": (outputs / "spec.js").is_file()
                and digest(outputs / "spec.js") != previous.get("spec.js"),
            }
        )
    browser = directory / "browser.json"
    browser_result = (
        json.loads(browser.read_text())
        if browser.exists()
        else {"status": "not-applicable" if expected.get("answerOnly") else "not-run"}
    )
    report = {
        "checks": checks,
        "browser": browser_result,
        "visualReview": {"status": "not-run", "checklist": expected["review"]},
        "artifacts": [
            {"path": str(p.relative_to(directory)), "sha256": digest(p)}
            for p in sorted(outputs.rglob("*"))
            if p.is_file()
        ],
    }
    report["status"] = (
        "failed"
        if not all(c["passed"] for c in checks) or browser_result["status"] == "failed"
        else "needs-review"
    )
    write_json(directory / "result.json", report)
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--case", action="append", help="Task id; repeat to select several. Overrides --group."
    )
    parser.add_argument(
        "--group",
        choices=["core", "extended", "all"],
        help="Group within a Skill (default: core); all includes all Skills unless --skill is set",
    )
    parser.add_argument(
        "--skill",
        choices=SKILLS,
        help="Select a fixed case catalog or the Skill for --prompt-file (default catalog: VChart)",
    )
    parser.add_argument("--prompt-file", type=Path, help="UTF-8 prompt file for a custom task")
    parser.add_argument(
        "--input",
        type=Path,
        action="append",
        default=[],
        help="Custom input file; repeat for multiple files",
    )
    parser.add_argument(
        "--html", help="Custom task HTML path relative to outputs/; required with --browser"
    )
    parser.add_argument(
        "--list", action="store_true", help="List selected tasks without running an Agent"
    )
    parser.add_argument("--runner", choices=["api", "codex"], default="api")
    parser.add_argument(
        "--config",
        type=Path,
        default=ROOT / "evals/model.local.json",
        help="API configuration (default: evals/model.local.json)",
    )
    parser.add_argument("--agent", help="Codex executable path; only with --runner codex")
    parser.add_argument("--model", help="Override the model in the selected runner's configuration")
    parser.add_argument("--timeout", type=int, default=600)
    parser.add_argument(
        "--browser", action="store_true", help="Run local Playwright checks after generation"
    )
    args = parser.parse_args()
    custom = bool(args.prompt_file or args.input or args.html)
    if custom:
        if not args.skill or not args.prompt_file:
            parser.error("Custom tasks require both --skill and --prompt-file")
        if args.case or args.group:
            parser.error("Custom tasks cannot be combined with --case or --group")
        if args.browser and not args.html:
            parser.error("Custom --browser checks require --html, e.g. --html demo.html")
        try:
            tasks = [custom_task(args.skill, args.prompt_file, args.input, args.html)]
        except (OSError, ValueError) as error:
            parser.error(str(error))
    else:
        try:
            tasks = select_tasks(load_tasks(), args.skill, args.case, args.group)
        except (OSError, ValueError, KeyError, TypeError) as error:
            parser.error(f"Invalid case selection: {error}")
    if args.list:
        for task in tasks:
            print(
                f"{task['id']} ({task['skill']}, {task.get('group')}, {len(task.get('steps', [task['prompt']]))} turn(s))"
            )
        return
    expanded = []
    for task in tasks:
        if task.get("steps"):
            expanded.extend(
                {**task, "prompt": prompt, "turn": i + 1} for i, prompt in enumerate(task["steps"])
            )
        else:
            expanded.append(task)
    tasks = expanded
    if args.timeout <= 0:
        parser.error("--timeout must be positive")
    api_config = None
    if args.runner == "api":
        from api_agent import load_config

        if args.agent:
            parser.error("--agent is only supported with --runner codex")
        try:
            api_config = load_config(args.config, args.model)
        except (OSError, ValueError, TypeError) as error:
            parser.error(
                f"Invalid API config: {error}. Copy evals/model.example.json to evals/model.local.json and configure it."
            )
        if not os.environ.get(api_config["api_key_env"]):
            parser.error(
                f"Set credential environment variable {api_config['api_key_env']} before running API evaluations"
            )
        version = "api-agent/1"
    else:
        executable = shutil.which(args.agent or "codex")
        if not executable:
            parser.error(f"Agent executable not found: {args.agent or 'codex'}")
        try:
            version = subprocess.check_output(
                [executable, "--version"], text=True, timeout=15
            ).strip()
        except (OSError, subprocess.SubprocessError) as error:
            parser.error(f"Cannot start Agent {executable}: {error}")
    run = (
        ROOT
        / "evals/runs"
        / (datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ") + "-" + uuid.uuid4().hex[:8])
    )
    run.mkdir(parents=True)
    if api_config:
        write_json(run / "model-config.json", api_config)
    rows = [
        "# Skill task results",
        "",
        "Model output varies. Automated checks do not replace visual review.",
        "",
    ]
    failed = False
    blocked = set()
    for task in tasks:
        directory = run / task["id"]
        label = task["id"]
        previous_workspace = None
        if task.get("turn"):
            directory /= f"turn-{task['turn']}"
            label += f"/turn-{task['turn']}"
            if task["id"] in blocked:
                directory.mkdir(parents=True)
                write_json(
                    directory / "result.json",
                    {"status": "not-run", "reason": "Previous turn failed"},
                )
                rows.append(f"- {label}: not-run (previous turn failed)")
                (run / "README.md").write_text("\n".join(rows) + "\n")
                continue
            if task["turn"] > 1:
                previous_workspace = run / task["id"] / f"turn-{task['turn'] - 1}" / "workspace"
        workspace = prepare(task, directory, previous_workspace)
        expected = (
            {
                "artifacts": [args.html] if args.html else [],
                "html": args.html,
                "engine": {
                    "vchart-development-assistant": "vchart",
                    "vtable-development-assistant": "vtable",
                }.get(task["skill"]),
                "requireAnswer": True,
                "review": [
                    "Compare the answer and artifacts with the supplied prompt and complete inputs; no case-specific correctness assertions are configured."
                ],
            }
            if custom
            else load_expectations(task)
        )
        write_json(directory / "expectations.json", expected)
        previous_artifacts = (
            {p.name: digest(p) for p in (workspace / "outputs").glob("*") if p.is_file()}
            if previous_workspace
            else None
        )
        instruction = f"Load only the installed skill .agents/skills/{task['skill']}/SKILL.md and its bundled resources. Work in this directory. Do not inspect other repositories, evaluation expectations or global skills. Use the input files as the data source. Write final artifacts under outputs/. Do not modify the installed skill.\n\n{task['prompt']}"
        if custom:
            instruction += "\n\nAvailable input files: " + json.dumps(
                [f"inputs/{f}" for f in task["inputs"]], ensure_ascii=False
            )
            if args.html:
                instruction += f"\nRequested HTML artifact: outputs/{args.html}"
        (directory / "prompt.txt").write_text(instruction, encoding="utf-8")
        if api_config:
            command = [
                sys.executable,
                str(ROOT / "evals/scripts/api_agent.py"),
                "--config",
                str(run / "model-config.json"),
                "--workspace",
                str(workspace),
                "--skill",
                task["skill"],
                "--timeout",
                str(args.timeout),
            ]
        else:
            command = [
                executable,
                "exec",
                "--skip-git-repo-check",
                "--ephemeral",
                "--json",
                "--sandbox",
                "workspace-write",
                "-c",
                'approval_policy="never"',
                "-c",
                "project_doc_max_bytes=0",
                "-C",
                str(workspace),
                "-",
            ]
            if args.model:
                command[2:2] = ["--model", args.model]
        metadata = {
            "task": task,
            "runner": args.runner,
            "agentVersion": version,
            "model": api_config["model"]
            if api_config
            else args.model or "user-configured (see agent events)",
            "apiConfig": api_config,
            "startedAt": datetime.now(timezone.utc).isoformat(),
            "command": command,
            "skillFiles": {
                str(p.relative_to(workspace)): digest(p)
                for p in sorted((workspace / ".agents").rglob("*"))
                if p.is_file()
            },
            "inputs": {f: digest(workspace / "inputs" / f) for f in task["inputs"]},
        }
        write_json(directory / "metadata.json", metadata)
        print(f"Running {task['id']}: {directory}", flush=True)
        try:
            execution = capture(command, instruction, directory, args.timeout)
        except OSError as error:
            execution = {"exitCode": None, "error": str(error)}
        execution["finishedAt"] = datetime.now(timezone.utc).isoformat()
        if previous_artifacts is not None:
            execution["previousArtifacts"] = previous_artifacts
        write_json(directory / "execution.json", execution)
        # Both workers emit completed assistant messages in the same event envelope.
        messages = []
        for line in (
            (directory / "events.jsonl").read_text().splitlines()
            if (directory / "events.jsonl").exists()
            else []
        ):
            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                continue
            item = event.get("item", {})
            if event.get("type") == "item.completed" and item.get("type") == "agent_message":
                messages.append(item.get("text", ""))
        (directory / "final-response.md").write_text("\n\n".join(messages), encoding="utf-8")
        if args.browser and expected.get("html"):
            checked = subprocess.run(
                ["node", str(ROOT / "evals/scripts/check-browser.mjs"), str(directory)],
                capture_output=True,
                text=True,
                check=False,
            )
            (directory / "browser-command.log").write_text(redact(checked.stdout + checked.stderr))
            if checked.returncode and not (directory / "browser.json").exists():
                write_json(
                    directory / "browser.json",
                    {
                        "status": "failed",
                        "error": "Browser checker failed; see browser-command.log",
                    },
                )
        result = evaluate_files(task, directory, execution)
        failed |= result["status"] == "failed"
        if result["status"] == "failed":
            blocked.add(task["id"])
        output = (
            f"workspace/outputs/{expected['html']}" if expected.get("html") else "final-response.md"
        )
        rows.append(
            f"- [{label}]({label}/result.json): {result['status']} · [logs]({label}/events.jsonl) · [output]({label}/{output})"
        )
        (run / "README.md").write_text("\n".join(rows) + "\n", encoding="utf-8")
        print(f"{task['id']}: {result['status']}", flush=True)
    print(f"Report: {run / 'README.md'}", flush=True)
    raise SystemExit(1 if failed else 0)


if __name__ == "__main__":
    main()
