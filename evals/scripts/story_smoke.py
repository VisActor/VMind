"""Deterministic story builds through the same tools exposed to API models."""

import json
import shutil
import subprocess
from pathlib import Path

from api_agent import WorkspaceTools

ROOT = Path(__file__).resolve().parents[2]
FIXTURES = ROOT / "tests/fixtures/data_storytelling"


def build_story(workspace: Path, target: str) -> list[dict]:
    runtime = workspace / "outputs/runtime"
    runtime.mkdir(parents=True)
    for file in FIXTURES.iterdir():
        shutil.copy2(file, runtime / file.name)
    (runtime / "page.json").write_text(json.dumps({"title": "Retention evidence", "lang": "en"}))
    (runtime / "generated-assets").mkdir()
    tools = WorkspaceTools(workspace, "data-storytelling", 20000)
    commands = [
        ("validate_story_plan.py", ["--plan-file", "outputs/runtime/plan.md"]),
        (
            f"build-{'html' if target == 'html' else 'ppt'}/scripts/prepare_story_head.py",
            [
                "--preset",
                "Swiss Modern",
                "--plan-file",
                "outputs/runtime/plan.md",
                "--head-output",
                "outputs/runtime/story-head.html",
            ],
        ),
        (
            "assemble_story_specs.py",
            [
                "--plan-file",
                "outputs/runtime/plan.md",
                "--dataset-json",
                "outputs/runtime/dataset_map.json",
                "--specs-json",
                "outputs/runtime/chart_specs.json",
                "--output",
                "outputs/runtime/spec_map.json",
            ],
        ),
        (
            "normalize_story_assets.py",
            [
                "--plan-file",
                "outputs/runtime/plan.md",
                "--assets-dir",
                "outputs/runtime/generated-assets",
                "--output",
                "outputs/runtime/resolved_asset_bindings.json",
                "--report-output",
                "outputs/runtime/asset_resolution_report.json",
            ],
        ),
        (
            "compose_story.py",
            [
                "--target",
                target,
                "--runtime-dir",
                "outputs/runtime",
                "--body-file",
                f"outputs/runtime/{'body' if target == 'html' else 'slides'}.html",
                "--config-file",
                "outputs/runtime/page.json",
                "--output",
                "outputs/output.html",
            ],
        ),
        ("validate_js.py", ["outputs/output.html"]),
    ]
    logs = []
    for name, args in commands:
        result = tools.run_script(name, args, 30)
        logs.append({"script": name, "args": args, **result})
        (workspace.parent / "generate.json").write_text(json.dumps(logs, indent=2))
        if result["exit_code"]:
            raise RuntimeError(f"{name}: {result['stderr']}\n{result['stdout']}")
    return logs


def run_story_smoke(output: Path) -> list[dict]:
    results = []
    for target in ["html", "ppt"]:
        directory = output / f"story-{target}"
        workspace = directory / "workspace"
        shutil.copytree(
            ROOT / "skills/data-storytelling",
            workspace / ".agents/skills/data-storytelling",
            ignore=shutil.ignore_patterns("__pycache__", "*.pyc"),
        )
        (workspace / "inputs").mkdir()
        (directory / "metadata.json").write_text(
            json.dumps(
                {
                    "task": {"skill": "data-storytelling", "id": f"story-{target}"},
                    "runner": "fixed-browser-smoke",
                }
            )
        )
        (directory / "expectations.json").write_text(
            json.dumps({"html": "output.html", "engine": "story", "deck": target == "ppt"})
        )
        try:
            build_story(workspace, target)
            result = subprocess.run(
                [
                    "node",
                    str(ROOT / "evals/scripts/check-browser.mjs"),
                    str(directory),
                    "--local-assets",
                ],
                capture_output=True,
                text=True,
                timeout=120,
            )
            (directory / "browser.log").write_text(result.stdout + result.stderr)
            passed = result.returncode == 0
        except (OSError, RuntimeError, subprocess.TimeoutExpired) as error:
            (directory / "failure.log").write_text(str(error))
            passed = False
        results.append({"case": f"story-{target}", "passed": passed})
        print(f"story-{target}: {'passed' if passed else 'failed'} ({directory})", flush=True)
    return results
