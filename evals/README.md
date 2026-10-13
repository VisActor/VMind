# Fixed Skill tasks

[English](README.md) | [简体中文](README.zh-CN.md)

Run the selected Skill against a fixed prompt and input files through a configurable model API. No Codex/Claude Code installation or account is required for the default runner. This is a small evaluation tool loop, not a hosted service or a general agent framework.

For everyday Skill development, **start with Codex or Claude Code** using the [direct debugging guide](../docs/debugging.md). The API harness below is an experimental route for bounded VChart/VTable tasks with clear inputs and outputs. It can test actual model-generated artifacts against fixed checks, not just Skill loading or tool availability, but its results depend on its limited tools and context budget. It is not recommended for end-to-end data-storytelling evaluation. Its CLI default is API; that does not make it the recommended overall user experience.

GitHub CI runs deterministic regressions and fixed browser smoke tests only. It does not run the model tasks below. Browser cases keep their configuration, inputs and acceptance criteria together by Skill in [smoke/](smoke/README.md); that guide covers commands and adding cases. See also [Continuous integration](../CONTRIBUTING.md#continuous-integration).

## Contributor quickstart

Run commands from the repository root. The runner copies the current checkout's selected Skill into each task workspace; no global Skill installation is needed.

Prerequisites: Python 3.12+, [uv](https://docs.astral.sh/uv/getting-started/installation/), a POSIX environment (macOS/Linux or WSL), and your own model API access. Browser checks additionally need Node.js 18+, npm, Chromium and internet access to the public CDN. Local validation so far was on macOS.

### 1. Install and run deterministic regressions

```bash
uv sync --locked
uv run pytest tests -q
uv run ruff check skills tests evals/scripts
```

These tests need no model credentials. Model generation is a separate, potentially billable operation.

### 2. Configure your model API

```bash
cp evals/model.example.json evals/model.local.json
```

Edit `evals/model.local.json` (gitignored):

```json
{
  "api": "openai-chat-completions",
  "base_url": "https://api.openai.com/v1",
  "model": "MODEL_ID",
  "api_key_env": "SKILLS_EVAL_API_KEY",
  "max_output_tokens": 4096,
  "output_token_parameter": "max_completion_tokens",
  "request_options": {},
  "limits": {
    "max_requests": 16,
    "max_tool_calls": 48,
    "max_total_tokens": 60000,
    "max_context_chars": 120000,
    "max_tool_output_chars": 12000,
    "request_timeout_seconds": 90
  }
}
```

Replace `MODEL_ID` and `base_url` with your provider's actual model and API base URL. The runner appends `/chat/completions`. It supports **OpenAI-compatible Chat Completions with function calling and token usage**; this is a protocol choice, not a restriction to OpenAI-hosted models. Native Anthropic Messages and OpenAI Responses are not implemented. A provider describing itself as compatible still needs to support this tool loop and usage format. Image-replication cases additionally require image input support.

Set the key in the named environment variable using your secret manager or shell. For an interactive Bash/Zsh terminal, this avoids entering it in command history:

```bash
printf 'Model API key: '
stty -echo
read -r SKILLS_EVAL_API_KEY
stty echo
printf '\n'
export SKILLS_EVAL_API_KEY
```

If input is interrupted while echo is off, run `stty echo`. To keep all settings in one local file, add `"api_key": "your actual key"` to a gitignored `evals/*.local.json`. `api_key_env` always names an environment variable, not the key itself. The runner loads the local key into that variable for its child process and omits `api_key` from saved config snapshots. Do not put a key in tracked JSON, case prompts or CLI arguments. Existing environment names are supported: for example set `api_key_env` to `OPENAI_API_KEY` when that variable is already exported. A repository `.env` file is **not** automatically loaded.

Some compatible providers require `max_tokens`; change `output_token_parameter` accordingly. Optional `request_options` keys are `temperature`, `top_p`, and `reasoning_effort`; use only parameters and values supported by the selected model. No model, temperature or reasoning-effort choice is imposed by the tool. Use `--config /path/to/config.json` for another configuration, and `--model MODEL_ID` for a one-run model override. The effective configuration is frozen in each run's logs, without the key.

[model.compatible.example.json](model.compatible.example.json) gives a second, minimal template for your own compatible endpoint using `max_tokens`. Its URL/model are placeholders, not a verified provider. Keep separate local files to switch providers/models without a profile-management layer:

```bash
cp evals/model.compatible.example.json evals/another-model.local.json
# Edit the base URL/model and export the named key variable before running.
uv run python evals/scripts/run.py --config evals/another-model.local.json --case vchart-grouped
```

All `evals/*.local.json` files are gitignored. API keys may be stored in the ignored local JSON `api_key` field or supplied through an environment variable. Models using the same endpoint can also be selected with `--model`.

For compatible gateways that use Azure-style HTTP authentication, set `api_key_header` to `api-key` (the default is `Authorization: Bearer ...`). Optional `api_version` adds an `api-version` query parameter. Set `base_url` to the provider's documented base, including a deployment path when required. Changing the model may then also require changing that deployment path. These options keep the Chat Completions message/tool protocol; they do not add a Responses adapter. Requests read credentials from the named environment variable; a local JSON `api_key` is first loaded into it.

API calls still consume tokens. Limits apply **per case turn**, not across an entire group. `max_total_tokens` sums the provider-reported usage of completed requests, including repeated input context. It stops further requests after reaching the threshold; one request can exceed the remaining budget. It is not a hard billing cap. `max_output_tokens` caps each response, including reasoning where the provider counts it. Request/tool counts, context size and timeouts provide additional bounds. There are no automatic retries, context compaction or silent truncation of conversation history. Tool reads expose explicit truncation/continuation offsets. A provider omitting usage fails the run, and timed-out requests may still be billed by that provider.

Each API request sends the selected Skill entry, task, tool definitions and accumulated conversation again. After a tool call, the next request also includes its result. A reference file read once can therefore contribute input tokens to several later requests. For example, requests reporting 2,000, 3,000 and 4,000 input tokens produce 9,000 cumulative input tokens, even when they share earlier context. This is per-request usage, not the size of unique source material. `cachedPromptTokens` records any cache usage reported by the provider; token totals alone do not establish the monetary cost. Inspect the request snapshots and usage before increasing a budget or starting a large group.

### 3. Prepare browser checks

```bash
npm ci --prefix evals
node evals/node_modules/playwright/cli.js install chromium
```

On Linux, use `install --with-deps chromium` if Playwright reports missing system libraries and your environment permits installing them. Omit `--browser` to run generation without rendering checks or screenshots.

### 4. List, run one, then run a group

Listing requires no config or credentials:

```bash
uv run python evals/scripts/run.py --group all --list
```

Start with one task. The default runner is `api`:

```bash
uv run python evals/scripts/run.py --case vchart-grouped --browser

# Explicit model override
uv run python evals/scripts/run.py --case vchart-grouped --model MODEL_ID --browser
```

Then run the relevant group:

```bash
# 8 VChart core tasks, 10 independent model conversations including three edit turns
uv run python evals/scripts/run.py --skill vchart-skill --group core --browser

# 4 VTable tasks
uv run python evals/scripts/run.py --skill vtable-skill --group core --browser

# 24 additional VChart tasks
uv run python evals/scripts/run.py --skill vchart-skill --group extended --browser
```

Use `--group all` for all 41 tasks, or repeat `--case` to select several. Explicit cases override groups. `--skill` selects a Skill and groups apply within it. The default is VChart core. With a Skill selected, `--group all` selects only its cases. `--timeout 600` sets the per-turn execution deadline. Start small and inspect `usage.json` before expanding the run.

The API runner includes the selected `SKILL.md` in its initial instructions. It offers four tools: `read_file`, `list_files`, `write_file` and `run_skill_script`. Reads are confined to that installed Skill, task inputs and outputs; writes go to outputs. Only the bundled HTML generators and knowledge-search script can execute; they receive no model credentials. References are read on demand. Checker expectations remain outside the workspace and are inaccessible through these tools. This is a restricted tool interface, not an OS sandbox: only run reviewed Skill scripts and review generated HTML before browser execution.

### 5. Read the report

To try your own prompt/data without adding a fixed case, use `--skill`, `--prompt-file` and optional repeatable `--input`. See the [copyable custom-task example](../docs/debugging.md#alternative-a-simple-model-api-harness). Custom tasks cannot be mixed with `--case` or `--group`. They reuse the runner/logs but have no predefined semantic assertions.

The last console line prints `Report: .../evals/runs/<run-id>/README.md`. Open it for per-case results, logs and outputs. Multi-turn cases keep separate `turn-1`, `turn-2` and `turn-3` directories.

- Exit code 1 indicates an automated case failure. Inspect `execution.json`, `stderr.log`, `events.jsonl`, API responses and `browser.json`. Setup/argument errors can use another nonzero exit code.
- Exit code 0 means automated execution/checks succeeded. It does **not** mean visual or semantic review passed; cases remain `needs-review`.
- Review against the saved `expectations.json`, then save `review.json` with artifact hashes. Preserve failures and original logs; later review does not rewrite the earlier exit code.
- `evals/runs/` is gitignored. Share affected case ids, model, runner, commands, usage, automated outcomes and reviewed results, with inspected screenshots/logs when useful.

### Optional: evaluate with an installed Codex CLI

Use this only when testing that host's behavior. It uses your local Codex authentication/configuration and quota; API-runner limits do not apply to it.

```bash
uv run python evals/scripts/run.py --runner codex --case vchart-grouped --browser
```

`--agent /absolute/path/to/codex` selects the executable; `--model` overrides its model. Codex must support `exec --json --ephemeral --sandbox workspace-write --skip-git-repo-check`. The initial historical runs used `0.155.0-alpha.9`. See the [official CLI](https://learn.chatgpt.com/docs/codex/cli), [authentication](https://learn.chatgpt.com/docs/auth) and [configuration](https://learn.chatgpt.com/docs/config-file/config-basic) instructions. This mode sets workspace-write sandboxing, disables interactive approval/project-document injection and retains the host's other configuration. API and Codex runs have different tool capabilities; compare them only with that distinction recorded.

### Common setup failures

| Symptom | Action |
| --- | --- |
| Invalid API config / MODEL_ID placeholder | Copy the example and set a real base URL/model. |
| Missing credential environment variable | Export the variable named by `api_key_env` in the current shell. |
| API 401/403/404 | Check credential access, model id and base URL; inspect the redacted error log. |
| API rejects token parameter / tools | Use the supported token parameter and a model with function calling. |
| Provider omitted token usage | This runner needs prompt/completion/total usage to account for budget. |
| length / request / token / context limit | Inspect partial artifacts and usage, then deliberately adjust the relevant limit. The run remains failed. |
| Playwright/Chromium missing | Run npm installation and Chromium setup above. |
| Browser CDN/network errors | Check public unpkg access; keep the failure evidence. |
| Report says needs-review | Inspect source, screenshot and required interactions. |

## Cases and checks

`cases/<skill-name>/tasks.json` contains prompts and input filenames. `cases/<skill-name>/expectations.json` is read by the checker, not copied into the agent's task workspace. Inputs are synthetic, publicly shareable fixtures.

Coverage: 32 VChart tasks, 4 VTable tasks and 5 data storytelling tasks. See [the case guide](cases/README.md) for per-Skill catalogs, groups and acceptance criteria. Curated tasks and executed tasks are separate counts. Core VChart covers grouping, diagnosis, stacking, normalization, nulls, explanation, clarification and file-based continuation. Extended tasks include React, image replication, axes, interactions and additional chart families.

The three-turn continuation case creates a new Agent invocation for each turn, copying the preceding filesystem state into a new workspace. It tests editing existing artifacts, not conversation memory. Each turn retains separate logs and outputs, and a failed turn blocks subsequent turns. Text-only tasks do not require HTML and fail if they generate unrequested output files.

`--browser` opens generated HTML on a loopback server and records JS/console/network errors, nonblank canvas pixels, screenshots and, for data cases, runtime records. The quarter-filter case actually selects Q1, Q2 and all, then compares displayed records. A rendered canvas alone is not proof of correct visual encoding or good design.

## Logs

Each run writes an immutable new directory under ignored `evals/runs/`:

- `README.md`: links to each case result and output.
- `model-config.json`: resolved API configuration at run level, with the credential environment variable name only.
- `metadata.json`: exact task, runner, launch command, runner/Agent version, configured model, input and installed skill SHA-256 hashes.
- `expectations.json`: snapshot of the checker contract for this turn, outside the Agent workspace.
- `prompt.txt`: exact supplied prompt.
- `events.jsonl`: redacted request/usage events, tool arguments/results and completed answers (or the optional Codex CLI event stream).
- `request-NNN.json`, `response-NNN.json`: API request/response bodies, with the configured API key redacted. Image data URLs are replaced with hashes; the actual images remain in workspace inputs.
- `usage.json`: cumulative requests, tool calls, prompt/completion/total tokens, cached prompt tokens when reported, completion status and duration. Provider errors or missing usage mark accounting incomplete. A parent-process timeout can leave the last partial snapshot; always check `execution.json`.
- `stderr.log`, `execution.json`: diagnostics, exit status, timeout and timing.
- `final-response.md`: completed assistant messages extracted from the event stream.
- `workspace/`: installed skill snapshot, inputs and produced output files.
- `browser.json`, `browser-command.log`, `screenshot.png`: browser evidence when enabled.
- `runtime-spec.json`: VChart spec observed in the browser when the template exposes its instance; null if unavailable, function bodies represented as `[function]` (inspect source for callback behavior).
- `result.json`: artifact inventory/hashes, automated results and a separate visual-review checklist.

Missing host data is not invented; this tool cannot promise private model reasoning or events the host does not expose. It does not dump the environment or auth files. Known credential forms and secret-valued environment variables are redacted in process logs. Inputs and artifacts may still contain user data: inspect before sharing any run directory.

A successful process plus files is `needs-review`, never automatically “all passed”. Failed checks produce `failed`. Browser and visual review that did not execute are `not-run`.

For manual visual review, inspect the screenshot and actual HTML against the case checklist, then save a separate `review.json` containing `status`, `reviewer`, `notes` and the reviewed artifact hashes. Keep the original automated report unchanged. Reference-image similarity and model-based visual scoring are not included.

Rerun browser checks without regenerating:

```bash
node evals/scripts/check-browser.mjs evals/runs/RUN/CASE
```

This replaces only browser evidence; the original result.json remains a record of the original evaluation. Use a new run for a changed skill or input.

## Live API evidence for basic chart and table tasks (2026-10-09)

With the locally configured `gpt-5.4-2026-03-05` endpoint and a 40,000-token cumulative threshold, neither representative run completed. `vchart-grouped` made 3 requests, reported 56,700 total tokens and wrote `spec.js`, but stopped before producing HTML. `vtable-list` made 5 requests, reported 49,748 total tokens and wrote `spec.js` and `demo.html`, but stopped before a final response; its browser checks did not pass. The threshold is checked between requests, so a final request can exceed it. Both runs reported zero cached prompt tokens. Their detailed logs are in the local, Git-ignored `evals/runs/` directory.

These two failures do not establish that VChart/VTable tasks cannot succeed through a model API. They do mean this harness has not yet demonstrated reliable end-to-end completion for even these basic cases with this model and budget. Evaluate a proposed Skill change with the generated artifact, usage and independent review, not just the runner exit code.

## Data storytelling debugging

Run end-to-end `data-storytelling` cases in Codex or Claude Code. The API harness exposes some bundled plan, VSeed, asset, HTML/PPT and JavaScript scripts, but its limited tool loop and growing context have not completed a live story case. It does not supply a Python analysis sandbox, browser tools or image generation. Do not use an API harness failure alone to judge story quality or Skill correctness.

```bash
uv run python evals/scripts/run.py --skill data-storytelling --list
```

See the [story cases](cases/data-storytelling/README.md) for prompts, inputs and review criteria to use with a full agent. A direct API run remains possible for investigation, but is not a recommended end-to-end evaluation path. Stories read more references and write several intermediate files; raising the budget alone does not address context growth. One live model case has been attempted and its result is recorded below; the other cases have not been run.

The browser saves compiled chart specs, screenshots, page and network errors; Web-PPT also checks navigation. It does not automatically judge narrative quality, all calculations or page layout, and does not use pixel similarity as acceptance.

### First live model run (2026-10-09)

`story-retention-html` used `gpt-5.4-2026-03-05` through the OpenAI-compatible API in `evals/visactor.local.json` for 5 requests. The model read inputs and Skill references, and wrote `runtime/dataset_map.json` (4 monthly rows, 3 segment rows and a sorted copy). After the fifth request, provider-reported usage reached 166,990 tokens, above the local 160,000 limit, and the runner stopped. No `plan.md`, HTML or other required intermediates were produced; the case status is `failed`. Logs are in the ignored `evals/runs/20261009T094650Z-99a5c791/`.

Prompt tokens per request were 9,910, 29,998, 36,085, 43,379 and 46,693; provider-reported cached tokens were zero. Previously read Skill material reappeared in subsequent conversation requests. This does not assess the quality of a generated story. It shows that this case did not finish under the current API harness and budget. Inspect reference reads and context growth before raising the budget or running a batch.
