# Browser smoke cases

[English](README.md) | [简体中文](README.zh-CN.md)

Fixed configurations exercise each Skill's local scripts, templates and browser runtime. They use copied Skills and pinned npm assets without calling a model. The runner discovers every `config.json` under `<skill>/<case>/`; CI runs all cases.

| Skill | Case | Coverage |
| --- | --- | --- |
| vchart-skill | [vchart-grouped](vchart-skill/vchart-grouped) | Grouped chart generation, rendering and complete records |
| vtable-skill | [vtable-list](vtable-skill/vtable-list) | List table generation, rendering and complete records |
| data-storytelling | [story-html](data-storytelling/story-html) | Plan, chart assembly, asset normalization and HTML rendering |
| data-storytelling | [story-ppt](data-storytelling/story-ppt) | Web-PPT assembly, chart rendering, forward and return navigation |

## Case layout

```text
evals/smoke/<skill-name>/<case-id>/
  config.json
  expectations.json
  spec.js                 # demo builder only
  inputs/
```

- `config.json` selects the build recipe and its configuration. The directory names identify the Skill and case; case IDs are unique within this smoke catalog.
- `inputs/` owns the case's data and authored page inputs. Each case is self-contained; HTML and PPT keep their small shared observations in their own directories. Input filenames are flat, matching the existing task-workspace contract.
- `expectations.json` declares browser acceptance, including required checks. It is copied into the evidence directory outside the installed Skill workspace.
- Demo cases keep their fixed JavaScript in `spec.js`. The runner reads the CSV named by `records`, converts fields listed in `numericFields` to numbers, replaces the source's `{{RECORDS}}` placeholder, and passes it to the Skill's HTML generator. Data stays inside the configuration object so the VChart editor can parse `spec` independently.
- Story cases declare `target` (`html` or `ppt`), `preset` and `body` in `config.json`. Their inputs contain `plan.md`, `dataset_map.json`, `chart_specs.json`, `page.json` and the declared body file. The runner passes these through the bundled story scripts.

## Run locally

From the repository root:

```bash
uv sync --locked
npm ci --prefix evals --ignore-scripts
node evals/node_modules/playwright/cli.js install chromium

uv run python evals/scripts/smoke.py --list
uv run python evals/scripts/smoke.py
uv run python evals/scripts/smoke.py --skill data-storytelling
uv run python evals/scripts/smoke.py --case story-ppt
```

Repeat `--case` to select several cases. Combining it with `--skill` restricts the cases to that Skill. Listing needs no browser or model credentials. On Linux, use `install --with-deps chromium` if browser system libraries are missing.

Each run creates a new evidence directory under `.cache/`. `--output-dir PATH` selects a directory that must not already exist. Reports retain the configuration, expectations, inputs, generated source/HTML, build logs, browser checks and screenshots. Story runs also retain chart specs and intermediate outputs. CI uploads the same evidence for seven days. A failed case makes the command exit nonzero, while other selected cases still run.

## Acceptance and maintenance

Browser assertions are implemented in [check-browser.mjs](../scripts/check-browser.mjs). Every current case requires a nonblank chart/table canvas, no page/resource errors and successful local asset routing. Chart/table cases compare runtime records with their own CSV. Story cases require compiled charts; Web-PPT also checks slide count, forward navigation and return geometry/visibility, with animations enabled in full Chromium headless mode.

`requiredChecks` lists the check names that must execute. A missing check fails the report even if the executed checks passed. Optional `review` entries are manual guidance; CI does not perform visual or narrative review. Screenshots are evidence, not pixel-comparison targets.

To add a case, create a directory under its Skill, supply its configuration, inputs and expectations, then run that case. No case-ID list in the runner needs updating. Keep inputs small and synthetic/public, declare relevant acceptance checks, and preserve failures and logs. Changes to smoke data and the [model-task catalog](../cases/README.md) are maintained independently. The model catalog runs through `run.py`; smoke runs through `smoke.py`.
