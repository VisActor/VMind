# VisActor Agent Skills

[English](README.md) | [简体中文](README.zh-CN.md)

VChart and VTable development skills for agents that can read files and run commands. Generate charts and tables, diagnose configuration problems, and deliver runnable HTML with editable source code.

## Skills

| Skill | Tasks |
| --- | --- |
| [vchart-skill](skills/vchart-skill/SKILL.md) | Chart generation, diagnosis, image replication and React integration |
| [vtable-skill](skills/vtable-skill/SKILL.md) | List tables, pivot tables/charts, interactions and diagnosis |

Each skill includes its instructions, local references, templates and scripts. No separate VisActor CLI, MCP server, model key or hosted VisActor API is required. The host agent supplies the model.

**Recommended: use the Skills directly in Codex or Claude Code.** Your agent provides model access and tool execution. Other compatible agents may also use these Skills, but do not have dedicated setup instructions here.

## Install

Run these commands in the project where you want to use the Skills:

```bash
npx skills add VisActor/VMind --skill vchart-skill
npx skills add VisActor/VMind --skill vtable-skill
```

Follow the installer's prompts to select Codex or Claude Code. You can install either Skill independently. More installation options are documented in the [Skills CLI reference](https://github.com/vercel-labs/skills#usage).

Requirements:

- Node.js and npm to run the installation commands above.
- An agent with filesystem and shell tools, plus its own model access.
- Python 3.9+ for the bundled standard-library scripts.
- A browser and internet access for generated HTML. Templates fetch pinned VChart/VTable, React (when needed), and Monaco packages from the public unpkg CDN. This is not a fully offline bundle.

VChart knowledge search reads bundled example/SOP files locally. It uses keyword matching, not a hosted semantic search service; unmatched questions fall back to the included type and API references.

## Use

After installation, ask your agent to use the selected Skill with your data. For example:

- “Use VChart to compare sales by region and quarter in this CSV. Give me the editable source and HTML.”
- “Use VTable to build a sortable detail table using every row in this file.”

Generated JavaScript/HTML is executable code. Preview your own or reviewed artifacts locally; the evaluation browser is not a sandbox for arbitrary untrusted submissions.

## Development and maintenance

This section is for contributors editing Skills or running local tests. Start with [CONTRIBUTING.md](CONTRIBUTING.md).

### Install from a local checkout

From the root of your local repository, install the working copy of either Skill:

```bash
npx skills add ./skills/vchart-skill
npx skills add ./skills/vtable-skill
```

Alternatively, copy the complete Skill directory into your agent's skill directory, including its references, templates and scripts. Do not copy only `SKILL.md`. See the [local debugging guide](docs/debugging.md) for Codex and Claude Code workspace setup. Refresh the installed copy after changing a Skill before retesting.

### Regression tests

The Python maintenance environment requires Python 3.12+ and [uv](https://docs.astral.sh/uv/):

```bash
uv sync --locked
uv run pytest tests -q
uv run ruff check skills tests evals/scripts
```

### Model API task debugging

For users with model API access, a lightweight harness can load a selected Skill and run a fixed case or a custom prompt with input files. It supports OpenAI-compatible Chat Completions; everyday interactive debugging is best done in your existing agent.

For fixed prompt/data runs, observable execution logs, browser checks and screenshots, see [evals/README.md](evals/README.md). These are maintainer tools, not part of the installed skills. The default runner uses a configurable model API with your own key; Codex/Claude Code are not required. Model calls may incur usage charges. Copy evals/model.example.json to the ignored evals/model.local.json, configure the endpoint/model/key environment variable, then run `uv run python evals/scripts/run.py --case vchart-grouped --browser`. See the quickstart for setup and usage limits.

The [case catalog](evals/cases/README.md) includes 32 VChart tasks and 4 VTable tasks, organized by Skill with explicit acceptance criteria. The runner defaults to the 8-task VChart core group; curated coverage does not mean every task has been executed.

## Versioning

Skills are versioned together at repository level. Each formal Skills release is identified by a Git tag covering the Skill instructions, references, templates and scripts. `vchart-skill` and `vtable-skill` do not have separate version numbers.

Use a release tag or commit SHA to identify the version when reporting an issue or reproducing a result; branch contents can change. Dependency versions such as VTable `1.26.8` identify the underlying library, not the Skill release. Historical VMind SDK tags remain unchanged and belong to the earlier SDK.

## Earlier VMind versions

The previous VMind SDK is no longer maintained. Its code and documentation remain in [historical releases](https://github.com/VisActor/VMind/releases).

[MIT license](LICENSE)
