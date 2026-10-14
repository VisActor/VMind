"""Assemble Agent-authored VSeed configurations with Plan-owned data."""

from __future__ import annotations

import logging
import math
from copy import deepcopy
from typing import Any, Mapping

ANNOTATION_KEYS = {
    "point": ("annotationPoint",),
    "line": ("annotationHorizontalLine", "annotationVerticalLine"),
    "area": ("annotationArea",),
    "difference": ("annotationDifferenceLine",),
}
_LOGGER = logging.getLogger(__name__)


def field_bindings(entries: Any) -> list[tuple[str, str]]:
    if not isinstance(entries, list) or any(
        not isinstance(entry, dict) or not entry.get("id") or not entry.get("encoding")
        for entry in entries
    ):
        raise ValueError("dimensions / measures must be arrays of id / encoding objects.")
    return [(entry["id"], entry["encoding"]) for entry in entries]


def reject_dynamic_filters(value: Any) -> None:
    if isinstance(value, dict):
        if "dynamicFilter" in value or "valueDynamicFilter" in value:
            raise ValueError(
                "Resolve annotation/highlight targets from prepared data; dynamic filters are outside this module."
            )
        for child in value.values():
            reject_dynamic_filters(child)
    elif isinstance(value, list):
        for child in value:
            reject_dynamic_filters(child)


def synchronize_number_formats(spec: dict[str, Any]) -> None:
    """Keep explicit measure formats effective and inherit uniform axis formats."""
    for measure in spec["measures"]:
        if isinstance(measure.get("numFormat"), dict):
            if measure.get("autoFormat") is True:
                raise ValueError(
                    f"Measure {measure['id']}: autoFormat=true overrides the requested numFormat."
                )
            measure["autoFormat"] = False
    axes = (
        ("primaryYAxis", "secondaryYAxis")
        if spec["chartType"] == "dualAxis"
        else ("xAxis", "yAxis")
    )
    for axis in axes:
        # Percent stacks plot normalized coordinates regardless of input units.
        # A raw measure formatter is valid for tooltips, not for the 0..1 axis.
        percent_axis = {"columnPercent": "yAxis", "barPercent": "xAxis"}.get(spec["chartType"])
        if axis == percent_axis:
            config = spec.get(axis, {})
            fmt = config.get("numFormat") if isinstance(config, dict) else None
            if isinstance(fmt, dict) and (fmt.get("type") != "percent" or fmt.get("ratio", 1) != 1):
                raise ValueError(
                    f"{axis}: {spec['chartType']} uses normalized 0..1 coordinates. "
                    "Omit the axis format or use numFormat.type=percent without scaling; "
                    "number + suffix=% would display 1% instead of 100%."
                )
            continue
        measures = [measure for measure in spec["measures"] if measure["encoding"] == axis]
        formats = [measure.get("numFormat") for measure in measures]
        # Display formats suggest a scale mismatch, but cannot prove units.
        # Keep semantic review advisory instead of blocking valid ratio data.
        format_conventions = set()
        for fmt in formats:
            if not isinstance(fmt, dict):
                continue
            if fmt.get("type") == "percent":
                format_conventions.add("fraction")
            elif fmt.get("type") == "number":
                format_conventions.add(
                    "percentage-points" if fmt.get("suffix") == "%" else "number"
                )
        if len(format_conventions) > 1:
            _LOGGER.warning(
                "WARNING SHARED_AXIS_FORMAT_MISMATCH axis=%s measures=%s: "
                "Display conventions differ on one numeric axis; formats alone cannot establish units. "
                "Check Plan/data comparability; use independent axes or documented conversions if needed. "
                "Keep valid mappings when the difference is intentional.",
                axis,
                ",".join(measure["id"] for measure in measures),
            )
        if (
            not formats
            or not isinstance(formats[0], dict)
            or any(item != formats[0] for item in formats)
        ):
            continue
        config = spec.get(axis, {})
        if isinstance(config, dict) and "numFormat" not in config and "autoFormat" not in config:
            spec[axis] = {**config, "autoFormat": False, "numFormat": deepcopy(formats[0])}


def validate_annotations(
    spec: dict[str, Any], requested: list[dict[str, Any]], *, chart_id: str
) -> None:
    """Reject malformed annotations, but report incomplete Plan coverage as warnings."""
    for keys in ANNOTATION_KEYS.values():
        for key in keys:
            value = spec.get(key)
            if value is not None and not (
                isinstance(value, dict)
                or isinstance(value, list)
                and all(isinstance(item, dict) for item in value)
            ):
                raise ValueError(f"{key} must be an object or an array of objects.")
    items = spec.get("annotationDifferenceLine", [])
    for item in items if isinstance(items, list) else [items]:
        if not isinstance(item, dict) or any(
            not isinstance(item.get(anchor), dict) or not item[anchor].get("selector")
            for anchor in ("start", "end")
        ):
            raise ValueError("Difference annotations require start.selector and end.selector.")
        if "text" in item or "label" in item:
            raise ValueError(
                "Difference annotation labels are computed by VSeed; do not supply text or label."
            )

    for annotation_type, keys in ANNOTATION_KEYS.items():
        expected = sum(item.get("type") == annotation_type for item in requested)
        actual = sum(
            len(spec[key])
            if isinstance(spec.get(key), list)
            else int(isinstance(spec.get(key), dict))
            for key in keys
        )
        if actual < expected:
            _LOGGER.warning(
                "WARNING ANNOTATION_MISSING chart=%s type=%s expected=%d actual=%d: "
                "Non-blocking: assembly success does not satisfy this Plan annotation. "
                "See this skill's references/vseed-generation.md; prefer repairing supported, "
                "unambiguous omissions in chart_specs.json and rerun assembly, keeping Plan/data unchanged. "
                "If repair is unsupported, ambiguous, disallowed, or fails validation, preserve valid "
                "output and report the unresolved annotation and specific reason.",
                chart_id,
                annotation_type,
                expected,
                actual,
                extra={
                    "code": "ANNOTATION_MISSING",
                    "chart_id": chart_id,
                    "annotation_type": annotation_type,
                    "expected": expected,
                    "actual": actual,
                },
            )


def assemble_local_specs(
    requests: list[dict[str, Any]],
    dataset_map: dict[str, Any],
    chart_specs: dict[str, Any],
) -> dict[str, Any]:
    """Return flat spec entries; the caller owns Plan/data grain checks and packaging."""
    if not isinstance(chart_specs, dict):
        raise ValueError(
            "chart_specs.json must be an object keyed by chart id (or chartId__step0, ...)."
        )
    expected_ids = {request["chartId"] for request in requests}
    missing = sorted(expected_ids - chart_specs.keys())
    unexpected = sorted(chart_specs.keys() - expected_ids)
    if missing or unexpected:
        raise ValueError(
            f"Chart configuration coverage mismatch: missing={missing}, unexpected={unexpected}. Update chart_specs.json from the current plan."
        )

    result: dict[str, Any] = {}
    for request in requests:
        chart_id = request["chartId"]
        contract = request["contract"]
        try:
            spec = deepcopy(chart_specs[chart_id])
            if not isinstance(spec, dict):
                raise ValueError("Expected a VSeed configuration object.")
            if any(key in spec for key in ("dataset", "spec", "steps", "theme", "renderer")):
                raise ValueError(
                    "Supply a VSeed configuration without dataset, theme, or spec_map wrappers; assembly owns them."
                )
            if spec.get("chartType") != contract["chart_type"]:
                raise ValueError(f"chartType must remain {contract['chart_type']} from the plan.")
            for key in ("dimensions", "measures"):
                planned = field_bindings(contract[key])
                if field_bindings(spec.get(key)) != planned:
                    raise ValueError(
                        f"{key} must preserve planned field ids, encodings, and order: {planned}."
                    )
            dataset = dataset_map[request["datasetRef"]]
            if not isinstance(dataset, list) or not dataset:
                raise ValueError("The chart-ready dataset must be a non-empty array.")
            reject_dynamic_filters(spec)
            validate_annotations(spec, request["annotations"], chart_id=chart_id)
            if request.get("highlight") and not (
                any(spec.get(key) for key in ("barStyle", "lineStyle", "areaStyle", "pointStyle"))
                or isinstance(spec.get("color"), dict)
                and spec["color"].get("colorMapping")
            ):
                raise ValueError(
                    "Missing planned highlight: supply conditional mark styles or a colorMapping."
                )
            for measure in contract["measures"]:
                if measure.get("numformat") and not any(
                    item["id"] == measure["id"] and isinstance(item.get("numFormat"), dict)
                    for item in spec["measures"]
                ):
                    raise ValueError(f"Missing requested numFormat for {measure['id']}.")
            if contract.get("label_mode"):
                spec["label"] = {**spec.get("label", {}), "enable": contract["label_mode"] == "on"}
            synchronize_number_formats(spec)
            spec["dataset"] = deepcopy(dataset)
            result[chart_id] = {"spec": spec}
        except (ValueError, KeyError, TypeError) as exc:
            raise ValueError(f"Chart '{chart_id}': {exc}") from exc
    return result


DIFFERENCE_LINE_REGION_PADDING_RULES = {
    "column": {
        "encoding": "yAxis",
        "nonnegative_key": "top",
        "negative_key": "bottom",
        "padding": 28,
    },
    "columnparallel": {
        "encoding": "yAxis",
        "nonnegative_key": "top",
        "negative_key": "bottom",
        "padding": 28,
    },
    "bar": {"encoding": "xAxis", "nonnegative_key": "right", "negative_key": "left", "padding": 42},
    "barparallel": {
        "encoding": "xAxis",
        "nonnegative_key": "right",
        "negative_key": "left",
        "padding": 42,
    },
    "line": {"padding_key": "right", "padding": 28},
    "area": {"padding_key": "right", "padding": 28},
}


def _coerce_numeric_value(value: Any) -> float | None:
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        numeric_value = float(value)
        return numeric_value if math.isfinite(numeric_value) else None
    if isinstance(value, str):
        stripped = value.strip()
        if not stripped:
            return None
        try:
            numeric_value = float(stripped)
        except ValueError:
            return None
        return numeric_value if math.isfinite(numeric_value) else None
    return None


def _measure_field_ids(spec: Mapping[str, Any], encoding: str) -> list[str]:
    field_ids: list[str] = []
    entries = spec.get("measures", [])
    if not isinstance(entries, list):
        return field_ids
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        field_id = entry.get("id")
        if entry.get("encoding") == encoding and isinstance(field_id, str):
            field_ids.append(field_id)
    return field_ids


def _has_difference_line_annotation(spec: Mapping[str, Any]) -> bool:
    difference_line = spec.get("annotationDifferenceLine")
    return isinstance(difference_line, dict) or (
        isinstance(difference_line, list)
        and any(isinstance(item, dict) for item in difference_line)
    )


def _dataset_measure_values(spec: Mapping[str, Any], encoding: str) -> list[float]:
    dataset = spec.get("dataset")
    if not isinstance(dataset, list):
        return []

    field_ids = _measure_field_ids(spec, encoding)
    if not field_ids:
        return []

    values: list[float] = []
    for row in dataset:
        if not isinstance(row, dict):
            continue
        for field_id in field_ids:
            if field_id not in row:
                continue
            numeric_value = _coerce_numeric_value(row[field_id])
            if numeric_value is not None:
                values.append(numeric_value)
    return values


def apply_difference_line_region_padding(spec: dict[str, Any]) -> dict[str, Any]:
    chart_type = str(spec.get("chartType", "")).lower()
    rule = DIFFERENCE_LINE_REGION_PADDING_RULES.get(chart_type)
    if rule is None:
        return spec

    if not _has_difference_line_annotation(spec):
        return spec

    if "padding_key" in rule:
        padding_key = str(rule["padding_key"])
    else:
        values = _dataset_measure_values(spec, str(rule["encoding"]))
        if not values:
            return spec

        if all(value >= 0 for value in values):
            padding_key = str(rule["nonnegative_key"])
        elif all(value < 0 for value in values):
            padding_key = str(rule["negative_key"])
        else:
            return spec

    existing_padding = spec.get("regionPadding")
    region_padding = existing_padding.copy() if isinstance(existing_padding, dict) else {}
    region_padding[padding_key] = int(rule["padding"])
    spec["regionPadding"] = region_padding
    return spec
