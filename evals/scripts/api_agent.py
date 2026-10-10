"""Small, bounded Chat Completions tool loop for installed Skills."""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

DEFAULT_LIMITS = {
    "max_requests": 16,
    "max_tool_calls": 48,
    "max_total_tokens": 60000,
    "max_context_chars": 120000,
    "max_tool_output_chars": 12000,
    "request_timeout_seconds": 90,
}
SCRIPTS = {
    "generate_demo_html.py",
    "generate_diagnosis_html.py",
    "generate_diagnosis_react_html.py",
    "search_knowledge.py",
}

# Keep imports in the installed Skill; do not expose a --skill-dir override.
STORY_SCRIPTS = {
    "assemble_story_specs.py": {
        "--plan-file": "read",
        "--dataset-json": "read",
        "--specs-json": "read",
        "--output": "write",
        "--requests-output": "write",
    },
    "normalize_story_assets.py": {
        "--plan-file": "read",
        "--assets-dir": "read",
        "--user-assets-dir": "read",
        "--output": "write",
        "--report-output": "write",
    },
    "compose_story.py": {
        "--target": "value",
        "--runtime-dir": "read",
        "--body-file": "read",
        "--config-file": "read",
        "--output": "write",
    },
    "validate_story_plan.py": {"--plan-file": "read", "--format": "value"},
    "validate_js.py": {},
    "build-html/scripts/prepare_story_head.py": {
        "--preset": "value",
        "--plan-file": "read",
        "--head-output": "write",
        "--format": "value",
    },
    "build-ppt/scripts/prepare_story_head.py": {
        "--preset": "value",
        "--plan-file": "read",
        "--head-output": "write",
        "--format": "value",
    },
}


def load_config(path: Path, model: str | None = None) -> dict:
    config = json.loads(path.read_text(encoding="utf-8"))
    direct_key = config.pop("api_key", None) if isinstance(config, dict) else None
    if direct_key is not None:
        if not path.name.endswith(".local.json"):
            raise ValueError("api_key is allowed only in a local config (*.local.json)")
        if not isinstance(direct_key, str) or not direct_key.strip():
            raise ValueError("api_key must be a nonempty string")
    allowed = {
        "api",
        "base_url",
        "model",
        "api_key_env",
        "api_key_header",
        "api_version",
        "max_output_tokens",
        "output_token_parameter",
        "request_options",
        "limits",
    }
    if not isinstance(config, dict) or set(config) - allowed:
        raise ValueError(
            "API config must be an object with documented keys; put credentials in the named environment variable"
        )
    if config.get("api", "openai-chat-completions") != "openai-chat-completions":
        raise ValueError("Only openai-chat-completions is currently supported")
    config["api"] = "openai-chat-completions"
    config["model"] = model or config.get("model")
    if (
        not isinstance(config["model"], str)
        or not config["model"].strip()
        or config["model"] in {"MODEL_ID", "YOUR_MODEL_ID"}
    ):
        raise ValueError("Set a real model id in the API config or with --model")
    url = urllib.parse.urlsplit(config.get("base_url", ""))
    if (
        url.scheme not in {"http", "https"}
        or not url.hostname
        or url.username
        or url.password
        or url.query
        or url.fragment
    ):
        raise ValueError(
            "base_url must be an HTTP(S) API base URL without credentials, query or fragment"
        )
    config["base_url"] = config["base_url"].rstrip("/")
    if config["base_url"].endswith("/chat/completions"):
        raise ValueError(
            "base_url is the API base, such as https://api.openai.com/v1, not the completions endpoint"
        )
    config.setdefault("api_key_env", "SKILLS_EVAL_API_KEY")
    config.setdefault("api_key_header", "Authorization")
    if config["api_key_header"] not in {"Authorization", "api-key"}:
        raise ValueError("api_key_header must be Authorization (Bearer) or api-key")
    if "api_version" in config and (
        not isinstance(config["api_version"], str)
        or not re.fullmatch(r"[A-Za-z0-9_.-]{1,64}", config["api_version"])
    ):
        raise ValueError("api_version must be a nonempty API version identifier")
    if not isinstance(config["api_key_env"], str) or not re.fullmatch(
        r"[A-Za-z_][A-Za-z0-9_]*", config["api_key_env"]
    ):
        raise ValueError("api_key_env must name an environment variable")
    if direct_key is not None:
        os.environ[config["api_key_env"]] = direct_key
    config.setdefault("max_output_tokens", 4096)
    config.setdefault("output_token_parameter", "max_completion_tokens")
    if config["output_token_parameter"] not in {"max_tokens", "max_completion_tokens"}:
        raise ValueError("output_token_parameter must be max_tokens or max_completion_tokens")
    config.setdefault("request_options", {})
    if not isinstance(config["request_options"], dict) or set(config["request_options"]) - {
        "temperature",
        "top_p",
        "reasoning_effort",
    }:
        raise ValueError("request_options supports only temperature, top_p and reasoning_effort")
    limits = config.get("limits", {})
    if not isinstance(limits, dict) or set(limits) - set(DEFAULT_LIMITS):
        raise ValueError("Unknown API limits")
    config["limits"] = {**DEFAULT_LIMITS, **limits}
    for name, value in {
        **config["limits"],
        "max_output_tokens": config["max_output_tokens"],
    }.items():
        if isinstance(value, bool) or not isinstance(value, int) or value <= 0:
            raise ValueError(f"{name} must be a positive integer")
    return config


def schema(name: str, description: str, properties: dict, required: list[str]) -> dict:
    return {
        "type": "function",
        "function": {
            "name": name,
            "description": description,
            "parameters": {
                "type": "object",
                "properties": properties,
                "required": required,
                "additionalProperties": False,
            },
        },
    }


STRING = {"type": "string"}
TOOLS = [
    schema(
        "read_file",
        "Read UTF-8 text from the selected Skill, inputs or outputs. Offsets/limits count characters; use next_offset until truncated=false for complete data.",
        {
            "path": STRING,
            "offset": {"type": "integer", "minimum": 0},
            "limit": {"type": "integer", "minimum": 1},
        },
        ["path"],
    ),
    schema(
        "list_files",
        "List one directory inside the selected Skill, inputs or outputs; no recursive scanning.",
        {"path": STRING},
        ["path"],
    ),
    schema(
        "write_file",
        "Write complete UTF-8 content to a file under outputs/. No other directory is writable.",
        {"path": STRING, "content": STRING},
        ["path", "content"],
    ),
    schema(
        "run_skill_script",
        "Run a bundled Python Skill script by filename (or build-html/scripts/prepare_story_head.py or build-ppt/scripts/prepare_story_head.py) with separate CLI arguments. No shell, arbitrary Python or generated code execution. Read the script/help for supported flags. Output paths must be inside outputs/. Omit --skill-dir; the installed directory is automatic.",
        {"script": STRING, "args": {"type": "array", "items": STRING}},
        ["script", "args"],
    ),
]


class WorkspaceTools:
    def __init__(self, workspace: Path, skill: str, max_output: int):
        self.workspace = workspace.resolve()
        self.skill = self.workspace / ".agents/skills" / skill
        if not self.skill.resolve().is_relative_to(self.workspace / ".agents/skills"):
            raise ValueError("Skill must be installed inside the workspace")
        self.roots = [self.skill.resolve(), self.workspace / "inputs", self.workspace / "outputs"]
        self.max_output = max_output

    def path(self, name: str, write: bool = False) -> Path:
        if not isinstance(name, str):
            raise ValueError("path must be a string")
        candidate = (self.workspace / name).resolve()
        roots = [self.roots[-1]] if write else self.roots
        if not any(candidate.is_relative_to(root) for root in roots):
            raise ValueError("Path is outside the allowed workspace directories")
        return candidate

    def call(self, name: str, args: dict, timeout: float) -> dict:
        if not isinstance(args, dict):
            raise ValueError("Tool arguments must be an object")
        if name == "read_file":
            file = self.path(args["path"])
            if file.stat().st_size > 2_000_000:
                raise ValueError("Text file exceeds 2 MB")
            text = file.read_text(encoding="utf-8")
            offset = args.get("offset", 0)
            limit = args.get("limit", self.max_output)
            if type(offset) is not int or type(limit) is not int or offset < 0 or limit < 1:
                raise ValueError("offset and limit must be nonnegative/positive integers")
            end = min(len(text), offset + min(limit, self.max_output))
            return {
                "text": text[offset:end],
                "next_offset": end,
                "total_chars": len(text),
                "truncated": end < len(text),
            }
        if name == "list_files":
            entries = sorted(p.name for p in self.path(args["path"]).iterdir())
            selected = []
            size = 0
            for entry in entries[:100]:
                size += len(entry) + 4
                if size > self.max_output:
                    break
                selected.append(entry)
            return {"entries": selected, "truncated": len(entries) > len(selected)}
        if name == "write_file":
            file = self.path(args["path"], write=True)
            content = args["content"]
            if not isinstance(content, str) or len(content) > 200_000:
                raise ValueError("content must be a string of at most 200000 characters")
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_text(content, encoding="utf-8")
            return {"path": str(file.relative_to(self.workspace)), "chars": len(content)}
        if name == "run_skill_script":
            return self.run_script(args["script"], args["args"], timeout)
        raise ValueError(f"Unknown tool: {name}")

    def run_script(self, name: str, args: list[str], timeout: float) -> dict:
        if self.skill.name == "data-storytelling" and name in STORY_SCRIPTS:
            return self.run_story_script(name, args, timeout)
        if name not in SCRIPTS or not (self.skill / "scripts" / name).is_file():
            raise ValueError("Not an allowed bundled script")
        script = self.path(str(self.skill / "scripts" / name))
        if not isinstance(args, list) or not all(isinstance(a, str) for a in args):
            raise ValueError("args must be a string array")
        flags = {"--validate", "--compact", "--help"}
        options = {
            "--title",
            "--desc",
            "--feature",
            "--tips",
            "--spec-file",
            "--config-file",
            "--output-dir",
            "--output",
            "--kind",
            "--query",
            "--limit",
            "--problem-code",
            "--problem-title",
            "--cause",
            "--suggestion",
        }
        normalized = []
        i = 0
        while i < len(args):
            flag = args[i]
            i += 1
            if flag in flags:
                normalized.append(flag)
                continue
            if flag not in options and not re.fullmatch(r"--solution-\d+-(title|desc|code)", flag):
                raise ValueError(f"Unsupported flag {flag}; use separate flag and value arguments")
            if i >= len(args):
                raise ValueError(f"Missing value for {flag}")
            value = args[i]
            i += 1
            if flag in {"--spec-file", "--config-file", "--output-dir", "--output"}:
                value = str(self.path(value, write=flag.startswith("--output")))
            normalized.extend([flag, value])
        if (
            name != "search_knowledge.py"
            and "--help" not in normalized
            and not ({"--output-dir", "--output"} & set(normalized))
        ):
            normalized.extend(["--output-dir", str(self.roots[-1])])
        env = {k: v for k, v in os.environ.items() if k in {"PATH", "LANG", "LC_ALL", "TMPDIR"}}
        result = subprocess.run(
            [sys.executable, "-B", str(script), *normalized],
            cwd=self.workspace,
            env=env,
            capture_output=True,
            text=True,
            timeout=min(timeout, 30),
            check=False,
        )
        return {
            "exit_code": result.returncode,
            "stdout": result.stdout[: self.max_output],
            "stderr": result.stderr[: self.max_output],
            "truncated": len(result.stdout) > self.max_output
            or len(result.stderr) > self.max_output,
        }

    def run_story_script(self, name: str, args: list[str], timeout: float) -> dict:
        relative = name if "/" in name else f"scripts/{name}"
        script = self.path(str(self.skill / relative))
        if not isinstance(args, list) or not all(isinstance(a, str) for a in args):
            raise ValueError("args must be a string array")
        if name == "validate_js.py":
            if len(args) != 1 or args[0].startswith("-"):
                raise ValueError("validate_js.py requires one HTML path")
            normalized = [str(self.path(args[0]))]
        elif args == ["--help"]:
            normalized = args
        else:
            policy = STORY_SCRIPTS[name]
            if len(args) % 2:
                raise ValueError("Use separate flag and value arguments")
            normalized = []
            for flag, value in zip(args[::2], args[1::2], strict=True):
                if flag not in policy:
                    raise ValueError(f"Unsupported flag {flag}")
                kind = policy[flag]
                if kind != "value":
                    value = str(self.path(value, write=kind == "write"))
                normalized.extend([flag, value])
        result = subprocess.run(
            [sys.executable, "-B", str(script), *normalized],
            cwd=self.workspace,
            env={k: v for k, v in os.environ.items() if k in {"PATH", "LANG", "LC_ALL", "TMPDIR"}},
            capture_output=True,
            text=True,
            timeout=min(timeout, 30),
            check=False,
        )
        return {
            "exit_code": result.returncode,
            "stdout": result.stdout[: self.max_output],
            "stderr": result.stderr[: self.max_output],
            "truncated": len(result.stdout) > self.max_output
            or len(result.stderr) > self.max_output,
        }


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def request(config: dict, key: str, payload: dict, timeout: float) -> dict:
    url = config["base_url"] + "/chat/completions"
    if config.get("api_version"):
        url += "?" + urllib.parse.urlencode({"api-version": config["api_version"]})
    header = config["api_key_header"]
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers={
            header: "Bearer " + key if header == "Authorization" else key,
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.build_opener(NoRedirect).open(req, timeout=timeout) as response:
            raw = response.read(8_000_001)
    except urllib.error.HTTPError as error:
        detail = error.read(4000).decode("utf-8", errors="replace")
        raise RuntimeError(f"Model API HTTP {error.code}: {scrub(detail, key)}") from None
    if len(raw) > 8_000_000:
        raise ValueError("API response exceeds 8 MB")
    return json.loads(raw)


def initial_messages(workspace: Path, skill: str, prompt: str) -> list[dict]:
    # Images are input attachments, not hidden expected answers. No SVG source is supplied.
    content = [{"type": "text", "text": prompt}]
    for image in sorted((workspace / "inputs").iterdir()):
        if image.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}:
            data = image.read_bytes()
            if len(data) > 4_000_000:
                raise ValueError("Image input exceeds 4 MB")
            mime = (
                "image/jpeg"
                if image.suffix.lower() in {".jpg", ".jpeg"}
                else "image/" + image.suffix[1:].lower()
            )
            content.append(
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:{mime};base64," + base64.b64encode(data).decode()},
                }
            )
    entry = workspace / ".agents/skills" / skill / "SKILL.md"
    system = f"You are executing a fixed Skill task. The selected Skill entry is included below, from .agents/skills/{skill}/SKILL.md; read only relevant bundled references as needed. Resolve Skill-relative references from .agents/skills/{skill}/. Follow that Skill and the user's task. Input files are in inputs/. Final artifacts belong in outputs/. Use run_skill_script for bundled generators; its args are an argv array, not shell text. No shell or arbitrary code runner is available. You can read templates and write source/HTML. Read every required input chunk; do not fabricate omitted data. Never claim to have opened a browser: independent checks run afterwards. For text-only requests give a final answer without files. Finish with a concise answer and actual output paths.\n\nSelected Skill instructions:\n{entry.read_text(encoding='utf-8')}"
    return [{"role": "system", "content": system}, {"role": "user", "content": content}]


def scrub(value, key: str):
    if isinstance(value, dict):
        return {k: scrub(v, key) for k, v in value.items()}
    if isinstance(value, list):
        return [scrub(v, key) for v in value]
    if isinstance(value, str):
        if value.startswith("data:image/"):
            return {
                "imageSha256": hashlib.sha256(value.encode()).hexdigest(),
                "dataUrlOmitted": True,
            }
        value = value.replace(key, "[REDACTED]") if key else value
        return re.sub(r"(?i)(Bearer\s+)[A-Za-z0-9._~+/=-]+", r"\1[REDACTED]", value)
    return value


def run(
    config: dict, workspace: Path, skill: str, prompt: str, timeout: int, transport=request
) -> dict:
    directory = workspace.parent
    key = os.environ.get(config["api_key_env"], "")
    if not key:
        raise ValueError(f"Missing credential environment variable: {config['api_key_env']}")
    limits = config["limits"]
    tools = WorkspaceTools(workspace, skill, limits["max_tool_output_chars"])
    messages = initial_messages(workspace, skill, prompt)
    usage = {
        "requests": 0,
        "toolCalls": 0,
        "promptTokens": 0,
        "completionTokens": 0,
        "totalTokens": 0,
        "cachedPromptTokens": 0,
        "complete": True,
    }
    started = time.monotonic()

    def emit(value):
        print(json.dumps(scrub(value, key), ensure_ascii=False), flush=True)

    def save(name, value):
        (directory / name).write_text(
            json.dumps(scrub(value, key), ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )

    def remaining():
        left = timeout - (time.monotonic() - started)
        if left <= 0:
            raise TimeoutError("API task deadline exceeded")
        return left

    status = "failed"
    try:
        for number in range(1, limits["max_requests"] + 1):
            if usage["totalTokens"] >= limits["max_total_tokens"]:
                raise RuntimeError("Cumulative provider-reported token budget reached")
            # Do not silently drop old tool results or instructions to fit a window.
            text_messages = scrub(messages, "")
            if len(json.dumps(text_messages, ensure_ascii=False)) > limits["max_context_chars"]:
                raise RuntimeError(
                    "Context character limit exceeded; inspect reads or raise max_context_chars"
                )
            payload = {
                **config["request_options"],
                "model": config["model"],
                "messages": messages,
                "tools": TOOLS,
                "stream": False,
                config["output_token_parameter"]: config["max_output_tokens"],
            }
            save(f"request-{number:03}.json", payload)
            emit({"type": "api.request", "request": number, "model": config["model"]})
            usage["requests"] += 1
            try:
                response = transport(
                    config, key, payload, min(remaining(), limits["request_timeout_seconds"])
                )
            except Exception:
                usage["complete"] = False
                raise
            save(f"response-{number:03}.json", response)
            raw_usage = response.get("usage") or {}
            if not all(
                type(raw_usage.get(k)) is int and raw_usage[k] >= 0
                for k in ["prompt_tokens", "completion_tokens", "total_tokens"]
            ):
                usage["complete"] = False
                raise RuntimeError("Provider omitted token usage; cannot enforce max_total_tokens")
            usage["promptTokens"] += raw_usage["prompt_tokens"]
            usage["completionTokens"] += raw_usage["completion_tokens"]
            usage["totalTokens"] += raw_usage["total_tokens"]
            cached = (raw_usage.get("prompt_tokens_details") or {}).get("cached_tokens", 0)
            usage["cachedPromptTokens"] += cached if type(cached) is int and cached >= 0 else 0
            save("usage.json", usage)
            emit({"type": "api.usage", "request": number, "usage": raw_usage})
            choice = response["choices"][0]
            message = choice["message"]
            if choice.get("finish_reason") not in {"stop", "tool_calls"}:
                raise RuntimeError(f"Model did not finish cleanly: {choice.get('finish_reason')}")
            assistant = {
                k: v
                for k, v in message.items()
                if k in {"role", "content", "tool_calls", "reasoning_content"}
            }
            assistant["role"] = "assistant"
            messages.append(assistant)
            calls = message.get("tool_calls") or []
            if not calls:
                answer = message.get("content")
                if not isinstance(answer, str) or not answer.strip():
                    raise RuntimeError("Empty final answer")
                emit({"type": "item.completed", "item": {"type": "agent_message", "text": answer}})
                status = "completed"
                return usage
            for call in calls:
                usage["toolCalls"] += 1
                if usage["toolCalls"] > limits["max_tool_calls"]:
                    raise RuntimeError("Tool-call limit exceeded")
                name = call["function"]["name"]
                emit(
                    {
                        "type": "tool.started",
                        "id": call["id"],
                        "name": name,
                        "arguments": call["function"]["arguments"],
                    }
                )
                try:
                    result = tools.call(
                        name, json.loads(call["function"]["arguments"]), remaining()
                    )
                except (
                    ValueError,
                    OSError,
                    KeyError,
                    TypeError,
                    subprocess.TimeoutExpired,
                ) as error:
                    result = {"error": str(error)}
                emit({"type": "tool.completed", "id": call["id"], "name": name, "result": result})
                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": call["id"],
                        "content": json.dumps(result, ensure_ascii=False),
                    }
                )
        raise RuntimeError("API request limit reached before a final answer")
    finally:
        save(
            "usage.json",
            {**usage, "status": status, "durationSeconds": round(time.monotonic() - started, 2)},
        )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, required=True)
    parser.add_argument("--workspace", type=Path, required=True)
    parser.add_argument("--skill", required=True)
    parser.add_argument("--model")
    parser.add_argument("--timeout", type=int, default=600)
    args = parser.parse_args()
    key = ""
    try:
        config = load_config(args.config, args.model)
        key = os.environ.get(config["api_key_env"], "")
        run(config, args.workspace, args.skill, sys.stdin.read(), args.timeout)
    except Exception as error:
        message = scrub(str(error), key)
        print(json.dumps({"type": "api.error", "error": message}), flush=True)
        print(message, file=sys.stderr)
        raise SystemExit(1) from None


if __name__ == "__main__":
    main()
