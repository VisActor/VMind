# Data Storytelling migration

Status: migrated and locally verified on `codex/migrate-chart-table-skills`.

Source: `skills/data-storytelling` on the local `codex/data-storytelling-skills` branch, runtime commit `54e265131209a7210f45622711291c1a7a70dced`. The source runtime is clean. Tests adapted during the initial import included then-uncommitted source work; this refresh selectively carries the new VSeed runtime and CDN contracts. Current source governance edits remain out of scope, and source files remain untouched.

Scope:

- Copy the independently installable runtime, HTML/Web-PPT builders, local VSeed assembly and asset normalization. Exclude architecture history, testing guides and the internal evaluation framework.
- Use public pinned dependencies, host-provided image generation and file-based data handoff. Standard charts only; the private infographic dependency is not shipped.
- Preserve behavioral regressions; add representative synthetic-data cases under `evals/cases/data-storytelling`. Keep expected answers outside agent inputs.
- Extend the existing bounded API harness only for bundled story scripts. Keep logs and browser evidence; no model calls in CI.
- Verify isolated installation, deterministic chart assembly, HTML/Web-PPT rendering and existing chart/table behavior. Visual review remains separate from automated checks.

## Validation (2026-10-09)

- 216 Python tests and 69 subtests passed, including independently copied HTML/PPT builds through API tool dispatch, source dataset ownership, annotation warnings, asset binding and path confinement. Existing VChart/VTable regressions remain green.
- 29 Node tests passed: pinned VSeed compilation/annotation/encoding contracts and public dependency routing, including distinct VChart versions for standalone charts and stories.
- Ruff, Skill metadata validation, runtime relative links, JS syntax, public-registry lockfile and case discovery passed. Catalog now contains 41 tasks (32 VChart, 4 VTable, 5 storytelling).
- Fixed VChart/VTable browser checks passed in `.cache/story-migration/browser/`. Final story HTML and Web-PPT checks passed in `.cache/story-migration/browser-ready/`, using copied Skills and local pinned public npm assets. Graph compilation, nonblank chart rendering, page/resource errors and deck navigation were checked. Logs, generated files, specs and screenshots are retained. No model calls in smoke.
- Inspected HTML and deck screenshots. An earlier deck screenshot caught a transition before content became visible; the browser probe now waits for active-slide geometry and text/chart opacity before capture. These are technical smoke fixtures, not editorial-quality model outputs or pixel comparison targets.

The VSeed 0.6.5 refresh passed 100 targeted Python tests and 69 subtests, 44 published-package Node tests including numeric range geometry and invalid-axis guards, Ruff, `npm ci` against the public registry, and all four fixed browser smoke tasks (VChart, VTable, story HTML and story Web-PPT) under `.cache/story-refresh-vseed-065-20261009/`. This is deterministic runtime evidence; no new model run or editorial visual review was performed for the refresh.

Final local regression run on 2026-10-10 passed 217 Python tests and 69 subtests, 47 Node tests, and Ruff. It also corrected the copied-story API test's expected VSeed URL to 0.6.5. The fixed browser smoke was not repeated because its inputs did not change after the VSeed refresh run.

## Adaptations

- Runtime uses public unpkg URLs; removed the dormant private infographic renderer. Unsupported infographic entries fail explicitly. Story dependencies are VSeed 0.6.5 / VChart 2.1.7 / VTable 1.26.8 / GSAP 3.15.0. The older standalone-chart dependency stays pinned separately through an npm alias in evals.
- Synced upstream numeric `annotationArea.range` guidance from `54e265131`: linear-axis bands and scatter rectangles, percent-coordinate rules and decision quadrants. Kept the public-CDN adapter and updated the local npm pin and geometry regressions to VSeed 0.6.5. Source-only governance and generated reports remain excluded.
- Python scripts use local imports instead of source-checkout path injection. Data handoff is file-based, and authorized end-to-end requests need not stop for another plan confirmation.
- Asset lookups reject traversal and symlink escape. Included the upstream MIT license for bundled @chenglou/pretext 0.0.5.
- API tooling exposes only the listed bundled commands and declared input/output paths. It does not add shell execution, arbitrary Python, browser or image-generation tools.
- Selected 5 tasks from four small synthetic-data families, covering HTML, scrolly, Web-PPT, SVG assets and feature/image fallback. Excluded old infographic tasks, external-data reporting and platform-specific roadshow material. The same retention inputs deliberately exercise two build targets. Expected intermediates are explicitly listed; no standalone spec.js is required for stories.

## Limits

One live model case was attempted with `gpt-5.4-2026-03-05` using `evals/visactor.local.json`: `story-retention-html` failed at the configured 160,000-token limit after 5 requests (166,990 provider-reported tokens, zero cached tokens). Only `runtime/dataset_map.json` was produced; `plan.md` and HTML were not. Evidence: ignored `evals/runs/20261009T094650Z-99a5c791/`. The other four model cases remain not-run; no narrative-quality claim is implied. Browser smoke uses npm assets locally and does not establish CDN availability on every user's network. Public dependency assets were verified in the npm registry. The current API harness is not recommended for end-to-end story evaluation; raising the token budget alone does not address the growing context or limited tool environment. Direct Codex/Claude Code use remains recommended. No global Skill installation was performed during migration.

## PR review follow-up (2026-10-13)

- Address CodeQL's prototype-polluting-function review on `mergeThemeDefaults`: skip `__proto__`, `constructor` and `prototype` at each depth, and recurse only into the target's own nested objects. Normal theme overrides remain unchanged.
- Add eight regressions covering root/nested dangerous keys, ordinary overrides and inherited target objects. Seven fail against the previous implementation; all eight pass after the fix, within 55 passing Node tests. JavaScript syntax and diff whitespace checks passed.
- Copied-Skill browser smoke passed for story HTML, Web-PPT and VTable under `.cache/story-theme-pollution-fix-ready-20261013/`. The unchanged VChart probe initially sampled a blank canvas; rerunning its browser check on the same artifact passed. The original aggregate failure remains in the evidence rather than being rewritten. An earlier attempt could not launch because the local Playwright browser was missing; it was installed before verification.
- The migration was pushed to PR #299 and its checks passed at `5ff1d03`. The security fix `f9831e6` passed regressions and CodeQL, and GitHub Advanced Security automatically resolved its review thread. Its browser job failed only while waiting five seconds for the deck to return to the opening slide; compilation and forward navigation passed.
- Keep the deck's position, label and opacity acceptance conditions, but poll readiness every 100 ms for up to 15 seconds. Record slide geometry and opacity plus a screenshot if return readiness still fails. All four local browser smoke tasks then passed in `.cache/story-ci-readiness-20261013/`; remote confirmation of this probe adjustment is pending. No merge is included in this follow-up.
- CI at `a73b411` still failed after 15 seconds: the opening slide was active in the DOM but remained at x=-1440 with headline opacity 0. The failure screenshot subsequently captured an in-progress return transition. This disproves a short timeout as the sole explanation; the exact renderer cause remains unconfirmed.
- Select Playwright's full Chromium headless mode (`channel: 'chromium'`) instead of the separate headless shell, keeping animations and readiness assertions enabled. All four local smoke tasks passed in `.cache/story-ci-full-chromium-20261013/`. CI is the remaining check for the Linux headless behavior; no runtime animation workaround is applied.

## Browser smoke organization (2026-10-13)

- Prior head `0848edb` passed all seven remote checks, including all four browser smoke tasks; the security review thread is resolved.
- Keep each fixed browser case under `evals/smoke/<skill>/<case>/`, including build configuration, owned inputs and expectations. Move the story fixtures from `tests/fixtures/`, and extract chart/table source configurations from the runner. The original four case IDs and input values remain unchanged.
- Discover case directories automatically, support `--skill`, repeated `--case` and `--list`, and retain existing evidence paths and model-free CI execution. Declared required checks fail if they were not executed. Reuse the case directories in the copied-story API-tool regressions.
- Publish English/Chinese smoke guides and update contributor, evaluation, case and root documentation. CI also archives each case's inputs alongside reports, logs and outputs.
- The initial moved VChart fixture referenced an external `records` variable, which the editor's independent `spec` parser could not resolve. Keep the failed report under `.cache/smoke-by-skill-20261013/`; inline CSV records through an explicit source placeholder instead. All four browser cases then passed under `.cache/smoke-by-skill-ready-20261013/`, with zero model calls and no changes to runtime Skill files.
- Verify preserved story input bytes, chart/table CSV inputs and prior expectations, documentation links, Ruff and diff whitespace. The 56 API/evaluation-runner regressions, 15 smoke-runner regressions and 58 Node regressions passed. All four local browser cases passed with zero model calls. Remote CI for the committed reorganization is tracked separately on PR #299.
