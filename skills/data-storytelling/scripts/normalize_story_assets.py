from __future__ import annotations

import argparse
import base64
import json
import re
from pathlib import Path
from typing import Any

from story_asset_contract import parse_asset_director_contract

IMAGE_BACKGROUND_PLACEMENTS = {"hero_background_image"}
IMAGE_EVIDENCE_PLACEMENTS = {"primary_image", "evidence_image"}
MOTIF_BACKGROUND_PLACEMENTS = {"opener_motif_background"}
BACKGROUND_PLACEMENTS = IMAGE_BACKGROUND_PLACEMENTS | MOTIF_BACKGROUND_PLACEMENTS
IMAGE_DATA_URI_PLACEMENTS = IMAGE_BACKGROUND_PLACEMENTS | IMAGE_EVIDENCE_PLACEMENTS
TRANSPARENT_SVG_PLACEMENTS = {
    "opener_motif_background",
    "takeaway_accent",
    "kpi_lead_icon",
    "action_lead_asset",
}
IMAGE_MIME_TYPES = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Normalize generated storytelling assets for HTML build."
    )
    parser.add_argument("--plan-file", required=True)
    parser.add_argument("--assets-dir", required=True)
    parser.add_argument("--user-assets-dir")
    parser.add_argument("--output", required=True)
    parser.add_argument("--report-output")
    return parser.parse_args()


def parse_svg_attrs(tag: str) -> dict[str, str]:
    attrs: dict[str, str] = {}
    for match in re.finditer(
        r"""([A-Za-z_:][A-Za-z0-9_:.-]*)\s*=\s*(['"])(.*?)\2""", tag, flags=re.DOTALL
    ):
        attrs[match.group(1).lower()] = match.group(3).strip()
    return attrs


def parse_float(value: str | None) -> float | None:
    if value is None:
        return None
    match = re.match(r"^\s*(-?\d+(?:\.\d+)?)", value)
    if match is None:
        return None
    return float(match.group(1))


def length_matches(value: str | None, expected: float) -> bool:
    if value is None:
        return False
    stripped = value.strip().lower()
    if stripped == "100%":
        return True
    parsed = parse_float(stripped)
    return parsed is not None and abs(parsed - expected) < 0.01


def position_matches(value: str | None, expected: float) -> bool:
    if value is None:
        return abs(expected) < 0.01
    parsed = parse_float(value)
    return parsed is not None and abs(parsed - expected) < 0.01


def opacity_value(attrs: dict[str, str]) -> float:
    opacity = parse_float(attrs.get("opacity"))
    fill_opacity = parse_float(attrs.get("fill-opacity"))
    values = [value for value in (opacity, fill_opacity) if value is not None]
    return min(values) if values else 1.0


def filled_canvas_rect_spans(markup: str, root_tag: str) -> list[tuple[int, int]]:
    root_attrs = parse_svg_attrs(root_tag)
    view_box = root_attrs.get("viewbox")
    if not view_box:
        return []
    parts = [parse_float(part) for part in re.split(r"[\s,]+", view_box.strip()) if part]
    if len(parts) != 4 or any(part is None for part in parts):
        return []

    min_x, min_y, width, height = (float(part) for part in parts if part is not None)
    spans: list[tuple[int, int]] = []
    for rect_match in re.finditer(r"<rect\b[^>]*>", markup, flags=re.IGNORECASE):
        attrs = parse_svg_attrs(rect_match.group(0))
        fill = attrs.get("fill", "").strip().lower()
        if fill in {"none", "transparent"} or opacity_value(attrs) <= 0:
            continue
        if (
            position_matches(attrs.get("x"), min_x)
            and position_matches(attrs.get("y"), min_y)
            and length_matches(attrs.get("width"), width)
            and length_matches(attrs.get("height"), height)
        ):
            spans.append(rect_match.span())
    return spans


def has_filled_canvas_rect(markup: str, root_tag: str) -> bool:
    return bool(filled_canvas_rect_spans(markup, root_tag))


def strip_filled_canvas_rects(markup: str, root_tag: str) -> str:
    spans = filled_canvas_rect_spans(markup, root_tag)
    if not spans:
        return markup
    parts: list[str] = []
    cursor = 0
    for start, end in spans:
        parts.append(markup[cursor:start])
        cursor = end
    parts.append(markup[cursor:])
    return "".join(parts)


def has_visible_svg_shape(markup: str) -> bool:
    return (
        re.search(
            r"<(?:path|circle|ellipse|line|polyline|polygon|rect|text)\b",
            markup,
            flags=re.IGNORECASE,
        )
        is not None
    )


def normalize_transparent_svg_canvas(markup: str) -> tuple[str, str | None]:
    stripped = markup.lstrip("\ufeff").lstrip()
    root_match = re.match(r"<svg\b[^>]*>", stripped, flags=re.IGNORECASE)
    if root_match is None:
        return markup, None

    root_tag = root_match.group(0)
    normalized = strip_filled_canvas_rects(markup, root_tag)
    if normalized != markup and not has_visible_svg_shape(normalized):
        return normalized, "visible SVG content is empty after removing full-canvas filled rect"
    return normalized, None


def validate_svg_markup(markup: str, *, require_transparent_canvas: bool = False) -> str | None:
    stripped = markup.lstrip("\ufeff")
    while True:
        stripped = stripped.lstrip()
        if stripped.startswith("<?xml"):
            end = stripped.find("?>")
            if end == -1:
                return "XML declaration is malformed"
            stripped = stripped[end + 2 :]
            continue
        if stripped.startswith("<!--"):
            end = stripped.find("-->")
            if end == -1:
                return "comment is malformed"
            stripped = stripped[end + 3 :]
            continue
        break

    root_match = re.match(r"<svg\b[^>]*>", stripped, flags=re.IGNORECASE)
    if root_match is None:
        return "root element must be <svg>"

    root_tag = root_match.group(0)
    if re.search(r"\bviewBox\s*=", root_tag, flags=re.IGNORECASE) is None:
        return "viewBox is required"
    if require_transparent_canvas and has_filled_canvas_rect(stripped, root_tag):
        return (
            "background assets must use a transparent canvas; full-canvas filled rect is forbidden"
        )

    lowered = stripped.lower()
    if "<script" in lowered:
        return "script is forbidden"
    if "foreignobject" in lowered:
        return "foreignObject is forbidden"
    if re.search(r"\bon[a-z0-9:_-]+\s*=", stripped, flags=re.IGNORECASE):
        return "event-handler attributes are forbidden"
    if "javascript:" in lowered:
        return "javascript: URLs are forbidden"
    for attr_match in re.finditer(
        r"""\b(?:href|xlink:href)\s*=\s*(['"])(.*?)\1""",
        stripped,
        flags=re.IGNORECASE | re.DOTALL,
    ):
        if not attr_match.group(2).strip().startswith("#"):
            return "external references are forbidden"
    if re.search(r"""(?:href|xlink:href|src)\s*=\s*["']https?://""", lowered):
        return "external references are forbidden"
    if re.search(r"""url\(\s*['"]?https?://""", lowered):
        return "external references are forbidden"
    return None


def svg_to_data_uri(markup: str) -> str:
    encoded = base64.b64encode(markup.encode("utf-8")).decode("ascii")
    return f"data:image/svg+xml;base64,{encoded}"


def binary_to_data_uri(payload: bytes, mime_type: str) -> str:
    encoded = base64.b64encode(payload).decode("ascii")
    return f"data:{mime_type};base64,{encoded}"


def find_asset_file(assets_dir: Path, asset_id: str, media_hint: str) -> Path | None:
    suffixes = [".svg"] if media_hint == "svg" else IMAGE_MIME_TYPES
    for suffix in suffixes:
        path = assets_dir / f"{asset_id}{suffix}"
        if not path.resolve().is_relative_to(assets_dir.resolve()):
            raise ValueError(f"Asset '{asset_id}' resolves outside its asset directory")
        if path.exists():
            return path
    return None


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def collect_placements(parsed_contract: dict[str, Any]) -> dict[str, list[dict[str, str]]]:
    placements_by_asset: dict[str, list[dict[str, str]]] = {}
    for chapter_id, chapter in parsed_contract["chapters"].items():
        for binding in chapter["asset_bindings"]:
            asset_id = binding["asset"]
            placements_by_asset.setdefault(asset_id, []).append(
                {
                    "chapter": chapter_id,
                    "placement": binding["placement"],
                    "usage": binding["usage"],
                }
            )
    return placements_by_asset


def normalize_story_assets(
    plan_path: Path,
    assets_dir: Path,
    output_path: Path,
    report_path: Path | None = None,
    user_assets_dir: Path | None = None,
) -> dict[str, Any]:
    plan_text = plan_path.read_text(encoding="utf-8")
    parsed = parse_asset_director_contract(plan_text)
    placements_by_asset = collect_placements(parsed)
    resolved: dict[str, Any] = {}
    filtered_out: list[dict[str, str]] = []

    for asset_id, asset_fields in parsed["assets"].items():
        media_hint = asset_fields["media_hint"]
        source = asset_fields.get("source", "generated")
        source_assets_dir = user_assets_dir if source == "user-provided" else assets_dir
        asset_path = (
            find_asset_file(source_assets_dir, asset_id, media_hint)
            if source_assets_dir is not None
            else None
        )
        placements = placements_by_asset.get(asset_id, [])
        if asset_path is None:
            filtered_out.append(
                {
                    "asset_id": asset_id,
                    "reason": "missing file",
                    "fallback": asset_fields["fallback"],
                }
            )
            continue

        placement_names = {placement["placement"] for placement in placements}
        payload: dict[str, Any] = {
            "media_hint": media_hint,
            "source": source,
            "fallback": asset_fields["fallback"],
            "placements": placements,
        }

        if media_hint == "svg":
            markup = asset_path.read_text(encoding="utf-8")
            if placement_names & TRANSPARENT_SVG_PLACEMENTS:
                markup, normalize_error = normalize_transparent_svg_canvas(markup)
                if normalize_error:
                    filtered_out.append(
                        {
                            "asset_id": asset_id,
                            "reason": normalize_error,
                            "fallback": asset_fields["fallback"],
                        }
                    )
                    continue
            error = validate_svg_markup(
                markup,
                require_transparent_canvas=bool(placement_names & MOTIF_BACKGROUND_PLACEMENTS),
            )
            if error:
                filtered_out.append(
                    {
                        "asset_id": asset_id,
                        "reason": error,
                        "fallback": asset_fields["fallback"],
                    }
                )
                continue

            if placement_names and placement_names <= BACKGROUND_PLACEMENTS:
                payload["data_uri"] = svg_to_data_uri(markup)
            else:
                payload["inline_markup"] = markup
        else:
            if not placement_names or not placement_names <= IMAGE_DATA_URI_PLACEMENTS:
                filtered_out.append(
                    {
                        "asset_id": asset_id,
                        "reason": "image assets are only supported for hero_background_image, primary_image, or evidence_image",
                        "fallback": asset_fields["fallback"],
                    }
                )
                continue
            mime_type = IMAGE_MIME_TYPES[asset_path.suffix.lower()]
            payload["data_uri"] = binary_to_data_uri(asset_path.read_bytes(), mime_type)
        resolved[asset_id] = payload

    write_json(output_path, resolved)
    if report_path is not None:
        write_json(report_path, {"filtered_out": filtered_out})
    return resolved


def main() -> int:
    args = parse_args()
    normalize_story_assets(
        plan_path=Path(args.plan_file).resolve(),
        assets_dir=Path(args.assets_dir).resolve(),
        output_path=Path(args.output).resolve(),
        report_path=Path(args.report_output).resolve() if args.report_output else None,
        user_assets_dir=Path(args.user_assets_dir).resolve() if args.user_assets_dir else None,
    )
    return 0


__all__ = [
    "collect_placements",
    "main",
    "normalize_story_assets",
    "parse_args",
    "binary_to_data_uri",
    "svg_to_data_uri",
    "validate_svg_markup",
]


if __name__ == "__main__":
    raise SystemExit(main())
