"""Import independently installed runtime helpers for behavioral tests."""

import sys
from pathlib import Path

SKILL = Path(__file__).resolve().parents[2] / "skills/data-storytelling"
sys.path.insert(0, str(SKILL / "scripts"))
sys.path.insert(0, str(SKILL / "build-html/scripts"))
