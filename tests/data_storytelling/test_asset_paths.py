"""Asset IDs and symlinks must stay inside the declared input directory."""

import pytest
from normalize_story_assets import find_asset_file


@pytest.mark.parametrize("asset_id", ["../outside", "/absolute/outside"])
def test_asset_ids_cannot_escape_the_input_directory(tmp_path, asset_id):
    assets = tmp_path / "assets"
    assets.mkdir()
    with pytest.raises(ValueError, match="outside"):
        find_asset_file(assets, asset_id, "svg")


def test_asset_symlink_cannot_escape_but_local_asset_can(tmp_path):
    assets = tmp_path / "assets"
    assets.mkdir()
    (tmp_path / "outside.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg"/>')
    (assets / "external.svg").symlink_to(tmp_path / "outside.svg")
    with pytest.raises(ValueError, match="outside"):
        find_asset_file(assets, "external", "svg")
    local = assets / "local.svg"
    local.write_text('<svg xmlns="http://www.w3.org/2000/svg"/>')
    assert find_asset_file(assets, "local", "svg") == local
