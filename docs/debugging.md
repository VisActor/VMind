# Debug Skills

## Recommended: Codex or Claude Code

Use your existing coding agent for everyday development and debugging. It provides the model, tool execution and conversation management; this repository supplies the Skill. Codex and Claude Code are the documented host targets. Other compatible agents may work, but do not have dedicated setup instructions or compatibility guarantees here.

Both hosts load complete Skill directories. Codex uses `.agents/skills/` in a project; Claude Code uses `.claude/skills/`. See the [official Codex instructions](https://learn.chatgpt.com/docs/build-skills) and [Claude Code instructions](https://code.claude.com/docs/en/skills).

The following local setup uses a fresh directory so it does not overwrite an existing Skill installation. Start in this repository's root, with your chosen agent installed and authenticated:

```bash
debug_workspace="$(mktemp -d)"
mkdir -p "$debug_workspace/inputs" "$debug_workspace/outputs"
cp evals/cases/vchart-development-assistant/inputs/sales.csv "$debug_workspace/inputs/"
```

Choose one host. For **Codex**:

```bash
mkdir -p "$debug_workspace/.agents/skills"
cp -R skills/vchart-development-assistant skills/vtable-development-assistant "$debug_workspace/.agents/skills/"
cd "$debug_workspace"
codex
```

For **Claude Code**, instead run this from the repository root after the shared setup:

```bash
mkdir -p "$debug_workspace/.claude/skills"
cp -R skills/vchart-development-assistant skills/vtable-development-assistant "$debug_workspace/.claude/skills/"
cd "$debug_workspace"
claude
```

You can also open that workspace in the corresponding app. The scripts need Python 3.9+, and generated HTML needs a browser and public CDN access. The API harness, uv environment and its model configuration are not required for this path.

In Codex CLI, send:

```text
$vchart-development-assistant Use every row in inputs/sales.csv to build a grouped bar chart comparing sales by region and quarter. Write editable source and runnable HTML under outputs/.
```

In Claude Code, send the same request with `/vchart-development-assistant` instead of `$vchart-development-assistant`. For a table, select `vtable-development-assistant` and ask for a sortable detail table. Inspect the generated source and HTML, then continue the conversation with changes or errors to investigate.

After editing this repository's Skill, refresh the installed copy before retesting (or create another fresh workspace with these steps). Record the host/model, prompt, inputs and observed result when reporting a problem. Logs and tool access in this route are managed by the host; they do not automatically appear in `evals/runs/`.

Historical generation/browser runs in this migration used Codex. Claude Code's setup above follows its documented Skill interface; a real Claude Code generation run has not yet been recorded for this migration.

## Alternative: a simple model API harness

Use this when you have an API endpoint or want repeatable runs on selected cases. It loads one Skill and provides the bounded tools needed for these tasks. It does not provide an interactive coding-agent application. Only OpenAI-compatible Chat Completions with tool calling and token usage is supported; native protocols are outside the current scope.

Follow [API setup](../evals/README.md#contributor-quickstart) to configure your endpoint, model and key environment variable. Run a built-in case with:

```bash
uv run python evals/scripts/run.py --case vchart-grouped --browser
```

Or supply a task without editing the case catalogue:

```bash
uv run python evals/scripts/run.py \
  --skill vchart-development-assistant \
  --prompt-file evals/examples/chart-prompt.md \
  --input evals/cases/vchart-development-assistant/inputs/sales.csv \
  --browser --html demo.html
```

Use `--skill vtable-development-assistant` for tables. Replace the prompt/data paths with your own files. Relative paths are resolved from your shell's current directory. Each `--input` is copied into `inputs/<filename>`; repeat the flag for multiple files with distinct basenames. Inputs are optional for explanatory tasks. All generated artifacts go to the run workspace's `outputs/`.

`--html` names an output HTML path relative to `outputs/`; the runner includes it in the task instructions and checks that it exists. With `--browser`, this path is required and rendering checks/screenshots run after generation. Omit both flags for text answers or tasks you will inspect yourself. Custom runs check process completion and a nonempty final answer, plus any explicitly requested HTML/browser checks; they do not invent case-specific semantic or data assertions. Success remains `needs-review`.

Each invocation creates `evals/runs/<run-id>/custom/` with the same prompt, Skill snapshot, input hashes, API request/response/tool logs, usage, outputs and report format as fixed cases. The original prompt and input files are not edited. Runs are independent; for conversational debugging, use Codex or Claude Code.
