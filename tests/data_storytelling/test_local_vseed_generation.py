"""Behavioral contracts for local-only story chart assembly."""

import json
import logging
import subprocess
import sys
import tempfile
import unittest
from copy import deepcopy
from pathlib import Path
from unittest.mock import patch

import assemble_story_specs as runtime
import validate_story_plan as plan_validator

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "skills/data-storytelling/scripts"

PLAN = """# Story Plan
## Story Meta
- **Style Preset**: Swiss Modern
## Chapter Outline
### Ch1
- **Pattern**: chart-narrative
- **Evidence**:
  - refs: [`trend`]
- **Charts**:
  - `trend-chart`
    - role: primary
    - dataRef: `trend`
    - renderer: standard-chart
    - chartType: line
    - dimensions:
      - id: month
        encoding: xAxis
        alias: 月份
    - measures:
      - id: rate
        encoding: yAxis
        alias: 比率
        numformat: 转成百分比，保留一位小数
    - annotationList:
      - type: point
        target:
          month: Jun
          measureId: rate
        text: 转折点
"""
DATA = {"trend": [{"month": "May", "rate": 0.2}, {"month": "Jun", "rate": 0.4}]}
SPEC = {
    "chartType": "line",
    "dimensions": [{"id": "month", "encoding": "xAxis"}],
    "measures": [
        {"id": "rate", "encoding": "yAxis", "numFormat": {"type": "percent", "fractionDigits": 1}}
    ],
    "annotationPoint": [{"selector": {"month": "Jun"}, "measureId": "rate", "text": "转折点"}],
}


class LocalVSeedTests(unittest.TestCase):
    def assemble(self, plan=PLAN, data=None, specs=None):
        return runtime.assemble_story_specs(
            plan,
            deepcopy(DATA if data is None else data),
            deepcopy({"trend-chart": SPEC} if specs is None else specs),
        )

    def test_assembly_is_network_independent(self):
        with patch("urllib.request.urlopen", side_effect=AssertionError("network")):
            self.assertEqual(self.assemble()["trend-chart"]["spec"]["dataset"], DATA["trend"])

    def test_input_data_and_config_are_not_mutated(self):
        data, specs = deepcopy(DATA), {"trend-chart": deepcopy(SPEC)}
        runtime.assemble_story_specs(PLAN, data, specs)
        self.assertEqual((data, specs), (DATA, {"trend-chart": SPEC}))

    def test_point_annotation_is_preserved(self):
        self.assertEqual(
            self.assemble()["trend-chart"]["spec"]["annotationPoint"], SPEC["annotationPoint"]
        )

    def test_metadata_and_number_format_are_applied(self):
        entry = self.assemble()["trend-chart"]
        self.assertEqual(
            (
                entry["theme"],
                entry["spec"]["dimensions"][0]["alias"],
                entry["spec"]["yAxis"]["numFormat"],
            ),
            ("swiss-modern", "月份", SPEC["measures"][0]["numFormat"]),
        )

    def test_missing_or_extra_chart_config_is_an_error(self):
        for specs in ({}, {"trend-chart": SPEC, "unused": SPEC}):
            with (
                self.subTest(specs=list(specs)),
                self.assertRaisesRegex(ValueError, "coverage mismatch"),
            ):
                self.assemble(specs=specs)

    def test_rejects_mapping_drift(self):
        spec = deepcopy(SPEC)
        spec["dimensions"][0]["encoding"] = "color"
        with self.assertRaisesRegex(ValueError, "preserve planned field"):
            self.assemble(specs={"trend-chart": spec})

    def test_rejects_embedded_dataset(self):
        with self.assertRaisesRegex(ValueError, "without dataset"):
            self.assemble(specs={"trend-chart": {**SPEC, "dataset": DATA["trend"]}})

    def test_missing_annotations_warn_without_blocking_or_inventing_annotations(self):
        spec = {key: value for key, value in SPEC.items() if key != "annotationPoint"}
        for missing_spec in (spec, {**spec, "annotationPoint": []}):
            with self.subTest(spec=missing_spec):
                with self.assertLogs("local_chart_specs", level="WARNING") as logs:
                    result = self.assemble(specs={"trend-chart": missing_spec})
                self.assertEqual(result["trend-chart"]["spec"]["dataset"], DATA["trend"])
                self.assertFalse(result["trend-chart"]["spec"].get("annotationPoint"))
                record = logs.records[0]
                self.assertEqual(
                    (
                        record.levelno,
                        record.code,
                        record.chart_id,
                        record.annotation_type,
                        record.expected,
                        record.actual,
                    ),
                    (logging.WARNING, "ANNOTATION_MISSING", "trend-chart", "point", 1, 0),
                )

    def test_present_point_does_not_hide_missing_area_annotation(self):
        plan = (
            PLAN
            + """      - type: area
        target:
          xStart: May
          xEnd: Jun
        text: 两个月
"""
        )
        with self.assertLogs("local_chart_specs", level="WARNING") as logs:
            result = self.assemble(plan=plan)
        self.assertEqual(
            [(r.annotation_type, r.expected, r.actual) for r in logs.records], [("area", 1, 0)]
        )
        self.assertEqual(result["trend-chart"]["spec"]["annotationPoint"], SPEC["annotationPoint"])

    def test_insufficient_annotation_count_warns(self):
        plan = (
            PLAN
            + """      - type: point
        target:
          month: May
          measureId: rate
        text: 起点
"""
        )
        with self.assertLogs("local_chart_specs", level="WARNING") as logs:
            self.assemble(plan=plan)
        self.assertEqual(
            [(r.annotation_type, r.expected, r.actual) for r in logs.records], [("point", 2, 1)]
        )

    def test_complete_or_unrequested_annotations_do_not_warn(self):
        without_annotations = PLAN.split("    - annotationList:")[0]
        baseline = {key: value for key, value in SPEC.items() if key != "annotationPoint"}
        with self.assertNoLogs("local_chart_specs", level="WARNING"):
            self.assemble()
            self.assemble(
                specs={"trend-chart": {**SPEC, "annotationPoint": SPEC["annotationPoint"][0]}}
            )
            self.assemble(plan=without_annotations, specs={"trend-chart": baseline})

    def test_missing_line_and_difference_annotations_each_warn(self):
        plan = (
            PLAN
            + """      - type: line
        target:
          y: 0.3
        text: 阈值
      - type: difference
        start:
          month: May
        end:
          month: Jun
        differenceType: absolute
"""
        )
        with self.assertLogs("local_chart_specs", level="WARNING") as logs:
            self.assemble(plan=plan)
        self.assertEqual(
            [(r.annotation_type, r.expected, r.actual) for r in logs.records],
            [("line", 1, 0), ("difference", 1, 0)],
        )

    def test_malformed_annotation_containers_remain_errors(self):
        keys = (
            "annotationPoint",
            "annotationArea",
            "annotationHorizontalLine",
            "annotationVerticalLine",
            "annotationDifferenceLine",
        )
        for key in keys:
            for invalid in ("invalid", 3, [None], ["invalid"]):
                with (
                    self.subTest(key=key, invalid=invalid),
                    self.assertRaisesRegex(ValueError, "annotation.*object"),
                ):
                    self.assemble(specs={"trend-chart": {**SPEC, key: invalid}})

    def test_malformed_difference_anchors_and_labels_remain_errors(self):
        valid = {"start": {"selector": {"month": "May"}}, "end": {"selector": {"month": "Jun"}}}
        for invalid in (
            {"start": valid["start"]},
            {**valid, "text": "invented"},
            {**valid, "label": "invented"},
        ):
            with (
                self.subTest(invalid=invalid),
                self.assertRaisesRegex(ValueError, "Difference annotation"),
            ):
                self.assemble(
                    specs={"trend-chart": {**SPEC, "annotationDifferenceLine": [invalid]}}
                )

    def test_rejects_missing_highlight(self):
        with self.assertRaisesRegex(ValueError, "Missing planned highlight"):
            self.assemble(plan=PLAN + "    - highlightDesc: 突出 rate 系列\n")

    def test_rejects_dynamic_code_filters(self):
        with self.assertRaisesRegex(ValueError, "dynamic filters"):
            self.assemble(
                specs={"trend-chart": {**SPEC, "lineStyle": {"dynamicFilter": "() => true"}}}
            )

    def test_rejects_duplicate_mark_grain(self):
        with self.assertRaisesRegex(ValueError, "grain"):
            self.assemble(data={"trend": DATA["trend"] * 2})

    def test_scrolly_steps_use_own_data_and_complete_annotation_state(self):
        plan = PLAN.replace("chart-narrative", "scrollytelling").replace(
            "- **Charts**:",
            """- **Steps**:
  - Step 1:
    - title: 关键点
    - annotationList:
      - type: point
        target:
          month: Jun
          measureId: rate
        text: 转折点
  - Step 2:
    - title: 查看五月
    - dataRef: `early`
- **Charts**:""",
        )
        baseline = {key: value for key, value in SPEC.items() if key != "annotationPoint"}
        specs = {"trend-chart__step0": SPEC, "trend-chart__step1": baseline}
        result = self.assemble(plan=plan, data={**DATA, "early": DATA["trend"][:1]}, specs=specs)
        self.assertEqual(
            [
                (step["dataset"], step.get("annotationPoint", []))
                for step in result["trend-chart"]["steps"]
            ],
            [(DATA["trend"], SPEC["annotationPoint"]), (DATA["trend"][:1], [])],
        )

        with self.assertLogs("local_chart_specs", level="WARNING") as logs:
            result = self.assemble(
                plan=plan,
                data={**DATA, "early": DATA["trend"][:1]},
                specs={"trend-chart__step0": baseline, "trend-chart__step1": baseline},
            )
        self.assertEqual([r.chart_id for r in logs.records], ["trend-chart__step0"])
        self.assertEqual(len(result["trend-chart"]["steps"]), 2)

    def test_dual_axis_titles_do_not_erase_generated_axis_formats(self):
        spec = {
            "chartType": "dualAxis",
            "primaryYAxis": {"autoFormat": False, "numFormat": {"type": "percent"}},
        }
        result = runtime.inject_local_owned_metadata(
            spec, {"axis_titles": {"primaryYAxis": "比率", "secondaryYAxis": "金额"}}
        )
        self.assertEqual(result["primaryYAxis"]["numFormat"], {"type": "percent"})

    def test_no_charts_produces_empty_map(self):
        self.assertEqual(self.assemble(plan=PLAN.split("## Chapter Outline")[0], specs={}), {})

    def test_chart_ids_are_required_even_next_to_a_valid_chart(self):
        chart_block = PLAN.split("- **Charts**:\n")[1]
        for header in ("  - ``", "  - ` `", "  - id:", "  - id: ''", "  - role: supporting", "  -"):
            for prefix in (PLAN.split("- **Charts**:\n")[0] + "- **Charts**:\n", PLAN):
                plan = prefix + chart_block.replace("  - `trend-chart`", header)
                with self.subTest(header=header, with_valid_chart=prefix == PLAN):
                    self.assertTrue(plan_validator.collect_plan_structure_errors(plan))
                    with self.assertRaisesRegex(ValueError, "Chart.*id"):
                        self.assemble(plan=plan)

    def test_chart_ids_must_be_unique_across_chapters_and_header_forms(self):
        for header in ("  - `trend-chart`", "  - id: trend-chart", "  - id: `trend-chart`"):
            second_chapter = "### Ch2\n" + PLAN.split("### Ch1\n")[1].replace(
                "  - `trend-chart`", header
            )
            with self.subTest(header=header):
                with self.assertRaisesRegex(ValueError, "must be unique"):
                    self.assemble(plan=PLAN + second_chapter)

    def test_mixed_chart_header_forms_preserve_both_charts(self):
        second_chart = PLAN.split("- **Charts**:\n")[1].replace(
            "  - `trend-chart`", "  - id: other-chart"
        )
        plan = PLAN + second_chart
        result = self.assemble(plan=plan, specs={"trend-chart": SPEC, "other-chart": SPEC})
        self.assertEqual(list(result), ["trend-chart", "other-chart"])
        self.assertEqual(list(runtime.build_chart_contract_index(plan)), list(result))

    def test_unparseable_charts_block_is_rejected_by_plan_validation(self):
        for block in ("    - `trend-chart`\n", "  chart without a list header\n"):
            with self.subTest(block=block):
                plan = PLAN.split("- **Charts**:\n")[0] + "- **Charts**:\n" + block
                self.assertTrue(plan_validator.collect_plan_structure_errors(plan))

    def test_plan_validator_reports_invalid_chart_id_as_json(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "plan.md"
            path.write_text(PLAN.replace("  - `trend-chart`", "  - ``"), encoding="utf-8")
            result = subprocess.run(
                [
                    sys.executable,
                    str(SCRIPTS / "validate_story_plan.py"),
                    "--plan-file",
                    str(path),
                    "--format",
                    "json",
                ],
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 1, result.stderr)
            self.assertFalse(json.loads(result.stdout)["valid"])

    def test_cli_requires_local_configs_before_writing_output(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            (path / "plan.md").write_text(PLAN, encoding="utf-8")
            (path / "data.json").write_text(json.dumps(DATA), encoding="utf-8")
            command = [
                sys.executable,
                str(SCRIPTS / "assemble_story_specs.py"),
                "--plan-file",
                str(path / "plan.md"),
                "--dataset-json",
                str(path / "data.json"),
                "--output",
                str(path / "output.json"),
            ]
            missing = subprocess.run(command, capture_output=True, text=True)
            self.assertNotEqual(missing.returncode, 0)
            self.assertFalse((path / "output.json").exists())
            (path / "specs.json").write_text(json.dumps({"trend-chart": SPEC}), encoding="utf-8")
            success = subprocess.run(
                command + ["--specs-json", str(path / "specs.json")], capture_output=True, text=True
            )
            self.assertEqual(success.returncode, 0, success.stderr)
            self.assertIn("configs=1", success.stdout)

    def test_cli_missing_annotations_warns_on_stderr_and_writes_output(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            (path / "plan.md").write_text(PLAN, encoding="utf-8")
            (path / "data.json").write_text(json.dumps(DATA), encoding="utf-8")
            spec = {key: value for key, value in SPEC.items() if key != "annotationPoint"}
            (path / "specs.json").write_text(json.dumps({"trend-chart": spec}), encoding="utf-8")
            command = [
                sys.executable,
                str(SCRIPTS / "assemble_story_specs.py"),
                "--plan-file",
                str(path / "plan.md"),
                "--dataset-json",
                str(path / "data.json"),
                "--specs-json",
                str(path / "specs.json"),
                "--output",
                str(path / "output.json"),
            ]
            result = subprocess.run(command, capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn(
                "WARNING ANNOTATION_MISSING chart=trend-chart type=point expected=1 actual=0",
                result.stderr,
            )
            reference = "references/vseed-generation.md"
            self.assertIn(reference, result.stderr)
            self.assertTrue((SCRIPTS.parent / reference).is_file())
            self.assertEqual(
                json.loads((path / "output.json").read_text())["trend-chart"]["spec"]["dataset"],
                DATA["trend"],
            )


if __name__ == "__main__":
    unittest.main()
