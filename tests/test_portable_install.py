import shutil
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]


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
