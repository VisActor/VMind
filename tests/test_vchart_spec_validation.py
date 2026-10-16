from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "skills/vchart-skill/scripts"


def validate_source(source: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["node", str(SCRIPTS / "validate_spec.cjs"), "--stdin"],
        input=source,
        text=True,
        capture_output=True,
        timeout=10,
    )


def generate(tmp_path: Path, source: str) -> subprocess.CompletedProcess[str]:
    spec = tmp_path / "spec.js"
    spec.write_text(source, encoding="utf-8")
    return subprocess.run(
        [
            sys.executable,
            str(SCRIPTS / "generate_demo_html.py"),
            "--spec-file",
            str(spec),
            "--output",
            str(tmp_path / "demo.html"),
        ],
        text=True,
        capture_output=True,
        timeout=10,
    )


@pytest.mark.parametrize(
    "expression", ["window.innerWidth", "document.documentElement.clientWidth", "VChart.width"]
)
def test_missing_host_globals_defer_spec_checks_but_allow_html_generation(
    tmp_path: Path, expression: str
) -> None:
    source = f"const spec = {{type:'bar', width:{expression}, data:{{values:[]}}}};"
    result = validate_source(source)
    assert result.returncode == 0, result.stdout + result.stderr
    report = json.loads(result.stdout)
    assert report["specChecked"] is False
    assert report["warnings"][0]["code"] == "RUNTIME_VALIDATION_DEFERRED"

    generated = generate(tmp_path, source)
    assert generated.returncode == 0, generated.stderr
    assert (tmp_path / "demo.html").is_file()
    assert "RUNTIME_VALIDATION_DEFERRED" in generated.stderr


@pytest.mark.parametrize("chart", ["treemap", "sunburst"])
@pytest.mark.parametrize("parser", ["csv", "dsv", "tsv"])
def test_hierarchy_accepts_text_data_with_a_supported_parser(chart: str, parser: str) -> None:
    source = (
        f"const spec = {{type:{json.dumps(chart)}, data:{{"
        f"values:'name,size\\nA,1\\nB,2', parser:{{type:{json.dumps(parser)}}}}}}};"
    )
    result = validate_source(source)
    assert result.returncode == 0, result.stdout + result.stderr
    assert json.loads(result.stdout)["specChecked"] is True


@pytest.mark.parametrize(
    ("source", "error"),
    [
        ("const spec = {type:'treemap', data:{value:{children:[]}}};", "DATA_VALUES_REQUIRED"),
        (
            "const spec = {type:'treemap', data:[{name:'root',children:[]}]};",
            "DATA_VALUES_REQUIRED",
        ),
        (
            "const spec = {type:'common', series:[{type:'treemap', data:[{name:'root',children:[]}]}]};",
            "DATA_VALUES_REQUIRED",
        ),
        (
            "const spec = {type:'sunburst',categoryField:'item',data:[{item:'leaf',amount:2}]};",
            "DATA_VALUES_REQUIRED",
        ),
        (
            "const spec = {type:'common', series:[{type:'treemap', data:{value:[]}}]};",
            "DATA_VALUES_REQUIRED",
        ),
        (
            "const spec = {type:'treemap', data:{values:{children:[]}}};",
            "HIERARCHY_ROOT_ARRAY",
        ),
        (
            "const spec = {type:'treemap', data:{values:'name,size'}};",
            "HIERARCHY_ROOT_ARRAY",
        ),
        (
            "const spec = {type:'treemap', data:{values:'name,size', parser:{type:'json'}}};",
            "HIERARCHY_ROOT_ARRAY",
        ),
        ("const spec = {type:'bar', label:{formatter: v => v}};", "FUNCTION_FORMATTER"),
        (
            "const spec = {type:'treemap', nonLeafLabel:{formatter: v => v}};",
            "FUNCTION_FORMATTER",
        ),
        (
            "const spec = {type:'common', series:[{type:'bar', label:{formatter: v => v}}]};",
            "FUNCTION_FORMATTER",
        ),
        ("const spec = {type:'bar', width:window.innerWidth, data:};", "SOURCE_SYNTAX"),
    ],
)
def test_invalid_source_fails_before_writing_html(tmp_path: Path, source: str, error: str) -> None:
    result = generate(tmp_path, source)
    assert result.returncode != 0
    assert error in result.stderr
    assert not (tmp_path / "demo.html").exists()


def test_source_helpers_callbacks_and_empty_data_remain_valid(tmp_path: Path) -> None:
    source = """const rows = [];
const format = value => `size: ${value}`;
const spec = {type:'treemap', data:{values:rows}, label:{formatMethod:format}};
"""
    result = generate(tmp_path, source)
    assert result.returncode == 0, result.stderr


@pytest.mark.parametrize(
    "data", ["{values:[]}", "[]", "{}", "{fromDataId:'original'}", "{fromDataIndex:0}"]
)
def test_hierarchy_keeps_empty_and_referenced_data_valid(data: str) -> None:
    result = validate_source(f"const spec = {{type:'treemap',categoryField:'name',data:{data}}};")
    assert result.returncode == 0, result.stdout + result.stderr


def test_missing_node_reports_the_runtime_dependency_without_writing_html(tmp_path: Path) -> None:
    result = subprocess.run(
        [
            sys.executable,
            str(SCRIPTS / "generate_demo_html.py"),
            "--output",
            str(tmp_path / "demo.html"),
        ],
        env={**os.environ, "PATH": str(tmp_path)},
        text=True,
        capture_output=True,
        timeout=10,
    )
    assert result.returncode != 0
    assert "Node.js" in result.stderr and "PATH" in result.stderr
    assert not (tmp_path / "demo.html").exists()


@pytest.mark.parametrize("valid_data", [True, False])
def test_deferred_source_is_checked_in_the_templates_host_environment(
    tmp_path: Path, valid_data: bool
) -> None:
    data = "values:[]" if valid_data else "value:[]"
    source = f"const spec = {{type:'bar', width:window.innerWidth, data:{{{data}}}}};"
    generated = generate(tmp_path, source)
    assert generated.returncode == 0, generated.stderr
    # Exercise the emitted scripts and their actual contract in a host context;
    # graphics are verified separately by the browser smoke runner.
    runtime = r"""
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(process.argv[1], 'utf8');
const rendered = [];
const errors = [];
const container = {innerHTML: ''};
const context = {
  innerWidth: 1024,
  document: {
    getElementById: () => container,
    addEventListener: (_, callback) => callback(),
  },
  VChart: {default: class {
    constructor(spec) {this.spec = spec;}
    renderSync() {rendered.push(this.spec);}
    release() {}
  }},
  console: {error: error => errors.push(String(error))},
  require: Object.assign(() => {}, {config: () => {}}),
};
context.window = context;
vm.createContext(context);
for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
  vm.runInContext(match[1], context, {timeout: 1000});
}
process.stdout.write(JSON.stringify({
  widths: rendered.map(spec => spec.width), errors, htmlError: container.innerHTML,
}));
"""
    result = subprocess.run(
        ["node", "-e", runtime, str(tmp_path / "demo.html")],
        text=True,
        capture_output=True,
        timeout=10,
        check=True,
    )
    observed = json.loads(result.stdout)
    if valid_data:
        assert observed == {"widths": [1024], "errors": [], "htmlError": ""}
    else:
        assert observed["widths"] == []
        assert "DATA_VALUES_REQUIRED" in observed["htmlError"]
        assert any("DATA_VALUES_REQUIRED" in error for error in observed["errors"])
