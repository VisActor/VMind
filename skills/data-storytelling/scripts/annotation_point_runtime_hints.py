"""Attach render-only annotation point placement hints to spec_map entries.

The placement logic lives here, after VSeed has returned DSL and before we
serialize spec_map.json. That keeps the browser runtime focused on rendering
while still letting us derive directional heuristics from normalized chart data.
"""

from __future__ import annotations

import math
from typing import Any, Mapping

from spec_map_types import AnnotationPointRuntimeHintWithColorId, VSeedSpecMapEntry

LINE_AREA_CHART_TYPES = {"line", "area"}
DUAL_AXIS_CHART_TYPES = {"dualaxis"}
TREND_ANNOTATION_CHART_TYPES = LINE_AREA_CHART_TYPES | DUAL_AXIS_CHART_TYPES
COLUMN_ANNOTATION_CHART_TYPES = {"column", "columnparallel"}
BAR_ANNOTATION_CHART_TYPES = {"bar", "barparallel"}
SUPPORTED_CHART_TYPES = (
    TREND_ANNOTATION_CHART_TYPES | COLUMN_ANNOTATION_CHART_TYPES | BAR_ANNOTATION_CHART_TYPES
)
SERIES_GROUP_ENCODINGS = {"color", "detail", "row", "column"}
SPARSE_POINT_THRESHOLD = 8
DENSE_POINT_THRESHOLD = 20
TREND_SAMPLE_LIMIT = 2
TREND_WEIGHTS = (1.0, 0.5)
FLAT_TREND_EPSILON = 1e-9
DEFAULT_RUNTIME_HINT: AnnotationPointRuntimeHintWithColorId = {
    "horizontal": "left",
    "vertical": "up",
    "showStartSymbol": False,
    "density": "normal",
}


def attach_annotation_point_runtime_hints_to_spec_map(spec_map: dict[str, Any]) -> dict[str, Any]:
    """Add ordered runtime hints beside each chart entry without mutating the DSL shape."""

    for raw_entry in spec_map.values():
        if not isinstance(raw_entry, dict):
            continue
        if raw_entry.get("renderer") == "infographic":
            continue
        entry: VSeedSpecMapEntry = raw_entry

        steps = entry.get("steps")
        if isinstance(steps, list):
            step_hints = [
                build_annotation_point_runtime_hints(step) if isinstance(step, dict) else []
                for step in steps
            ]
            if any(step_hints):
                entry["stepAnnotationPointRuntimeHints"] = step_hints
            else:
                entry.pop("stepAnnotationPointRuntimeHints", None)
            continue

        spec = entry.get("spec")
        if isinstance(spec, dict):
            hints = build_annotation_point_runtime_hints(spec)
            if hints:
                entry["annotationPointRuntimeHints"] = hints
            else:
                entry.pop("annotationPointRuntimeHints", None)

    return spec_map


def build_annotation_point_runtime_hints(
    spec: Mapping[str, Any],
) -> list[AnnotationPointRuntimeHintWithColorId]:
    """Build render hints in annotationPoint order, matching the downstream markPoint order."""

    chart_type = str(spec.get("chartType", "")).lower()
    if not _supports_runtime_hints_for_chart(spec, chart_type):
        return []

    annotation_points = _normalize_annotation_points(spec.get("annotationPoint"))
    if not annotation_points:
        return []

    dataset = spec.get("dataset")
    if not isinstance(dataset, list) or not dataset:
        return [_default_runtime_hint(spec, 0) for _ in annotation_points]

    category_field = _extract_category_field(spec, chart_type)
    default_value_field = _extract_value_field(spec, chart_type)
    x_axis_field = _extract_axis_field(spec, "xAxis")
    y_axis_field = _extract_axis_field(spec, "yAxis")
    if not category_field or not default_value_field or not x_axis_field:
        return [_default_runtime_hint(spec, len(dataset)) for _ in annotation_points]

    series_group_fields = _extract_series_group_fields(spec)
    hints: list[AnnotationPointRuntimeHintWithColorId] = []
    default_hint = _default_runtime_hint(spec, len(dataset))

    for annotation_point in annotation_points:
        if not isinstance(annotation_point, Mapping):
            hints.append(dict(default_hint))
            continue

        target_filters = _extract_annotation_filters(
            annotation_point,
            category_field,
            x_axis_field,
            y_axis_field,
        )
        if not target_filters:
            hints.append(dict(default_hint))
            continue

        matched_row_indices = _matching_row_indices(dataset, target_filters)
        if len(matched_row_indices) != 1:
            hints.append(dict(default_hint))
            continue

        target_row_index = matched_row_indices[0]
        target_row = dataset[target_row_index]
        if not isinstance(target_row, Mapping):
            hints.append(dict(default_hint))
            continue

        value_field = _extract_value_field(spec, chart_type, annotation_point)
        if not value_field:
            hints.append(dict(default_hint))
            continue

        ordered_series_rows = _ordered_series_rows(
            dataset, target_row, series_group_fields, value_field
        )
        series_position = _series_position_for_row(ordered_series_rows, target_row_index)
        if series_position is None:
            hints.append(dict(default_hint))
            continue

        current_value = ordered_series_rows[series_position][2]
        if current_value is None:
            hints.append(dict(default_hint))
            continue

        horizontal, vertical = _resolve_annotation_directions(
            chart_type,
            ordered_series_rows,
            series_position,
            current_value,
        )
        density = _classify_density(len(ordered_series_rows))
        hint: AnnotationPointRuntimeHintWithColorId = {
            "horizontal": horizontal,
            "vertical": vertical,
            "showStartSymbol": default_hint["showStartSymbol"],
            "density": density,
        }
        color_id = _resolve_annotation_color_id(spec, chart_type, annotation_point, target_row)
        if color_id:
            hint["colorId"] = color_id
        hints.append(hint)

    return hints


def _normalize_annotation_points(value: Any) -> list[Mapping[str, Any]]:
    if isinstance(value, Mapping):
        return [value]
    if isinstance(value, list):
        return [item for item in value if isinstance(item, Mapping)]
    return []


def _extract_axis_field(spec: Mapping[str, Any], axis_encoding: str) -> str:
    return _extract_encoding_field(spec, axis_encoding)


def _extract_category_field(spec: Mapping[str, Any], chart_type: str) -> str:
    if chart_type in BAR_ANNOTATION_CHART_TYPES:
        return _extract_axis_field(spec, "yAxis")
    return _extract_axis_field(spec, "xAxis")


def _extract_value_field(
    spec: Mapping[str, Any],
    chart_type: str,
    annotation_point: Mapping[str, Any] | None = None,
) -> str:
    if chart_type in BAR_ANNOTATION_CHART_TYPES:
        return _extract_axis_field(spec, "xAxis")
    if chart_type in DUAL_AXIS_CHART_TYPES:
        measure_id = _extract_annotation_measure_id(annotation_point or {})
        if measure_id is not None:
            candidate = str(measure_id)
            for entry in spec.get("measures", []):
                if not isinstance(entry, Mapping):
                    continue
                if entry.get("id") == candidate and entry.get("encoding") in {
                    "primaryYAxis",
                    "secondaryYAxis",
                }:
                    return candidate
        return _extract_axis_field(spec, "primaryYAxis") or _extract_axis_field(
            spec, "secondaryYAxis"
        )
    return _extract_axis_field(spec, "yAxis")


def _extract_encoding_field(spec: Mapping[str, Any], encoding: str) -> str:
    for entry in spec.get("dimensions", []):
        if isinstance(entry, Mapping) and entry.get("encoding") == encoding and entry.get("id"):
            return str(entry["id"])
    for entry in spec.get("measures", []):
        if isinstance(entry, Mapping) and entry.get("encoding") == encoding and entry.get("id"):
            return str(entry["id"])
    return ""


def _extract_series_group_fields(spec: Mapping[str, Any]) -> list[str]:
    fields: list[str] = []
    for entry in spec.get("dimensions", []):
        if not isinstance(entry, Mapping):
            continue
        if entry.get("encoding") in SERIES_GROUP_ENCODINGS and entry.get("id"):
            fields.append(str(entry["id"]))
    return fields


def _supports_runtime_hints_for_chart(spec: Mapping[str, Any], chart_type: str) -> bool:
    if chart_type in TREND_ANNOTATION_CHART_TYPES | {"columnparallel", "barparallel"}:
        return True
    if chart_type not in {"column", "bar"}:
        return False
    return not _has_color_encoding(spec) and _count_non_label_measures(spec) == 1


def _has_color_encoding(spec: Mapping[str, Any]) -> bool:
    return any(
        isinstance(entry, Mapping) and entry.get("encoding") == "color"
        for entry in spec.get("dimensions", [])
    )


def _count_non_label_measures(spec: Mapping[str, Any]) -> int:
    return sum(
        1
        for entry in spec.get("measures", [])
        if isinstance(entry, Mapping) and entry.get("id") and entry.get("encoding") != "label"
    )


def _extract_annotation_filters(
    annotation_point: Mapping[str, Any],
    category_field: str,
    x_axis_field: str,
    y_axis_field: str,
) -> dict[str, Any]:
    selector = annotation_point.get("selector")
    if selector is not None:
        filters = _extract_filters_from_selector(selector, category_field)
        if filters:
            return filters

    target = annotation_point.get("target")
    if isinstance(target, Mapping):
        filters = _extract_filters_from_target(target, x_axis_field, y_axis_field)
        if filters:
            return filters

    if "value" in annotation_point and category_field:
        return {category_field: annotation_point.get("value")}

    return {}


def _extract_filters_from_selector(selector: Any, x_field: str) -> dict[str, Any]:
    selectors = selector if isinstance(selector, list) else [selector]
    filters: dict[str, Any] = {}

    for item in selectors:
        if isinstance(item, bool):
            return {}
        if isinstance(item, (int, float, str)):
            if not x_field:
                return {}
            filters[x_field] = item
            continue
        if not isinstance(item, Mapping):
            return {}

        field = item.get("field")
        operator = item.get("operator", item.get("op"))
        value = item.get("value")
        if not field:
            return {}
        if operator in (None, "=", "=="):
            filters[str(field)] = value
            continue
        if operator == "in" and isinstance(value, list) and len(value) == 1:
            filters[str(field)] = value[0]
            continue
        return {}

    return filters


def _extract_filters_from_target(
    target: Mapping[str, Any], x_field: str, y_field: str
) -> dict[str, Any]:
    filters: dict[str, Any] = {}
    for key, value in target.items():
        if key == "x" and x_field:
            filters[x_field] = value
        elif key == "y" and y_field:
            filters[y_field] = value
        elif key == "measureId":
            continue
        else:
            filters[str(key)] = value
    return filters


def _resolve_annotation_color_id(
    spec: Mapping[str, Any],
    chart_type: str,
    annotation_point: Mapping[str, Any],
    target_row: Mapping[str, Any],
) -> str:
    color_field = _extract_encoding_field(spec, "color")
    if color_field:
        return _normalize_color_id(target_row.get(color_field))
    if chart_type in DUAL_AXIS_CHART_TYPES:
        return _normalize_color_id(
            _extract_annotation_measure_id(annotation_point)
            or _extract_value_field(spec, chart_type, annotation_point)
        )
    return _normalize_color_id(_extract_annotation_measure_id(annotation_point))


def _extract_annotation_measure_id(annotation_point: Mapping[str, Any]) -> Any:
    if "measureId" in annotation_point:
        return annotation_point.get("measureId")
    target = annotation_point.get("target")
    if isinstance(target, Mapping) and "measureId" in target:
        return target.get("measureId")
    return None


def _normalize_color_id(value: Any) -> str:
    if value is None:
        return ""
    normalized = str(value).strip()
    return normalized


def _matching_row_indices(dataset: list[Any], filters: Mapping[str, Any]) -> list[int]:
    matched: list[int] = []
    for index, row in enumerate(dataset):
        if not isinstance(row, Mapping):
            continue
        if all(_values_match(row.get(field), expected) for field, expected in filters.items()):
            matched.append(index)
    return matched


def _values_match(actual: Any, expected: Any) -> bool:
    if actual == expected:
        return True
    actual_numeric = _coerce_numeric_value(actual)
    expected_numeric = _coerce_numeric_value(expected)
    if actual_numeric is not None and expected_numeric is not None:
        return abs(actual_numeric - expected_numeric) <= FLAT_TREND_EPSILON
    return str(actual) == str(expected)


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


def _ordered_series_rows(
    dataset: list[Any],
    target_row: Mapping[str, Any],
    series_group_fields: list[str],
    y_field: str,
) -> list[tuple[int, Mapping[str, Any], float | None]]:
    signature = tuple(target_row.get(field) for field in series_group_fields)
    ordered_rows: list[tuple[int, Mapping[str, Any], float | None]] = []

    for index, row in enumerate(dataset):
        if not isinstance(row, Mapping):
            continue
        if tuple(row.get(field) for field in series_group_fields) != signature:
            continue
        ordered_rows.append((index, row, _coerce_numeric_value(row.get(y_field))))

    return ordered_rows


def _series_position_for_row(
    ordered_rows: list[tuple[int, Mapping[str, Any], float | None]],
    target_row_index: int,
) -> int | None:
    for position, (row_index, _row, _value) in enumerate(ordered_rows):
        if row_index == target_row_index:
            return position
    return None


def _resolve_horizontal_direction(position: int, point_count: int) -> str:
    midpoint = (point_count - 1) / 2
    return "right" if position < midpoint else "left"


def _resolve_sequence_vertical_direction(position: int, point_count: int) -> str:
    midpoint = (point_count - 1) / 2
    return "down" if position < midpoint else "up"


def _resolve_value_horizontal_direction(current_value: float) -> str:
    return "right" if current_value >= -FLAT_TREND_EPSILON else "left"


def _resolve_value_vertical_direction(current_value: float) -> str:
    return "up" if current_value >= -FLAT_TREND_EPSILON else "down"


def _resolve_annotation_directions(
    chart_type: str,
    ordered_rows: list[tuple[int, Mapping[str, Any], float | None]],
    position: int,
    current_value: float,
) -> tuple[str, str]:
    if chart_type in TREND_ANNOTATION_CHART_TYPES:
        horizontal = _resolve_horizontal_direction(position, len(ordered_rows))
        vertical = _resolve_trend_vertical_direction(
            ordered_rows,
            position,
            current_value,
            horizontal,
        )
        return horizontal, vertical
    if chart_type in COLUMN_ANNOTATION_CHART_TYPES:
        return (
            _resolve_horizontal_direction(position, len(ordered_rows)),
            _resolve_value_vertical_direction(current_value),
        )
    return (
        _resolve_value_horizontal_direction(current_value),
        _resolve_sequence_vertical_direction(position, len(ordered_rows)),
    )


def _resolve_trend_vertical_direction(
    ordered_rows: list[tuple[int, Mapping[str, Any], float | None]],
    position: int,
    current_value: float,
    horizontal: str,
) -> str:
    if horizontal == "right":
        neighbor_positions = range(
            position + 1, min(len(ordered_rows), position + 1 + TREND_SAMPLE_LIMIT)
        )
    else:
        neighbor_positions = range(position - 1, max(-1, position - 1 - TREND_SAMPLE_LIMIT), -1)

    weighted_delta = 0.0
    has_neighbor = False
    for weight_index, neighbor_position in enumerate(neighbor_positions):
        if neighbor_position < 0 or neighbor_position >= len(ordered_rows):
            continue
        neighbor_value = ordered_rows[neighbor_position][2]
        if neighbor_value is None:
            continue
        has_neighbor = True
        weighted_delta += (neighbor_value - current_value) * TREND_WEIGHTS[weight_index]

    if not has_neighbor:
        return "up"
    if weighted_delta > FLAT_TREND_EPSILON:
        return "down"
    return "up"


def _classify_density(point_count: int) -> str:
    if point_count <= SPARSE_POINT_THRESHOLD:
        return "sparse"
    if point_count >= DENSE_POINT_THRESHOLD:
        return "dense"
    return "normal"


def _default_runtime_hint(
    spec: Mapping[str, Any], point_count: int
) -> AnnotationPointRuntimeHintWithColorId:
    return {
        **DEFAULT_RUNTIME_HINT,
        "showStartSymbol": _is_point_hidden_config(spec.get("pointStyle")),
        "density": _classify_density(point_count),
    }


def _is_point_hidden_config(point_config: Any) -> bool:
    if not isinstance(point_config, (dict, list)):
        return False
    if isinstance(point_config, list):
        return any(_is_point_hidden_config(item) for item in point_config)
    return point_config.get("visible") is False or point_config.get("pointVisible") is False


__all__ = [
    "attach_annotation_point_runtime_hints_to_spec_map",
    "build_annotation_point_runtime_hints",
]
