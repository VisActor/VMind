import json
import shutil
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlsplit

import pytest

ROOT = Path(__file__).resolve().parents[1]


def test_evaluation_lockfile_uses_public_npm_registry():
    lock = json.loads((ROOT / "evals/package-lock.json").read_text())
    resolved = [package["resolved"] for package in lock["packages"].values() if "resolved" in package]
    assert resolved and all(urlsplit(url).hostname == "registry.npmjs.org" for url in resolved)


@pytest.mark.parametrize("skill", ["vchart-development-assistant", "vtable-development-assistant"])
def test_copied_skill_generates_without_source_checkout(tmp_path, skill):
    installed = tmp_path / "installed skill"
    shutil.copytree(ROOT / "skills" / skill, installed)
    cwd = tmp_path / "user project"
    cwd.mkdir()
    result = subprocess.run(
        [
            sys.executable,
            str(installed / "scripts/generate_demo_html.py"),
            "--output-dir",
            "result files",
        ],
        cwd=cwd,
        capture_output=True,
        text=True,
        check=True,
    )
    html = cwd / "result files/demo.html"
    assert html.exists(), result.stderr
    assert "https://unpkg.com/" in html.read_text()
    assert str(ROOT) not in html.read_text()
