"""Resolve preset style tokens for data-storytelling build flows.

This module lets build-time workflows inject preset-driven page styles without
asking the model to read preset reference files and manually copy CSS tokens.
Runtime preset text assets are preferred because some builtin hosts encrypt
markdown reference files.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any, Dict

PRESET_META = {
    "Swiss Modern": {"filename": "swiss-modern.md", "polarity": "light"},
    "Indigo Porcelain": {"filename": "indigo-porcelain.md", "polarity": "light"},
    "Dark Botanical": {"filename": "dark-botanical.md", "polarity": "dark"},
    "Pudding Neon": {"filename": "pudding-neon.md", "polarity": "dark"},
    "Warm Earth": {"filename": "warm-earth.md", "polarity": "light"},
    "Vintage Editorial": {"filename": "vintage-editorial.md", "polarity": "light"},
    "Paper & Ink": {"filename": "paper-and-ink.md", "polarity": "light"},
}

REQUIRED_ROOT_VARS = (
    "--page-bg",
    "--surface",
    "--surface-strong",
    "--text-primary",
    "--text-secondary",
    "--accent",
    "--accent-soft",
    "--border",
)

OPTIONAL_ROOT_VARS = (
    "--font-display",
    "--component-radius-sm",
    "--component-radius-md",
    "--component-radius-lg",
    "--component-surface-neutral",
    "--component-surface-raised",
    "--component-surface-accent",
    "--component-surface-action",
    "--component-shadow-card",
    "--component-shadow-card-hover",
    "--component-shadow-elevated",
    "--component-border",
    "--type-heading-weight",
    "--type-heading-tracking",
    "--type-metric-weight",
    "--section-bar-width",
    "--highlight-border-width",
)

ROOT_VAR_ORDER = REQUIRED_ROOT_VARS + OPTIONAL_ROOT_VARS

CSS_BLOCK_RE = re.compile(r"```css\s*(.*?)```", re.DOTALL)
JSON_BLOCK_RE = re.compile(r"```json\s*(.*?)```", re.DOTALL)
CSS_VAR_RE = re.compile(r"(?P<name>--[\w-]+)\s*:\s*(?P<value>[^;]+);")
REQUIRED_CHART_COLOR_SCHEMA_KEYS = ("categorical", "linearColor")
STYLE_OVERRIDES_HEADING_RE = re.compile(r"^###\s+Style Overrides\s*$", re.MULTILINE)
STYLE_OVERRIDES_BOUNDARY_RE = re.compile(r"^#{1,3}\s+", re.MULTILINE)
HEX_COLOR_RE = re.compile(r"^#[0-9A-Fa-f]{6}$")
ALLOWED_PAGE_OVERRIDE_TOKENS = {"--accent", "--text-primary", "--text-secondary"}
ALLOWED_CHART_PALETTE_KEYS = {"categorical", "linearColor"}
ALLOWED_THEME_OVERRIDE_TOKENS = {
    "--story-stage-background",
    "--story-surface-background",
    "--story-surface-border-color",
    "--story-surface-shadow",
    "--story-emphasis-shadow",
}
THEME_TOKEN_ORDER = (
    "--story-stage-background",
    "--story-surface-background",
    "--story-surface-border-color",
    "--story-surface-shadow",
    "--story-emphasis-shadow",
)
ALLOWED_STYLE_OVERRIDE_KEYS = {"page_tokens", "chart_palette", "theme_tokens"}
FORBIDDEN_THEME_VALUE_FRAGMENTS = ("!important", "url(", "@import", "expression(", "var(")
STYLE_OVERRIDES_CONTRACT_HINT = (
    "请读取 references/style-overrides.md 后重新生成 Style Overrides："
    "只保留一个 ```json 代码块，顶层字段只能是 page_tokens、chart_palette、theme_tokens；"
    "不要写 CSS、class、layout 或自然语言意图"
)


def _with_style_overrides_hint(message: str) -> str:
    if "style-overrides.md" in message:
        return message
    return f"{message}。{STYLE_OVERRIDES_CONTRACT_HINT}"


def resolve_preset_dir(skill_dir: str | Path | None = None) -> Path:
    """Resolve the preset text/reference directory from the skill root or preset dir."""
    if skill_dir is None:
        candidate = Path(__file__).resolve().parent.parent
    else:
        candidate = Path(skill_dir)

    if candidate.name == "presets" and candidate.is_dir():
        return candidate

    asset_preset_dir = candidate / "assets" / "presets"
    if asset_preset_dir.is_dir():
        return asset_preset_dir

    reference_preset_dir = candidate / "references" / "presets"
    if reference_preset_dir.is_dir():
        return reference_preset_dir

    raise FileNotFoundError(
        f"未找到 presets 目录。 预期目录: {asset_preset_dir} 或 {reference_preset_dir}"
    )


def _resolve_preset_file(preset_dir: Path, preset_name: str) -> Path:
    """Resolve a preset text asset, falling back to the markdown reference."""
    markdown_filename = PRESET_META[preset_name]["filename"]
    stem = Path(markdown_filename).stem
    candidates = [
        preset_dir / f"{stem}.txt",
        preset_dir / markdown_filename,
    ]

    if preset_dir.name == "presets" and preset_dir.parent.name == "assets":
        skill_dir = preset_dir.parent.parent
        candidates.append(skill_dir / "references" / "presets" / markdown_filename)

    seen: set[Path] = set()
    for candidate in candidates:
        if candidate in seen:
            continue
        seen.add(candidate)
        if candidate.is_file():
            return candidate

    raise FileNotFoundError(
        f"Preset 文件不存在: {preset_name}. 已尝试: "
        + ", ".join(str(candidate) for candidate in candidates)
    )


def _extract_css_block(markdown_text: str, marker: str) -> str | None:
    for block in CSS_BLOCK_RE.findall(markdown_text):
        if marker in block:
            return block.strip()
    return None


def _parse_root_variables(root_css: str) -> Dict[str, str]:
    variables: Dict[str, str] = {}
    for match in CSS_VAR_RE.finditer(root_css):
        variables[match.group("name")] = match.group("value").strip()

    missing = [name for name in REQUIRED_ROOT_VARS if name not in variables]
    if missing:
        raise ValueError(f"Preset 缺少必需颜色变量: {missing}")

    return {name: variables[name] for name in ROOT_VAR_ORDER if name in variables}


def _build_root_css(root_variables: Dict[str, str]) -> str:
    lines = [":root {"]
    for name in ROOT_VAR_ORDER:
        if name in root_variables:
            lines.append(f"  {name}: {root_variables[name]};")
    lines.append("}")
    return "\n".join(lines)


def _build_theme_tokens_css(theme_tokens: dict[str, str]) -> str:
    if not theme_tokens:
        return ""

    lines = [":root {"]
    for name in THEME_TOKEN_ORDER:
        if name in theme_tokens:
            lines.append(f"  {name}: {theme_tokens[name]};")
    lines.append("}")
    return "\n".join(lines)


def _hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    if not HEX_COLOR_RE.match(hex_color):
        raise ValueError(f"颜色必须使用 6 位 hex: {hex_color}")
    return (
        int(hex_color[1:3], 16),
        int(hex_color[3:5], 16),
        int(hex_color[5:7], 16),
    )


def _derive_accent_soft(hex_color: str, polarity: str) -> str:
    r, g, b = _hex_to_rgb(hex_color)
    alpha = 0.15 if polarity == "dark" else 0.08
    return f"rgba({r}, {g}, {b}, {alpha})"


def _rgba_from_hex(hex_color: str, alpha: float) -> str:
    r, g, b = _hex_to_rgb(hex_color)
    return f"rgba({r}, {g}, {b}, {alpha})"


def _build_annotation_theme_tokens(polarity: str) -> Dict[str, Any]:
    if polarity == "dark":
        annotation_text_background_color = "#555960"
        return {
            "annotationAreaColor": "#4B4F54",
            "annotationAreaColorOpacity": 0.26,
            "annotationLineColor": "#888C93",
            "annotationLineStyle": "dashed",
            "annotationTextColor": "#fff",
            "annotationTextBackgroundColor": annotation_text_background_color,
            "annotationTextBackgroundOpacity": 1,
            "annotationTextBackgroundBorderRadius": 3,
            "annotationTextBackgroundPadding": 3,
            "annotationTextBackgroundBorderColor": annotation_text_background_color,
        }

    annotation_text_background_color = "#5f6267"
    return {
        "annotationAreaColor": "#BCC1CB",
        "annotationAreaColorOpacity": 0.12,
        "annotationLineColor": "#21252CB8",
        "annotationLineStyle": "dashed",
        "annotationTextColor": "#fff",
        "annotationTextBackgroundColor": annotation_text_background_color,
        "annotationTextBackgroundOpacity": 1,
        "annotationTextBackgroundBorderRadius": 3,
        "annotationTextBackgroundPadding": 3,
        "annotationTextBackgroundBorderColor": annotation_text_background_color,
    }


def _require_hex_list(
    colors: Any, *, field_name: str, min_len: int, max_len: int | None = None
) -> list[str]:
    if not isinstance(colors, list):
        raise ValueError(f"{field_name} 必须是颜色数组")
    if len(colors) < min_len:
        raise ValueError(f"{field_name} 至少需要 {min_len} 个颜色")
    if max_len is not None and len(colors) > max_len:
        raise ValueError(f"{field_name} 最多允许 {max_len} 个颜色")
    for color in colors:
        _hex_to_rgb(str(color))
    return [str(color) for color in colors]


def _build_chart_theme(
    root_variables: Dict[str, str],
    chart_color_schema: dict[str, list[str]],
    polarity: str,
) -> Dict[str, Any]:
    surface = root_variables["--surface"]
    accent = root_variables["--accent"]
    tooltip_background = _rgba_from_hex(surface, 0.95) if HEX_COLOR_RE.match(surface) else surface

    return {
        "baseTheme": polarity,
        "colorScheme": chart_color_schema["categorical"],
        "linearColorScheme": chart_color_schema["linearColor"],
        "textPrimary": root_variables["--text-primary"],
        "textSecondary": root_variables["--text-secondary"],
        "borderColor": root_variables["--border"],
        "surfaceColor": surface,
        "tooltipBackgroundColor": tooltip_background,
        "axisGridColor": root_variables["--border"],
        "axisLineColor": root_variables["--border"],
        "tableHeaderBackgroundColor": surface,
        "tableSelectedBorderColor": accent,
        **_build_annotation_theme_tokens(polarity),
    }


def _extract_section_after_heading(markdown_text: str, heading_re: re.Pattern[str]) -> str | None:
    heading_match = heading_re.search(markdown_text)
    if not heading_match:
        return None
    tail = markdown_text[heading_match.end() :]
    boundary_match = STYLE_OVERRIDES_BOUNDARY_RE.search(tail)
    if boundary_match:
        return tail[: boundary_match.start()]
    return tail


def _validate_theme_token_value(token_name: str, value: str) -> str:
    normalized = " ".join(str(value).strip().split())
    if not normalized:
        raise ValueError(f"Style Overrides.theme_tokens 不能为空: {token_name}")
    lower_value = normalized.lower()
    for fragment in FORBIDDEN_THEME_VALUE_FRAGMENTS:
        if fragment in lower_value:
            raise ValueError(f"Style Overrides.theme_tokens 不允许使用 {fragment}: {token_name}")
    if any(char in normalized for char in ("<", ">", "{", "}", ";")):
        raise ValueError(f"Style Overrides.theme_tokens 包含非法字符: {token_name}")
    return normalized


def _parse_style_overrides_section(section_text: str) -> dict[str, Any]:
    if CSS_BLOCK_RE.search(section_text):
        raise ValueError("Style Overrides 只允许 json 代码块；主题样式请写入 theme_tokens")

    json_blocks = JSON_BLOCK_RE.findall(section_text)
    if not json_blocks:
        raise ValueError("Style Overrides 必须使用 json 代码块")
    if len(json_blocks) > 1:
        raise ValueError("Style Overrides 最多允许一个 json 代码块")
    parsed = json.loads(json_blocks[0])
    if not isinstance(parsed, dict):
        raise ValueError("Style Overrides JSON 必须是对象")
    return parsed


def parse_style_overrides_from_plan(plan_file: str | Path | None) -> dict[str, Any]:
    if not plan_file:
        return {}
    plan_text = Path(plan_file).read_text(encoding="utf-8")
    section_text = _extract_section_after_heading(plan_text, STYLE_OVERRIDES_HEADING_RE)
    if section_text is None:
        return {}
    try:
        return _parse_style_overrides_section(section_text)
    except ValueError as exc:
        raise ValueError(_with_style_overrides_hint(str(exc))) from exc


def _apply_style_overrides(
    resolved: Dict[str, Any], style_overrides: dict[str, Any] | None
) -> Dict[str, Any]:
    if not style_overrides:
        return resolved

    unknown_override_keys = sorted(set(style_overrides) - ALLOWED_STYLE_OVERRIDE_KEYS)
    if unknown_override_keys:
        raise ValueError(f"Style Overrides 包含不允许的顶层字段: {unknown_override_keys}")

    root_variables = dict(resolved["rootVariables"])
    chart_color_schema = {
        "categorical": list(resolved["chartColorSchema"]["categorical"]),
        "linearColor": list(resolved["chartColorSchema"]["linearColor"]),
    }
    page_tokens = style_overrides.get("page_tokens") or {}
    if not isinstance(page_tokens, dict):
        raise ValueError("Style Overrides.page_tokens 必须是对象")

    unknown_tokens = sorted(set(page_tokens) - ALLOWED_PAGE_OVERRIDE_TOKENS)
    if unknown_tokens:
        raise ValueError(f"Style Overrides.page_tokens 包含不允许覆盖的 token: {unknown_tokens}")

    for token_name, value in page_tokens.items():
        value = str(value)
        _hex_to_rgb(value)
        root_variables[token_name] = value
        if token_name == "--accent":
            root_variables["--accent-soft"] = _derive_accent_soft(value, resolved["polarity"])

    chart_palette = style_overrides.get("chart_palette") or {}
    if not isinstance(chart_palette, dict):
        raise ValueError("Style Overrides.chart_palette 必须是对象")

    unknown_palette_keys = sorted(set(chart_palette) - ALLOWED_CHART_PALETTE_KEYS)
    if unknown_palette_keys:
        raise ValueError(
            f"Style Overrides.chart_palette 包含不允许覆盖的字段: {unknown_palette_keys}"
        )

    if "categorical" in chart_palette:
        chart_color_schema["categorical"] = _require_hex_list(
            chart_palette["categorical"],
            field_name="chart_palette.categorical",
            min_len=4,
            max_len=8,
        )
    if "linearColor" in chart_palette:
        chart_color_schema["linearColor"] = _require_hex_list(
            chart_palette["linearColor"],
            field_name="chart_palette.linearColor",
            min_len=2,
            max_len=2,
        )

    theme_tokens = style_overrides.get("theme_tokens") or {}
    if not isinstance(theme_tokens, dict):
        raise ValueError("Style Overrides.theme_tokens 必须是对象")
    unknown_theme_tokens = sorted(set(theme_tokens) - ALLOWED_THEME_OVERRIDE_TOKENS)
    if unknown_theme_tokens:
        raise ValueError(
            f"Style Overrides.theme_tokens 包含不允许覆盖的 token: {unknown_theme_tokens}"
        )
    theme_tokens = {
        str(token_name): _validate_theme_token_value(str(token_name), str(token_value))
        for token_name, token_value in theme_tokens.items()
    }

    root_css = _build_root_css(root_variables)
    theme_css = _build_theme_tokens_css(theme_tokens)
    chart_theme = _build_chart_theme(root_variables, chart_color_schema, resolved["polarity"])
    return {
        **resolved,
        "rootVariables": root_variables,
        "rootCss": root_css,
        "themeTokens": theme_tokens,
        "themeCss": theme_css,
        "chartColorSchema": chart_color_schema,
        "chartTheme": chart_theme,
        "styleOverrides": style_overrides,
        "styleCss": "\n\n".join(
            part for part in (root_css, resolved.get("bodyCss"), theme_css) if part
        ),
    }


def apply_style_overrides(
    resolved: Dict[str, Any], style_overrides: dict[str, Any] | None
) -> Dict[str, Any]:
    try:
        return _apply_style_overrides(resolved, style_overrides)
    except ValueError as exc:
        raise ValueError(_with_style_overrides_hint(str(exc))) from exc


def _parse_chart_color_schema(markdown_text: str, preset_file: Path) -> dict[str, list[str]]:
    for block in JSON_BLOCK_RE.findall(markdown_text):
        parsed = json.loads(block)
        chart_color_schema = parsed.get("chartColorSchema") if isinstance(parsed, dict) else None
        if chart_color_schema is None:
            continue
        if not isinstance(chart_color_schema, dict):
            raise ValueError(f"Preset chartColorSchema 必须是对象: {preset_file}")

        missing = [key for key in REQUIRED_CHART_COLOR_SCHEMA_KEYS if key not in chart_color_schema]
        if missing:
            raise ValueError(f"Preset chartColorSchema 缺少必需字段: {missing}")
        categorical = _require_hex_list(
            chart_color_schema["categorical"],
            field_name="Preset chartColorSchema.categorical",
            min_len=3,
            max_len=8,
        )
        linear_color = _require_hex_list(
            chart_color_schema["linearColor"],
            field_name="Preset chartColorSchema.linearColor",
            min_len=2,
            max_len=2,
        )
        return {"categorical": categorical, "linearColor": linear_color}

    raise ValueError(f"Preset 文件缺少 chartColorSchema JSON 代码块: {preset_file}")


def _preset_slug(preset_name: str) -> str:
    return Path(PRESET_META[preset_name]["filename"]).stem


def resolve_preset_style(preset_name: str, skill_dir: str | Path | None = None) -> Dict[str, Any]:
    """Return preset CSS tokens and metadata for build-time injection."""
    if preset_name not in PRESET_META:
        raise ValueError(f"Unsupported preset: {preset_name}. Allowed: {sorted(PRESET_META)}")

    preset_dir = resolve_preset_dir(skill_dir)
    preset_file = _resolve_preset_file(preset_dir, preset_name)
    markdown_text = preset_file.read_text(encoding="utf-8")

    root_block = _extract_css_block(markdown_text, ":root")
    if not root_block:
        raise ValueError(f"Preset 文件缺少 :root 代码块: {preset_file}")

    body_block = _extract_css_block(markdown_text, "body")
    root_variables = _parse_root_variables(root_block)
    root_css = _build_root_css(root_variables)
    chart_color_schema = _parse_chart_color_schema(markdown_text, preset_file)
    chart_theme = _build_chart_theme(
        root_variables, chart_color_schema, PRESET_META[preset_name]["polarity"]
    )

    return {
        "presetName": preset_name,
        "themeSlug": _preset_slug(preset_name),
        "presetFile": str(preset_file),
        "polarity": PRESET_META[preset_name]["polarity"],
        "rootVariables": root_variables,
        "rootCss": root_css,
        "bodyCss": body_block,
        "themeTokens": {},
        "themeCss": "",
        "chartColorSchema": chart_color_schema,
        "chartTheme": chart_theme,
        "styleCss": "\n\n".join(part for part in (root_css, body_block) if part),
    }


def build_preset_chart_theme_map(
    preset_name: str, skill_dir: str | Path | None = None
) -> Dict[str, Any]:
    """Return the selected preset chart theme keyed by runtime theme slug."""
    resolved = resolve_preset_style(preset_name, skill_dir)
    return {resolved["themeSlug"]: resolved["chartTheme"]}


def resolve_story_style(
    preset_name: str,
    skill_dir: str | Path | None = None,
    *,
    plan_file: str | Path | None = None,
) -> Dict[str, Any]:
    """Resolve preset style plus optional plan-level Style Overrides."""
    resolved = resolve_preset_style(preset_name, skill_dir)
    return apply_style_overrides(resolved, parse_style_overrides_from_plan(plan_file))


def build_preset_style_css(preset_name: str, skill_dir: str | Path | None = None) -> str:
    """Return CSS for inline <style> injection."""
    return resolve_preset_style(preset_name, skill_dir)["styleCss"]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Resolve preset style tokens for data-storytelling builds.",
    )
    parser.add_argument(
        "--preset",
        required=True,
        help="Preset display name, e.g. 'Swiss Modern'.",
    )
    parser.add_argument(
        "--skill-dir",
        default=str(Path(__file__).resolve().parent.parent),
        help="Path to the skill root or preset text/reference directory.",
    )
    parser.add_argument(
        "--format",
        choices=("css", "json"),
        default="css",
        help="Output CSS for inline injection or JSON for tooling.",
    )
    parser.add_argument(
        "--output",
        help="Optional file path to write the resolved result.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    resolved = resolve_preset_style(args.preset, args.skill_dir)

    if args.format == "json":
        result = json.dumps(resolved, ensure_ascii=False, indent=2)
    else:
        result = resolved["styleCss"]

    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(result, encoding="utf-8")
        print(f"OK {output_path.resolve()}")
    else:
        print(result)
    return 0


__all__ = [
    "OPTIONAL_ROOT_VARS",
    "PRESET_META",
    "REQUIRED_ROOT_VARS",
    "REQUIRED_CHART_COLOR_SCHEMA_KEYS",
    "ROOT_VAR_ORDER",
    "ALLOWED_PAGE_OVERRIDE_TOKENS",
    "ALLOWED_CHART_PALETTE_KEYS",
    "ALLOWED_THEME_OVERRIDE_TOKENS",
    "apply_style_overrides",
    "build_preset_chart_theme_map",
    "build_preset_style_css",
    "parse_style_overrides_from_plan",
    "resolve_preset_dir",
    "resolve_preset_style",
    "resolve_story_style",
]


if __name__ == "__main__":
    raise SystemExit(main())
