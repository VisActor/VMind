"""Typed metadata for local-owned spec_map entry extensions.

These fields are not part of the upstream VSeed DSL. They are local adapter
metadata that travels alongside each chart entry so the browser runtime can
apply consistent rendering-only adjustments without re-deriving chart intent.
"""

from __future__ import annotations

from typing import Literal, TypedDict

AnnotationHorizontalHint = Literal["left", "right"]
AnnotationVerticalHint = Literal["up", "down"]
AnnotationDensityHint = Literal["sparse", "normal", "dense"]


class AnnotationPointRuntimeHint(TypedDict):
    """Render-only placement hints aligned by index with annotationPoint -> markPoint order."""

    horizontal: AnnotationHorizontalHint
    vertical: AnnotationVerticalHint
    showStartSymbol: bool
    density: AnnotationDensityHint


class AnnotationPointRuntimeHintWithColorId(AnnotationPointRuntimeHint, total=False):
    """Optional color metadata resolved pre-render from the normalized VSeed spec."""

    # colorId mirrors builder.getColorValueMap() keys when we can resolve a stable series identity.
    colorId: str


class VSeedSpecMapEntry(TypedDict, total=False):
    """Local spec_map entry shape consumed by output.html and browser runtime."""

    renderer: Literal["standard-chart", "infographic"]
    spec: dict
    steps: list[dict]
    theme: str
    # Ordered 1:1 with spec.annotationPoint and the generated spec.markPoint array.
    annotationPointRuntimeHints: list[AnnotationPointRuntimeHintWithColorId]
    # Ordered 1:1 with steps, then 1:1 with each step.annotationPoint / step markPoint array.
    stepAnnotationPointRuntimeHints: list[list[AnnotationPointRuntimeHintWithColorId]]
