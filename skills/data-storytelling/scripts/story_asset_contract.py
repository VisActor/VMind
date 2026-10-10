from __future__ import annotations

import re
from typing import Any

PRESENTATION_MODES = {
    "editorial",
    "feature",
}

ASSET_MEDIA_HINTS = {"svg", "image"}
ASSET_SOURCES = {"generated", "user-provided"}

ASSET_FALLBACKS = {
    "remove",
    "gradient",
    "text-only",
}

ASSET_PLACEMENTS = {
    "hero_background_image",
    "opener_motif_background",
    "primary_image",
    "evidence_image",
    "visual_artifact",
    "takeaway_accent",
    "kpi_lead_icon",
    "action_lead_asset",
}

REQUIRED_IDENTITY_FIELDS = {"theme_subject", "visual_language", "recurring_motifs", "avoid"}
REQUIRED_ASSET_FIELDS = {"media_hint", "purpose", "visual_brief", "fallback"}


def extract_section(text: str, section_name: str) -> str:
    match = re.search(
        rf"^##\s+{re.escape(section_name)}(?:[（(].*?[）)])?.*?\n(.*?)(?=^##\s+|\Z)",
        text,
        flags=re.MULTILINE | re.DOTALL,
    )
    return match.group(1).strip() if match else ""


def extract_subsection(section_text: str, subsection_name: str) -> str:
    match = re.search(
        rf"^###\s+{re.escape(subsection_name)}\s*\n(.*?)(?=^###\s+|\Z)",
        section_text,
        flags=re.MULTILINE | re.DOTALL,
    )
    return match.group(1).strip() if match else ""


def extract_field_block(block: str, field_name: str) -> str:
    lines = block.splitlines()
    prefix = f"- **{field_name}**:"
    start = next((index for index, line in enumerate(lines) if line.startswith(prefix)), None)
    if start is None:
        return ""

    collected: list[str] = []
    inline = lines[start].split(":", 1)[1].strip()
    if inline:
        collected.append(inline)

    for line in lines[start + 1 :]:
        if line.startswith("- **"):
            break
        collected.append(line)

    return "\n".join(collected).rstrip()


def extract_story_meta_field(plan_text: str, field_name: str) -> str:
    story_meta = extract_section(plan_text, "Story Meta")
    match = re.search(
        rf"^-\s+\*\*{re.escape(field_name)}\*\*:\s*(.+?)\s*$",
        story_meta,
        flags=re.MULTILINE,
    )
    if match is None:
        return ""
    return match.group(1).strip().strip("`").strip('"')


def parse_scalar_and_list_fields(block: str, *, section_name: str) -> dict[str, Any]:
    fields: dict[str, Any] = {}
    current_list_key: str | None = None

    for raw_line in block.splitlines():
        if not raw_line.strip():
            continue

        stripped = raw_line.strip()
        if raw_line.startswith("  - "):
            if current_list_key is None:
                raise ValueError(f"Malformed {section_name}: list item has no field.")
            fields.setdefault(current_list_key, []).append(stripped[2:].strip().strip('"'))
            continue

        current_list_key = None
        match = re.match(r"^([A-Za-z_]+):(?:\s*(.*))?$", stripped)
        if match is None:
            raise ValueError(f"Malformed {section_name}: unsupported line '{stripped}'.")

        key = match.group(1).strip()
        value = match.group(2).strip() if match.group(2) is not None else ""
        if key in fields:
            raise ValueError(f"Malformed {section_name}: duplicate field '{key}'.")
        if value:
            fields[key] = value.strip('"')
        else:
            fields[key] = []
            current_list_key = key

    return fields


def extract_section_visual_asset_bindings(section_visual_block: str) -> list[dict[str, str]]:
    lines = section_visual_block.splitlines()
    bindings: list[dict[str, str]] = []
    assets_started = False
    current: dict[str, str] | None = None

    def flush_current() -> None:
        nonlocal current
        if current is None:
            return
        missing = {"placement", "asset", "usage"} - set(current)
        if missing:
            missing_list = ", ".join(sorted(missing))
            raise ValueError(f"Malformed SectionVisual.assets: missing {missing_list}.")
        bindings.append(current)
        current = None

    for line in lines:
        stripped = line.strip()
        if not assets_started:
            if stripped == "- assets:":
                assets_started = True
            continue

        if not stripped:
            continue

        placement_match = re.match(r"^- placement:\s*(.+)$", stripped)
        if placement_match:
            flush_current()
            current = {"placement": placement_match.group(1).strip().strip('"')}
            continue

        field_match = re.match(r"^(asset|usage):\s*(.+)$", stripped)
        if field_match:
            if current is None:
                raise ValueError(
                    "Malformed SectionVisual.assets: asset and usage must follow placement."
                )
            field_name = field_match.group(1)
            if field_name in current:
                raise ValueError(f"Malformed SectionVisual.assets: duplicate {field_name}.")
            current[field_name] = field_match.group(2).strip().strip('"')
            continue

        raise ValueError(f"Malformed SectionVisual.assets: unsupported line '{stripped}'.")

    flush_current()
    if assets_started and not bindings:
        raise ValueError(
            "Malformed SectionVisual.assets: assets block must contain at least one binding."
        )
    return bindings


def extract_asset_director_registry(registry_block: str) -> dict[str, dict[str, str]]:
    if not registry_block.strip():
        return {}

    assets: dict[str, dict[str, str]] = {}
    current_asset_id: str | None = None
    current_fields: dict[str, str] = {}

    def flush_current() -> None:
        nonlocal current_asset_id, current_fields
        if current_asset_id is None:
            return
        if current_asset_id in assets:
            raise ValueError(f"Duplicate asset id '{current_asset_id}' in Asset Registry.")
        missing = REQUIRED_ASSET_FIELDS - set(current_fields)
        if missing:
            missing_list = ", ".join(sorted(missing))
            raise ValueError(f"Asset '{current_asset_id}' is missing fields: {missing_list}.")
        current_fields.setdefault("source", "generated")
        assets[current_asset_id] = current_fields
        current_asset_id = None
        current_fields = {}

    for line in registry_block.splitlines():
        stripped = line.strip()
        if not stripped:
            continue

        asset_match = re.match(r"^- `([^`]+)`$", stripped)
        if asset_match:
            flush_current()
            current_asset_id = asset_match.group(1).strip()
            if not current_asset_id:
                raise ValueError("Malformed Asset Registry: asset id must not be empty.")
            continue

        if current_asset_id is None:
            raise ValueError(f"Malformed Asset Registry: unexpected line '{stripped}'.")

        field_match = re.match(r"^- ([A-Za-z_]+): (.+)$", stripped)
        if field_match is None:
            raise ValueError(f"Malformed Asset Registry: unsupported line '{stripped}'.")

        field_name = field_match.group(1).strip()
        field_value = field_match.group(2).strip().strip('"')
        if field_name in current_fields:
            raise ValueError(f"Asset '{current_asset_id}' repeats field '{field_name}'.")
        current_fields[field_name] = field_value

    flush_current()
    return assets


def parse_asset_director_contract(plan_text: str) -> dict[str, Any]:
    presentation_mode = extract_story_meta_field(plan_text, "presentation_mode")
    assets_section = extract_section(plan_text, "Assets")
    visual_identity = parse_scalar_and_list_fields(
        extract_subsection(assets_section, "Story Visual Identity"),
        section_name="Story Visual Identity",
    )
    assets = extract_asset_director_registry(extract_subsection(assets_section, "Asset Registry"))

    chapters_section = extract_section(plan_text, "Chapter Outline")
    chapter_blocks = re.findall(
        r"^###\s+(.+?)\n(.*?)(?=^###\s+|\Z)",
        chapters_section,
        flags=re.MULTILINE | re.DOTALL,
    )

    parsed_chapters: dict[str, dict[str, Any]] = {}
    referenced_asset_ids: set[str] = set()
    for heading, block in chapter_blocks:
        pattern_match = re.search(r"^- \*\*Pattern\*\*: (.+)$", block, flags=re.MULTILINE)
        section_visual = extract_field_block(block, "SectionVisual")
        bindings = extract_section_visual_asset_bindings(section_visual)
        for binding in bindings:
            referenced_asset_ids.add(binding["asset"])
        parsed_chapters[heading.strip()] = {
            "pattern": pattern_match.group(1).strip() if pattern_match else "",
            "asset_bindings": bindings,
        }

    parsed = {
        "presentation_mode": presentation_mode,
        "visual_identity": visual_identity,
        "assets": assets,
        "chapters": parsed_chapters,
    }
    validate_asset_director_contract(parsed, referenced_asset_ids)
    return parsed


def validate_asset_director_contract(
    parsed: dict[str, Any], referenced_asset_ids: set[str]
) -> None:
    presentation_mode = parsed.get("presentation_mode")
    if presentation_mode not in PRESENTATION_MODES:
        raise ValueError(f"Unsupported presentation_mode '{presentation_mode}'.")

    visual_identity = parsed["visual_identity"]
    missing_identity = REQUIRED_IDENTITY_FIELDS - set(visual_identity)
    if missing_identity:
        missing_list = ", ".join(sorted(missing_identity))
        raise ValueError(f"Story Visual Identity is missing fields: {missing_list}.")

    declared_assets = parsed["assets"]
    for asset_id, asset_fields in declared_assets.items():
        if asset_fields["source"] not in ASSET_SOURCES:
            raise ValueError(
                f"Asset '{asset_id}' has unsupported source '{asset_fields['source']}'."
            )
        if asset_fields["media_hint"] not in ASSET_MEDIA_HINTS:
            raise ValueError(
                f"Asset '{asset_id}' has unsupported media_hint '{asset_fields['media_hint']}'."
            )
        if asset_fields["fallback"] not in ASSET_FALLBACKS:
            raise ValueError(
                f"Asset '{asset_id}' has unsupported fallback '{asset_fields['fallback']}'."
            )

    for chapter_id, chapter in parsed["chapters"].items():
        for binding in chapter["asset_bindings"]:
            placement = binding["placement"]
            asset_id = binding["asset"]
            if placement not in ASSET_PLACEMENTS:
                raise ValueError(
                    f"Unsupported asset placement '{placement}' in chapter '{chapter_id}'."
                )
            if asset_id not in declared_assets:
                raise ValueError(
                    f"Asset '{asset_id}' is referenced in chapter '{chapter_id}' but not declared."
                )
            if not binding["usage"].strip():
                raise ValueError(
                    f"Asset '{asset_id}' in chapter '{chapter_id}' must include usage."
                )
            asset_fields = declared_assets[asset_id]
            if placement == "evidence_image" and asset_fields["media_hint"] != "image":
                raise ValueError(
                    f"Asset '{asset_id}' in chapter '{chapter_id}' uses evidence_image and must be media_hint: image."
                )

    for asset_id in declared_assets:
        if asset_id not in referenced_asset_ids:
            raise ValueError(
                f"Asset '{asset_id}' is declared but not referenced by any SectionVisual.assets binding."
            )


__all__ = [
    "ASSET_FALLBACKS",
    "ASSET_MEDIA_HINTS",
    "ASSET_PLACEMENTS",
    "ASSET_SOURCES",
    "PRESENTATION_MODES",
    "extract_asset_director_registry",
    "extract_field_block",
    "extract_section",
    "extract_section_visual_asset_bindings",
    "extract_story_meta_field",
    "extract_subsection",
    "parse_asset_director_contract",
    "parse_scalar_and_list_fields",
    "validate_asset_director_contract",
]
