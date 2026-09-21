# VChart case expansion — 2026-09-18

The first migrated six-case set established standalone execution but was too narrow to establish capability coverage. The expanded catalog selects 32 VChart tasks and preserves the 4 VTable tasks separately.

## Selection

- 24 tasks adapt named entries from the old 728-case blind pool.
- 2 adapt website regression intents (clarification and successive artifact edits), excluding website-only state/version selection.
- 2 preserve the previously reviewed grouped-bar and field-diagnosis baselines.
- 4 supplement empty inputs, Chinese fields, full input retention and image replication.
- One placeholder FAQ is excluded; 703 unselected pool entries remain deferred, not exhaustively reviewed or claimed redundant.
- [Coverage table](../../evals/cases/vchart-development-assistant/README.md), [source decisions](../../evals/cases/vchart-development-assistant/selection.json) and [fixture hashes](../../evals/cases/vchart-development-assistant/fixtures.json) are separate from Agent inputs.

## Runner scope

The existing Python script gained group selection, text-only acceptance, saved checker expectations and three successive filesystem-based turns. Each turn uses a fresh Agent invocation with a copy of the prior workspace; this does not test conversation history. No new Agent runtime, generic evaluator, service or product CLI was introduced.

The input image is a self-authored synthetic chart rasterized from the bundled SVG. Only the PNG is provided to its task. All other added data fixtures are synthetic. The extended group has definitions and review criteria; execution remains pending.

## Verification

- 61 deterministic tests passed, including local input completeness, catalog/expectation alignment, continuation snapshot preservation, no-op edit rejection and answer-only output constraints.
- Ruff checks and JavaScript syntax checks passed.
- New core execution evidence: `evals/runs/20260918T072831Z-e48b6216/`. Original grouped and diagnosis evidence remains in `evals/runs/20260918T064801Z-b5362456/` because their prompt/runtime did not change.
- Outcomes are recorded separately below after review. Browser success alone does not override a failed visual check.

## Checker correction

The first QA checklist unnecessarily required a formatting explanation although the fixed prompt asked only how to show values. The catalog checklist was corrected to require valid label visibility guidance and no unrequested files. The original run retains its initial expectations snapshot; review records the correction and assesses the unchanged answer. No model retry or runtime change was made for this correction.

## Known visual failure

`vchart-line-null` correctly preserves `null` versus zero and breaks the line, but the rendered month labels are partially clipped at the preview panel's bottom at 1440×1000. Nonblank-canvas and browser-error checks pass. Its separate review is **failed**, and the case and original artifacts remain. The failure is not suppressed by dropping the case, changing the viewport or manually editing the result. Runtime remediation is separate from this case-selection change.

## Reviewed outcomes

| Case | Outcome | Evidence |
| --- | --- | --- |
| Grouped bars | Passed, reused initial evidence | Unchanged task/runtime; earlier screenshot and record checks |
| Field diagnosis | Passed, reused initial evidence | Unchanged task/runtime; earlier source/repair screenshot |
| Additive stacking | Passed | Six records; totals 270/170/210 and segment values |
| Percentage stacking | Passed | Three 100% bars; Q1 44.4%/47.1%/47.6% |
| Null versus zero | **Visual failure** | Data and gap semantics correct; month labels clipped |
| Label explanation | Passed after documented checker correction | Valid label.visible guidance; no generated files |
| Missing data | Passed | Requests year/data/definition; no invented company figures or files |
| Three-turn file editing | Passed for scoped chart edits | Source changes only title, then color/fill; values and labels retained; previous output hashes unchanged |

Core summary: **7 passed, 1 visual failure** across 8 distinct tasks, including 2 unchanged prior baselines. The new run contains 6 distinct tasks / 8 Agent invocations. All browser/process checks passed; the visual failure remains separately recorded in review.json. Runtime skill and input hashes stayed unchanged in every new turn. The edit case's surrounding feature description still says blue columns after the color change; copy synchronization remains outside this narrow source/chart preservation check.

All **24 extended tasks remain not-run**. No claim of full VChart capability coverage or compatibility with other Agent hosts is made. No runtime skill changes, commits or publication were performed during this expansion.

## Archived source inventory

The original 728-case pool comprises 407 examples, 206 FAQs and 115 tutorials; overlapping subsets are not additive. The 12 legacy E2E definitions have unresolved inputCase references and empty image baselines, so they were not imported as runnable tests. The excluded FAQ is the 0-template placeholder. `evals/cases/vchart-development-assistant/selection.json` retains source IDs, original prompts, source document paths, adaptation decisions and deferred IDs. Original keyword assertions and private absolute paths are not part of task workspaces. No legacy screenshots with uncertain reuse rights were imported.

These are migration records. The public case guides describe current coverage, execution and acceptance without requiring familiarity with the source repository.
