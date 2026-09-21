# VTable evaluation cases

[English](README.md) | [简体中文](README.zh-CN.md)

[All Skill catalogs](../README.md)

Four fixed tasks cover list tables, pivot tables, filtering and field diagnosis. All belong to this Skill's core group. `tasks.json` defines tasks, `inputs/` holds fixtures, and `expectations.json` defines checks and review criteria.

## Run

Configure the environment and model using the [evaluation guide](../../README.md), then run from the repository root:

```bash
uv run python evals/scripts/run.py --skill vtable-development-assistant --group all --list
uv run python evals/scripts/run.py --skill vtable-development-assistant --case vtable-list --browser
uv run python evals/scripts/run.py --skill vtable-development-assistant --group core --browser
```

## Core cases (core)

| Case | Focus | Acceptance |
| --- | --- | --- |
| vtable-list | List table, complete records and sorting | Preserve all six records; clicking the sales header sorts them. |
| vtable-pivot | Row/column dimensions and aggregation | East:120/150, West:80/90, North:100/110; correct region and quarter orientation. |
| vtable-filter | Actual data updates and restoration after filtering | Switch Q1, Q2 and all; displayed records and values update accordingly. |
| vtable-diagnosis | Diagnose and repair field mapping | Explain the mismatch between column field and record; the repaired table shows East=120 and West=80. |

## Review results

Automated checks cover execution and artifacts. With `--browser`, they check browser errors, nonblank canvas and applicable runtime records. The filter task actually switches Q1, Q2 and all and verifies the records. Sorting, pivot dimensions and aggregates, and the diagnosis explanation still require review against the table.

Screenshots preserve evidence; there is no fixed full-page image comparison or automated model rating of the whole page. Unspecified layout and colors may differ. Check required data, behavior and readability. Automated success leaves the case at `needs-review`; see [logging and review](../../README.md#logs).

Inputs are synthetic and their hashes are in `fixtures.json`. Expected answers are hidden from the tested Agent. Add tasks for new capabilities or failure modes and update both language guides.
