# Data storytelling cases

[English](README.md) | [简体中文](README.zh-CN.md)

Small synthetic inputs cover different narrative, chart and asset workflows. Multiple correct texts, styles and chapter layouts are accepted; matching a reference page is not required.

| Case | Group | Core review |
| --- | --- | --- |
| story-retention-html | core | Percentage points, segment differences, facts versus hypotheses |
| story-regional-scrolly | core | One chart changes with reading steps; share definitions |
| story-retention-deck | core | Chart evidence, keyboard navigation, closing judgment |
| story-supply-assets | extended | Declared SVG assets, normalization, binding and visibility |
| story-vegas-feature | extended | Synthetic-data label, feature presentation, image or explicit fallback |

Fixed prompts are in tasks.json and data in inputs/. expectations.json stays hidden from the agent; fixtures.json records input hashes. Completed plans, insight answers and reference outputs are not supplied.

```bash
uv run python evals/scripts/run.py --skill data-storytelling --group all --list
```

Use the prompts and inputs with Codex or Claude Code for end-to-end review; the current API harness is not recommended for a full story run. See the [evaluation guide](../../README.md) for its limits and the recorded attempt. Automated checks cover running artifacts, chart compilation and limited interactions. Review data accuracy, assets, scroll synchronization, readability and narrative against expectations.json manually. Screenshots are evidence, not pixel ground truth. A declared image fallback is valid; empty image frames or fabricated success are not.

The `story-retention-html` model run failed at its token budget; the other 4 tasks have not been run. Fixed-script browser smoke and model performance are recorded separately. Selection favors small independent tasks, excluding internal services, external dataset downloads and real-person imagery dependencies.
