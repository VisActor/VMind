"""Assemble authored HTML fragments using fixed renderers and normalized assets."""

from __future__ import annotations

import argparse
import base64
import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

from normalize_story_assets import validate_svg_markup
from story_render import (
    SKILL_DIR,
    motion_level_for_presentation_mode,
    read_json,
    read_text,
    render_deck,
    render_page,
)

MARKERS = {"data-story-background", "data-story-image", "data-story-inline"}
VOID_TAGS = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
}


class AssetBinder(HTMLParser):
    """Preserve authored markup; only serialize start tags carrying asset references."""

    def __init__(self, source: str, assets: dict[str, Any]):
        super().__init__(convert_charrefs=False)
        self.source = source
        self.assets = assets
        self.parts: list[str] = []
        self.inline_tag: str | None = None
        self.line_offsets = [0]
        self.line_offsets.extend(m.end() for m in re.finditer("\n", source))

    def data_uri(self, asset_id: str, asset: dict[str, Any]) -> str:
        uri = asset.get("data_uri", "")
        if not isinstance(uri, str) or not re.fullmatch(
            r"data:image/(?:png|jpeg|webp|svg\+xml);base64,[A-Za-z0-9+/=]+", uri
        ):
            raise ValueError(f"Asset '{asset_id}' requires a normalized image data_uri")
        try:
            if not base64.b64decode(uri.split(",", 1)[1], validate=True):
                raise ValueError("empty image")
        except ValueError as exc:
            raise ValueError(f"Asset '{asset_id}' has invalid base64 image content") from exc
        return uri

    def start(self, tag: str, attrs: list[tuple[str, str | None]], closed: bool) -> None:
        if self.inline_tag:
            raise ValueError("data-story-inline must be an empty container")
        if tag in {"html", "head", "body", "script", "style", "base", "link", "meta"}:
            raise ValueError(
                f"Body fragment must not contain <{tag}>; the fixed composer owns the shell and runtime"
            )
        refs = [(key, value) for key, value in attrs if key in MARKERS]
        if not refs:
            self.parts.append(self.get_starttag_text())
            return
        names = [key for key, _ in attrs]
        if len(refs) != 1 or len(names) != len(set(names)):
            raise ValueError(
                "Asset node requires exactly one reference and no duplicate attributes"
            )
        marker, asset_id = refs[0]
        asset = self.assets.get(asset_id)
        if not asset_id or not isinstance(asset, dict):
            raise ValueError(
                f"Unresolved asset '{asset_id}': normalize it or apply the Plan fallback and remove its reference"
            )
        additions: list[tuple[str, str]] = []
        markup = ""
        if marker == "data-story-background":
            if tag in VOID_TAGS or "style" in names:
                raise ValueError(
                    f"Background asset '{asset_id}' needs a non-void node without an authored style attribute"
                )
            additions.append(
                ("style", f"background-image: url({json.dumps(self.data_uri(asset_id, asset))});")
            )
        elif marker == "data-story-image":
            if tag != "img" or "src" in names or "srcset" in names:
                raise ValueError(f"Image asset '{asset_id}' needs an img without src/srcset")
            additions.append(("src", self.data_uri(asset_id, asset)))
        else:
            if tag not in {"div", "span", "figure"} or closed:
                raise ValueError("data-story-inline needs an empty div, span or figure")
            markup = asset.get("inline_markup", "")
            if not isinstance(markup, str) or not markup or validate_svg_markup(markup):
                raise ValueError(f"Asset '{asset_id}' requires valid normalized inline SVG")
            self.inline_tag = tag
        rendered = "".join(
            f" {key}" if value is None else f' {key}="{html.escape(value, quote=True)}"'
            for key, value in attrs + additions
        )
        self.parts.append(f"<{tag}{rendered}{' /' if closed else ''}>")
        self.parts.append(markup)

    def handle_starttag(self, tag, attrs):
        self.start(tag, attrs, False)

    def handle_startendtag(self, tag, attrs):
        self.start(tag, attrs, True)

    def handle_endtag(self, tag):
        if self.inline_tag:
            if tag != self.inline_tag:
                raise ValueError("data-story-inline container is not empty or has mismatched tags")
            self.inline_tag = None
        line, column = self.getpos()
        start = self.line_offsets[line - 1] + column
        self.parts.append(self.source[start : self.source.index(">", start) + 1])

    def handle_data(self, data):
        if self.inline_tag and data.strip():
            raise ValueError("data-story-inline must be an empty container")
        self.parts.append(data)

    def handle_entityref(self, name):
        self.handle_data(f"&{name};")

    def handle_charref(self, name):
        self.handle_data(f"&#{name};")

    def handle_comment(self, data):
        self.parts.append(f"<!--{data}-->")

    def handle_decl(self, decl):
        raise ValueError("Body fragment must not contain a document declaration")

    def handle_pi(self, data):
        raise ValueError("Body fragment must not contain processing instructions")


def bind_assets(source: str, assets: dict[str, Any]) -> str:
    binder = AssetBinder(source, assets)
    binder.feed(source)
    binder.close()
    if binder.inline_tag:
        raise ValueError("Unclosed data-story-inline container")
    return "".join(binder.parts)


def validate_config(config: Any, target: str) -> dict[str, str]:
    if not isinstance(config, dict):
        raise ValueError("page.json must be an object")
    allowed = (
        {"title", "lang", "presentation_mode"}
        if target == "html"
        else {"title", "lang", "deck_axis"}
    )
    if config.keys() - allowed:
        raise ValueError(f"Unknown page config keys: {sorted(config.keys() - allowed)}")
    for key, value in config.items():
        if not isinstance(value, str) or not value.strip():
            raise ValueError(f"page.json '{key}' must be a non-empty string")
    if not config.get("title"):
        raise ValueError("page.json requires title")
    result = {"lang": "zh-CN", **config}
    if target == "html":
        result.setdefault("presentation_mode", "editorial")
        motion_level_for_presentation_mode(result["presentation_mode"])
    else:
        result.setdefault("deck_axis", "horizontal")
        if result["deck_axis"] not in {"horizontal", "vertical"}:
            raise ValueError("deck_axis must be horizontal or vertical")
    return result


def compose_story(
    *, target: str, runtime_dir: Path, body_file: Path, config_file: Path, output: Path
) -> None:
    if target not in {"html", "ppt"}:
        raise ValueError("target must be html or ppt")
    config = validate_config(read_json(config_file), target)
    story_head = read_text(runtime_dir / "story-head.html")
    spec_map = read_json(runtime_dir / "spec_map.json")
    assets = read_json(runtime_dir / "resolved_asset_bindings.json")
    if not isinstance(spec_map, dict) or not isinstance(assets, dict):
        raise ValueError("spec_map and resolved_asset_bindings must be JSON objects")
    body = bind_assets(read_text(body_file), assets)
    if not body.strip():
        raise ValueError("Body fragment must not be empty")
    if target == "html":
        rendered = render_page(
            story_head=story_head,
            spec_map=spec_map,
            body_html=body,
            title=config["title"],
            lang=config["lang"],
            motion_level=motion_level_for_presentation_mode(config["presentation_mode"]),
        )
    else:
        rendered = render_deck(
            story_head=story_head,
            spec_map=spec_map,
            slides_html=body,
            title=config["title"],
            lang=config["lang"],
            deck_axis=config["deck_axis"],
            deck_runtime_js=read_text(SKILL_DIR / "build-ppt/scripts/deck-runtime.js"),
            vseed_render_js=read_text(SKILL_DIR / "scripts/vseed-render.js"),
        )
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(rendered, encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--target", choices=["html", "ppt"], required=True)
    parser.add_argument("--runtime-dir", type=Path, required=True)
    parser.add_argument("--body-file", type=Path, required=True)
    parser.add_argument("--config-file", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    compose_story(**vars(args))
    print(f"OK {args.output}")


if __name__ == "__main__":
    main()
