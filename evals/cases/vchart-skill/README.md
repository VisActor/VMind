# VChart evaluation cases

[English](README.md) | [简体中文](README.zh-CN.md)

[All Skill catalogs](../README.md)

These 32 fixed VChart tasks cover chart generation, diagnosis, data handling, interaction and successive edits. Each has a fixed prompt, inputs and acceptance criteria for targeted regression checks after Skill changes.

## Choose and run cases

| Group | Cases | When to use it |
| --- | --- | --- |
| `core` | 8 | Common capabilities: grouping, stacking, percentages, nulls, diagnosis, answers, clarification and successive edits. |
| `extended` | 24 | Target additional chart types, axes, layout, interactions, React and image replication affected by your change. |

Configure the environment and model using the [evaluation guide](../../README.md), then run from the repository root:

```bash
uv run python evals/scripts/run.py --skill vchart-skill --group all --list
uv run python evals/scripts/run.py --skill vchart-skill --case vchart-grouped --browser
uv run python evals/scripts/run.py --skill vchart-skill --group core --browser
uv run python evals/scripts/run.py --skill vchart-skill --group extended --list
```

`--list` lists tasks without calling a model. Repeat `--case` to select several cases; `--skill vchart-skill --group all` selects all 32 tasks for this Skill. With this Skill selected and no case or group selection, the default is core. Start with one case and inspect its results and usage before expanding the run.

The continuation case in core has three independent Agent invocations, so the group contains ten task turns. Each turn may involve multiple model API requests.

## Core cases (core)

| Case | Focus | Acceptance |
| --- | --- | --- |
| vchart-grouped | Generate a chart from complete grouped data. | Six bars with correct grouping, legend and value labels; no occlusion. |
| vchart-diagnosis | Diagnose and repair mismatched fields. | Explain the field mismatch and render the repaired chart with East=120 and West=80. |
| vchart-stack | Protect additive stacking, distinct from grouped bars. | Totals: East=270, West=170, North=210; stack the two quarters within each region. |
| vchart-percent | Protect normalization denominator and percentage axis. | Each region totals 100%; Q1 shares are 120/270, 80/170 and 100/210. Do not label amounts as percentages. |
| vchart-line-null | Distinguish missing values from zero. | Feb remains missing and breaks the line; preserve Mar=0, Jan=10 and Apr=20. |
| vchart-qa-label | Protect explanation-only routing. | Explain valid label visibility configuration, optionally position/style; no invented API or unnecessary spec request; outputs stays empty. |
| vchart-missing-data | Protect missing-input clarification. | Ask for the year, revenue data and necessary definitions; invent no company facts and produce no artifacts. |
| vchart-edit | Protect file-based successive edits and preservation. | Three turns: generate, change only the title, then only the color; preserve data, labels, unrelated settings and earlier snapshots. |

## Extended cases (extended)

| Case | Focus | Acceptance |
| --- | --- | --- |
| vchart-line | Protect series grouping and chronological order. | Two lines with three points each, in order, with no cross-series connections. |
| vchart-area-stack | Protect filled stacked boundaries. | Totals: Jan=18, Feb=32, Mar=33; correct stacked boundaries rather than overlapping series. |
| vchart-pie | Protect angular encoding and label layout. | A/B/C/D represent 40/30/20/10%; labels neither overlap nor clip. |
| vchart-scatter | Protect two quantitative axes. | A(1,4), B(2,2), C(3,5), D(4,1); use quantitative axes, not equally spaced categories. |
| vchart-heatmap | Protect rectangular data and zero-valued cells. | All four cells (10, 0, 20, 5) exist; color encodes value and the zero cell remains visible. |
| vchart-radar | Protect polar encoding and shared scale. | Five dimensions show 80/60/40/90/70 on a shared scale, without independent normalization. |
| vchart-funnel | Protect ordered conversion stages. | Stages follow 1000/600/300/100 with decreasing widths and complete labels. |
| vchart-dual-axis | Protect mixed units and per-series axis binding. | Revenue is 100/120/90/150 and gross margin is 20/25/10/30%; bind each series to its correct axis. |
| vchart-negative | Protect sign and zero baseline. | A=-20, B=0, C=30, D=-5; positive and negative values lie on opposite sides of zero. |
| vchart-long-labels | Protect long label layout without dropping meaning. | Three complete Chinese labels remain readable without overlap or clipping; values are 120/80/100. |
| vchart-legend | Protect actual interactive visibility, not presence of legend config. | Click Online in the legend: Online hides while Store remains; click again to restore it. |
| vchart-tooltip | Protect displayed datum binding and formatter. | Hover over different bars: tooltips show the correct region, quarter, amount and unit. |
| vchart-zoom | Protect viewport filtering without data truncation. | Keep all 40 source rows; initially show about ten days, then drag to reach day 40. |
| vchart-reference-line | Protect aggregation and coordinate-space annotation. | Totals are 270/170/210; the reference line is at 200 and both line and annotation are readable. |
| vchart-empty-data | Protect empty dataset semantics. | Explain that zero records cannot establish a trend; do not infer zero revenue or generate artifacts. |
| vchart-chinese-fields | Protect Unicode and punctuation in field names. | Hangzhou=90, Nanjing=70, Shanghai=120; preserve field names and the unit of ten thousand yuan. |
| vchart-complete-data | Protect complete input reading beyond preview length. | Preserve all 40 records and points, including day 40=120; do not invent rows from a preview. |
| vchart-react | Protect declarative React workflow. | Render through a React component in the browser; values are 40/30/20/10, no console errors, and JSX matches HTML. |
| vchart-image-replication | Protect image-driven extraction and reconstruction. | Review beside the reference: Quarterly sales, Q1/Q2/Q3, 40/70/55, blue bars and a zero baseline; do not substitute the screenshot as a background. |
| vchart-format | Protect consistent fraction-to-percent formatting. | Show 20%, 25%, 10%, 30%; neither 0.2% nor double multiplication. |
| vchart-numeric-sort | Protect numeric order versus lexical order. | Order: Two=2, Ten=10, Twenty=20, Hundred=100; use numeric, not lexical sorting. |
| vchart-bubble | Protect third quantitative channel distinct from scatter. | Four correct coordinates; sizes increase monotonically with 10/20/40/80. |
| vchart-step-line | Protect interpolation semantics and deliberate filtering. | Jan=10, Feb=20, Mar=15; only the three Online points, connected as a step line. |
| vchart-log-axis | Protect nonlinear axis geometry. | 1, 10, 100, 1000 are equally spaced vertically; correct ticks/data and no invalid log(0). |

## Review results

Reports distinguish automated checks from human review. Passing automated checks leaves a case at `needs-review`. The tables above are review checklists, not a claim that every criterion is checked automatically.

- **HTML tasks**: check artifacts; with `--browser`, inspect browser errors, nonblank canvas, screenshots and applicable runtime records. Review source, runtime configuration and visual output against the table.
- **Answer tasks**: automated checks require a nonempty final response and no output files. Review API correctness, clarification and factual accuracy separately.
- **Interactive tasks**: click, hover or drag the actual output and record observations. Configuration alone does not establish success.
- **Image replication and React**: compare the output beside the reference PNG; there is no automated pixel-similarity threshold. Verify that React tasks actually render through a React component.
- **Successive edits**: each turn copies prior files into a new workspace and preserves separate logs and snapshots. A failed turn blocks later turns. Besides checking for file changes, compare configurations and previews to verify preservation of unrelated content. This tests file-based editing, not host conversation memory.

Save review conclusions and artifact hashes as described in the [evaluation guide](../../README.md#logs). Mark unexecuted cases `not-run`; the catalog is not a record of passing results.

## Data and case maintenance

- `tasks.json` defines prompts and input files; `expectations.json` defines checks. Expected answers are not copied into the Agent workspace.
- Tabular and JSON inputs are synthetic. The image task uses the bundled `reference-bars.png`, generated from `reference-bars.svg`; both are covered by the repository MIT license.
- Add cases to cover new capabilities or failure modes, with publicly shareable inputs and reviewable acceptance criteria.
- Retain failing cases and execution evidence. Fix incorrect fixtures or checkers separately from Skill changes.
