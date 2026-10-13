"""校验 HTML 文件中 <script> 代码和当前 VSeed/VChart 挂载约定。纯 Python 实现，可选 Node.js 增强。"""

from __future__ import annotations

import base64
import json
import re
import shutil
import subprocess
import tempfile
from html.parser import HTMLParser
from pathlib import Path


class ScriptExtractor(HTMLParser):
    """从 HTML 中提取 inline <script> 块（跳过外链 CDN）。"""

    JAVASCRIPT_TYPES = {
        "",
        "application/ecmascript",
        "application/javascript",
        "module",
        "text/ecmascript",
        "text/javascript",
    }

    def __init__(self):
        super().__init__()
        self._in_script = False
        self._is_external = False
        self.scripts = []  # list of (line_number, code)
        self._current_code = []
        self._current_line = 0

    def _is_javascript_script(self, attrs_dict):
        script_type = (attrs_dict.get("type") or "").split(";", 1)[0].strip().lower()
        return script_type in self.JAVASCRIPT_TYPES

    def handle_starttag(self, tag, attrs):
        if tag == "script":
            attrs_dict = dict(attrs)
            if "src" in attrs_dict:
                self._is_external = True
            elif self._is_javascript_script(attrs_dict):
                self._in_script = True
                self._is_external = False
                self._current_code = []
                self._current_line = self.getpos()[0]

    def handle_data(self, data):
        if self._in_script:
            self._current_code.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self._in_script:
            code = "".join(self._current_code)
            if code.strip():
                self.scripts.append((self._current_line, code))
            self._in_script = False
        if tag == "script":
            self._is_external = False


class StyleExtractor(HTMLParser):
    """从 HTML 中提取 inline <style> 块、style 属性和内嵌 base64 stylesheet。"""

    def __init__(self):
        super().__init__()
        self._in_style = False
        self.styles = []  # list of (line_number, code)
        self.inline_styles = []
        self.style_attrs = []
        self.stylesheet_links = []
        self._current_style = []
        self._current_line = 0

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "style":
            self._in_style = True
            self._current_style = []
            self._current_line = self.getpos()[0]
        if tag == "link":
            rel = (attrs_dict.get("rel") or "").lower()
            href = attrs_dict.get("href", "")
            if href and "stylesheet" in rel:
                self.stylesheet_links.append(href)
        style_attr = attrs_dict.get("style")
        if style_attr:
            self.style_attrs.append(style_attr)

    def handle_data(self, data):
        if self._in_style:
            self._current_style.append(data)

    def handle_endtag(self, tag):
        if tag == "style" and self._in_style:
            style_text = "".join(self._current_style)
            if style_text.strip():
                self.styles.append((self._current_line, style_text))
                self.inline_styles.append(style_text)
            self._in_style = False


class DeckSlideExtractor(HTMLParser):
    """收集 Web-PPT slide 的少量结构信息，用于发现合同级硬错误。"""

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

    def __init__(self):
        super().__init__()
        self.slides = []
        self._current = None
        self._depth = 0

    @staticmethod
    def _classes(attrs_dict):
        return set((attrs_dict.get("class") or "").split())

    def _record_child(self, attrs_dict):
        classes = self._classes(attrs_dict)
        if "quote-block" in classes:
            self._current["quote_count"] += 1
        if "visual-artifact" in classes:
            self._current["visual_artifact_count"] += 1
        if "action-lead-asset" in classes:
            self._current["action_lead_asset_count"] += 1
        if "chart-frame" in classes:
            self._current["chart_frame_count"] += 1
            self._current["chart_frame_ids"].append(attrs_dict.get("data-chart-id", ""))
        if "chart-container" in classes:
            self._current["chart_container_count"] += 1
        if "primary-image" in classes:
            self._current["primary_image_count"] += 1
        if "evidence-image" in classes:
            self._current["evidence_image_count"] += 1
        if "evidence-figure" in classes:
            self._current["evidence_figure_count"] += 1
        if "metric-tile" in classes:
            self._current["metric_tile_count"] += 1
        if "comparison-panel" in classes:
            self._current["comparison_panel_count"] += 1
        if "scroll-step-copy" in classes:
            self._current["scroll_steps"].append(
                {
                    "line": self.getpos()[0],
                    "step": attrs_dict.get("data-scroll-step", ""),
                    "is_active": "is-active" in classes,
                }
            )
        if classes & {"action-item", "process-step", "timeline-node", "metric-tile"}:
            self._current["rowline_item_count"] += 1
        if "action-item" in classes:
            self._current["action_item_count"] += 1
        if "stat-context-card" in classes:
            self._current["stat_context_card_count"] += 1
        if "scroll-step-dots" in classes:
            self._current["scroll_step_dots_count"] += 1
        if attrs_dict.get("data-scroll-step-target") is not None:
            self._current["scroll_step_target_count"] += 1
        if "scrolly-section" in classes:
            self._current["html_scrolly_section_count"] += 1
        if "slide-split" in classes:
            self._current["slide_split_count"] += 1
        if "headline" in classes:
            self._current["headline_count"] += 1

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        classes = self._classes(attrs_dict)

        if tag == "section" and "deck-slide" in classes:
            self._current = {
                "line": self.getpos()[0],
                "slide_type": attrs_dict.get("data-slide-type", ""),
                "recipe": attrs_dict.get("data-recipe", ""),
                "layout": attrs_dict.get("data-layout", ""),
                "stat_stage": attrs_dict.get("data-stat-stage", ""),
                "number_treatment": attrs_dict.get("data-number-treatment", ""),
                "legacy_slide_role": attrs_dict.get("data-slide-role", ""),
                "legacy_composition": attrs_dict.get("data-composition", ""),
                "treatment": attrs_dict.get("data-treatment", ""),
                "quote_count": 0,
                "visual_artifact_count": 0,
                "action_lead_asset_count": 0,
                "chart_frame_count": 0,
                "chart_frame_ids": [],
                "chart_container_count": 0,
                "primary_image_count": 0,
                "evidence_image_count": 0,
                "evidence_figure_count": 0,
                "metric_tile_count": 0,
                "comparison_panel_count": 0,
                "scroll_steps": [],
                "rowline_item_count": 0,
                "action_item_count": 0,
                "stat_context_card_count": 0,
                "scroll_step_dots_count": 0,
                "scroll_step_target_count": 0,
                "html_scrolly_section_count": 0,
                "slide_split_count": 0,
                "headline_count": 0,
                "chart_id": attrs_dict.get("data-chart-id", ""),
                "text_parts": [],
            }
            self._depth = 1
            self._record_child(attrs_dict)
            return

        if self._current is None:
            return

        self._record_child(attrs_dict)
        if tag not in self.VOID_TAGS:
            self._depth += 1

    def handle_startendtag(self, tag, attrs):
        if self._current is None:
            return
        self._record_child(dict(attrs))

    def handle_data(self, data):
        if self._current is not None and data.strip():
            self._current["text_parts"].append(data.strip())

    def handle_endtag(self, tag):
        if self._current is None:
            return

        self._depth -= 1
        if self._depth == 0:
            self._current["text"] = " ".join(self._current["text_parts"])
            del self._current["text_parts"]
            self.slides.append(self._current)
            self._current = None


class HtmlChartWrapperExtractor(HTMLParser):
    """收集 HTML story chart-wrapper 的挂载结构。"""

    VOID_TAGS = DeckSlideExtractor.VOID_TAGS

    def __init__(self):
        super().__init__()
        self.wrappers = []
        self._current = None
        self._depth = 0

    @staticmethod
    def _classes(attrs_dict):
        return set((attrs_dict.get("class") or "").split())

    def _record_child(self, attrs_dict):
        classes = self._classes(attrs_dict)
        if "chart-container" in classes:
            self._current["containers"].append(
                {
                    "line": self.getpos()[0],
                    "id": attrs_dict.get("id", ""),
                    "chart_id": attrs_dict.get("data-chart-id", ""),
                }
            )

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        classes = self._classes(attrs_dict)

        if self._current is None and "chart-wrapper" in classes:
            self._current = {
                "line": self.getpos()[0],
                "chart_id": attrs_dict.get("data-chart-id", ""),
                "containers": [],
            }
            self._depth = 1
            self._record_child(attrs_dict)
            return

        if self._current is None:
            return

        self._record_child(attrs_dict)
        if tag not in self.VOID_TAGS:
            self._depth += 1

    def handle_startendtag(self, tag, attrs):
        if self._current is None:
            return
        self._record_child(dict(attrs))

    def handle_endtag(self, tag):
        if self._current is None:
            return

        self._depth -= 1
        if self._depth == 0:
            self.wrappers.append(self._current)
            self._current = None


class HtmlScrollySectionExtractor(HTMLParser):
    """收集 HTML story scrollytelling section 的结构。"""

    VOID_TAGS = DeckSlideExtractor.VOID_TAGS

    def __init__(self):
        super().__init__()
        self.sections = []
        self._current = None
        self._depth = 0

    @staticmethod
    def _classes(attrs_dict):
        return set((attrs_dict.get("class") or "").split())

    def _record_child(self, attrs_dict):
        classes = self._classes(attrs_dict)
        if "scrolly-chart" in classes:
            self._current["scrolly_chart_count"] += 1
        if "scrolly-steps" in classes:
            self._current["scrolly_steps_count"] += 1
        if "chart-container" in classes:
            self._current["chart_containers"].append(
                {
                    "line": self.getpos()[0],
                    "classes": classes,
                }
            )
        if "scrolly-step" in classes:
            self._current["steps"].append(
                {
                    "line": self.getpos()[0],
                    "step": attrs_dict.get("data-step", ""),
                    "is_active": "is-active" in classes,
                }
            )

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        classes = self._classes(attrs_dict)

        if self._current is None and "scrolly-section" in classes:
            self._current = {
                "line": self.getpos()[0],
                "chart_id": attrs_dict.get("data-chart-id", ""),
                "pattern": attrs_dict.get("data-pattern", ""),
                "scrolly_chart_count": 0,
                "scrolly_steps_count": 0,
                "chart_containers": [],
                "steps": [],
            }
            self._depth = 1
            return

        if self._current is None:
            return

        self._record_child(attrs_dict)
        if tag not in self.VOID_TAGS:
            self._depth += 1

    def handle_startendtag(self, tag, attrs):
        if self._current is None:
            return
        self._record_child(dict(attrs))

    def handle_endtag(self, tag):
        if self._current is None:
            return

        self._depth -= 1
        if self._depth == 0:
            self.sections.append(self._current)
            self._current = None


def _check_brackets(code, script_line_offset):
    """检查括号/花括号/方括号是否匹配。"""
    errors = []
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}
    in_string = None  # None, "'", '"', '`'
    escape_next = False
    line_num = 1

    for ch in code:
        if ch == "\n":
            line_num += 1

        if escape_next:
            escape_next = False
            continue

        if ch == "\\" and in_string:
            escape_next = True
            continue

        if in_string:
            if ch == in_string:
                in_string = None
            continue

        if ch in ("'", '"', "`"):
            in_string = ch
            continue

        # Skip single-line comments
        # (simplified: we handle // by scanning ahead)

        if ch in ("(", "[", "{"):
            stack.append((ch, line_num + script_line_offset - 1))
        elif ch in pairs:
            if not stack:
                errors.append(f'行 {line_num + script_line_offset - 1}: 多余的闭合 "{ch}"')
            elif stack[-1][0] != pairs[ch]:
                errors.append(
                    f'行 {line_num + script_line_offset - 1}: "{ch}" 与 "{stack[-1][0]}" '
                    f"(行 {stack[-1][1]}) 不匹配"
                )
                stack.pop()
            else:
                stack.pop()

    # Check unclosed string
    if in_string:
        errors.append(f"<script> 块起始行 {script_line_offset}: 字符串未闭合（{in_string}）")

    for bracket, line in stack:
        errors.append(f'行 {line}: "{bracket}" 未闭合')

    return errors


def _check_unclosed_strings(code, script_line_offset):
    """逐行检查未闭合的字符串字面量（检测实际换行符在字符串中的情况）。"""
    errors = []
    lines = code.split("\n")

    for i, line in enumerate(lines):
        line_num = i + script_line_offset
        stripped = line.strip()

        # Skip empty lines, comments
        if (
            not stripped
            or stripped.startswith("//")
            or stripped.startswith("*")
            or stripped.startswith("/*")
        ):
            continue

        in_string = None
        escaped = False
        index = 0
        while index < len(stripped):
            ch = stripped[index]
            if escaped:
                escaped = False
                index += 1
                continue
            if ch == "\\" and in_string:
                escaped = True
                index += 1
                continue
            if in_string:
                if ch == in_string:
                    in_string = None
                index += 1
                continue
            if ch == "/" and index + 1 < len(stripped) and stripped[index + 1] == "/":
                break
            if ch in ("'", '"'):
                in_string = ch
            index += 1

        if in_string:
            errors.append(f"行 {line_num}: 可能存在未闭合的 {in_string} 字符串（实际换行应用 \\n）")

    return errors


def _check_patterns(code, script_line_offset):
    """检测常见致命模式。"""
    errors = []
    lines = code.split("\n")

    for i, line in enumerate(lines):
        line_num = i + script_line_offset

        # 连续逗号
        if ",," in line and "//" not in line.split(",,")[0]:
            errors.append(f'行 {line_num}: 连续逗号 ",,"（可能缺少值或多余逗号）')

    return errors


def _check_chart_ids(html_content, scripts):
    """检查脚本中 getElementById 引用的 DOM id 是否在 HTML 中存在。"""
    errors = []

    html_ids = set(re.findall(r'id=["\']([^"\']+)["\']', html_content))

    for line_offset, code in scripts:
        for match in re.finditer(r'getElementById\(["\']([^"\']+)["\']\)', code):
            ref_id = match.group(1)
            if ref_id not in html_ids:
                errors.append(f'脚本引用了不存在的 id="{ref_id}"')

    return errors


def _check_legacy_render_terms(scripts):
    """检测旧渲染接口命名残留。"""
    errors = []
    all_code = "\n".join(code for _, code in scripts)

    checks = [
        (
            r"\brender_interactive\b",
            "检测到过时的 render_interactive 表述，请改用现有 py 脚本批量获取图表配置",
        ),
        (
            r"\brender_static\b",
            "检测到过时的 render_static 表述，请改用现有 py 脚本批量获取图表配置",
        ),
    ]

    for pattern, message in checks:
        if re.search(pattern, all_code):
            errors.append(message)

    return errors


def _check_vseed_runtime_contract(html_content, scripts):
    """检查当前 VSeed/VChart/VTable 渲染约定是否完整。"""
    errors = []
    all_code = "\n".join(code for _, code in scripts)
    has_chart_mounts = re.search(r"\bdata-chart-id\s*=", html_content) is not None

    uses_vseed_runtime = (
        any(
            keyword in all_code
            for keyword in (
                "VSEED_SPEC_MAP",
                "initVSeedCharts",
                "renderVSeedChart",
                "renderVSeedScrolly",
            )
        )
        or has_chart_mounts
    )
    if not uses_vseed_runtime:
        return errors

    has_empty_spec_map = (
        re.search(
            r"\b(?:window\.)?VSEED_SPEC_MAP\s*=\s*\{\s*\}\s*;",
            all_code,
        )
        is not None
    )
    has_nonempty_spec_map = "VSEED_SPEC_MAP" in all_code and not has_empty_spec_map
    requires_chart_runtime = has_chart_mounts or has_nonempty_spec_map
    if not requires_chart_runtime:
        return errors

    uses_shared_runtime_shell = (
        "VSEED_SPEC_MAP" in all_code and "initVSeedCharts" in all_code and has_chart_mounts
    )

    if "@visactor/vseed" not in html_content:
        errors.append("缺少 VSeed CDN 引用（@visactor/vseed）")
    if "@visactor/vchart" not in html_content:
        errors.append("缺少 VChart CDN 引用（@visactor/vchart）")
    if uses_shared_runtime_shell and "@visactor/vtable" not in html_content:
        errors.append("缺少 VTable CDN 引用（@visactor/vtable）")
    if re.search(r'"renderer"\s*:\s*"infographic"', html_content):
        errors.append("此 Skill 仅支持 standard-chart；请重新生成 VSeed 配置")
    if "VSEED_SPEC_MAP" not in all_code:
        errors.append("缺少 VSEED_SPEC_MAP 内联数据，图表无法渲染")
    if "initVSeedCharts" not in all_code:
        errors.append("缺少 initVSeedCharts 调用或定义，图表不会自动挂载")
    if not has_chart_mounts:
        errors.append("HTML 中缺少 data-chart-id 标记，统一图表渲染脚本无法定位章节")

    return errors


def _check_html_chart_wrapper_contract(html_content):
    """检查 HTML story chart-wrapper 的图表挂载结构。"""
    errors = []
    if "chart-wrapper" not in html_content:
        return errors

    extractor = HtmlChartWrapperExtractor()
    extractor.feed(html_content)

    for wrapper in extractor.wrappers:
        chart_id = wrapper["chart_id"]
        label = chart_id or f"line {wrapper['line']}"
        containers = wrapper["containers"]
        if not chart_id:
            errors.append(
                f'HTML chart-wrapper "{label}" 缺少 data-chart-id；图表 id 只挂在外层 chart-wrapper'
            )
        if len(containers) != 1:
            errors.append(
                f'HTML chart-wrapper "{label}" 必须正好包含 1 个 chart-container，当前为 {len(containers)} 个'
            )
            continue
        container = containers[0]
        if not container["id"]:
            errors.append(
                f'HTML chart-wrapper "{label}" 的 chart-container 缺少 id；应使用 id="chart-{chart_id}"'
            )
        if container["chart_id"]:
            errors.append(
                f'HTML chart-wrapper "{label}" 的 chart-container 不要重复挂 data-chart-id；只在外层 chart-wrapper 上挂载'
            )

    return errors


def _check_html_scrolly_contract(html_content):
    """检查 HTML story scrollytelling section 的必要挂载点。"""
    errors = []
    if "scrolly-section" not in html_content:
        return errors

    extractor = HtmlScrollySectionExtractor()
    extractor.feed(html_content)

    for section in extractor.sections:
        line = section["line"]
        if section["pattern"] != "scrollytelling":
            errors.append(
                f'HTML scrolly-section line {line} 必须声明 data-pattern="scrollytelling"'
            )
        if not section["chart_id"]:
            errors.append(
                "HTML scrolly-section 缺少 data-chart-id；section root 必须挂载 primary chart id，内部 chart-wrapper 或 step 的 data-chart-id 不能替代"
            )
        if section["scrolly_chart_count"] != 1:
            errors.append(
                f"HTML scrolly-section line {line} 必须包含 1 个 .scrolly-chart sticky 图表列，当前为 {section['scrolly_chart_count']} 个"
            )
        if section["scrolly_steps_count"] != 1:
            errors.append(
                f"HTML scrolly-section line {line} 必须包含 1 个 .scrolly-steps 步骤列，当前为 {section['scrolly_steps_count']} 个"
            )
        if not any("scrolly" in item["classes"] for item in section["chart_containers"]):
            errors.append(
                f"HTML scrolly-section line {line} 的 chart-container 必须追加 .scrolly modifier"
            )
        step_values = [item["step"] for item in section["steps"]]
        expected_steps = [str(index) for index in range(len(step_values))]
        if step_values != expected_steps:
            errors.append(
                f"HTML scrolly-section line {line} 的 scrolly-step data-step 必须从 0 开始连续递增，当前为 {step_values}"
            )
        active_steps = [item for item in section["steps"] if item["is_active"]]
        if not any(item["step"] == "0" for item in active_steps):
            errors.append(
                f'HTML scrolly-section line {line} 的初始 active step 必须是 data-step="0"'
            )

    return errors


def _check_story_motion_contract(html_content, scripts):
    """检查当前 story motion runtime 约定是否完整。"""
    errors = []
    all_code = "\n".join(code for _, code in scripts)

    uses_story_motion = "initStoryMotion" in all_code or "data-pattern=" in html_content
    if not uses_story_motion:
        return errors

    if "gsap@3" not in html_content:
        errors.append("缺少 GSAP CDN 引用（gsap@3）")
    if "ScrollTrigger" not in html_content:
        errors.append("缺少 ScrollTrigger CDN 引用")
    if "initStoryMotion" not in all_code:
        errors.append("缺少 initStoryMotion 调用或定义，story motion runtime 不会自动挂载")
    if "data-pattern=" not in html_content:
        errors.append("HTML 中缺少 data-pattern 标记，story motion runtime 无法定位章节")

    return errors


WEB_PPT_SLIDE_TYPES = {
    "cover",
    "hero-stat",
    "hero-image",
    "metric-board",
    "metric-reading",
    "chart-read",
    "scroll-scene",
    "comparison",
    "timeline",
    "action",
    "quote",
    "quote-pair",
    "image-grid",
    "text-image",
    "process-flow",
    "methodology",
    "transition",
    "closing",
}

WEB_PPT_LAYOUTS = {
    "wide-editorial",
    "diagonal-stage",
    "evidence-stage",
    "rowline-board",
    "split-argument",
    "scrolly-stage",
    "quote-focus",
    "closing-stage",
}

WEB_PPT_FORBIDDEN_ASSET_TEXT = (
    "素材缺失",
    "当前以占位",
    "占位影像",
    "asset missing",
    "missing asset",
    "unresolved asset",
)

WEB_PPT_ASSET_CLASSES = (
    "visual-artifact",
    "action-lead-asset",
    "primary-image",
    "evidence-image",
    "slide-background",
)

WEB_PPT_EMPTY_ASSET_CONTAINER_RE = re.compile(
    r'<(?P<tag>div|figure)\b(?P<attrs>[^>]*)\bclass=["\'](?P<class>[^"\']*'
    r"(?:visual-artifact|action-lead-asset|primary-image|evidence-image|slide-background)"
    r'[^"\']*)["\'][^>]*>\s*</(?P=tag)>',
    re.IGNORECASE | re.DOTALL,
)

WEB_PPT_FORBIDDEN_MOTION_MARKERS = (
    "data-motion-level",
    "data-animate",
    "data-anim",
    "data-motion-recipe",
    "data-runtime-motion",
)

WEB_PPT_STAT_STAGES = {
    "monolith",
    "context-cards",
    "delta-compare",
    "ticker",
}

WEB_PPT_COMPOSE_REQUIRED_FRAGMENTS = (
    ("data-deck-shell", "data-deck-shell"),
    ("data-deck-track", "data-deck-track"),
    ("data-deck-axis", "data-deck-axis"),
    ("data-bg-polarity", "data-bg-polarity"),
    ("deck-progress-bar", "deck-progress-bar"),
    ("data-deck-progress", "data-deck-progress"),
    ("data-deck-dots", "data-deck-dots"),
    ("window.VSEED_SPEC_MAP", "window.VSEED_SPEC_MAP"),
    ("initVSeedCharts", "initVSeedCharts"),
    ("initStoryDeck", "initStoryDeck"),
    ("AUTO_REVEAL_SELECTOR", "AUTO_REVEAL_SELECTOR"),
    ("HERO_STAT_NUMBER_SELECTOR", "HERO_STAT_NUMBER_SELECTOR"),
    ("--deck-cover-title-size", "--deck-cover-title-size"),
    ('.deck-slide[data-slide-type="hero-stat"]', '.deck-slide[data-slide-type="hero-stat"]'),
)


def _first_web_ppt_asset_class(class_value: str) -> str:
    classes = set((class_value or "").split())
    for asset_class in WEB_PPT_ASSET_CLASSES:
        if asset_class in classes:
            return asset_class
    return class_value.strip() or "asset container"


def _extract_json_object_after_assignment(content: str, variable_name: str):
    match = re.search(r"\b(?:window\.)?" + re.escape(variable_name) + r"\s*=", content)
    if not match:
        return None

    start = content.find("{", match.end())
    if start == -1:
        return None

    depth = 0
    in_string = None
    escaped = False
    for index in range(start, len(content)):
        ch = content[index]
        if escaped:
            escaped = False
            continue
        if ch == "\\" and in_string:
            escaped = True
            continue
        if in_string:
            if ch == in_string:
                in_string = None
            continue
        if ch in ('"', "'"):
            in_string = ch
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return content[start : index + 1]
    return None


def _extract_vseed_spec_map_keys(html_content: str):
    payload = _extract_json_object_after_assignment(html_content, "VSEED_SPEC_MAP")
    if payload is None:
        return None
    try:
        parsed = json.loads(payload)
    except json.JSONDecodeError:
        return None
    if not isinstance(parsed, dict):
        return None
    return set(str(key) for key in parsed.keys())


def _check_web_ppt_contract(html_content):
    """检查 Web-PPT 的 slide type / layout 边界，避免视觉结构在最终 HTML 中失控。"""
    errors = []

    if "deck-slide" not in html_content and "data-deck-shell" not in html_content:
        return errors

    extractor = DeckSlideExtractor()
    extractor.feed(html_content)
    if "data-deck-shell" in html_content and not extractor.slides:
        errors.append("Web-PPT deck shell 缺少 deck-slide；至少需要 1 张 slide")
        return errors

    for fragment, label in WEB_PPT_COMPOSE_REQUIRED_FRAGMENTS:
        if fragment not in html_content:
            errors.append(f"Web-PPT 最终 HTML 缺少 compose 输出标记 {label}")

    if len(extractor.slides) > 1:
        first_slide = extractor.slides[0]
        first_type = first_slide["slide_type"]
        if first_type not in {"cover", "hero-stat", "hero-image"}:
            errors.append(
                f'Web-PPT 首张 slide 是 "{first_type or "missing"}"；首张 slide 只能是 cover / hero-stat / hero-image'
            )
        elif first_type == "hero-stat" and first_slide["stat_stage"] != "monolith":
            errors.append(
                f'Web-PPT 首张 slide 是 hero-stat，但必须使用 hero-stat/monolith，不能使用 "{first_slide["stat_stage"] or "missing"}"'
            )

    for slide_index, slide in enumerate(extractor.slides):
        slide_type = slide["slide_type"]
        recipe = slide["recipe"]
        layout = slide["layout"]
        stat_stage = slide["stat_stage"]
        number_treatment = slide["number_treatment"]
        quote_count = slide["quote_count"]
        visual_artifact_count = slide["visual_artifact_count"]
        action_lead_asset_count = slide["action_lead_asset_count"]
        chart_frame_count = slide["chart_frame_count"]
        chart_frame_ids = slide["chart_frame_ids"]
        chart_container_count = slide["chart_container_count"]
        primary_image_count = slide["primary_image_count"]
        evidence_image_count = slide["evidence_image_count"]
        evidence_figure_count = slide["evidence_figure_count"]
        metric_tile_count = slide["metric_tile_count"]
        comparison_panel_count = slide["comparison_panel_count"]
        scroll_steps = slide["scroll_steps"]
        rowline_item_count = slide["rowline_item_count"]
        action_item_count = slide["action_item_count"]
        stat_context_card_count = slide["stat_context_card_count"]
        scroll_step_dots_count = slide["scroll_step_dots_count"]
        scroll_step_target_count = slide["scroll_step_target_count"]
        html_scrolly_section_count = slide["html_scrolly_section_count"]
        slide_split_count = slide["slide_split_count"]
        headline_count = slide["headline_count"]
        label = slide_type or recipe or f"line {slide['line']}"

        if slide["legacy_slide_role"]:
            errors.append(
                f'Web-PPT slide "{label}" 使用了旧属性 data-slide-role；请改用 data-slide-type'
            )

        if slide["legacy_composition"]:
            errors.append(
                f'Web-PPT slide "{label}" 使用了旧属性 data-composition；请改用 data-layout'
            )

        if slide["treatment"]:
            errors.append(
                f'Web-PPT slide "{label}" 使用了 data-treatment；Web-PPT 不暴露 page-level treatment'
            )

        if stat_stage:
            if slide_type != "hero-stat":
                errors.append(
                    f'Web-PPT slide "{label}" 使用了 data-stat-stage，但该内部舞台只允许用于 hero-stat'
                )
            elif stat_stage not in WEB_PPT_STAT_STAGES:
                errors.append(f'Web-PPT slide "{label}" 使用了未知 data-stat-stage="{stat_stage}"')

        if number_treatment:
            errors.append(
                f'Web-PPT slide "{label}" 使用了 data-number-treatment；当前不支持独立数字材质处理'
            )

        if slide_type == "visual-artifact":
            errors.append(
                "Web-PPT visual-artifact 不能作为 slide type；它只能作为 text-image 页内的证据对象"
            )

        if not slide_type:
            errors.append(f"Web-PPT slide line {slide['line']} 缺少 data-slide-type")
        elif slide_type not in WEB_PPT_SLIDE_TYPES:
            errors.append(f'Web-PPT slide "{label}" 使用了未知 data-slide-type="{slide_type}"')

        if not layout:
            errors.append(f'Web-PPT slide "{label}" 缺少 data-layout')
        elif layout not in WEB_PPT_LAYOUTS:
            errors.append(f'Web-PPT slide "{label}" 使用了未知 data-layout="{layout}"')

        if layout == "rowline-board" and rowline_item_count > 6:
            errors.append(
                f'Web-PPT slide "{label}" 使用 rowline-board 但包含 {rowline_item_count} 行；rowline-board 最多 6 行，超出必须拆页'
            )

        if slide_type == "cover":
            if layout and layout != "wide-editorial":
                errors.append(
                    f'Web-PPT slide "{label}" 是 cover，但 data-layout 必须是 wide-editorial'
                )
            if slide_split_count:
                errors.append(f'Web-PPT slide "{label}" 是 cover，但不能使用 slide-split 双栏结构')
            cover_forbidden = (
                ("chart-frame", chart_frame_count),
                ("metric-tile", metric_tile_count),
                ("comparison-panel", comparison_panel_count),
                ("evidence-figure", evidence_figure_count),
                ("evidence-image", evidence_image_count),
                ("primary-image", primary_image_count),
            )
            for class_name, count in cover_forbidden:
                if count:
                    errors.append(
                        f'Web-PPT slide "{label}" 是 cover，但不能使用 {class_name}；封面只承载入口标题、导语、meta 和背景 motif'
                    )

        if slide_type == "hero-image" and slide_split_count:
            errors.append(
                f'Web-PPT slide "{label}" 是 hero-image，但不能使用 slide-split；hero_background_image 是背景氛围素材，不创建右侧证据列'
            )

        if slide_type == "action" and action_item_count > 5:
            errors.append(
                f'Web-PPT slide "{label}" 是 action，但包含 {action_item_count} 个 action-item；action 最多 5 个，超出必须拆页'
            )

        if slide_type == "image-grid" and not 2 <= evidence_figure_count <= 6:
            errors.append(
                f'Web-PPT slide "{label}" 是 image-grid，但包含 {evidence_figure_count} 个 evidence-figure；image-grid 必须使用 2-6 张真实图片'
            )

        if slide_type == "chart-read":
            if chart_frame_count != 1 or chart_container_count != 1:
                errors.append(
                    f'Web-PPT slide "{label}" 是 chart-read，必须正好包含 1 个 chart-frame 和 1 个 chart-container'
                )
            if chart_frame_count and any(not chart_id for chart_id in chart_frame_ids):
                errors.append(
                    f'Web-PPT slide "{label}" 是 chart-read，但 chart-frame 缺少 data-chart-id'
                )

        if (
            slide_type == "hero-stat"
            and stat_stage == "context-cards"
            and not 1 <= stat_context_card_count <= 4
        ):
            errors.append(
                f'Web-PPT slide "{label}" 是 hero-stat/context-cards，但包含 {stat_context_card_count} 个 stat-context-card；context-cards 必须使用 1-4 条短读法，超出必须拆页'
            )

        if slide_type == "hero-stat" and headline_count < 1:
            if slide_index == 0:
                errors.append(
                    "Web-PPT 首张 slide 是 hero-stat，必须包含 headline；首页不能只输出 kicker、big-number 和 reading"
                )
            else:
                errors.append(
                    f'Web-PPT slide "{label}" 是 hero-stat，必须包含 headline；数字页也需要先给出判断标题'
                )

        if slide_type == "scroll-scene":
            if layout != "scrolly-stage":
                errors.append(
                    f'Web-PPT slide "{label}" 是 scroll-scene，但 data-layout 必须是 scrolly-stage'
                )
            if not slide["chart_id"]:
                errors.append(f'Web-PPT slide "{label}" 是 scroll-scene，但缺少 data-chart-id')
            if chart_frame_count != 1 or chart_container_count != 1:
                errors.append(
                    f'Web-PPT slide "{label}" 是 scroll-scene，必须正好包含 1 个 chart-frame 和 1 个 chart-container'
                )
            if chart_frame_count and any(not chart_id for chart_id in chart_frame_ids):
                errors.append(
                    f'Web-PPT slide "{label}" 是 scroll-scene，但 chart-frame 缺少 data-chart-id'
                )
            if len(scroll_steps) < 2:
                errors.append(
                    f'Web-PPT slide "{label}" 是 scroll-scene，但 scroll-step-copy 少于 2 个'
                )
            else:
                parsed_steps = []
                for item in scroll_steps:
                    try:
                        parsed_steps.append(int(item["step"]))
                    except ValueError:
                        errors.append(
                            f'Web-PPT slide "{label}" 第 {item["line"]} 行 scroll-step-copy 的 data-scroll-step 不是整数'
                        )
                if parsed_steps and sorted(parsed_steps) != list(range(len(scroll_steps))):
                    errors.append(f'Web-PPT slide "{label}" 的 data-scroll-step 必须从 0 连续递增')
                active_count = sum(1 for item in scroll_steps if item["is_active"])
                if active_count != 1:
                    errors.append(
                        f'Web-PPT slide "{label}" 的 scroll-step-copy 初始必须且只能有 1 个 is-active'
                    )
            if scroll_step_dots_count or scroll_step_target_count:
                errors.append(
                    f'Web-PPT slide "{label}" 不允许使用 scroll-step-dots；scroll-scene 内部 step 不展示可见数量指示'
                )
            if html_scrolly_section_count > 0:
                errors.append(
                    f'Web-PPT slide "{label}" 使用了 HTML story 的 scrolly-section；scroll-scene 必须使用 PPT 专用结构'
                )
        elif layout == "scrolly-stage":
            errors.append(
                f'Web-PPT slide "{label}" 使用 scrolly-stage，但 slide type 不是 scroll-scene'
            )

        if slide_type == "methodology" and layout != "rowline-board":
            errors.append(
                f'Web-PPT slide "{label}" 是 methodology，但 data-layout 必须是 rowline-board'
            )

        if slide_type == "closing":
            if layout != "closing-stage":
                errors.append(
                    f'Web-PPT slide "{label}" 是 closing，但 data-layout 必须是 closing-stage'
                )
            if chart_frame_count or chart_container_count:
                errors.append(
                    f'Web-PPT slide "{label}" 是 closing，不允许包含 chart-frame 或 chart-container'
                )
        elif layout == "closing-stage":
            errors.append(f'Web-PPT slide "{label}" 使用 closing-stage，但 slide type 不是 closing')

        if slide_type == "quote" and quote_count != 1:
            errors.append(
                f'Web-PPT slide "{label}" 是普通 quote 页，但包含 {quote_count} 个 quote-block；普通 quote 页只能放 1 条引用'
            )

        if slide_type == "quote-pair" and quote_count != 2:
            errors.append(
                f'Web-PPT slide "{label}" 是 quote-pair 页，但包含 {quote_count} 个 quote-block；quote-pair 必须正好 2 条引用'
            )

        if quote_count > 1 and slide_type != "quote-pair":
            errors.append(
                f'Web-PPT slide "{label}" 包含多个 quote-block，必须改用 data-slide-type="quote-pair"'
            )

        if layout == "split-argument" and quote_count > 1:
            errors.append(
                f'Web-PPT slide "{label}" 在 split-argument 中放了多个 quote-block；多引用页必须使用 quote-pair + evidence-stage'
            )

        if slide_type == "cover" and visual_artifact_count > 0:
            errors.append(
                f'Web-PPT slide "{label}" 是 cover，但使用了 visual-artifact；封面 motif / texture 必须使用背景或 motif slot，不能输出主证据图框'
            )

        elif slide_type == "action" and visual_artifact_count > 0:
            errors.append(
                f'Web-PPT slide "{label}" 是 action，但使用了 visual-artifact；行动页不放装饰或主证据 asset，行动项必须保持主体'
            )

        elif visual_artifact_count > 0 and slide_type != "text-image":
            errors.append(
                f'Web-PPT slide "{label}" 使用了 visual-artifact，但该证据对象只允许出现在 text-image 页'
            )

        if action_lead_asset_count > 0:
            errors.append(
                f'Web-PPT slide "{label}" 使用了 action-lead-asset；Web-PPT action 页不支持装饰 asset'
            )

    chart_ids = sorted(
        {
            chart_id
            for slide in extractor.slides
            for chart_id in slide["chart_frame_ids"]
            if chart_id
        }
    )
    if chart_ids:
        spec_keys = _extract_vseed_spec_map_keys(html_content)
        if spec_keys is None:
            errors.append("Web-PPT 最终 HTML 无法解析 VSEED_SPEC_MAP；图表无法按 spec_map 挂载")
        else:
            missing_chart_ids = sorted(set(chart_ids) - spec_keys)
            if missing_chart_ids:
                errors.append(
                    f"Web-PPT chart-frame 的 data-chart-id 未出现在 VSEED_SPEC_MAP: {', '.join(missing_chart_ids)}"
                )

    closing_indexes = [
        index for index, slide in enumerate(extractor.slides) if slide["slide_type"] == "closing"
    ]
    if len(closing_indexes) > 1:
        errors.append("Web-PPT closing slide 最多只能出现 1 张")
    if closing_indexes and closing_indexes[-1] != len(extractor.slides) - 1:
        errors.append("Web-PPT closing slide 必须是最后一张 slide")

    lower_html = html_content.lower()
    for term in WEB_PPT_FORBIDDEN_ASSET_TEXT:
        if term in lower_html:
            errors.append(
                f'Web-PPT 最终 HTML 含有素材缺失/占位说明 "{term}"；应使用 resolved asset、移除弱装饰 slot，或在必需素材缺失时停止'
            )

    if re.search(r"\{\{[^}]*asset[^}]*\}\}", html_content, flags=re.IGNORECASE):
        errors.append("Web-PPT 最终 HTML 含有未解析的 asset 模板标记")

    for match in WEB_PPT_EMPTY_ASSET_CONTAINER_RE.finditer(html_content):
        line = html_content.count("\n", 0, match.start()) + 1
        asset_class = _first_web_ppt_asset_class(match.group("class"))
        errors.append(
            f"Web-PPT 最终 HTML 第 {line} 行含有空 asset 容器 .{asset_class}；弱装饰缺失时删除 slot，主证据缺失时停止"
        )

    for marker in WEB_PPT_FORBIDDEN_MOTION_MARKERS:
        if re.search(r"\b" + re.escape(marker) + r"\s*=", html_content, flags=re.IGNORECASE):
            errors.append(
                f"Web-PPT 最终 HTML 不允许使用 {marker}；PPT 动效由 deck runtime / CSS 内置，不暴露逐页 motion 配置"
            )

    return errors


def _try_node_check(scripts):
    """如果 Node.js 可用，做语法检查。"""
    node = shutil.which("node")
    if not node:
        return []

    errors = []
    for line_offset, code in scripts:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".js", delete=False) as f:
            f.write(code)
            f.flush()
            try:
                result = subprocess.run(
                    [node, "--check", f.name], capture_output=True, text=True, timeout=10
                )
                if result.returncode != 0:
                    # Extract error info
                    err = result.stderr.strip()
                    errors.append(f"Node.js 语法错误 (script 起始行 {line_offset}): {err}")
            except (subprocess.TimeoutExpired, OSError):
                pass
            finally:
                Path(f.name).unlink(missing_ok=True)

    return errors


CSS_TOKEN_DECLARATION_PATTERN = re.compile(r"(--[A-Za-z0-9_-]+)\s*:")
CSS_TOKEN_USAGE_PATTERN = re.compile(r"var\(\s*(--[A-Za-z0-9_-]+)\b(?P<tail>[^)]*)\)")


def _decode_data_uri_stylesheet(href: str) -> str:
    payload = href.split(",", 1)[1]
    try:
        return base64.b64decode(payload).decode("utf-8")
    except Exception:
        return ""


def _read_linked_stylesheet(href: str, html_path: Path) -> str:
    if href.startswith("data:text/css;base64,"):
        return _decode_data_uri_stylesheet(href)
    if href.startswith(("http://", "https://", "//")):
        return ""

    css_path = (html_path.parent / href).resolve()
    try:
        if css_path.exists() and css_path.is_file():
            return css_path.read_text(encoding="utf-8")
    except OSError:
        return ""
    return ""


def _collect_css_sources(html_content: str, html_path: Path) -> list[str]:
    extractor = StyleExtractor()
    extractor.feed(html_content)
    linked_styles = [
        _read_linked_stylesheet(href, html_path) for href in extractor.stylesheet_links
    ]
    return [*extractor.inline_styles, *extractor.style_attrs, *linked_styles]


def _check_unknown_css_tokens(html_content: str, html_path: Path):
    """Fail on unknown CSS custom properties so generated HTML stays on the shared token system."""
    errors = []
    css_sources = _collect_css_sources(html_content, html_path)
    if not css_sources:
        return errors

    declared_tokens = set()
    used_tokens = set()
    for source in css_sources:
        declared_tokens.update(CSS_TOKEN_DECLARATION_PATTERN.findall(source))
        for match in CSS_TOKEN_USAGE_PATTERN.finditer(source):
            # `var(--token, fallback)` is safe without a declaration in the current HTML payload.
            if "," in (match.group("tail") or ""):
                continue
            used_tokens.add(match.group(1))

    unknown_tokens = sorted(token for token in used_tokens if token not in declared_tokens)
    for token in unknown_tokens:
        errors.append(f"检测到未定义的 CSS token: {token}")
    return errors


def validate_html_scripts(html_path):
    """
    校验 HTML 文件中的 inline <script> 与 page-specific <style> 契约。

    返回: (passed: bool, errors: list[str])
    - passed=True: 所有检查通过
    - passed=False: errors 包含具体错误描述
    """
    html_path = Path(html_path)
    if not html_path.exists():
        return False, [f"文件不存在: {html_path}"]

    html_content = html_path.read_text(encoding="utf-8")

    # Extract scripts
    extractor = ScriptExtractor()
    extractor.feed(html_content)
    scripts = extractor.scripts

    errors = []

    # Layer 1: structural checks (pure Python)
    for line_offset, code in scripts:
        errors.extend(_check_brackets(code, line_offset))
        errors.extend(_check_unclosed_strings(code, line_offset))
        errors.extend(_check_patterns(code, line_offset))

    errors.extend(_check_chart_ids(html_content, scripts))
    errors.extend(_check_legacy_render_terms(scripts))
    errors.extend(_check_vseed_runtime_contract(html_content, scripts))
    errors.extend(_check_html_chart_wrapper_contract(html_content))
    errors.extend(_check_html_scrolly_contract(html_content))
    errors.extend(_check_story_motion_contract(html_content, scripts))
    errors.extend(_check_web_ppt_contract(html_content))
    errors.extend(_check_unknown_css_tokens(html_content, html_path))

    # Layer 2: Node.js syntax check (optional)
    if scripts:
        errors.extend(_try_node_check(scripts))

    passed = len(errors) == 0
    return passed, errors


def validate_or_raise(html_path):
    """校验 HTML JS，失败时直接 raise ValueError。适合生产流程中确保校验闭环。"""
    passed, errors = validate_html_scripts(html_path)
    if passed:
        print(f"JS 校验通过: {html_path}")
    else:
        msg = f"JS 校验失败（{len(errors)} 个问题）:\n" + "\n".join(f"  - {e}" for e in errors)
        print(msg)
        raise ValueError(msg)


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("用法: python3 validate_js.py <html_file>")
        sys.exit(1)

    html_file = sys.argv[1]
    passed, errors = validate_html_scripts(html_file)

    if passed:
        print(f"OK: {html_file} JS 校验通过")
    else:
        print(f"FAIL: {html_file} 发现 {len(errors)} 个问题:")
        for err in errors:
            print(f"  - {err}")
        sys.exit(1)
