# Contributing

Changes to Skills should protect a concrete user task or failure mode. Keep runtime instructions/resources under `skills/`, deterministic regressions under `tests/`, and fixed Agent tasks under `evals/`.

## Start here

The recommended development loop is [direct Skill debugging in Codex or Claude Code](docs/debugging.md). Use their existing harness for exploration and iterative fixes. The API harness is a lightweight alternative for fixed cases or a custom prompt with input files; it supports only OpenAI-compatible Chat Completions.

1. Follow the [contributor quickstart](evals/README.md#contributor-quickstart) for prerequisites, API endpoint/model/key-environment configuration, commands and report interpretation.
2. Run `uv sync --locked`, then `uv run pytest tests -q`. These tests need no model account.
3. For a Skill change, choose relevant cases from the [coverage table](evals/cases/README.md). Run one with `uv run python evals/scripts/run.py --case vchart-grouped --browser` (substitute the relevant case id). Model API runs use your own credentials and billing. Start with one case and inspect usage.json.
4. Inspect the generated source, screenshot and required interactions. Automated success does not replace semantic or visual review.
5. Run `uv run ruff check skills tests evals/scripts` for Python changes. Keep the smallest meaningful verification scope.

The runner installs the selected Skill from the current checkout into each case workspace. You do not need to install it into your global Agent directory first. The default runner calls a configurable OpenAI-compatible model API and does not require Codex or Claude Code. An optional --runner codex mode tests that host separately; the Skills themselves can be used by other compatible agents.

## In your contribution

Enable the repository's Git hooks after cloning or switching from the historical SDK checkout:

```bash
git config core.hooksPath .githooks
```

The hooks check staged whitespace, run Ruff for Python/tooling changes and require a Conventional Commit subject. Python checks require `uv` on PATH. Run the relevant tests before committing; the hook does not run model evaluations or the complete test suite. These hooks replace the historical Rush hooks, whose scripts are no longer part of this repository.

Explain the task or defect, the behavior changed, and why the chosen cases protect it. Include the commands, case ids, Agent version, requested model and review outcomes. Report known failures and skipped checks. An exit code of zero means the automated checks passed, not that every rendered artifact is correct.

Add cases for distinct behaviors or meaningful regressions, not just to increase the count. Keep prompts and inputs separate from expectations; use public or synthetic fixtures and record provenance. Keep `evals/runs/`, credentials and private data out of commits. Runtime Skills must work independently of maintenance tools and the historical VMind SDK.
