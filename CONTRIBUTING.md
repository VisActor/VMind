# Contributing

Changes to Skills should protect a concrete user task or failure mode. Keep runtime instructions/resources under `skills/`, deterministic regressions under `tests/`, and fixed Agent tasks under `evals/`.

## Start here

Use `develop` as the default and primary maintenance branch. Create contribution branches from the latest `origin/develop` and target pull requests to `develop`.

The recommended development loop is [direct Skill debugging in Codex or Claude Code](docs/debugging.md). Use their existing harness for exploration and iterative fixes. The API harness is a lightweight alternative for fixed cases or a custom prompt with input files; it supports only OpenAI-compatible Chat Completions.

1. Follow the [contributor quickstart](evals/README.md#contributor-quickstart) for prerequisites, API endpoint/model/key-environment configuration, commands and report interpretation.
2. Run `uv sync --locked`, then `uv run pytest tests -q`. These tests need no model account.
3. For a Skill change, choose relevant cases from the [coverage table](evals/cases/README.md). Run one with `uv run python evals/scripts/run.py --case vchart-grouped --browser` (substitute the relevant case id). Model API runs use your own credentials and billing. Start with one case and inspect usage.json.
4. Inspect the generated source, screenshot and required interactions. Automated success does not replace semantic or visual review.
5. Run `uv run ruff check skills tests evals/scripts` for Python changes. Keep the smallest meaningful verification scope.

The runner installs the selected Skill from the current checkout into each case workspace. You do not need to install it into your global Agent directory first. The default runner calls a configurable OpenAI-compatible model API and does not require Codex or Claude Code. An optional --runner codex mode tests that host separately; the Skills themselves can be used by other compatible agents.

## Continuous integration

`Skills CI` runs on pull requests and pushes to `main`/`develop`, with two jobs:

- **Lint and regressions**: install locked Python dependencies, run Ruff and the deterministic test suite, including per-Skill case/input contracts and a simulated model API.
- **Browser smoke (no model)**: use copied Skills to generate a fixed VChart chart, VTable table, HTML data story and Web-PPT deck, then check rendering, runtime records and browser errors. Pinned npm packages serve CDN requests locally; unexpected external requests fail. Save JSON reports, logs, generated HTML and screenshots for seven days.

Maintain browser smoke configurations, inputs and acceptance criteria together under `evals/smoke/<skill-name>/<case-id>/`. The runner discovers them automatically; see the [smoke case guide](evals/smoke/README.md) for the catalog, file contract and adding cases.

Neither job calls a model or needs model credentials. Browser smoke checks script/template integration, not Skill quality on model-generated tasks. Model evaluation remains a separate local development activity.

To run browser smoke locally:

```bash
npm ci --prefix evals --ignore-scripts
node evals/node_modules/playwright/cli.js install chromium
node --test tests/test_browser_assets.mjs tests/test_browser_checks.mjs tests/test_story_vseed.cjs
uv run python evals/scripts/smoke.py
# Select a Skill or a single fixed browser case
uv run python evals/scripts/smoke.py --skill data-storytelling
uv run python evals/scripts/smoke.py --case story-ppt
```

On Linux, use `install --with-deps chromium` when system libraries are missing. Each run creates a new evidence directory under `.cache/`; `--output-dir PATH` selects an explicit directory that must not exist yet.

## Before committing

Enable the repository's Git hooks after cloning or switching from the historical SDK checkout:

```bash
git config core.hooksPath .githooks
```

The hooks check staged whitespace, run Ruff for Python/tooling changes and require a Conventional Commit subject. Python checks require `uv` on PATH. Run the relevant tests before committing; the hook does not run model evaluations or the complete test suite. These hooks replace the historical Rush hooks, whose scripts are no longer part of this repository.

Explain the task or defect, the behavior changed, and why the chosen cases protect it. Include the commands, case ids, Agent version, requested model and review outcomes. Report known failures and skipped checks. An exit code of zero means the automated checks passed, not that every rendered artifact is correct.

Add cases for distinct behaviors or meaningful regressions, not just to increase the count. Keep prompts and inputs separate from expectations; use public or synthetic fixtures and record provenance. Keep `evals/runs/`, credentials and private data out of commits. Runtime Skills must work independently of maintenance tools and the historical VMind SDK.
