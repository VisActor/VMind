"""Protect per-Skill fixture and expectation contracts, not prompt wording."""

import hashlib
import json
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
CATALOGS = sorted((ROOT / "evals/cases").glob("*/tasks.json"))


@pytest.mark.parametrize("catalog", CATALOGS, ids=lambda p: p.parent.name)
def test_every_case_has_local_inputs_and_a_verification_contract(catalog):
    folder = catalog.parent
    tasks = json.loads(catalog.read_text())
    expected = json.loads((folder / "expectations.json").read_text())
    assert (ROOT / "skills" / folder.name / "SKILL.md").is_file()
    assert all(t["skill"] == folder.name for t in tasks)
    assert set(expected) == {t["id"] for t in tasks}
    for task in tasks:
        assert all((folder / "inputs" / name).is_file() for name in task["inputs"])
        contract = expected[task["id"]]
        assert contract["review"]
        assert bool(contract.get("html")) != bool(contract.get("answerOnly"))


def test_case_ids_are_unique_across_skills():
    ids = [t["id"] for p in CATALOGS for t in json.loads(p.read_text())]
    assert len(ids) == len(set(ids))


@pytest.mark.parametrize("catalog", CATALOGS, ids=lambda p: p.parent.name)
def test_catalog_fixture_inventory_matches_input_bytes(catalog):
    folder = catalog.parent
    fixtures = json.loads((folder / "fixtures.json").read_text())
    assert set(fixtures) == {p.name for p in (folder / "inputs").iterdir()}
    for name, record in fixtures.items():
        assert (
            hashlib.sha256((folder / "inputs" / name).read_bytes()).hexdigest() == record["sha256"]
        )


def test_selection_covers_every_vchart_task_once():
    folder = ROOT / "evals/cases/vchart-development-assistant"
    tasks = json.loads((folder / "tasks.json").read_text())
    selection = json.loads((folder / "selection.json").read_text())
    ids = [c["id"] for c in selection["cases"]]
    assert len(ids) == len(set(ids))
    assert set(ids) == {t["id"] for t in tasks}
    assert all(c["reason"] and c["origin"] for c in selection["cases"])
