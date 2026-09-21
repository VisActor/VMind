"""Render fixed VChart/VTable examples through copied Skills, without a model."""

from __future__ import annotations

import argparse
import csv
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from run import ROOT, load_expectations, load_tasks, prepare, write_json


def source_code(skill: str, records: list[dict]) -> str:
    if skill == "vchart-skill":
        return (
            "const spec = "
            + json.dumps(
                {
                    "type": "bar",
                    "data": [{"id": "sales", "values": records}],
                    "xField": ["region", "quarter"],
                    "yField": "sales",
                    "seriesField": "quarter",
                    "legends": {"visible": True},
                    "label": {"visible": True},
                    "animation": False,
                },
                ensure_ascii=False,
            )
            + ";"
        )
    if skill == "vtable-skill":
        return (
            "const tableInstance = new VTable.ListTable({\n"
            "  container: document.getElementById('container'),\n"
            f"  records: {json.dumps(records, ensure_ascii=False)},\n"
            "  columns: [\n"
            "    { field: 'region', title: 'Region', width: 180 },\n"
            "    { field: 'quarter', title: 'Quarter', width: 180 },\n"
            "    { field: 'sales', title: 'Sales', width: 180, sort: true }\n"
            "  ]\n});"
        )
    raise ValueError(f"No fixed browser fixture for Skill: {skill}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output-dir", type=Path, help="New evidence directory; must not already exist"
    )
    args = parser.parse_args()
    if args.output_dir:
        output = args.output_dir.resolve()
        output.mkdir(parents=True, exist_ok=False)
    else:
        (ROOT / ".cache").mkdir(exist_ok=True)
        output = Path(tempfile.mkdtemp(prefix="browser-smoke-", dir=ROOT / ".cache"))
    selected = {"vchart-grouped", "vtable-list"}
    tasks = [task for task in load_tasks() if task["id"] in selected]
    if {task["id"] for task in tasks} != selected:
        raise ValueError("Missing chart/table smoke case definitions")
    results = []
    for task in tasks:
        directory = output / task["id"]
        workspace = prepare(task, directory)
        write_json(directory / "metadata.json", {"task": task, "runner": "fixed-browser-smoke"})
        write_json(directory / "expectations.json", load_expectations(task))
        with (workspace / "inputs/sales.csv").open() as stream:
            records = [{**row, "sales": float(row["sales"])} for row in csv.DictReader(stream)]
        spec = workspace / "outputs/spec.js"
        spec.write_text(source_code(task["skill"], records), encoding="utf-8")
        commands = [
            [
                sys.executable,
                str(workspace / ".agents/skills" / task["skill"] / "scripts/generate_demo_html.py"),
                "--spec-file",
                str(spec),
                "--output-dir",
                str(workspace / "outputs"),
            ],
            [
                "node",
                str(ROOT / "evals/scripts/check-browser.mjs"),
                str(directory),
                "--local-assets",
            ],
        ]
        passed = True
        for name, command in zip(["generate", "browser"], commands, strict=True):
            try:
                result = subprocess.run(
                    command, cwd=workspace, capture_output=True, text=True, timeout=120
                )
                (directory / f"{name}.log").write_text(result.stdout + result.stderr)
                passed = result.returncode == 0
            except (OSError, subprocess.TimeoutExpired) as error:
                (directory / f"{name}.log").write_text(str(error))
                passed = False
            if not passed:
                break
        results.append({"case": task["id"], "passed": passed})
        print(f"{task['id']}: {'passed' if passed else 'failed'} ({directory})", flush=True)
    write_json(output / "summary.json", {"checks": results, "modelCalls": 0})
    print(f"Evidence: {output}")
    raise SystemExit(0 if all(result["passed"] for result in results) else 1)


if __name__ == "__main__":
    main()
