# Initial Skills migration

Status: initial migration and scoped verification complete, 2026-09-18. See [verification](verification.md) for evidence and coverage limits.

## Scope

- Keep repository history; begin branch `codex/migrate-chart-table-skills` at refreshed `origin/develop`, base `e9b05dfb5d9fd42b1a56724682810e5597eaa22e`.
- Replace the tracked historical SDK tree with a new Skills library. Preserve license and copyright notices. Old versions remain available through Git and releases.
- Migrate only `vchart-development-assistant` and `vtable-development-assistant`, their regression tests and selected fixed tasks.
- No product CLI, hosted service, agent-core dependency, generic evaluation framework or automated skill optimizer.
- Keep local user files and ignored legacy build artifacts untouched; exclude them from the new library and verification dependencies.

## Stages

- [x] Create migration branch directly in the existing checkout from current origin/develop.
- [x] Remove tracked old SDK, documentation, build tooling and publishing workflows.
- [x] Import both development-assistant skills and record source provenance.
- [x] Replace hosted VChart search with bundled keyword retrieval; remove personal source paths and historical evaluation artifacts.
- [x] Use public npm CDN addresses and standalone filesystem outputs.
- [x] Migrate deterministic path tests and add portable-install/search tests.
- [x] Add fixed prompts and synthetic input files, isolated installed skill copies, observable process logs and browser checks.
- [x] Complete fixed-task runs, investigate failures, inspect screenshots and record outcomes.
- [x] Finish public documentation, resource audit and final verification.

## Acceptance

The installed skill directory and documented environment must suffice. The runner must not import the former agent runtime or show expected answers to the tested agent. Logs must distinguish failed, successful and unperformed checks. Browser rendering is not equivalent to data correctness or visual review.

Image replication, React-specific flows and multi-turn editing remain included workflows; initial automated task coverage does not imply those paths were fully tested. Record remaining verification gaps explicitly.

## Expanded VChart case selection (2026-09-18)

The user approved selecting cases by target capability, distinct failure mode, public/complete input, meaningful acceptance criteria and maintenance cost. [The coverage table](../../evals/cases/README.md) records 32 VChart tasks: 24 adapted from the old blind pool, 2 from website regression intents, 2 migration baselines and 4 supplements. Four VTable tasks remain separate.

- [x] Record source ids/prompts, adaptations, selection reasons and deferred candidates.
- [x] Bundle synthetic inputs and a self-authored image fixture; hide checker expectations from the task workspace.
- [x] Support core/extended selection, answer-only tasks and three-turn filesystem continuation in the small runner.
- [x] Execute and review newly added core cases; record failures without changing selection to improve pass rate. Core outcome: 7 passed, 1 visual failure; see [expansion evidence](vchart-case-expansion.md).

The 24 extended tasks are runnable definitions, not a claim of completed execution. Image replication and React remain pending until their extended runs are inspected. File continuation tests copied prior artifacts, not website version selection or host conversation memory.

Commit, push, PR, repository rename and remote default-branch changes are separate operations requiring a user request.

## Direct model API evaluation (2026-09-18)

The user corrected the initial Codex-only entry point: maintainers must be able to select a model and endpoint directly, without using a coding-agent subscription. The default runner now uses an OpenAI-compatible Chat Completions tool loop. The old Codex runner remains an explicit optional mode.

- [x] Add an ignored local model configuration, environment-variable credentials and a public example.
- [x] Load the selected Skill entry and expose bounded filesystem/script tools; keep checker expectations inaccessible through those tools.
- [x] Preserve existing cases, continuation snapshots, browser checks and reports.
- [x] Record redacted request/response bodies, observable tool calls and per-turn token usage; enforce request/tool/context/time limits and a provider-usage threshold.
- [x] Rewrite contributor setup around API configuration and copyable commands.
- [x] Verify the HTTP/tool loop with a local fake provider, real bundled generators and failure-path regressions: 76 tests passed; Ruff and diff whitespace checks passed.
- [ ] Connect an actual configured provider and inspect API-generated charts/tables, screenshots and usage. No live-provider credentials were configured for this change.

This adds a small evaluation-only runner, with no agent-core dependency or hosted service. It does not add a product CLI. API access still consumes tokens, and the usage threshold is checked between requests rather than constituting a hard billing cap. Native Anthropic Messages and OpenAI Responses protocols are outside this first implementation. Historical case outcomes above came from Codex and do not establish quality with this API tool environment.

## Debugging scope confirmed (2026-09-20)

The recommended route is direct Skill use in Codex or Claude Code. These are the documented host targets; other host applications receive no dedicated adapters. The API harness remains a lightweight alternative for selected cases, supporting only OpenAI-compatible Chat Completions. No additional protocol adapters or interactive agent application are planned in this scope.

- [x] Add direct host installation/debugging instructions with official references and honest verification status.
- [x] Add `--skill`, `--prompt-file` and repeatable `--input` to the existing runner for independent custom tasks; preserve source files and reuse logs/usage/artifact snapshots.
- [x] Support optional custom HTML/browser checks with `--html`; require manual semantic review rather than inventing task expectations.
- [x] Include a runnable custom prompt/data example and a minimal compatible-endpoint configuration example. Separate ignored local JSON files suffice for model switching.
- [x] Run the 32 relevant runner/API regressions, Ruff and diff checks. HTTP integration covers both fixed and custom selection; no paid model calls were made.

The Skill runtime and existing fixed-case definitions are unchanged. Real provider quality/cost validation and a recorded Claude Code generation run remain unperformed; documented host support is distinct from completed end-to-end evidence.

The repository entry now includes English `README.md` and Simplified Chinese `README.zh-CN.md`, with reciprocal language links and matching installation, debugging, configuration and verification guidance. This documentation-only change is checked for local links, command parity and whitespace; it does not require model runs or runtime tests.

README audience correction: public installation now uses repository-based Skill installation, while local-checkout installation, regressions and API debugging live in a separate development/maintenance section. Migration branch/review/publishing details are removed from both README files. The public commands describe the intended published library; their CLI syntax was checked against the Skills CLI documentation, but installation from the remote repository has not been verified and requires the migrated Skills to reach the public installation ref before release.

Custom browser smoke evidence: a synthetic loopback provider issued an HTML-writing tool call, then a final answer. The real Playwright checker saved its screenshot and report. Run `20260920T062019Z-5ccba0ac` reported a blank canvas; independent rendering probes succeeded, and replaying the unchanged mock responses in new run `20260920T062243Z-f219910c` passed automated checks and retained `needs-review`. The first failure remains preserved, with its cause unresolved. This tests the custom entry/report/browser plumbing using a plain canvas fixture, not VChart quality or real model behavior.

## First real API case (2026-09-20)

At the user's request, reused the source repository's local model selection and environment-resolved credential to run `vchart-grouped`. No credential was copied into configuration or committed files. Added two transport configuration fields for Chat Completions-compatible gateways: `api_key_header` (`Authorization` or `api-key`) and optional `api_version`. This does not implement the Responses protocol. Both auth modes pass HTTP integration tests; 18 relevant API tests, Ruff and whitespace checks passed.

- Requested model: `gpt-5.4-2026-03-05`; compatible Chat Completions endpoint verified with a 13-token preflight.
- Initial run `20260920T092104Z-72926283`: failed on the cumulative token threshold after 4 requests / 80,437 reported tokens. Generated files and browser checks exist, but the execution remains failed and its evidence is retained.
- Final run `20260920T092146Z-ddd6932e`: 5 requests / 13 tool calls / 20.78 seconds; 116,343 prompt tokens + 1,256 completion tokens = 117,599 total tokens. The local per-turn threshold was explicitly raised to 160,000; public defaults are unchanged.
- Execution, artifact, nonblank canvas, full runtime-record and browser error checks passed. Separate `review.json` records source/screenshot review: six bars, correct groups/legend/values, no occlusion at 1440×1000. Generated files were not hand-edited.
- Both run directories were scanned for the resolved credential with no matches. Local config and credential-loading helper are gitignored. Real model API coverage is one VChart case; it does not establish VTable, other model or Claude Code coverage.

Repeated input context accounts for most observed usage. A simpler harness does not itself establish token savings over a coding-agent host. Logs report tokens; provider billing is not inferred from them.

## Bilingual evaluation guide and usage explanation (2026-09-21)

Added `evals/README.zh-CN.md` with reciprocal language links and linked it from the Chinese repository README. Both evaluation guides explain how the tool loop resends accumulated context and why summed input usage differs from unique content size. Documentation checks cover local link targets, executable command/JSON parity and whitespace; no runtime changes or additional model calls are needed.

For successful run `20260920T092146Z-ddd6932e`, the five responses report 8,047 / 16,390 / 30,147 / 30,761 / 30,998 prompt tokens, summing to 116,343. All five report zero cached prompt tokens. The harness includes the full selected Skill entry initially and retains tool results in later requests; these counts describe cumulative API usage, not unique context size or monetary charges.

Added `evals/cases/README.zh-CN.md` with the full selection record, 32-case coverage table, fixture provenance and execution limits. Both case guides have reciprocal language links, and the Chinese evaluation guide links to the Chinese case guide. Verification checks case IDs, group assignments, unchanged acceptance criteria, local links and whitespace; no runtime code or case definitions changed.

Case-guide audience correction (2026-09-21): rewrote both languages around current case groups, commands and review criteria. Split core/extended tables, replaced migration rationale with capability descriptions, and translated English acceptance criteria. Source-pool counts, legacy exclusions and adaptation history remain in migration records and selection metadata. Case definitions and runtime behavior are unchanged; documentation verification checks catalog membership, groups, preserved Chinese acceptance criteria, commands and local links.

## Per-Skill case catalogs (2026-09-21)

Completed: organized cases as `evals/cases/<skill-name>/` with independent tasks, expectations, inputs and bilingual guides. Keep the root guide as an index. Extend `--skill` to select fixed catalogs as well as custom tasks; use core/extended within a Skill, and put the four VTable tasks in its core group. Preserve existing case IDs, prompts, input bytes, review criteria and historical run snapshots. Update runner/browser lookup, contributor commands and targeted regression tests. No model calls or new evaluation criteria are required.

Verification: 53 targeted catalog/runner/API tests passed; Ruff, JavaScript syntax and whitespace checks passed. A direct comparison against the saved pre-split catalog confirms all 36 prompts, inputs and expectation contracts are unchanged; only VTable group membership changed from `vtable` to its local `core`. All 12 distinct documented fixed-case command examples resolve through `--list` without credentials. Bilingual command parity and local links passed. Browser smoke checks passed for both per-Skill catalog lookup and an independent historical expectations snapshot, using copies of existing artifacts in `.cache/case-layout-browser-rxfqh36e/`; original run directories were untouched. No paid model requests, commits or publication.

CLI migration: replace `--group vtable` with `--skill vtable-development-assistant --group core`. Existing globally unique `--case` IDs and the default VChart core selection remain supported. `--skill` alone now selects a fixed catalog; custom tasks still require `--prompt-file`. New catalog directories are discovered automatically and duplicate case IDs or mismatched Skill ownership fail before model access.

## Local migration commit (2026-09-21)

The user authorized a local commit. Keep the complete migration in one coherent commit: the SDK retirement, portable Skills, regression tooling, per-Skill cases and contributor documentation depend on one another. Preserve the existing Git history and do not push.

Pre-commit review: 52 runtime/search/portable-install regressions passed, complementing the 53 catalog/runner/API regressions from the catalog reorganization (105 total across the relevant suites). Ruff for all maintained Python passed; uv lock consistency and installed Playwright version matched the locked configuration. Existing generated-case evidence and known visual failures remain recorded separately; this is not a claim that all 36 model tasks pass.

The checkout's legacy Git hooks called deleted Rush scripts. Added versioned `.githooks` with staged whitespace checks, conditional Python linting and Conventional Commit subject validation, and configured this checkout to use them. Old local hooks were preserved under ignored `.cache/legacy-git-hooks/`. Hook syntax and valid/invalid subject checks passed. Contributor setup documents the replacement; no hook bypass is used.

Final staged review: removed inherited trailing whitespace from 38 reference/template files, preserving explicit Markdown hard breaks. The 47 affected artifact/portable-install tests passed again. Staged whitespace and JSON parsing checks passed. The index contains 305 files, including 237 portable Skill files; local API configuration, credential-loading helper, generated runs, caches and legacy build leftovers are excluded. A scan for the reused local credential and high-confidence secret patterns found no matches in staged content.

## Deterministic GitHub CI (2026-09-21)

Approved scope: add baseline checks and small browser smoke tests only. No model evaluation, model credentials, paid API calls or publishing workflow. Use fixed chart/table configurations with copied Skills; check rendering/data and retain diagnostic artifacts. Document that Skills are installed directly from Git source, while the third-party Skills CLI is the npm-delivered installer. Public installation requires the migrated directories on the selected remote ref.

During CI preparation, the evaluation npm lockfile was found to contain internal registry URLs. Regenerate it against the public npm registry and verify public dependency installation. Browser smoke should serve pinned dependencies locally during rendering to avoid depending on a live CDN. Remote GitHub execution remains a separate verification after pushing.

Implemented `.github/workflows/ci.yml` with read-only baseline and browser jobs on pull requests, main/develop pushes and manual dispatch. Actions are pinned to verified upstream tag SHAs. The browser job uses copied Skill generators, fixed six-record chart/table configurations, locally served pinned npm assets and seven-day diagnostic artifacts; it never invokes the model runner. Added a public-registry regression after regenerating the npm lockfile from registry.npmjs.org.

Local verification: 105 existing Python tests passed; the updated portable-install suite (including the new registry regression) passed all three tests, for 106 covered Python tests in total. Two Node asset-routing tests passed. Both fixed browser cases passed with local assets in `.cache/browser-smoke-suzheyn1/`; reports show zero model calls. Public npm installation, Ruff, JavaScript syntax, workflow YAML/pin/trigger checks, documentation links and diff whitespace checks passed. This validates local macOS execution with Python 3.12.9; the Ubuntu GitHub jobs have not run remotely. No model calls, remote changes, commit or push were performed for this CI addition.

Distribution check: the Skills CLI documentation and clone implementation support Git repository sources, local directories and explicit refs. The current remote default branch is develop at e9b05df; migrated Skills remain local until pushed and integrated into the intended installation ref. The distribution mechanism was explained in conversation only; at the user's request, the public READMEs retain installation commands without this explanatory paragraph.

## VTable stable version validation (2026-09-21)

Approved: replace inherited VTable 1.26.1-alpha.0 with pinned stable 1.26.8 in both runtime HTML templates and evaluation dependencies. Validate locally with fixed list/pivot/filter/diagnosis examples plus the relevant generator tests. No model calls, automatic publication or global Skill installation changes are needed.

Completed: both VTable HTML templates and the public npm lockfile now pin 1.26.8. The 21 targeted VTable artifact/portable-install tests passed, along with Ruff and the existing fixed VChart/VTable browser smoke (`.cache/browser-smoke-8hi8qs4p/`). Additional local browser interaction checks passed for numeric header-icon sorting, region/quarter pivot values, Q1/Q2/all filtering, and the diagnosis template's corrected field mappings. The final run has no browser/resource errors and records zero model calls in `.cache/vtable-1.26.8-recheck-ullci8vw/summary.json`; screenshots and per-case logs are retained alongside it. List sorting and diagnosis screenshots were visually inspected.

The first ad hoc interaction run is preserved in `.cache/vtable-1.26.8-qhs4n3ct/`: two checks failed because the probe clicked away from the sort icon and requested diagnosis.html instead of the generator's demo.html. Correcting the probe resolved both without runtime code changes. These checks validate fixed-example compatibility with 1.26.8, not live model quality or full-library coverage. Changes remain local and uncommitted.

Local checkpoint (2026-09-21): the user authorized committing the verified deterministic CI and VTable 1.26.8 changes before renaming the public Skills. Reuse the successful checks above; review the staged diff and run repository hooks. No push.

## Public Skill names (2026-09-21)

Approved: rename the public Skills to `vchart-skill` and `vtable-skill` after local checkpoint `8f33962`. Update runtime directories/frontmatter, references, bilingual installation/debugging guides, per-Skill case directories, runner selection and test paths together. Preserve case IDs, task prompts, fixtures and expected outcomes. Keep historical source names in provenance with an explicit current-name mapping; existing generated run snapshots remain untouched. Validate discovery, isolated copies, API harness mechanics and fixed browser smoke without model calls.

Completed: new names are consistent across Skill folders/frontmatter, runtime instructions, installation/debugging commands, case catalogs and runner/tests. The 106 Python regressions, Ruff, both Skill validators, discovery of all 36 cases and fixed VChart/VTable browser smoke passed (`.cache/browser-smoke-w5gt5p71/`). Compared all task definitions and expectations with checkpoint 8f33962: only Skill ownership names changed; prompts, case IDs and acceptance criteria are preserved. Updated guide links resolve and active runtime/evaluation/docs entrypoints contain no old names. No model calls or global installation changes. The preceding CI/version checkpoint is committed; this subsequent rename remains uncommitted for review.

Local rename commit (2026-09-21): the user approved committing this rename separately. Reuse the successful regression/browser checks above, review the staged rename/content diff and run the repository hooks. No push or history rewriting.

## Repository-level Skill versions (2026-09-21)

Agreed: version the Skills together through repository release tags rather than separate per-Skill version numbers. Document the maintenance rule in AGENTS.md and explain it in both README languages. Distinguish Skill snapshots from VChart/VTable dependency versions, use tags or commit SHAs for reproducibility, and preserve historical SDK tags. This documentation change does not create a tag or release. Verify bilingual consistency and diff whitespace; runtime tests are unnecessary because executable behavior is unchanged.
