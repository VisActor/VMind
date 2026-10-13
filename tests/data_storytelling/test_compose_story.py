from __future__ import annotations

import base64
import json
import subprocess
import sys
import tempfile
import unittest
from html.parser import HTMLParser
from pathlib import Path

from compose_story import bind_assets, compose_story, validate_config

SCRIPTS = Path(__file__).resolve().parents[2] / "skills/data-storytelling/scripts"

PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lmmxQgAAAABJRU5ErkJggg=="
SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><circle cx="10" cy="10" r="4"/></svg>'


class Tags(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.tags = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


class ComposeStoryTest(unittest.TestCase):
    def test_background_round_trips_as_css_value_not_escaped_attribute(self):
        source = '<section class="hero" data-story-background="hero"><h1>A &amp; B</h1></section>'
        result = bind_assets(source, {"hero": {"data_uri": PNG}})
        attrs = Tags(result).tags[0][1]
        self.assertEqual(attrs["style"], f'background-image: url("{PNG}");')
        self.assertIn("<h1>A &amp; B</h1>", result)

    def test_image_src_is_bound_and_alt_is_preserved(self):
        result = bind_assets(
            '<img data-story-image="photo" alt="A &amp; B"/>', {"photo": {"data_uri": PNG}}
        )
        self.assertEqual(
            dict(Tags(result).tags[0][1]), {"data-story-image": "photo", "alt": "A & B", "src": PNG}
        )

    def test_inline_svg_is_inserted_as_markup(self):
        result = bind_assets(
            '<div data-story-inline="diagram"> </div>', {"diagram": {"inline_markup": SVG}}
        )
        self.assertIn(SVG, result)

    def test_untouched_markup_preserves_svg_case_quotes_entities(self):
        source = "<section data-x='a&amp;b'>x&#32;y<svg><linearGradient id='g'></linearGradient></svg><!-- ok --></section>"
        self.assertEqual(bind_assets(source, {}), source)

    def test_svg_background_data_uri_is_supported(self):
        uri = "data:image/svg+xml;base64," + base64.b64encode(SVG.encode()).decode()
        attrs = Tags(
            bind_assets('<div data-story-background="motif"></div>', {"motif": {"data_uri": uri}})
        ).tags[0][1]
        self.assertEqual(attrs["style"], f'background-image: url("{uri}");')

    def test_missing_asset_is_actionable_error(self):
        with self.assertRaisesRegex(ValueError, "Unresolved asset 'absent'.*fallback"):
            bind_assets('<img data-story-image="absent">', {})

    def test_conflicting_or_invalid_bindings_fail(self):
        for fragment in [
            '<div data-story-background="a" style="opacity:0"></div>',
            '<div data-story-image="a"></div>',
            '<img data-story-image="a" src="stale.png">',
            '<img data-story-image="a" srcset="stale.png 2x">',
            '<img data-story-image="a" data-story-background="a">',
            '<img data-story-image="a" data-story-image="a">',
            '<img data-story-background="a">',
        ]:
            with self.subTest(fragment=fragment), self.assertRaises(ValueError):
                bind_assets(fragment, {"a": {"data_uri": PNG}})

    def test_nonempty_or_invalid_inline_container_fails(self):
        for fragment in [
            '<div data-story-inline="a">placeholder</div>',
            '<div data-story-inline="a"><span></span></div>',
            '<div data-story-inline="a"/>',
            '<div data-story-inline="a">',
        ]:
            with self.subTest(fragment=fragment), self.assertRaises(ValueError):
                bind_assets(fragment, {"a": {"inline_markup": SVG}})

    def test_wrong_payload_and_remote_url_fail(self):
        for asset in [
            {"inline_markup": SVG},
            {"data_uri": "https://example.org/a.png"},
            {"data_uri": "data:image/png;base64,A"},
        ]:
            with self.subTest(asset=asset), self.assertRaises(ValueError):
                bind_assets('<img data-story-image="a">', {"a": asset})

    def test_body_cannot_replace_shell_or_runtime(self):
        for fragment in [
            "<script>alert(1)</script>",
            "<html></html>",
            "<style>p{}</style>",
            '<link href="x.css">',
        ]:
            with self.subTest(fragment=fragment), self.assertRaises(ValueError):
                bind_assets(fragment, {})

    def test_config_rejects_typos_and_invalid_modes(self):
        for target, config in [
            ("html", {}),
            ("html", {"title": "x", "presentation_mode": "unknown"}),
            ("ppt", {"title": "x", "deck_axis": "diagonal"}),
            ("html", {"title": 3}),
            ("html", {"title": "x", "script": "evil.js"}),
        ]:
            with self.subTest(config=config), self.assertRaises(ValueError):
                validate_config(config, target)

    def test_cli_builds_html_and_ppt_from_fragment_and_config(self):
        for target in ["html", "ppt"]:
            with self.subTest(target=target), tempfile.TemporaryDirectory() as directory:
                runtime = Path(directory)
                (runtime / "story-head.html").write_text("<style>body{color:black}</style>")
                (runtime / "spec_map.json").write_text(
                    json.dumps({"safe": "</script><script>bad()</script>"})
                )
                (runtime / "resolved_asset_bindings.json").write_text(
                    json.dumps({"hero": {"data_uri": PNG}})
                )
                (runtime / "body.html").write_text(
                    '<section data-story-background="hero"><h1>A</h1></section>'
                )
                (runtime / "page.json").write_text(json.dumps({"title": "<A&B>", "lang": "en"}))
                output = runtime / "output.html"
                proc = subprocess.run(
                    [
                        sys.executable,
                        str(SCRIPTS / "compose_story.py"),
                        "--target",
                        target,
                        "--runtime-dir",
                        str(runtime),
                        "--body-file",
                        str(runtime / "body.html"),
                        "--config-file",
                        str(runtime / "page.json"),
                        "--output",
                        str(output),
                    ],
                    capture_output=True,
                    text=True,
                )
                self.assertEqual(proc.returncode, 0, proc.stderr)
                result = output.read_text()
                self.assertIn("<title>&lt;A&amp;B&gt;</title>", result)
                self.assertNotIn("</script><script>bad()", result)
                self.assertIn(
                    "https://unpkg.com/@visactor/vseed@0.6.5/dist/umd/index.js", result
                )
                self.assertLess(result.index("@visactor/vseed@"), result.index("@visactor/vchart@"))
                self.assertIn("initVSeedCharts();", result)
                self.assertIn(
                    "initStoryDeck();" if target == "ppt" else "initStoryMotion();", result
                )
                attrs = next(
                    attrs for tag, attrs in Tags(result).tags if attrs.get("data-story-background")
                )
                self.assertEqual(attrs["style"], f'background-image: url("{PNG}");')

    def test_failure_does_not_overwrite_existing_output(self):
        with tempfile.TemporaryDirectory() as directory:
            runtime = Path(directory)
            output = runtime / "output.html"
            output.write_text("previous")
            (runtime / "page.json").write_text('{"title":"Test"}')
            with self.assertRaises(FileNotFoundError):
                compose_story(
                    target="html",
                    runtime_dir=runtime,
                    body_file=runtime / "body.html",
                    config_file=runtime / "page.json",
                    output=output,
                )
            self.assertEqual(output.read_text(), "previous")


if __name__ == "__main__":
    unittest.main()
