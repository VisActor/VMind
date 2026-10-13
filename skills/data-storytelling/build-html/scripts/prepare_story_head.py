"""Prepare shared head assets for data-storytelling HTML builds.

This keeps head loading deterministic:
- shared CSS markup always comes from embed_css.py
- preset/page/chart style always comes from preset_resolver.py
"""

from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path
from typing import Any


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Prepare shared HTML head assets for data-storytelling builds.",
    )
    parser.add_argument(
        "--skill-dir",
        default=str(Path(__file__).resolve().parents[2]),
        help="Path to the skill root.",
    )
    parser.add_argument(
        "--preset",
        help="Preset display name, e.g. 'Swiss Modern'.",
    )
    parser.add_argument(
        "--plan-file",
        help="Optional plan.md path. When present, Style Overrides are parsed from this file.",
    )
    parser.add_argument(
        "--head-output",
        help="Optional file path to write complete shared head markup.",
    )
    parser.add_argument(
        "--format",
        choices=("json", "summary"),
        default="summary",
        help="stdout format when outputs are written.",
    )
    parser.add_argument(
        "--print-usage-json",
        action="store_true",
        help="Print the build-flow usage contract as JSON and exit.",
    )
    args = parser.parse_args()
    if not args.print_usage_json and not args.preset:
        parser.error("--preset is required unless --print-usage-json is used.")
    return args


def build_usage_payload() -> dict[str, Any]:
    return {
        "script": "build-html/scripts/prepare_story_head.py",
        "purpose": "Generate runtime/story-head.html for data-storytelling HTML builds.",
        "command": [
            "python3",
            "$SKILL_DIR/build-html/scripts/prepare_story_head.py",
            "--skill-dir",
            "$SKILL_DIR",
            "--preset",
            "<Story Meta.Style Preset>",
            "--plan-file",
            "/path/to/runtime/plan.md",
            "--head-output",
            "/path/to/runtime/story-head.html",
        ],
        "requiredArgs": ["--skill-dir", "--preset", "--plan-file", "--head-output"],
        "optionalArgs": ["--format json|summary", "--print-usage-json"],
        "inputs": [
            "runtime/plan.md",
            "Style Preset resolved from --skill-dir",
            "$SKILL_DIR/build-html/story-base.css",
            "$SKILL_DIR/build-html/styles/story-components.manifest.json",
        ],
        "outputs": ["runtime/story-head.html"],
        "notes": [
            "--skill-dir must point to the current data-storytelling skill root, even if this script is copied elsewhere.",
            "--preset should come from Story Meta.Style Preset.",
            "--plan-file lets this helper apply plan-level Style Overrides; compose_story.py must not parse overrides.",
            "--head-output should be runtime/story-head.html for the normal build flow.",
        ],
    }


def _write_text(path_str: str | None, content: str) -> str | None:
    if not path_str:
        return None
    output_path = Path(path_str)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(content, encoding="utf-8")
    return str(output_path.resolve())


def _script_json(payload: object) -> str:
    return json.dumps(payload, ensure_ascii=False).replace("</", "<\\/")


def load_module(module_name: str, path: Path) -> Any:
    if not path.exists():
        raise FileNotFoundError(f"Required helper module is missing: {path}")

    spec = importlib.util.spec_from_file_location(module_name, path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Cannot load helper module: {path}")

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def load_embed_css(skill_dir: str | Path) -> Any:
    return load_module(
        "story_embed_css",
        Path(skill_dir) / "build-html" / "scripts" / "embed_css.py",
    )


def load_preset_resolver(skill_dir: str | Path) -> Any:
    return load_module(
        "story_preset_resolver",
        Path(skill_dir) / "scripts" / "preset_resolver.py",
    )


def build_chart_theme_script(chart_theme: dict[str, object]) -> str:
    return f"<script>\n  window.STORY_CHART_THEME_TOKENS = {_script_json(chart_theme)};\n</script>"


def build_html_theme_override_css(story_style: dict[str, Any]) -> str:
    theme_tokens = story_style.get("themeTokens") or {}
    if not theme_tokens:
        return ""

    parts: list[str] = []

    root_lines: list[str] = []
    if "--story-surface-background" in theme_tokens:
        root_lines.extend(
            [
                "  --component-surface-neutral: var(--story-surface-background);",
                "  --component-surface-raised: var(--story-surface-background);",
                "  --component-surface-action: var(--story-surface-background);",
            ]
        )
    if "--story-surface-border-color" in theme_tokens:
        root_lines.extend(
            [
                "  --component-border: 1px solid var(--story-surface-border-color);",
                "  --card-border: 1px solid var(--story-surface-border-color);",
            ]
        )
    if "--story-surface-shadow" in theme_tokens:
        root_lines.extend(
            [
                "  --component-shadow-card: var(--story-surface-shadow);",
                "  --component-shadow-card-hover: var(--story-surface-shadow);",
                "  --component-shadow-elevated: var(--story-surface-shadow);",
            ]
        )
    if root_lines:
        parts.append(":root {\n" + "\n".join(root_lines) + "\n}")

    rules: list[str] = []
    if "--story-stage-background" in theme_tokens:
        rules.append(
            ".cover-intro:not(.with-svg-bg),\n"
            '.hero:not(.with-image):not(.hero-image):not([data-hero-mode="image"]) {\n'
            "  background: var(--story-stage-background);\n"
            "}"
        )
    if "--story-emphasis-shadow" in theme_tokens:
        rules.append(
            ".kpi-card .kpi-value,\n"
            ".big-stat .big-stat-value,\n"
            ".hero-number,\n"
            ".hero-title-accent {\n"
            "  text-shadow: var(--story-emphasis-shadow);\n"
            "}"
        )
    parts.extend(rules)

    return "\n\n".join(parts)


def build_story_head(
    css_links: str,
    preset_style_css: str,
    chart_theme: dict[str, object],
    story_style: dict[str, Any],
) -> str:
    theme_override_css = build_html_theme_override_css(story_style)
    return "\n".join(
        [
            css_links,
            "<style>",
            preset_style_css,
            theme_override_css,
            "</style>",
            build_chart_theme_script(chart_theme),
        ]
    )


def main() -> int:
    args = parse_args()
    if args.print_usage_json:
        print(json.dumps(build_usage_payload(), ensure_ascii=False, indent=2))
        return 0

    embed_css = load_embed_css(args.skill_dir)
    resolver = load_preset_resolver(args.skill_dir)
    css_links = embed_css.build_story_css_links(args.skill_dir)
    story_style = resolver.resolve_story_style(
        args.preset, args.skill_dir, plan_file=args.plan_file
    )
    preset_style_css = story_style["styleCss"]
    chart_theme = {story_style["themeSlug"]: story_style["chartTheme"]}
    story_head = build_story_head(css_links, preset_style_css, chart_theme, story_style)

    head_output = _write_text(args.head_output, story_head)

    payload = {
        "preset": args.preset,
        "headOutput": head_output,
        "styleOverridesApplied": bool(story_style.get("styleOverrides")),
    }

    if args.format == "json":
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    else:
        if head_output:
            print(f"OK {head_output}")
        if not head_output:
            print("No output paths provided.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
