"""Validate structural data-storytelling plan contracts before build."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

import assemble_story_specs
import preset_resolver
from story_plan_contract import (
    collect_scrollytelling_chart_errors,
    collect_scrollytelling_step_errors,
    collect_trend_detail_encoding_errors,
    format_plan_structural_errors,
    normalize_plan_value,
)

SKILL_DIR = Path(__file__).resolve().parents[1]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate structural contracts in data-storytelling plan.md.",
    )
    parser.add_argument("--plan-file", required=True, help="Path to plan.md.")
    parser.add_argument(
        "--skill-dir",
        default=str(SKILL_DIR),
        help="Path to the data-storytelling skill root.",
    )
    parser.add_argument(
        "--format",
        choices=("summary", "json"),
        default="summary",
        help="Output format.",
    )
    return parser.parse_args()


def collect_plan_structure_errors(plan_text: str) -> list[str]:
    errors: list[str] = []
    try:
        parsed = assemble_story_specs.parse_plan_for_specs(plan_text)
    except ValueError as exc:
        return [str(exc)]
    if not normalize_plan_value(parsed.get("style_preset")):
        errors.append("Story Meta is missing Style Preset.")

    errors.extend(collect_scrollytelling_chart_errors(parsed["chapters"]))
    errors.extend(collect_scrollytelling_step_errors(parsed["chapters"]))
    errors.extend(collect_trend_detail_encoding_errors(parsed["chapters"]))

    seen_chart_ids: set[str] = set()
    for chapter_index, chapter in enumerate(parsed["chapters"], start=1):
        pattern = normalize_plan_value(chapter.get("pattern")).lower()
        chapter_label = f"chapter {chapter_index}"
        charts = chapter.get("charts") or []
        steps = chapter.get("steps") or []

        if steps and pattern != "scrollytelling":
            errors.append(f"Only scrollytelling chapters may declare Steps ({chapter_label}).")
        if pattern == "scrollytelling":
            if not steps:
                errors.append(f"Scrollytelling {chapter_label} must declare Steps.")
            if len(steps) == 1:
                errors.append(f"Scrollytelling {chapter_label} must contain at least 2 Steps.")
            if len(charts) != 1:
                errors.append(
                    f"Scrollytelling {chapter_label} must declare exactly one primary chart."
                )
            elif normalize_plan_value(charts[0].get("role")) != "primary":
                errors.append(f"Scrollytelling {chapter_label} chart must use role primary.")

        for chart in charts:
            chart_id = normalize_plan_value(chart.get("id"))
            if chart_id:
                if chart_id in seen_chart_ids:
                    errors.append(f"Chart id '{chart_id}' must be unique across the whole plan.")
                seen_chart_ids.add(chart_id)
    return dedupe(errors)


def collect_style_errors(plan_file: Path, skill_dir: Path, plan_text: str) -> list[str]:
    try:
        preset = assemble_story_specs.parse_plan_for_specs(plan_text).get("style_preset") or ""
    except ValueError as exc:
        return [str(exc)]
    if not normalize_plan_value(preset):
        return []
    try:
        preset_resolver.resolve_story_style(str(preset), skill_dir, plan_file=plan_file)
    except Exception as exc:  # noqa: BLE001
        return [f"Style Preset / Style Overrides structural validation failed: {exc}"]
    return []


def dedupe(items: list[str]) -> list[str]:
    seen: set[str] = set()
    deduped: list[str] = []
    for item in items:
        if item in seen:
            continue
        seen.add(item)
        deduped.append(item)
    return deduped


def validate_plan(plan_file: Path, skill_dir: Path) -> dict[str, Any]:
    plan_text = plan_file.read_text(encoding="utf-8")
    errors = [
        *collect_plan_structure_errors(plan_text),
        *collect_style_errors(plan_file, skill_dir, plan_text),
    ]
    errors = dedupe(errors)
    return {
        "valid": not errors,
        "errors": errors,
        "warnings": [],
    }


def main() -> int:
    args = parse_args()
    plan_file = Path(args.plan_file)
    skill_dir = Path(args.skill_dir)
    payload = validate_plan(plan_file, skill_dir)

    if args.format == "json":
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    elif payload["valid"]:
        print(f"OK: {plan_file} structural validation passed")
    else:
        print(format_plan_structural_errors(payload["errors"]), file=sys.stderr)
    return 0 if payload["valid"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
