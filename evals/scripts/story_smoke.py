"""Deterministic story builds through the same tools exposed to API models."""

import shutil
from pathlib import Path

from api_agent import WorkspaceTools
from run import write_json


def build_story(workspace: Path, config: dict) -> list[dict]:
    runtime = workspace / "outputs/runtime"
    runtime.mkdir(parents=True)
    for file in (workspace / "inputs").iterdir():
        shutil.copy2(file, runtime / file.name)
    (runtime / "generated-assets").mkdir()
    tools = WorkspaceTools(workspace, "data-storytelling", 20000)
    commands = [
        ("validate_story_plan.py", ["--plan-file", "outputs/runtime/plan.md"]),
        (
            f"build-{'html' if config['target'] == 'html' else 'ppt'}/scripts/prepare_story_head.py",
            [
                "--preset",
                config["preset"],
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
                config["target"],
                "--runtime-dir",
                "outputs/runtime",
                "--body-file",
                f"outputs/runtime/{config['body']}",
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
        write_json(workspace.parent / "generate.json", logs)
        if result["exit_code"]:
            raise RuntimeError(f"{name}: {result['stderr']}\n{result['stdout']}")
    return logs
