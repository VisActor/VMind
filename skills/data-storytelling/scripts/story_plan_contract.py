"""Shared structural contract helpers for data-storytelling plans."""

from __future__ import annotations

from typing import Any

SCROLLYTELLING_ALLOWED_CHART_TYPE_DISPLAY = [
    "line",
    "area",
    "column",
    "columnPercent",
    "bar",
    "barPercent",
    "columnParallel",
    "barParallel",
    "dualAxis",
]
SCROLLYTELLING_ALLOWED_CHART_TYPES = {
    value.lower() for value in SCROLLYTELLING_ALLOWED_CHART_TYPE_DISPLAY
}
TREND_CHART_TYPES = {"line", "area"}


def normalize_plan_value(value: Any) -> str:
    normalized = str(value or "").strip()
    while (
        len(normalized) >= 2
        and normalized[0] == normalized[-1]
        and normalized[0] in {"`", '"', "'"}
    ):
        normalized = normalized[1:-1].strip()
    return normalized


def normalize_chart_type(value: Any) -> str:
    return normalize_plan_value(value).lower()


def normalize_renderer(value: Any) -> str:
    return normalize_plan_value(value).lower() or "standard-chart"


def allowed_scrollytelling_chart_types_label() -> str:
    return ", ".join(SCROLLYTELLING_ALLOWED_CHART_TYPE_DISPLAY)


def collect_scrollytelling_chart_errors(chapters: list[dict[str, Any]]) -> list[str]:
    errors: list[str] = []
    allowed_label = allowed_scrollytelling_chart_types_label()
    for chapter_index, chapter in enumerate(chapters, start=1):
        if normalize_plan_value(chapter.get("pattern")).lower() != "scrollytelling":
            continue

        for chart in chapter.get("charts") or []:
            chart_id = normalize_plan_value(chart.get("id")) or f"chapter {chapter_index} chart"
            renderer = normalize_renderer(chart.get("renderer"))
            chart_type = normalize_plan_value(chart.get("chart_type"))
            chart_type_key = normalize_chart_type(chart_type)

            if renderer == "infographic":
                errors.append(
                    f"Scrollytelling chart '{chart_id}' uses renderer 'infographic'; "
                    "scrollytelling only supports renderer 'standard-chart'. "
                    "Update plan.md and rerun validate_story_plan.py."
                )
            if chart_type_key not in SCROLLYTELLING_ALLOWED_CHART_TYPES:
                errors.append(
                    f"Scrollytelling chart '{chart_id}' uses chartType '{chart_type or 'missing'}'. "
                    f"Allowed chartTypes: {allowed_label}. "
                    "Dense matrix or single-shot chart types such as heatmap should use Pattern: chart-narrative, "
                    "or the plan should change to a staged trend/ranking chart that can visibly progress by step."
                )
    return errors


def collect_trend_detail_encoding_errors(chapters: list[dict[str, Any]]) -> list[str]:
    """Reject trend plans that mistake ``detail`` for a visual series channel.

    VSeed's categorical line/area series identity comes from a dimension mapped
    to ``color``. ``detail`` is opt-in auxiliary metadata in the Data
    Storytelling contract; it must not be the only declared grouping channel
    for a trend chart.
    """
    errors: list[str] = []
    for chapter_index, chapter in enumerate(chapters, start=1):
        for chart in chapter.get("charts") or []:
            if normalize_renderer(chart.get("renderer")) != "standard-chart":
                continue
            if normalize_chart_type(chart.get("chart_type")) not in TREND_CHART_TYPES:
                continue

            dimensions = chart.get("dimensions") or []
            detail_dimension_ids = [
                normalize_plan_value(entry.get("id"))
                for entry in dimensions
                if isinstance(entry, dict)
                and normalize_plan_value(entry.get("encoding")) == "detail"
                and normalize_plan_value(entry.get("id"))
            ]
            has_color_dimension = any(
                isinstance(entry, dict) and normalize_plan_value(entry.get("encoding")) == "color"
                for entry in dimensions
            )
            if not detail_dimension_ids or has_color_dimension:
                continue

            chart_id = normalize_plan_value(chart.get("id")) or f"chapter {chapter_index} chart"
            detail_fields = ", ".join(detail_dimension_ids)
            errors.append(
                f"Trend chart '{chart_id}' maps {detail_fields} to detail without a color dimension. "
                "In Data Storytelling, categorical line/area series must use dimensions[].encoding: color; "
                "detail is auxiliary only. Move a series field to color, or remove the auxiliary field "
                "from dimensions (use tooltip when it only needs to be read)."
            )
    return errors


def scrollytelling_step_has_visual_delta(step: Any, default_data_ref: str = "") -> bool:
    if not isinstance(step, dict):
        return False

    data_ref = normalize_plan_value(step.get("data_ref"))
    if data_ref and data_ref != normalize_plan_value(default_data_ref):
        return True
    if normalize_plan_value(step.get("highlight_desc")):
        return True
    annotation_list = step.get("annotation_list")
    return isinstance(annotation_list, list) and len(annotation_list) > 0


def collect_scrollytelling_step_errors(chapters: list[dict[str, Any]]) -> list[str]:
    errors: list[str] = []
    for chapter_index, chapter in enumerate(chapters, start=1):
        if normalize_plan_value(chapter.get("pattern")).lower() != "scrollytelling":
            continue

        charts = chapter.get("charts") or []
        chart = charts[0] if len(charts) == 1 else {}
        chart_id = normalize_plan_value(chart.get("id")) or f"chapter {chapter_index} chart"
        default_data_ref = normalize_plan_value(chart.get("data_ref"))
        if not default_data_ref:
            evidence_refs = chapter.get("evidence_refs") or []
            default_data_ref = normalize_plan_value(evidence_refs[0] if evidence_refs else "")

        for step_index, step in enumerate(chapter.get("steps") or [], start=1):
            if step_index == 1:
                continue
            if scrollytelling_step_has_visual_delta(step, default_data_ref):
                continue
            errors.append(
                f"Scrollytelling chart '{chart_id}' Step {step_index} only has narrative text. "
                "Every step after the baseline must add a chart-state change through dataRef, "
                "highlightDesc, or annotationList; otherwise merge the step or change the pattern."
            )
    return errors


def format_plan_structural_errors(errors: list[str]) -> str:
    return (
        "Plan structural validation failed. Fix plan.md, read the relevant skill reference docs, "
        "then rerun validate_story_plan.py.\n" + "\n".join(f"- {error}" for error in errors)
    )
