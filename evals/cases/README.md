# Skill evaluation cases

[English](README.md) | [简体中文](README.zh-CN.md)

Cases are maintained in separate Skill directories. Each catalog owns its tasks, inputs, acceptance criteria and guide.

| Skill | Cases | Groups | Guide |
| --- | --- | --- | --- |
| `vchart-development-assistant` | 32 | core (8), extended (24) | [VChart](vchart-development-assistant/README.md) |
| `vtable-development-assistant` | 4 | core (4) | [VTable](vtable-development-assistant/README.md) |

## Directory structure

```text
cases/
  <skill-name>/
    README.md / README.zh-CN.md
    tasks.json
    expectations.json
    fixtures.json
    inputs/
```

- `tasks.json`: case ID, Skill, group, prompt and input filenames. Multi-turn tasks use `steps`.
- `inputs/`: data, broken source files and reference images owned by this Skill. Identical filenames in different catalogs are independent.
- `expectations.json`: automated check settings and human review criteria keyed by case ID; hidden from the tested Agent.
- `fixtures.json`: input provenance and SHA-256 hashes.

## Choose and run cases

Set up the environment and model using the [evaluation guide](../README.md), then run from the repository root:

```bash
# List every case across Skills without calling a model
uv run python evals/scripts/run.py --group all --list

# Select a Skill, then a group within that Skill
uv run python evals/scripts/run.py --skill vchart-development-assistant --group core --browser
uv run python evals/scripts/run.py --skill vchart-development-assistant --group extended --list
uv run python evals/scripts/run.py --skill vtable-development-assistant --group core --browser

# Run one case
uv run python evals/scripts/run.py --skill vtable-development-assistant --case vtable-list --browser
```

`--skill` selects a catalog; `--group` selects a group within it. With a Skill selected, `--group all` selects all its cases; without a Skill, it selects every case. The default remains VChart core. Selecting only a Skill uses its core group. VTable currently has no extended group; an empty selection is an error.

Case IDs remain unique across Skills, so `--case vtable-list` also works directly. Repeat `--case` to select multiple tasks. Explicit cases override group selection but remain constrained by `--skill`. Custom tasks still use `--skill` with `--prompt-file`; see the evaluation guide.

## Add cases

Add inputs and update `tasks.json`, `expectations.json`, `fixtures.json` and both guides in the matching Skill directory. For a new Skill catalog, use the same directory name as `skills/<skill-name>/`; the runner discovers its `tasks.json` automatically. Prefix case IDs for their Skill to avoid collisions across catalogs.

Define acceptance around required behavior and allow different correct implementations. Retain failing cases and logs. Catalog size does not imply executed or passing coverage. After automated checks pass, review each Skill's checklist; mark unexecuted checks `not-run`.
