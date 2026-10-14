"""Numeric-scale contracts; independent of narrative wording and field names."""

import unittest
from copy import deepcopy

from local_chart_specs import assemble_local_specs


def assemble(chart_type, measures, **config):
    horizontal = chart_type.startswith("bar")
    dimensions = [{"id": "category", "encoding": "yAxis" if horizontal else "xAxis"}]
    spec = {"chartType": chart_type, "dimensions": dimensions, "measures": measures, **config}
    request = {
        "chartId": "chart",
        "datasetRef": "data",
        "annotations": [],
        "contract": {"chart_type": chart_type, "dimensions": dimensions, "measures": measures},
    }
    data = [{"category": "A", **{m["id"]: 0.5 for m in measures}}]
    return assemble_local_specs([request], {"data": data}, {"chart": spec})["chart"]["spec"]


class NumericScaleTests(unittest.TestCase):
    def test_percent_axes_do_not_inherit_raw_measure_formats(self):
        for chart, axis in [("columnPercent", "yAxis"), ("barPercent", "xAxis")]:
            with self.subTest(chart=chart):
                fmt = {"type": "number", "fractionDigits": 0, "suffix": " units"}
                result = assemble(chart, [{"id": "value", "encoding": axis, "numFormat": fmt}])
                self.assertNotIn(axis, result)
                self.assertEqual(result["measures"][0]["numFormat"], fmt)

    def test_rejects_explicit_wrong_percent_axis_format(self):
        for chart, axis in [("columnPercent", "yAxis"), ("barPercent", "xAxis")]:
            for fmt in [
                {"type": "number", "suffix": "%"},
                {"type": "number"},
                {"type": "percent", "ratio": 100},
            ]:
                with (
                    self.subTest(chart=chart, fmt=fmt),
                    self.assertRaisesRegex(ValueError, "normalized 0..1"),
                ):
                    assemble(
                        chart,
                        [{"id": "value", "encoding": axis}],
                        **{axis: {"autoFormat": False, "numFormat": fmt}},
                    )

    def test_accepts_explicit_percent_precision(self):
        axis = {"autoFormat": False, "numFormat": {"type": "percent", "fractionDigits": 0}}
        self.assertEqual(
            assemble("columnPercent", [{"id": "value", "encoding": "yAxis"}], yAxis=axis)["yAxis"],
            axis,
        )

    def test_warns_without_mutating_data_for_mixed_display_conventions(self):
        for chart, axis in [
            ("barParallel", "xAxis"),
            ("columnParallel", "yAxis"),
            ("line", "yAxis"),
        ]:
            for rate in [{"type": "percent"}, {"type": "number", "suffix": "%"}]:
                with (
                    self.subTest(chart=chart, rate=rate),
                    self.assertLogs("local_chart_specs", level="WARNING") as logs,
                ):
                    result = assemble(
                        chart,
                        [
                            {"id": "a", "encoding": axis, "numFormat": {"type": "number"}},
                            {"id": "b", "encoding": axis, "numFormat": rate},
                        ],
                    )
                    self.assertEqual(result["dataset"][0], {"category": "A", "a": 0.5, "b": 0.5})
                    self.assertEqual(result["measures"][1]["numFormat"], rate)
                self.assertTrue(any("SHARED_AXIS_FORMAT_MISMATCH" in line for line in logs.output))

    def test_accepts_independent_axes(self):
        measures = [
            {"id": "a", "encoding": "primaryYAxis", "numFormat": {"type": "number"}},
            {"id": "b", "encoding": "secondaryYAxis", "numFormat": {"type": "percent"}},
        ]
        with self.assertNoLogs("local_chart_specs", level="WARNING"):
            result = assemble("dualAxis", deepcopy(measures))
        self.assertEqual(result["secondaryYAxis"]["numFormat"], measures[1]["numFormat"])

    def test_accepts_common_units_and_does_not_guess_missing_formats(self):
        for formats in [
            [{"type": "number"}, {"type": "number"}],
            [{"type": "percent"}, {"type": "percent"}],
            [None, {"type": "percent"}],
        ]:
            with self.subTest(formats=formats):
                measures = [
                    {"id": str(i), "encoding": "yAxis", **({"numFormat": f} if f else {})}
                    for i, f in enumerate(formats)
                ]
                with self.assertNoLogs("local_chart_specs", level="WARNING"):
                    self.assertEqual(len(assemble("line", measures)["measures"]), 2)


if __name__ == "__main__":
    unittest.main()
