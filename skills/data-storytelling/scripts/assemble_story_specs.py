"""Assemble Agent-authored VSeed configurations with Plan-owned datasets.

Inputs: plan.md, dataset_map.json, chart_specs.json.
Output: spec_map.json with dataset, theme, metadata and ordered step states.
"""

from __future__ import annotations

import argparse
import json
import math
import re
from pathlib import Path
from typing import Any

from annotation_point_runtime_hints import attach_annotation_point_runtime_hints_to_spec_map
from local_chart_specs import apply_difference_line_region_padding, assemble_local_specs
from preset_resolver import PRESET_META
from story_plan_contract import format_plan_structural_errors

STANDARD_CHART_RENDERER = "standard-chart"
ALLOWED_CHART_RENDERERS = {STANDARD_CHART_RENDERER, "infographic"}


def _match(text: str, pattern: str) -> str:
    m = re.search(pattern, text, flags=re.MULTILINE)
    return _strip_wrapping_pairs(m.group(1)) if m else ""


def _match_text(text: str, pattern: str) -> str:
    m = re.search(pattern, text, flags=re.MULTILINE)
    return _clean_text(m.group(1)) if m else ""


def _extract_section(text: str, heading: str) -> str:
    pattern = rf"^##\s+{re.escape(heading)}\s*\n(.*?)(?=^##\s+|\Z)"
    m = re.search(pattern, text, flags=re.MULTILINE | re.DOTALL)
    return m.group(1) if m else ""


def _match_inline_field(block: str, field_name: str) -> str:
    return _match(block, rf"^- (?:\*\*)?{re.escape(field_name)}(?:\*\*)?: (.+)$")


def _extract_field_block(block: str, field: str) -> str:
    pattern = (
        rf"^- (?:\*\*)?{re.escape(field)}(?:\*\*)?:\s*\n(?P<body>.*?)(?=^- (?:\*\*)?[A-Za-z][^:\n]*"
        rf"(?:\*\*)?:|\Z)"
    )
    m = re.search(pattern, block, flags=re.MULTILINE | re.DOTALL)
    return m.group("body") if m else ""


def _extract_chart_subblock(chart_block: str, field_name: str) -> str:
    match = re.search(
        rf"^(?P<indent>\s*)(?:- )?{re.escape(field_name)}:\s*\n(?P<body>.*?)(?=^(?P=indent)(?:- )?[A-Za-z]|\Z)",
        chart_block,
        flags=re.MULTILINE | re.DOTALL,
    )
    return match.group("body") if match else ""


def _extract_step_subblock(step_body: str, field_name: str) -> str:
    match = re.search(
        rf"^(?P<indent>\s*)(?:- )?{re.escape(field_name)}:\s*\n(?P<body>.*?)(?=^(?P=indent)(?:- )?[A-Za-z]|\Z)",
        step_body,
        flags=re.MULTILINE | re.DOTALL,
    )
    return match.group("body") if match else ""


def _annotation_lines(block: str) -> list[tuple[int, str]]:
    lines: list[tuple[int, str]] = []
    for raw_line in block.splitlines():
        if not raw_line.strip():
            continue
        indent = len(raw_line) - len(raw_line.lstrip(" "))
        lines.append((indent, raw_line.strip()))
    return lines


def _annotation_scalar(value: str) -> str:
    cleaned = value.strip()
    while len(cleaned) >= 2 and cleaned[0] == cleaned[-1] and cleaned[0] in {'"', "'"}:
        cleaned = cleaned[1:-1].strip()
    return cleaned


def _parse_annotation_node(lines: list[tuple[int, str]], index: int) -> tuple[Any, int]:
    _indent, content = lines[index]
    if content.startswith("- "):
        return _parse_annotation_list(lines, index, lines[index][0])
    return _parse_annotation_mapping(lines, index, lines[index][0])


def _parse_annotation_mapping(
    lines: list[tuple[int, str]],
    index: int,
    indent: int,
    initial: dict[str, Any] | None = None,
) -> tuple[dict[str, Any], int]:
    mapping = dict(initial or {})
    while index < len(lines):
        current_indent, content = lines[index]
        if current_indent != indent or content.startswith("- ") or ":" not in content:
            break
        key, raw_value = content.split(":", 1)
        key = _clean(key)
        raw_value = raw_value.strip()
        index += 1
        if raw_value:
            mapping[key] = _annotation_scalar(raw_value)
            continue
        if index < len(lines) and lines[index][0] > indent:
            nested_value, index = _parse_annotation_node(lines, index)
            mapping[key] = nested_value
        else:
            mapping[key] = ""
    return mapping, index


def _parse_annotation_list(
    lines: list[tuple[int, str]],
    index: int,
    indent: int,
) -> tuple[list[Any], int]:
    items: list[Any] = []
    while index < len(lines):
        current_indent, content = lines[index]
        if current_indent != indent or not content.startswith("- "):
            break
        item_content = content[2:].strip()
        if not item_content:
            index += 1
            if index < len(lines) and lines[index][0] > indent:
                nested_value, index = _parse_annotation_node(lines, index)
                items.append(nested_value)
            else:
                items.append("")
            continue
        if ":" in item_content:
            key, raw_value = item_content.split(":", 1)
            key = _clean(key)
            raw_value = raw_value.strip()
            entry: dict[str, Any] = {}
            index += 1
            if raw_value:
                entry[key] = _annotation_scalar(raw_value)
            elif index < len(lines) and lines[index][0] > indent:
                nested_value, index = _parse_annotation_node(lines, index)
                entry[key] = nested_value
            else:
                entry[key] = ""
            entry, index = _parse_annotation_mapping(lines, index, indent + 2, entry)
            items.append(entry)
            continue
        items.append(_annotation_scalar(item_content))
        index += 1
    return items, index


def _parse_annotation_block(block: str) -> list[Any]:
    lines = _annotation_lines(block)
    if not lines:
        return []
    parsed, _ = _parse_annotation_node(lines, 0)
    return parsed if isinstance(parsed, list) else []


def _parse_encodings(chart_block: str, field_name: str) -> list[dict[str, str]]:
    section = _extract_chart_subblock(chart_block, field_name)
    if not section.strip():
        return []
    entries = re.findall(
        r"^\s{6}- id: ([^\n]+)\n(.*?)(?=^\s{6}- id: |\Z)",
        section,
        flags=re.MULTILINE | re.DOTALL,
    )
    return [
        {
            "id": _clean(item_id),
            "encoding": _match(body, r"^\s{8}encoding: (.+)$"),
            "alias": _match_text(body, r"^\s{8}alias: (.+)$"),
            "numformat": _match(body, r"^\s{8}numformat: (.+)$"),
        }
        for item_id, body in entries
    ]


def _parse_axis_titles(chart_block: str) -> dict[str, str]:
    axis_titles_block = _extract_chart_subblock(chart_block, "axisTitles")
    if not axis_titles_block.strip():
        return {}
    return {
        "primaryYAxis": _match_text(axis_titles_block, r"^\s*primaryYAxis: (.+)$"),
        "secondaryYAxis": _match_text(axis_titles_block, r"^\s*secondaryYAxis: (.+)$"),
    }


def _clean(value: str) -> str:
    return _strip_wrapping_pairs(value)


def _clean_text(value: str) -> str:
    return _strip_wrapping_pairs(value)


def _strip_wrapping_pairs(value: str) -> str:
    cleaned = value.strip()
    while len(cleaned) >= 2 and cleaned[0] == cleaned[-1] and cleaned[0] in {"`", '"', "'"}:
        cleaned = cleaned[1:-1].strip()
    return cleaned


def _normalize_label_mode(value: str | None) -> str:
    normalized = _strip_wrapping_pairs(value or "").lower()
    if normalized in {"", "on", "off"}:
        return normalized
    if normalized == "auto":
        return "on"
    return ""


def normalize_chart_renderer(value: str | None) -> str:
    normalized = _strip_wrapping_pairs(value or "").lower()
    if not normalized:
        return STANDARD_CHART_RENDERER
    if normalized not in ALLOWED_CHART_RENDERERS:
        raise ValueError(
            f"Unsupported chart renderer: {value}. "
            f"Allowed: {', '.join(sorted(ALLOWED_CHART_RENDERERS))}"
        )
    return normalized


def _parse_inline_refs(block: str, key_name: str) -> list[str]:
    match = re.search(rf"^\s+- {re.escape(key_name)}: \[(.+)\]$", block, flags=re.MULTILINE)
    if not match:
        return []
    return [_clean(item) for item in match.group(1).split(",") if _clean(item)]


def _match_chart_field(block: str, field_name: str) -> str:
    return _match(block, rf"^\s{{4}}(?:- )?{re.escape(field_name)}: (.+)$")


def _match_chart_text_field(block: str, field_name: str) -> str:
    return _match_text(block, rf"^\s{{4}}(?:- )?{re.escape(field_name)}: (.+)$")


def _parse_charts(charts_block: str) -> list[dict[str, Any]]:
    if not charts_block.strip():
        return []
    # Split every top-level entry, including malformed headers. Filtering for
    # valid ids first would silently discard an invalid chart next to a valid one.
    headers = list(
        re.finditer(
            r"^ {2}-(?:[ \t]+([^\n]*)|[ \t]*)$",
            charts_block,
            re.MULTILINE,
        )
    )
    if not headers or charts_block[: headers[0].start()].strip():
        raise ValueError(
            "Charts entries must start with a chart id: "
            "two spaces followed by - `chart-id` or - id: chart-id."
        )
    charts = []
    for index, header in enumerate(headers):
        raw_header = (header.group(1) or "").strip()
        match = re.fullmatch(r"`([^`]*)`|id:[ \t]*(.*)", raw_header)
        chart_id = _clean((match.group(1) or match.group(2) or "") if match else "")
        if not chart_id:
            raise ValueError(
                f"Charts entry {index + 1} requires an explicit non-empty chart id; "
                "use - `chart-id` or - id: chart-id."
            )
        end = headers[index + 1].start() if index + 1 < len(headers) else len(charts_block)
        block = charts_block[header.end() : end]
        annotation_block = _extract_chart_subblock(block, "annotationList")
        charts.append(
            {
                "id": chart_id,
                "data_ref": _match_chart_field(block, "dataRef"),
                "role": _match_chart_field(block, "role"),
                "purpose": _match_chart_text_field(block, "purpose"),
                "renderer": normalize_chart_renderer(_match_chart_field(block, "renderer")),
                "chart_type": _match(block, r"^\s{4}(?:- )?(?:chartType|type): (.+)$"),
                "dimensions": _parse_encodings(block, "dimensions"),
                "measures": _parse_encodings(block, "measures"),
                "label_mode": _normalize_label_mode(_match_chart_field(block, "labelMode")),
                "highlight_desc": _match_chart_text_field(block, "highlightDesc"),
                "axis_titles": _parse_axis_titles(block),
                "annotation_list": _parse_annotation_block(annotation_block),
                "visual_info": [
                    _clean_text(item)
                    for item in re.findall(
                        r"^\s{6}- (.+)$",
                        _extract_chart_subblock(block, "visualInfo"),
                        flags=re.MULTILINE,
                    )
                ],
            }
        )
    return charts


def _parse_steps(block: str) -> list[dict[str, Any] | str]:
    steps_block = _extract_field_block(block, "Steps")
    if not steps_block.strip():
        return []

    structured = re.findall(
        r"^\s{2}- Step \d+:\s*\n(.*?)(?=^\s{2}- Step \d+:|\Z)",
        steps_block,
        flags=re.MULTILINE | re.DOTALL,
    )
    if not structured:
        structured = re.findall(
            r"^\s{2}- step: [^\n]+\n(.*?)(?=^\s{2}- step: |\Z)",
            steps_block,
            flags=re.MULTILINE | re.DOTALL,
        )
    if structured:
        parsed: list[dict[str, Any] | str] = []
        for step_body in structured:
            ann_block = _extract_step_subblock(step_body, "annotationList")
            parsed.append(
                {
                    "title": _match(step_body, r"^\s+(?:- )?title: (.+)$"),
                    "narrative": _match(step_body, r"^\s+(?:- )?narrative: (.+)$"),
                    "data_ref": _match(step_body, r"^\s+(?:- )?dataRef: (.+)$"),
                    "highlight_desc": _match_text(step_body, r"^\s+(?:- )?highlightDesc: (.+)$"),
                    "annotation_list": _parse_annotation_block(ann_block),
                }
            )
        return parsed

    return [_clean(item) for item in re.findall(r"^\s+- (.+)$", steps_block, flags=re.MULTILINE)]


def parse_plan_for_specs(plan_text: str) -> dict[str, Any]:
    """Extract only the fields needed for spec generation from plan.md."""
    story_meta_block = _extract_section(plan_text, "Story Meta")
    style_preset = _match_inline_field(story_meta_block, "Style Preset")

    chapters_section = _extract_section(plan_text, "Chapter Outline")
    chapter_blocks = re.findall(
        r"^###\s+(.+?)\n(.*?)(?=^###\s+|\Z)",
        chapters_section,
        flags=re.MULTILINE | re.DOTALL,
    )
    chapters = []
    for _title, block in chapter_blocks:
        pattern = _match_inline_field(block, "Pattern")
        evidence_block = _extract_field_block(block, "Evidence")
        chapters.append(
            {
                "pattern": pattern,
                "evidence_refs": _parse_inline_refs(evidence_block, "refs"),
                "steps": _parse_steps(block),
                "charts": _parse_charts(_extract_field_block(block, "Charts")),
            }
        )

    return {"style_preset": style_preset, "chapters": chapters}


def build_chart_contract_index(plan_text: str) -> dict[str, dict[str, Any]]:
    parsed = parse_plan_for_specs(plan_text)
    contracts: dict[str, dict[str, Any]] = {}
    for chapter in parsed["chapters"]:
        for chart in chapter["charts"]:
            chart_id = chart["id"]
            contracts[chart_id] = {
                "chart_type": chart.get("chart_type", ""),
                "renderer": normalize_chart_renderer(chart.get("renderer")),
                "label_mode": chart.get("label_mode", ""),
                "dimensions": chart.get("dimensions", []),
                "measures": chart.get("measures", []),
                "axis_titles": chart.get("axis_titles", {}),
            }
    return contracts


# ---------------------------------------------------------------------------
# Spec reassembly
# ---------------------------------------------------------------------------

STEP_CHART_ID_PATTERN = re.compile(r"^(.+)__step(\d+)$")
NULL_LIKE_STRINGS = {"nan", "null", "none", "undefined"}
MINIMUM_CONTRACT_ENCODINGS = {
    "line": {"dimensions": {"xAxis"}, "measures": {"yAxis"}},
    "area": {"dimensions": {"xAxis"}, "measures": {"yAxis"}},
    "column": {"dimensions": {"xAxis"}, "measures": {"yAxis"}},
    "columnparallel": {"dimensions": {"xAxis"}, "measures": {"yAxis"}},
    "columnpercent": {"dimensions": {"xAxis"}, "measures": {"yAxis"}},
    "bar": {"dimensions": {"yAxis"}, "measures": {"xAxis"}},
    "barparallel": {"dimensions": {"yAxis"}, "measures": {"xAxis"}},
    "barpercent": {"dimensions": {"yAxis"}, "measures": {"xAxis"}},
    "pie": {"dimensions": {"color"}, "measures": {"angle"}},
    "donut": {"dimensions": {"color"}, "measures": {"angle"}},
    "scatter": {"dimensions": set(), "measures": {"xAxis", "yAxis"}},
    "radar": {"dimensions": {"angle"}, "measures": {"radius"}},
    "heatmap": {"dimensions": {"xAxis", "yAxis"}, "measures": {"color"}},
    "dualaxis": {"dimensions": {"xAxis"}, "measures": {"primaryYAxis", "secondaryYAxis"}},
}


def sanitize_dataset_scalar_for_vseed(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, float):
        if not math.isfinite(value):
            return None
        return value
    if isinstance(value, str) and value.strip().lower() in NULL_LIKE_STRINGS:
        return None
    return value


def sanitize_dataset_value_for_vseed(value: Any) -> Any:
    if isinstance(value, dict):
        cleaned: dict[str, Any] = {}
        for key, item in value.items():
            cleaned_item = sanitize_dataset_value_for_vseed(item)
            if cleaned_item is not None:
                cleaned[key] = cleaned_item
        return cleaned
    if isinstance(value, list):
        return [
            cleaned_item
            for item in value
            if (cleaned_item := sanitize_dataset_value_for_vseed(item)) is not None
        ]
    return sanitize_dataset_scalar_for_vseed(value)


def sanitize_dataset_map_for_vseed(dataset_map: dict[str, Any]) -> dict[str, Any]:
    return {
        dataset_ref: cleaned_value
        for dataset_ref, dataset in dataset_map.items()
        if (cleaned_value := sanitize_dataset_value_for_vseed(dataset)) is not None
    }


def base_chart_id(chart_id: str) -> str:
    match = STEP_CHART_ID_PATTERN.match(chart_id)
    return match.group(1) if match else chart_id


def _contract_entries_with_encoding(entries: Any) -> list[dict[str, str]]:
    if not isinstance(entries, list):
        return []
    normalized: list[dict[str, str]] = []
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        entry_id = entry.get("id")
        encoding = entry.get("encoding")
        if entry_id and encoding:
            normalized.append({"id": str(entry_id), "encoding": str(encoding)})
    return normalized


def contract_field_ids(chart_contract: dict[str, Any]) -> list[str]:
    field_ids: list[str] = []
    for entry in [
        *_contract_entries_with_encoding(chart_contract.get("dimensions")),
        *_contract_entries_with_encoding(chart_contract.get("measures")),
    ]:
        field_id = entry["id"]
        if field_id not in field_ids:
            field_ids.append(field_id)
    return field_ids


def contract_dimension_ids(chart_contract: dict[str, Any]) -> list[str]:
    dimension_ids: list[str] = []
    for entry in _contract_entries_with_encoding(chart_contract.get("dimensions")):
        field_id = entry["id"]
        if field_id not in dimension_ids:
            dimension_ids.append(field_id)
    return dimension_ids


def contract_measure_ids(chart_contract: dict[str, Any]) -> list[str]:
    measure_ids: list[str] = []
    for entry in _contract_entries_with_encoding(chart_contract.get("measures")):
        field_id = entry["id"]
        if field_id not in measure_ids:
            measure_ids.append(field_id)
    return measure_ids


def validate_dataset_supports_contract(
    chart_id: str,
    dataset_ref: str,
    dataset: Any,
    chart_contract: dict[str, Any],
) -> None:
    required_fields = contract_field_ids(chart_contract)
    if not required_fields:
        return
    if not isinstance(dataset, list):
        raise ValueError(
            f"Chart '{chart_id}' expects dataset '{dataset_ref}' to be a list of records."
        )

    available_fields: set[str] = set()
    for row in dataset:
        if isinstance(row, dict):
            available_fields.update(str(key) for key in row.keys())

    missing_fields = [field_id for field_id in required_fields if field_id not in available_fields]
    if missing_fields:
        raise ValueError(
            f"Chart '{chart_id}' references fields not present in dataset '{dataset_ref}': "
            + ", ".join(missing_fields)
        )

    validate_dataset_mark_grain(
        chart_id=chart_id,
        dataset_ref=dataset_ref,
        dataset=dataset,
        dimension_ids=contract_dimension_ids(chart_contract),
        measure_ids=contract_measure_ids(chart_contract),
    )


def validate_dataset_mark_grain(
    *,
    chart_id: str,
    dataset_ref: str,
    dataset: list[Any],
    dimension_ids: list[str],
    measure_ids: list[str],
) -> None:
    if not dimension_ids or not measure_ids:
        return

    for measure_id in measure_ids:
        seen: dict[tuple[Any, ...], int] = {}
        for row_index, row in enumerate(dataset):
            if not isinstance(row, dict) or measure_id not in row:
                continue
            grain = tuple(row.get(dimension_id) for dimension_id in dimension_ids)
            first_seen_index = seen.get(grain)
            if first_seen_index is not None:
                grain_label = ", ".join(dimension_ids)
                raise ValueError(
                    f"Chart '{chart_id}' dataset '{dataset_ref}' is not chart-ready: "
                    f"dimension grain {grain_label} repeats for measure {measure_id}. "
                    "Regenerate the data for this chart so each declared dimension grain has one row per measure. "
                    f"Prefer rewriting dataset_map['{dataset_ref}'] with aggregated rows at the declared chart grain; "
                    "if you create a new aggregated DataFrame instead, update Charts.dataRef to that new DataFrame "
                    "and rerun assemble_story_specs.py. Do not hand-write spec_map.json."
                )
            seen[grain] = row_index


def validate_chart_dataset_contracts(
    requests: list[dict[str, Any]],
    dataset_map: dict[str, Any],
    chart_contracts: dict[str, dict[str, Any]],
) -> None:
    for item in requests:
        chart_id = item.get("chartId")
        dataset_ref = item.get("datasetRef")
        if not chart_id or not dataset_ref:
            continue
        validate_dataset_supports_contract(
            chart_id=chart_id,
            dataset_ref=dataset_ref,
            dataset=dataset_map.get(dataset_ref),
            chart_contract=chart_contracts.get(base_chart_id(chart_id), {}),
        )


def has_supported_chart_bindings(chart_contract: dict[str, Any]) -> bool:
    chart_type = str(chart_contract.get("chart_type", "")).lower()
    dimension_entries = _contract_entries_with_encoding(chart_contract.get("dimensions"))
    measure_entries = _contract_entries_with_encoding(chart_contract.get("measures"))
    if chart_type == "funnel":
        return funnel_has_supported_chart_bindings(dimension_entries, measure_entries)

    requirements = MINIMUM_CONTRACT_ENCODINGS.get(chart_type)
    if not chart_type or requirements is None:
        return False

    dimension_encodings = {entry["encoding"] for entry in dimension_entries}
    measure_encodings = {entry["encoding"] for entry in measure_entries}
    return requirements["dimensions"].issubset(dimension_encodings) and requirements[
        "measures"
    ].issubset(measure_encodings)


def funnel_has_supported_chart_bindings(
    dimension_entries: list[dict[str, str]],
    measure_entries: list[dict[str, str]],
) -> bool:
    if len(dimension_entries) == 1 and dimension_entries[0]["encoding"] == "color":
        return len(measure_entries) == 1 and measure_entries[0]["encoding"] == "size"

    return (
        len(dimension_entries) == 0
        and len(measure_entries) >= 2
        and all(entry["encoding"] == "size" for entry in measure_entries)
    )


def reassemble_scrolly_entries(spec_map: dict[str, Any]) -> dict[str, Any]:
    step_groups: dict[str, dict[int, Any]] = {}
    passthrough: dict[str, Any] = {}

    for chart_id, entry in spec_map.items():
        m = STEP_CHART_ID_PATTERN.match(chart_id)
        if m:
            step_groups.setdefault(m.group(1), {})[int(m.group(2))] = entry.get("spec", entry)
        else:
            passthrough[chart_id] = entry

    result = dict(passthrough)
    for base_id, steps_dict in step_groups.items():
        ordered = [steps_dict[i] for i in sorted(steps_dict.keys())]
        result[base_id] = {**passthrough.get(base_id, {}), "steps": ordered}
    return result


def preset_name_to_theme_slug(preset_name: str) -> str:
    meta = PRESET_META.get(preset_name)
    if not meta:
        raise ValueError(f"Unsupported preset: {preset_name}")
    return Path(meta.get("filename", "")).stem


def attach_theme(spec_map: dict[str, Any], preset_name: str) -> dict[str, Any]:
    slug = preset_name_to_theme_slug(preset_name)
    return {cid: {**entry, "theme": slug} for cid, entry in spec_map.items()}


DENSE_LABEL_THRESHOLD = 20
POINT_STYLE_SYNC_CHART_TYPES = {"line", "area"}
POINT_AUTO_HIDE_CHART_TYPES = POINT_STYLE_SYNC_CHART_TYPES | {"dualaxis"}
BAR_LIKE_CHART_TYPES = {"bar", "barparallel", "barpercent"}
LABEL_DENSITY_CHART_TYPES = POINT_AUTO_HIDE_CHART_TYPES | {
    "column",
    "columnparallel",
    "columnpercent",
    *BAR_LIKE_CHART_TYPES,
}


def extract_axis_field(spec: dict[str, Any], axis_encoding: str) -> str:
    for entry in spec.get("dimensions", []):
        if entry.get("encoding") == axis_encoding and entry.get("id"):
            return str(entry["id"])
    for entry in spec.get("measures", []):
        if entry.get("encoding") == axis_encoding and entry.get("id"):
            return str(entry["id"])
    return ""


def count_unique_axis_values(spec: dict[str, Any], axis_encoding: str) -> int:
    axis_field = extract_axis_field(spec, axis_encoding)
    dataset = spec.get("dataset")
    if not axis_field or not isinstance(dataset, list):
        return 0
    return len(
        {
            repr(row.get(axis_field))
            for row in dataset
            if isinstance(row, dict) and axis_field in row
        }
    )


def count_category_values_for_density(spec: dict[str, Any], chart_type: str) -> int:
    axis_encoding = "yAxis" if chart_type in BAR_LIKE_CHART_TYPES else "xAxis"
    return count_unique_axis_values(spec, axis_encoding)


def collect_point_opacity_rules_from_line_style(spec: dict[str, Any]) -> list[dict[str, Any]]:
    """Mirror line opacity emphasis into point rules so line/point highlighting stays visually aligned."""
    line_style = spec.get("lineStyle")
    style_rules = line_style if isinstance(line_style, list) else [line_style]
    mirrored_rules: list[dict[str, Any]] = []

    for style in style_rules:
        if not isinstance(style, dict) or "lineColorOpacity" not in style:
            continue
        point_rule = {"pointColorOpacity": style["lineColorOpacity"]}
        if "selector" in style:
            point_rule["selector"] = style["selector"]
        mirrored_rules.append(point_rule)

    return mirrored_rules


def prepend_point_style_rules(spec: dict[str, Any], default_rules: list[dict[str, Any]]) -> None:
    """Prepend normalization defaults while preserving explicit pointStyle rules."""
    if not default_rules:
        return

    point_style = spec.get("pointStyle")
    if isinstance(point_style, list):
        spec["pointStyle"] = [*default_rules, *point_style]
    elif isinstance(point_style, dict):
        spec["pointStyle"] = [*default_rules, point_style]
    else:
        spec["pointStyle"] = default_rules if len(default_rules) > 1 else default_rules[0]


def point_style_disables_points(point_style: Any) -> bool:
    style_rules = point_style if isinstance(point_style, list) else [point_style]
    return any(
        isinstance(style, dict)
        and (style.get("pointVisible") is False or style.get("visible") is False)
        for style in style_rules
    )


def force_point_visibility_off(spec: dict[str, Any]) -> None:
    point_style = spec.get("pointStyle")
    if isinstance(point_style, dict):
        spec["pointStyle"] = {**point_style, "pointVisible": False}
    elif isinstance(point_style, list):
        spec["pointStyle"] = [
            {**style, "pointVisible": False} if isinstance(style, dict) else {"pointVisible": False}
            for style in point_style
        ]
    else:
        spec["pointStyle"] = {"pointVisible": False}


def sync_scrolly_step_point_visibility(steps: list[Any]) -> None:
    """Keep point visibility stable across scrolly step spec transitions."""
    if not any(
        isinstance(step, dict) and point_style_disables_points(step.get("pointStyle"))
        for step in steps
    ):
        return

    for step in steps:
        if not isinstance(step, dict):
            continue
        chart_type = str(step.get("chartType", "")).lower()
        if chart_type in POINT_AUTO_HIDE_CHART_TYPES or "pointStyle" in step:
            force_point_visibility_off(step)


def sync_bar_opacity_fields(spec: dict[str, Any]) -> None:
    """Keep bar fill/border opacity aligned when VSeed returns only one side of the opacity pair."""
    bar_style = spec.get("barStyle")
    style_rules = bar_style if isinstance(bar_style, list) else [bar_style]
    synced_rules: list[dict[str, Any] | Any] = []
    changed = False

    for style in style_rules:
        if not isinstance(style, dict):
            synced_rules.append(style)
            continue

        synced_style = dict(style)
        if "barColorOpacity" in synced_style and "barBorderOpacity" not in synced_style:
            synced_style["barBorderOpacity"] = synced_style["barColorOpacity"]
            changed = True
        elif "barBorderOpacity" in synced_style and "barColorOpacity" not in synced_style:
            synced_style["barColorOpacity"] = synced_style["barBorderOpacity"]
            changed = True
        synced_rules.append(synced_style)

    if not changed:
        return

    if isinstance(bar_style, list):
        spec["barStyle"] = synced_rules
    else:
        spec["barStyle"] = synced_rules[0] if synced_rules else bar_style


def remove_redundant_percent_numformat_suffixes(value: Any) -> None:
    """Drop suffix='%' from percent numFormat objects; percent formatting already owns the percent sign."""
    if isinstance(value, dict):
        if (
            str(value.get("type", "")).strip().lower() == "percent"
            and str(value.get("suffix", "")).strip() == "%"
        ):
            value.pop("suffix", None)
        for child in value.values():
            remove_redundant_percent_numformat_suffixes(child)
    elif isinstance(value, list):
        for child in value:
            remove_redundant_percent_numformat_suffixes(child)


def remove_duplicate_label_measures(spec: dict[str, Any]) -> None:
    """Drop VSeed-added label channel measures when the base measure already exists in the chart."""
    measures = spec.get("measures")
    if not isinstance(measures, list):
        return

    base_measure_ids = {
        entry.get("id")
        for entry in measures
        if isinstance(entry, dict) and entry.get("id") and entry.get("encoding") != "label"
    }
    if not base_measure_ids:
        return

    spec["measures"] = [
        entry
        for entry in measures
        if not (
            isinstance(entry, dict)
            and entry.get("id") in base_measure_ids
            and entry.get("encoding") == "label"
        )
    ]


def remove_axis_grid_specs(spec: dict[str, Any]) -> None:
    """Drop VSeed axis grid styling so story charts keep the deck's editorial tone."""
    for axis_key in ("xAxis", "yAxis"):
        axis_config = spec.get(axis_key)
        if isinstance(axis_config, dict):
            axis_config.pop("grid", None)
        elif isinstance(axis_config, list):
            for axis_entry in axis_config:
                if isinstance(axis_entry, dict):
                    axis_entry.pop("grid", None)


LEGEND_AUTO_HIDE_CHART_TYPES = {
    "line",
    "bar",
    "column",
    "barparallel",
    "columnparallel",
    "barpercent",
    "columnpercent",
}


def should_hide_default_legend(spec: dict[str, Any]) -> bool:
    """Hide the default legend when current VSeed semantics would not create meaningful legend items."""
    chart_type = str(spec.get("chartType", "")).lower()
    if chart_type not in LEGEND_AUTO_HIDE_CHART_TYPES:
        return False

    dimensions = spec.get("dimensions")
    if isinstance(dimensions, list):
        has_color_encoding = any(
            isinstance(entry, dict) and entry.get("encoding") == "color" for entry in dimensions
        )
        if has_color_encoding:
            return False

    measures = spec.get("measures")
    if not isinstance(measures, list):
        return False

    non_label_measure_count = sum(
        1
        for entry in measures
        if isinstance(entry, dict) and entry.get("id") and entry.get("encoding") != "label"
    )
    return non_label_measure_count == 1


def apply_default_legend_visibility(spec: dict[str, Any]) -> None:
    """Hide the legend only when VSeed would otherwise create a redundant single-series legend."""
    if not should_hide_default_legend(spec):
        return

    legend = spec.get("legend")
    if isinstance(legend, dict) and "enable" in legend:
        return

    spec["legend"] = {**legend, "enable": False} if isinstance(legend, dict) else {"enable": False}


def apply_density_defaults_to_single_spec(spec: dict[str, Any], label_mode: str) -> dict[str, Any]:
    chart_type = str(spec.get("chartType", "")).lower()
    # Normalize shared display defaults before renderer hints are derived.
    remove_axis_grid_specs(spec)
    remove_redundant_percent_numformat_suffixes(spec)
    remove_duplicate_label_measures(spec)
    apply_default_legend_visibility(spec)
    sync_bar_opacity_fields(spec)
    # For line/area charts, keep point emphasis in sync with any returned line opacity styling first.
    if chart_type in POINT_STYLE_SYNC_CHART_TYPES:
        prepend_point_style_rules(spec, collect_point_opacity_rules_from_line_style(spec))

    category_count = count_category_values_for_density(spec, chart_type)

    if chart_type in POINT_AUTO_HIDE_CHART_TYPES and category_count > DENSE_LABEL_THRESHOLD:
        force_point_visibility_off(spec)

    if chart_type not in LABEL_DENSITY_CHART_TYPES or category_count <= DENSE_LABEL_THRESHOLD:
        return spec

    if label_mode:
        return spec

    label = spec.get("label")
    spec["label"] = {**label, "enable": False} if isinstance(label, dict) else {"enable": False}
    return spec


def inject_local_owned_metadata(
    spec: dict[str, Any], chart_contract: dict[str, Any]
) -> dict[str, Any]:
    contract_dimensions = (
        chart_contract.get("dimensions") if isinstance(chart_contract, dict) else []
    )
    if isinstance(contract_dimensions, list) and contract_dimensions:
        dimension_aliases = {
            entry.get("id"): entry.get("alias")
            for entry in contract_dimensions
            if isinstance(entry, dict) and entry.get("id") and entry.get("alias")
        }
        if dimension_aliases:
            for entry in spec.get("dimensions", []):
                if isinstance(entry, dict) and entry.get("id") in dimension_aliases:
                    entry["alias"] = dimension_aliases[entry["id"]]

    contract_measures = chart_contract.get("measures") if isinstance(chart_contract, dict) else []
    if isinstance(contract_measures, list) and contract_measures:
        measure_aliases = {
            entry.get("id"): entry.get("alias")
            for entry in contract_measures
            if isinstance(entry, dict) and entry.get("id") and entry.get("alias")
        }
        if measure_aliases:
            for entry in spec.get("measures", []):
                if isinstance(entry, dict) and entry.get("id") in measure_aliases:
                    entry["alias"] = measure_aliases[entry["id"]]

    chart_type = str(spec.get("chartType", "")).lower()
    axis_titles = chart_contract.get("axis_titles") if isinstance(chart_contract, dict) else {}
    if chart_type == "dualaxis" and isinstance(axis_titles, dict) and axis_titles:
        spec["primaryYAxis"] = {
            **spec.get("primaryYAxis", {}),
            "title": {"visible": True, "titleText": axis_titles.get("primaryYAxis", "")},
        }
        spec["secondaryYAxis"] = {
            **spec.get("secondaryYAxis", {}),
            "title": {
                "visible": True,
                "titleText": axis_titles.get("secondaryYAxis", ""),
            },
        }
    return spec


def apply_density_defaults_to_spec_map(
    spec_map: dict[str, Any],
    chart_contracts: dict[str, dict[str, Any]],
) -> dict[str, Any]:
    for chart_id, entry in spec_map.items():
        chart_contract = chart_contracts.get(chart_id, {})
        label_mode = (
            chart_contract.get("label_mode", "") if isinstance(chart_contract, dict) else ""
        )
        if isinstance(entry, dict) and isinstance(entry.get("steps"), list):
            entry["steps"] = [
                apply_density_defaults_to_single_spec(
                    inject_local_owned_metadata(step, chart_contract)
                    if isinstance(step, dict)
                    else step,
                    label_mode,
                )
                if isinstance(step, dict)
                else step
                for step in entry["steps"]
            ]
            sync_scrolly_step_point_visibility(entry["steps"])
            continue

        target = (
            entry.get("spec")
            if isinstance(entry, dict) and isinstance(entry.get("spec"), dict)
            else entry
        )
        if isinstance(target, dict):
            inject_local_owned_metadata(target, chart_contract)
            apply_density_defaults_to_single_spec(target, label_mode)
    return spec_map


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def extract_local_chart_requests(plan_text: str) -> list[dict[str, Any]]:
    from validate_story_plan import collect_plan_structure_errors

    errors = collect_plan_structure_errors(plan_text)
    if errors:
        raise ValueError(format_plan_structural_errors(errors))
    parsed = parse_plan_for_specs(plan_text)
    requests: list[dict[str, Any]] = []
    for chapter in parsed["chapters"]:
        for chart in chapter["charts"]:
            chart_id = chart["id"]
            if chart["renderer"] != STANDARD_CHART_RENDERER:
                raise ValueError(
                    f"Chart '{chart_id}': local generation supports standard-chart only."
                )
            if not chart["data_ref"] or not has_supported_chart_bindings(chart):
                raise ValueError(
                    f"Chart '{chart_id}': provide dataRef, chartType, dimensions, and measures from chart-contract.md."
                )
            steps = chapter["steps"] if chapter["pattern"] == "scrollytelling" else [None]
            for index, step in enumerate(steps):
                state = step if isinstance(step, dict) else chart
                requests.append(
                    {
                        "chartId": f"{chart_id}__step{index}" if step is not None else chart_id,
                        "datasetRef": state.get("data_ref") or chart["data_ref"],
                        "contract": chart,
                        "annotations": state.get("annotation_list") or [],
                        "highlight": state.get("highlight_desc") or "",
                    }
                )
    if not requests and re.search(
        r"^- (?:\*\*)?Charts(?:\*\*)?:\s*\n\s+\S", plan_text, re.MULTILINE
    ):
        raise ValueError(
            "Plan declares Charts but contains no parseable chart entries. Use the canonical chart contract."
        )
    return requests


def assemble_story_specs(
    plan_text: str, dataset_map: dict[str, Any], chart_specs: dict[str, Any]
) -> dict[str, Any]:
    requests = extract_local_chart_requests(plan_text)
    contracts = build_chart_contract_index(plan_text)
    cleaned_data = sanitize_dataset_map_for_vseed(dataset_map)
    validate_chart_dataset_contracts(requests, cleaned_data, contracts)
    result = assemble_local_specs(requests, cleaned_data, chart_specs)
    for entry in result.values():
        apply_difference_line_region_padding(entry["spec"])
    result = reassemble_scrolly_entries(result)
    result = apply_density_defaults_to_spec_map(result, contracts)
    result = attach_annotation_point_runtime_hints_to_spec_map(result)
    return attach_theme(result, parse_plan_for_specs(plan_text)["style_preset"])


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Locally assemble Agent-authored VSeed configurations from plan.md."
    )
    p.add_argument("--plan-file", required=True, help="Path to plan.md.")
    p.add_argument("--dataset-json", required=True, help="Path to dataset_map JSON file.")
    p.add_argument(
        "--specs-json",
        help="Agent-authored chart_specs.json; required when the plan contains charts.",
    )
    p.add_argument("--output", required=True, help="Output path for spec_map.json.")
    p.add_argument("--requests-output", help="Optional chart id / dataset reference manifest.")
    return p.parse_args()


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main() -> int:
    args = parse_args()
    plan_text = Path(args.plan_file).read_text(encoding="utf-8")
    dataset_map = json.loads(Path(args.dataset_json).read_text(encoding="utf-8"))

    parsed = parse_plan_for_specs(plan_text)
    preset_name = parsed["style_preset"]
    if not preset_name:
        raise ValueError("plan.md is missing Style Preset.")

    requests = extract_local_chart_requests(plan_text)
    if requests and not args.specs_json:
        raise ValueError(
            "Charts require --specs-json. Read references/vseed-generation.md and author chart_specs.json locally; then rerun assembly."
        )
    chart_specs = (
        json.loads(Path(args.specs_json).read_text(encoding="utf-8")) if args.specs_json else {}
    )
    spec_map = assemble_story_specs(plan_text, dataset_map, chart_specs)
    if args.requests_output:
        write_json(
            Path(args.requests_output),
            [
                {"chartId": request["chartId"], "datasetRef": request["datasetRef"]}
                for request in requests
            ],
        )

    write_json(Path(args.output), spec_map)
    print(f"OK {Path(args.output).resolve()} charts={len(spec_map)} configs={len(requests)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
