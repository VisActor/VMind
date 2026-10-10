"""Generate self-contained CSS markup for data-storytelling HTML outputs."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

STORY_BASE_CSS = "story-base.css"
COMPONENTS_MANIFEST = Path("styles/story-components.manifest.json")


def resolve_build_html_dir(skill_dir) -> Path:
    """兼容传入 skill 根目录或 build-html 目录。"""
    candidate = Path(skill_dir)
    if (candidate / STORY_BASE_CSS).exists() and (candidate / COMPONENTS_MANIFEST).exists():
        return candidate

    build_dir = candidate / "build-html"
    if (build_dir / STORY_BASE_CSS).exists() and (build_dir / COMPONENTS_MANIFEST).exists():
        return build_dir

    raise FileNotFoundError(
        "未找到 story-base.css / styles/story-components.manifest.json。"
        f" 预期目录: {candidate} 或 {build_dir}"
    )


def build_story_components_css(skill_dir) -> str:
    """从拆分后的 component/pattern/runtime CSS 源文件构造共享组件 CSS。"""
    build_html_dir = resolve_build_html_dir(skill_dir)
    styles_dir = build_html_dir / "styles"
    manifest_path = build_html_dir / COMPONENTS_MANIFEST
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    files = manifest.get("files")

    if not isinstance(files, list) or not files:
        raise ValueError("story-components.manifest.json must contain a non-empty files array")

    chunks = [
        "/**",
        " * Data Storytelling Component Library",
        " *",
        " * This CSS is assembled in memory from build-html/styles/*.css.",
        " * Edit the source CSS modules instead of generated bundles.",
        " */",
    ]
    for relative_path in files:
        if not isinstance(relative_path, str) or not relative_path:
            raise ValueError("story-components.manifest.json files must be non-empty strings")
        css_path = styles_dir / relative_path
        if not css_path.is_file():
            raise FileNotFoundError(f"CSS manifest references missing file: {relative_path}")
        css_text = css_path.read_text(encoding="utf-8").strip()
        chunks.append(f"/* source: {relative_path} */\n{css_text}")

    return "\n\n".join(chunks) + "\n"


def build_story_css_links(skill_dir):
    """
    返回两个 inline <style> 块，分别内嵌 story-base.css 和 assembled component CSS。

    设计原则：
    1. Agent 只调用此函数，不自行读取 CSS 文件。
    2. CSS 内容不进入模型上下文。
    3. 返回值可直接插入 HTML <head>，保持单文件自包含。
    """
    build_html_dir = resolve_build_html_dir(skill_dir)
    style_blocks = [
        f"<style>\n{(build_html_dir / STORY_BASE_CSS).read_text(encoding='utf-8')}\n</style>",
        f"<style>\n{build_story_components_css(build_html_dir)}\n</style>",
    ]

    return "\n".join(style_blocks)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Embed data-storytelling CSS files as inline <style> tags.",
    )
    parser.add_argument(
        "--skill-dir",
        default=str(Path(__file__).resolve().parents[2]),
        help="Path to the skill root or build-html directory.",
    )
    parser.add_argument(
        "--output",
        help="Optional file path to write the generated <style> blocks.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    result = build_story_css_links(args.skill_dir)

    assert result.count("<style>") == 2, "Both CSS files must be embedded as inline styles"
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(result, encoding="utf-8")
        print(f"OK {output_path.resolve()}")
    else:
        print(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
