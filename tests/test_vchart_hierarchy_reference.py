from __future__ import annotations

import json
import subprocess
from pathlib import Path

import pytest

REFERENCE = (
    Path(__file__).resolve().parents[1]
    / "skills/vchart-skill/references/examples/treemap/hierarchy-treemap.js"
)


def probe(rows: list[dict], hierarchy: list[str], value: str, group: str, palette: dict) -> dict:
    runtime = r"""
const fs = require('node:fs');
const vm = require('node:vm');
const input = JSON.parse(fs.readFileSync(0, 'utf8'));
const factory = vm.runInNewContext(fs.readFileSync(process.argv[1], 'utf8') + '; createTreemapSpec;', {
  document: {createElement: () => ({getContext: () => ({measureText: text => ({width: text.length * 8})})})},
});
try {
  const spec = factory(input.rows, input.options);
  const leaves = [];
  function visit(nodes) {for (const node of nodes) node.children ? visit(node.children) : leaves.push(node);}
  visit(spec.data.values);
  const row = input.rows[0];
  const result = {leaves, values: spec.data.values};
  if (row) {
    const bounds = {x0:0,x1:250,y0:0,y1:80};
    const forms = [{...row,...bounds}, {datum:[{unrelated:'ancestor'},row],...bounds}, {datum:row,...bounds}];
    result.callbacks = forms.map(node => ({
      color: spec.leaf.style.fill(node),
      title: spec.tooltip.mark.title.value(node),
      details: spec.tooltip.mark.content.map(item => item.value(node)),
      label: spec.label.formatMethod('',node),
    }));
    result.narrow = spec.label.formatMethod('',{datum:[row],...bounds,x1:20});
    result.short = spec.label.formatMethod('',{datum:[row],...bounds,y1:10});
  }
  process.stdout.write(JSON.stringify(result));
} catch(error) {process.stdout.write(JSON.stringify({error:String(error.message)}));}
"""
    result = subprocess.run(
        ["node", "-e", runtime, str(REFERENCE)],
        input=json.dumps(
            {
                "rows": rows,
                "options": {
                    "hierarchyFields": hierarchy,
                    "valueField": value,
                    "groupField": group,
                    "palette": palette,
                },
            }
        ),
        capture_output=True,
        text=True,
        check=True,
        timeout=10,
    )
    return json.loads(result.stdout)


@pytest.mark.parametrize("hierarchy", [["region", "item"], ["region", "division", "item"]])
def test_reference_preserves_leaf_data_at_different_depths(hierarchy: list[str]) -> None:
    rows = [
        {"region": "East", "division": "X", "item": "One", "size": 12},
        {"region": "East", "division": "Y", "item": "Two", "size": 4},
        {"region": "West", "division": "Y", "item": "Three", "size": 4},
    ]
    observed = probe(rows, hierarchy, "size", "region", {"East": "#2563eb", "West": "#ea580c"})
    assert observed["leaves"] == rows


def test_callbacks_read_original_records_not_internal_keys_and_labels_fit() -> None:
    rows = [
        {"team": "Red", "product": "First", "revenue": 6},
        {"team": "Red", "product": "Next", "revenue": 4},
    ]
    observed = probe(rows, ["team", "product"], "revenue", "team", {"Red": "#ea580c"})
    expected = {
        "color": "#ea580c",
        "title": "First",
        "details": ["Red", "6", "60%"],
        "label": "First 60%",
    }
    assert observed["callbacks"] == [expected, expected, expected]
    assert observed["narrow"] == observed["short"] == ""


def test_empty_rows_keep_values_empty() -> None:
    assert probe([], ["group", "name"], "amount", "group", {}) == {"leaves": [], "values": []}


@pytest.mark.parametrize("amount", [None, "", "invalid"])
def test_reference_rejects_missing_or_invalid_amounts(amount: object) -> None:
    result = probe(
        [{"group": "G", "name": "N", "amount": amount}],
        ["group", "name"],
        "amount",
        "group",
        {"G": "#2563eb"},
    )
    assert result == {"error": "Invalid numeric value for amount."}


def test_reference_does_not_mask_unknown_groups_with_fallback_colors() -> None:
    result = probe(
        [{"group": "G", "name": "N", "amount": 2}], ["group", "name"], "amount", "group", {}
    )
    assert result == {"error": "Missing palette for group: G"}


@pytest.mark.parametrize(
    ("height", "width", "expected"),
    [(80, 100, ["First", "60%"]), (35, 100, ""), (80, 40, "")],
)
def test_multiline_labels_require_full_width_and_total_line_height(
    height: int, width: int, expected: object
) -> None:
    runtime = r"""
const fs = require('node:fs');
const vm = require('node:vm');
const fit = vm.runInNewContext(fs.readFileSync(process.argv[1], 'utf8') + '; fitTreemapLabel;', {
  document: {createElement: () => ({getContext: () => ({measureText: text => ({width: text.length * 8})})})},
});
const node = {x0:0,y0:0,x1:Number(process.argv[2]),y1:Number(process.argv[3])};
process.stdout.write(JSON.stringify(fit('First\n60%',node)));
"""
    result = subprocess.run(
        ["node", "-e", runtime, str(REFERENCE), str(width), str(height)],
        text=True,
        capture_output=True,
        check=True,
        timeout=10,
    )
    assert json.loads(result.stdout) == expected
