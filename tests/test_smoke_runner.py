import importlib.util
import json
import shutil
import subprocess
import sys
from pathlib import Path
from types import SimpleNamespace

import pytest

ROOT = Path(__file__).resolve().parents[1]


@pytest.fixture
def smoke(monkeypatch):
    monkeypatch.syspath_prepend(str(ROOT / "evals/scripts"))
    spec = importlib.util.spec_from_file_location("smoke_runner", ROOT / "evals/scripts/smoke.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.fixture
def catalog(tmp_path):
    directory = tmp_path / "vchart-skill/custom-chart"
    shutil.copytree(ROOT / "evals/smoke/vchart-skill/vchart-grouped", directory)
    return tmp_path, directory


def test_new_case_directory_is_discovered_without_a_runner_allowlist(smoke, catalog):
    root, _ = catalog
    assert [(case["skill"], case["id"]) for case in smoke.load_cases(root)] == [
        ("vchart-skill", "custom-chart")
    ]


def test_explicit_case_selection_stays_within_selected_skill(smoke):
    with pytest.raises(ValueError, match="Unknown smoke cases"):
        smoke.select_cases(smoke.load_cases(), "vchart-skill", ["story-ppt"])


@pytest.mark.parametrize("field, value, message", [
    ("source", "../outside.js", "simple filename"),
    ("records", "missing.csv", "Missing smoke records"),
    ("numericFields", "sales", "list of field names"),
])
def test_invalid_case_config_fails_before_browser_execution(smoke, catalog, field, value, message):
    root, directory = catalog
    path = directory / "config.json"
    config = json.loads(path.read_text())
    path.write_text(json.dumps({**config, field: value}))
    with pytest.raises(ValueError, match=message):
        smoke.load_cases(root)


def test_mismatched_acceptance_engine_is_rejected(smoke, catalog):
    root, directory = catalog
    path = directory / "expectations.json"
    expected = json.loads(path.read_text())
    path.write_text(json.dumps({**expected, "engine": "story"}))
    with pytest.raises(ValueError, match="engine does not match Skill"):
        smoke.load_cases(root)


def test_nested_input_directories_fail_instead_of_being_silently_skipped(smoke, catalog):
    root, directory = catalog
    (directory / "inputs/nested").mkdir()
    with pytest.raises(ValueError, match="must be flat files"):
        smoke.load_cases(root)


def test_preparation_copies_owned_inputs_and_keeps_acceptance_outside_skill_workspace(smoke, catalog):
    root, directory = catalog
    case = smoke.load_cases(root)[0]
    destination = root / "evidence"
    workspace = smoke.prepare_case(case, destination)
    assert (workspace / "inputs/sales.csv").read_bytes() == (directory / "inputs/sales.csv").read_bytes()
    assert (workspace / ".agents/skills/vchart-skill/SKILL.md").is_file()
    assert not list(workspace.rglob("expectations.json"))
    assert json.loads((destination / "expectations.json").read_text()) == case["expectations"]


def test_source_fixture_uses_the_declared_csv_and_numeric_fields(smoke, catalog):
    root, directory = catalog
    (directory / "spec.js").write_text("console.log(JSON.stringify({{RECORDS}}));")
    (directory / "inputs/sales.csv").write_text("region,amount,count\nEast,12.5,03\n")
    config = json.loads((directory / "config.json").read_text())
    (directory / "config.json").write_text(json.dumps({**config, "numericFields": ["amount"]}))
    case = smoke.load_cases(root)[0]
    workspace = smoke.prepare_case(case, root / "evidence")
    result = subprocess.run(["node", "-e", smoke.source_code(case, workspace)], capture_output=True, text=True, check=True)
    assert json.loads(result.stdout) == [{"region": "East", "amount": 12.5, "count": "03"}]


def test_records_require_an_explicit_source_placeholder(smoke, catalog):
    root, directory = catalog
    (directory / "spec.js").write_text("const spec = {};")
    case = smoke.load_cases(root)[0]
    workspace = smoke.prepare_case(case, root / "evidence")
    with pytest.raises(ValueError, match="Missing .*RECORDS.* placeholder"):
        smoke.source_code(case, workspace)


@pytest.mark.parametrize("step", ["generate", "browser"])
def test_failed_step_keeps_its_log_and_case_failure(smoke, catalog, monkeypatch, step):
    root, _ = catalog
    case = smoke.load_cases(root)[0]
    outcomes = [SimpleNamespace(returncode=1, stdout="", stderr="fixture failure")]
    if step == "browser":
        outcomes.insert(0, SimpleNamespace(returncode=0, stdout="generated", stderr=""))
    monkeypatch.setattr(smoke.subprocess, "run", lambda *args, **kwargs: outcomes.pop(0))
    output = root / "evidence"
    assert smoke.run_case(case, output) == {"case": "custom-chart", "passed": False}
    assert "fixture failure" in (output / "custom-chart" / f"{step}.log").read_text()


@pytest.mark.parametrize("step", ["generate", "browser"])
def test_timeout_preserves_partial_step_output_and_case_failure(smoke, catalog, monkeypatch, step):
    root, _ = catalog
    case = smoke.load_cases(root)[0]
    calls = []

    def run(command, **kwargs):
        calls.append(command)
        if step == "browser" and len(calls) == 1:
            return SimpleNamespace(returncode=0, stdout="generated", stderr="")
        raise subprocess.TimeoutExpired(command, 120, output=b"partial output", stderr="partial error")

    monkeypatch.setattr(smoke.subprocess, "run", run)
    output = root / "evidence"
    assert smoke.run_case(case, output) == {"case": "custom-chart", "passed": False}
    log = (output / "custom-chart" / f"{step}.log").read_text()
    assert "partial output" in log and "partial error" in log and "timed out" in log


def test_list_needs_no_browser_or_credentials_and_creates_no_evidence(tmp_path):
    output = tmp_path / "evidence"
    result = subprocess.run([
        sys.executable, str(ROOT / "evals/scripts/smoke.py"), "--skill", "data-storytelling",
        "--list", "--output-dir", str(output),
    ], capture_output=True, text=True, check=True)
    assert {line.split()[0] for line in result.stdout.splitlines()} == {"story-html", "story-ppt"}
    assert not output.exists()
