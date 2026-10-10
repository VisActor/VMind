"""Prepare shared head assets for data-storytelling Web-PPT builds."""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
from pathlib import Path
from typing import Any

BODY_RULE_RE = re.compile(r"^body\s*\{", re.MULTILINE)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Prepare shared HTML head assets for data-storytelling Web-PPT builds.",
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
        "script": "build-ppt/scripts/prepare_story_head.py",
        "purpose": "Generate runtime/story-head.html for data-storytelling Web-PPT builds.",
        "command": [
            "python3",
            "$SKILL_DIR/build-ppt/scripts/prepare_story_head.py",
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
            "$SKILL_DIR/build-ppt/styles/deck-base.css",
        ],
        "outputs": ["runtime/story-head.html"],
        "notes": [
            "--skill-dir must point to the current data-storytelling skill root, even if this script is copied elsewhere.",
            "--preset should come from Story Meta.Style Preset.",
            "--plan-file lets this helper apply plan-level Style Overrides; compose_story.py must only read story-head.html.",
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


def load_preset_resolver(skill_dir: str | Path) -> Any:
    resolver_path = Path(skill_dir) / "scripts" / "preset_resolver.py"
    if not resolver_path.exists():
        raise FileNotFoundError(f"Preset resolver is missing: {resolver_path}")

    spec = importlib.util.spec_from_file_location("story_preset_resolver", resolver_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Cannot load preset resolver: {resolver_path}")

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def read_deck_base_css(skill_dir: str | Path) -> str:
    css_path = Path(skill_dir) / "build-ppt" / "styles" / "deck-base.css"
    if not css_path.is_file():
        raise FileNotFoundError(f"Deck base CSS is missing: {css_path}")
    return css_path.read_text(encoding="utf-8")


def build_deck_preset_css(story_style: dict[str, Any]) -> str:
    root_css = str(story_style["rootCss"])
    body_css = str(story_style.get("bodyCss") or "").strip()

    parts = [f"/* Preset: {story_style['presetName']} */", root_css]
    if body_css:
        deck_background_css, replacement_count = BODY_RULE_RE.subn(
            ".deck-shell,\n.deck-slide {",
            body_css,
            count=1,
        )
        if replacement_count != 1:
            raise ValueError(
                f"Preset body rule cannot be adapted for deck: {story_style['presetName']}"
            )
        parts.append(deck_background_css)
    return "\n\n".join(parts)


def build_deck_theme_script(story_style: dict[str, Any]) -> str:
    chart_theme = {story_style["themeSlug"]: story_style["chartTheme"]}
    theme_tokens = story_style.get("themeTokens") or {}
    ambient_background_enabled = "--story-stage-background" not in theme_tokens
    return (
        "<script>\n"
        f"  window.STORY_DECK_THEME_POLARITY = {_script_json(story_style['polarity'])};\n"
        f"  window.STORY_DECK_ENABLE_AMBIENT_BACKGROUND = {_script_json(ambient_background_enabled)};\n"
        f"  window.STORY_CHART_THEME_TOKENS = {_script_json(chart_theme)};\n"
        "</script>"
    )


def build_deck_theme_override_css(story_style: dict[str, Any]) -> str:
    theme_tokens = story_style.get("themeTokens") or {}
    if not theme_tokens:
        return ""

    parts: list[str] = []
    theme_css = str(story_style.get("themeCss") or "").strip()
    if theme_css:
        parts.append(theme_css)

    root_lines: list[str] = []
    if "--story-stage-background" in theme_tokens:
        root_lines.append("  --deck-stage-background: var(--story-stage-background);")
    if "--story-surface-background" in theme_tokens:
        root_lines.extend(
            [
                "  --deck-surface: var(--story-surface-background);",
                "  --deck-surface-strong: var(--story-surface-background);",
            ]
        )
    if "--story-surface-border-color" in theme_tokens:
        root_lines.extend(
            [
                "  --deck-line: var(--story-surface-border-color);",
                "  --deck-component-border: 1px solid var(--story-surface-border-color);",
            ]
        )
    if "--story-surface-shadow" in theme_tokens:
        root_lines.append("  --deck-shadow: var(--story-surface-shadow);")
    if root_lines:
        parts.append(":root {\n" + "\n".join(root_lines) + "\n}")

    if "--story-stage-background" in theme_tokens:
        parts.append(
            ".deck-shell[data-deck-shell] {\n"
            "  background: var(--deck-stage-background);\n"
            "}\n\n"
            ".deck-shell[data-deck-shell] .deck-slide {\n"
            "  background: var(--deck-stage-background);\n"
            "}"
        )

    if "--story-emphasis-shadow" in theme_tokens:
        parts.append(
            ".tone-accent,\n"
            ".big-number.tone-accent,\n"
            ".metric-value.tone-accent {\n"
            "  text-shadow: var(--story-emphasis-shadow);\n"
            "}"
        )

    return "\n\n".join(parts)


def build_deck_head(deck_base_css: str, deck_preset_css: str, story_style: dict[str, Any]) -> str:
    return "\n".join(
        [
            "<style>",
            deck_base_css,
            "",
            deck_preset_css,
            build_deck_theme_override_css(story_style),
            "</style>",
            build_deck_theme_script(story_style),
        ]
    )


def main() -> int:
    args = parse_args()
    if args.print_usage_json:
        print(json.dumps(build_usage_payload(), ensure_ascii=False, indent=2))
        return 0

    resolver = load_preset_resolver(args.skill_dir)
    story_style = resolver.resolve_story_style(
        args.preset, args.skill_dir, plan_file=args.plan_file
    )
    deck_head = build_deck_head(
        read_deck_base_css(args.skill_dir),
        build_deck_preset_css(story_style),
        story_style,
    )

    head_output = _write_text(args.head_output, deck_head)
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
