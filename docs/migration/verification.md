# Initial migration verification

For the subsequent 32-case VChart catalog and core-run outcomes, see [case expansion](vchart-case-expansion.md). This document preserves the initial six-case evidence.

Verified on 2026-09-18 on `codex/migrate-chart-table-skills`, based on `origin/develop` at `e9b05dfb5d9fd42b1a56724682810e5597eaa22e`. No commit or publication was performed.

## Deterministic checks

- `uv run pytest tests -q`: **56 passed**. Covers output paths, portable installation into a separate directory, bundled keyword retrieval, runner isolation, failure/timeout logging and credential redaction.
- `uv run ruff check skills tests evals/scripts`: passed.
- `git diff --check`: passed.
- Local Markdown link audit: no missing file targets in either skill. Five previously missing VChart SOP resources were restored from source history; provenance records the revision.
- Public runtime scan found no personal filesystem paths or the former internal CDN/service addresses. Templates now use pinned public npm CDN URLs.
- Each accepted run's installed runtime file hashes match the final migrated skill files.

## Fixed tasks

The installed Codex CLI `0.155.0-alpha.9` executed each task in a separate workspace with only its selected skill and synthetic inputs copied in. Existing user Agent configuration supplied model access; the exact resolved model was not independently recorded. Playwright 1.61.1 / Chromium performed browser checks. These runs establish a working path for this host, not compatibility with every Agent.

| Task | Browser/data evidence | Screenshot review |
| --- | --- | --- |
| VChart grouped bars | Six input rows retained; renders without page/network errors | Six correct values, region groups, quarter legend and labels |
| VChart diagnosis | Repair HTML renders without page/network errors | Field mismatch explained; East=120 and West=80 restored |
| VTable list | Six input rows retained; separate screenshot-guided sort-icon click yielded 80,90,100,110,120,150 | Records and sorted display inspected |
| VTable pivot | Six input rows retained; renders without page/network errors | Region rows, quarter columns and all six aggregate values inspected |
| VTable filter | Actual Q1, Q2 and all selections checked against runtime records | Initial/all and Q2 displays inspected |
| VTable diagnosis | Repair HTML renders without page/network errors | Correct explanation and two repaired records; default narrow Region header is abbreviated |

Local evidence is deliberately gitignored:

- `evals/runs/20260918T063829Z-b2632ec7/`: initial six tasks; the four VTable runs are the accepted final-runtime evidence.
- `evals/runs/20260918T064801Z-b5362456/`: both VChart tasks rerun after restoring the missing SOP resources; these are the accepted VChart runs.
- Each case retains prompt, copied inputs/runtime, hashes, public Agent events, stderr, execution outcome, final response, source/HTML, browser report and screenshots. Accepted cases also have `review.json` with reviewer notes and artifact/screenshot hashes.
- The list case's browser report includes a supplementary sort-icon click. An initial generic right-edge header click did not sort because it missed the icon; the output required no change. The fixed runner leaves screenshot-guided sorting in its review checklist rather than baking generated-layout coordinates into the shared checker.

Automated `result.json` retains `needs-review`; the separate `review.json` records the actual screenshot review instead of silently changing the historical automated result.

## Limits and follow-up scope

- No pixel-baseline comparison or visual-model scoring is included. Canvas nonblank checks alone do not establish a correct chart; diagnostic cases depend on visual inspection of the repaired example.
- Image replication, React workflows, pivot charts and multi-turn edits are retained but were not exercised end to end in this initial six-case set.
- Local keyword search replaces hosted semantic retrieval; ranking is not claimed to be equivalent.
- HTML requires internet access to public CDN assets. This migration does not provide an offline bundle.
- Process logs contain only what the host Agent exposes, with best-effort credential redaction. Existing user plugins/configuration can remain available; workspace isolation is not a hermetic environment or security sandbox.
- The system npm Codex wrapper was killed during version preflight on this machine. The working bundled Codex executable was selected with `--agent`; the global installation was not modified.
- Historical ignored build directories and the user's local editor configuration were preserved on disk, excluded from the new library. The old tracked SDK/build/release tree is removed while Git ancestry and LICENSE remain.
- Internal VAgent consumer switching, commits, pushing, repository renaming and publication are outside this migration.
