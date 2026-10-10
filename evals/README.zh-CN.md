# Skill 固定任务评测

[English](README.md) | [简体中文](README.zh-CN.md)

通过可配置的模型 API，让指定 Skill 执行固定 prompt 和输入文件。默认 runner 不需要安装或登录 Codex、Claude Code。这是一个带工具调用循环的轻量评测工具，不提供托管服务，也不是通用 Agent 框架。

日常开发 Skill，**推荐先使用 Codex 或 Claude Code**，具体步骤见 [直接调试指南](../docs/debugging.md)。下面的 API harness 是输入、产物边界清晰的 VChart/VTable 任务的实验性入口；它可以让模型实际生成产物并接受固定检查，不只是检查 Skill 加载或工具调用。但结果受限于工具和上下文预算，不推荐用于数据叙事端到端评测。评测命令默认选择 API，并不代表它是整体使用体验的首选。

GitHub CI 只运行确定性回归和固定配置的浏览器冒烟，不执行下文的模型任务。不调用模型的浏览器命令及检查范围见 [持续集成说明](../CONTRIBUTING.md#continuous-integration)。

## 贡献者快速上手

以下命令均在仓库根目录执行。runner 会将当前工作副本中选定的 Skill 复制到每个任务的工作区，无需预先全局安装 Skill。

环境要求：Python 3.12+、[uv](https://docs.astral.sh/uv/getting-started/installation/)、POSIX 环境（macOS/Linux 或 WSL），以及你自己的模型 API 访问权限。浏览器检查还需要 Node.js 18+、npm、Chromium 和访问公开 CDN 的网络。目前本地验证环境为 macOS。

### 1. 安装依赖并执行确定性回归测试

```bash
uv sync --locked
uv run pytest tests -q
uv run ruff check skills tests evals/scripts
```

这些测试无需模型凭据。调用模型生成产物是单独的操作，可能产生费用。

### 2. 配置模型 API

```bash
cp evals/model.example.json evals/model.local.json
```

编辑 `evals/model.local.json`（已被 Git 忽略）：

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

将 `MODEL_ID` 和 `base_url` 替换为服务商提供的实际模型 ID 与 API 基础地址。runner 会追加 `/chat/completions`。目前支持 **OpenAI 兼容的 Chat Completions 协议，要求支持函数调用并返回 token usage**。这是接口协议要求，并不限制只能使用 OpenAI 托管的模型。暂未实现 Anthropic 原生 Messages 或 OpenAI Responses 协议。即使服务商声称兼容，也需要支持这里使用的工具调用循环和 usage 格式。图片还原 case 还要求模型支持图片输入。

通过密钥管理工具或 Shell，将 Key 设置到配置指定的环境变量中。在交互式 Bash/Zsh 终端，可使用以下方式避免将 Key 写入命令历史：

```bash
printf 'Model API key: '
stty -echo
read -r SKILLS_EVAL_API_KEY
stty echo
printf '\n'
export SKILLS_EVAL_API_KEY
```

如果输入过程中被中断、终端无法显示输入字符，请运行 `stty echo`。如果希望只维护一个本地配置文件，可在被 Git 忽略的 `evals/*.local.json` 中另加 `"api_key": "实际密钥"`。`api_key_env` 始终填写环境变量名，不是密钥本身。runner 会在当前进程把本地密钥放入该环境变量，并从运行日志的配置快照中移除 `api_key`。不要把 Key 写入跟踪的 JSON、case prompt 或命令行参数。也可以复用已有环境变量，例如已导出 `OPENAI_API_KEY` 时，将 `api_key_env` 设置为 `OPENAI_API_KEY`。仓库中的 `.env` 文件**不会自动加载**。

部分兼容服务要求使用 `max_tokens`，此时修改 `output_token_parameter` 即可。`request_options` 可选参数包括 `temperature`、`top_p` 和 `reasoning_effort`，仅填写所选模型支持的参数和值。工具不强制指定模型、temperature 或推理强度。使用 `--config /path/to/config.json` 切换配置，使用 `--model MODEL_ID` 覆盖本次运行的模型。实际生效的配置会作为快照保存在运行日志中，不包含 Key。

[model.compatible.example.json](model.compatible.example.json) 提供了另一份使用 `max_tokens` 的最小兼容接口模板。其中 URL 和模型 ID 均为占位符，不代表已验证的服务商。使用不同的本地配置文件即可切换服务商或模型，无需额外的 profile 管理机制：

```bash
cp evals/model.compatible.example.json evals/another-model.local.json
# 运行前修改基础地址和模型，并导出配置指定的 Key 环境变量。
uv run python evals/scripts/run.py --config evals/another-model.local.json --case vchart-grouped
```

所有 `evals/*.local.json` 均被 Git 忽略。API Key 可以保存在被忽略的本地 JSON 的 `api_key` 字段，或由环境变量提供。同一 endpoint 下的不同模型也可以通过 `--model` 切换。

对于采用 Azure 风格 HTTP 鉴权的兼容网关，将 `api_key_header` 设置为 `api-key`，默认值对应 `Authorization: Bearer ...`。可选的 `api_version` 会追加 `api-version` 查询参数。`base_url` 应填写服务商规定的基础地址；如果接口要求 deployment 路径，也要包含该路径。此时切换模型可能还需要同步修改 deployment 路径。这些配置沿用 Chat Completions 消息与工具协议，不会启用 Responses 适配器。请求阶段从指定环境变量读取凭据；本地 JSON 的 `api_key` 会先装入该变量。

API 调用仍会消耗 token。限制按**每个 case 的每一轮任务**计算，不是整个任务组的总限制。`max_total_tokens` 累加已完成请求中服务商报告的用量，包括重复输入的上下文。达到阈值后，runner 停止发起后续请求；单次请求仍可能超过剩余额度，因此它不是账单硬上限。`max_output_tokens` 限制单次响应长度；如果服务商将推理 token 纳入该参数，也会计入限制。请求次数、工具调用次数、上下文大小和超时提供额外约束。runner 不会自动重试、压缩上下文或静默裁剪会话历史。文件读取结果会明确标记是否截断以及后续读取位置。服务商缺少 usage 时，运行会失败；发生超时的请求仍可能被服务商计费。

每次 API 请求都会再次发送所选 Skill 入口、任务、工具定义和累计会话历史。调用工具后，下一次请求还会带上工具结果。因此，一个只读取过一次的参考文件，其内容可能在后续多次请求中重复计入输入 token。例如，三次请求分别报告 2,000、3,000 和 4,000 个输入 token，累计输入就是 9,000，即使其中包含相同的历史上下文。这是逐次请求的累计用量，不是去重后的资料大小。`cachedPromptTokens` 记录服务商返回的缓存用量；仅凭 token 总数不能确定实际费用。提高预算或执行大批任务前，请先检查请求快照和 usage。

### 3. 准备浏览器检查

```bash
npm ci --prefix evals
node evals/node_modules/playwright/cli.js install chromium
```

在 Linux 中，如果 Playwright 提示缺少系统库且环境允许安装，可使用 `install --with-deps chromium`。省略 `--browser` 可只生成产物，不执行渲染检查或截图。

### 4. 查看用例，先跑单个，再跑任务组

列出用例不需要配置文件或凭据：

```bash
uv run python evals/scripts/run.py --group all --list
```

先运行一个任务，默认 runner 为 `api`：

```bash
uv run python evals/scripts/run.py --case vchart-grouped --browser

# 显式覆盖模型
uv run python evals/scripts/run.py --case vchart-grouped --model MODEL_ID --browser
```

随后选择相关任务组：

```bash
# 8 个 VChart 核心任务，包含三轮续改，共 10 次独立模型会话
uv run python evals/scripts/run.py --skill vchart-skill --group core --browser

# 4 个 VTable 任务
uv run python evals/scripts/run.py --skill vtable-skill --group core --browser

# 24 个额外的 VChart 任务
uv run python evals/scripts/run.py --skill vchart-skill --group extended --browser
```

使用 `--group all` 运行全部 41 个任务，或重复传入 `--case` 选择多个任务。显式指定 case 时，以 case 选择为准。`--skill` 选择 Skill；分组在该 Skill 内生效。默认选择 VChart 的 core 组。指定 Skill 后，`--group all` 仅选择该 Skill 的全部任务。`--timeout 600` 设置每轮任务的执行时限。建议从少量任务开始，检查 `usage.json` 后再扩大范围。

API runner 会将所选 `SKILL.md` 加入初始指令，提供四个工具：`read_file`、`list_files`、`write_file` 和 `run_skill_script`。读取范围限于选定的已安装 Skill、任务输入和输出，写入范围限于 outputs。只能执行 Skill 自带的 HTML 生成脚本和知识检索脚本，脚本不会获得模型凭据。参考资料按需读取。检查器的预期结果保存在工作区外，无法通过这些工具读取。这是受限的工具接口，不是操作系统沙箱：应仅运行已审查的 Skill 脚本，在浏览器中执行前检查生成的 HTML。

### 5. 查看报告

如果想使用自己的 prompt 和数据，无需添加固定 case，可指定 `--skill`、`--prompt-file`，并按需重复传入 `--input`。见 [自定义任务示例](../docs/debugging.md#alternative-a-simple-model-api-harness)。自定义任务不能与 `--case` 或 `--group` 混用。它们复用 runner 和日志，但没有预设的语义正确性断言。

终端最后一行会输出 `Report: .../evals/runs/<run-id>/README.md`。打开该文件可查看各 case 的结果、日志和产物。多轮任务分别保存在 `turn-1`、`turn-2` 和 `turn-3` 子目录中。

- 退出码 1 表示自动执行或检查失败。请检查 `execution.json`、`stderr.log`、`events.jsonl`、API 响应和 `browser.json`。配置或参数错误可能返回其他非零退出码。
- 退出码 0 表示自动执行与检查成功，**不代表视觉或语义审核通过**，case 仍保持 `needs-review`。
- 按照保存的 `expectations.json` 复核后，将结论和产物哈希写入 `review.json`。保留失败记录及原始日志；后续复核不会修改先前的退出码。
- `evals/runs/` 已被 Git 忽略。贡献变更时，应说明涉及的 case ID、模型、runner、命令、usage、自动检查结果和复核结论；必要时附上已检查的截图或日志。

### 可选：通过已安装的 Codex CLI 评测

仅在需要测试该宿主行为时选择此方式。它使用你本地的 Codex 鉴权、配置和额度；API runner 的用量限制不适用于此模式。

```bash
uv run python evals/scripts/run.py --runner codex --case vchart-grouped --browser
```

`--agent /absolute/path/to/codex` 用于指定可执行文件，`--model` 用于覆盖模型。Codex 需要支持 `exec --json --ephemeral --sandbox workspace-write --skip-git-repo-check`。初始历史运行使用的版本为 `0.155.0-alpha.9`。可参考官方 [CLI 说明](https://learn.chatgpt.com/docs/codex/cli)、[鉴权说明](https://learn.chatgpt.com/docs/auth) 和 [配置说明](https://learn.chatgpt.com/docs/config-file/config-basic)。此模式启用 workspace-write 沙箱，禁用交互审批和项目文档注入，同时保留宿主的其他配置。API 与 Codex 模式的工具能力不同，对比结果时应记录这一差异。

### 常见配置问题

| 现象 | 处理方式 |
| --- | --- |
| API 配置无效，或仍为 MODEL_ID 占位符 | 复制配置示例，填写实际基础地址和模型 ID。 |
| 缺少凭据环境变量 | 在当前 Shell 中导出 `api_key_env` 指定的变量。 |
| API 返回 401/403/404 | 检查凭据权限、模型 ID 和基础地址，查看脱敏后的错误日志。 |
| API 不接受 token 参数或 tools | 改用接口支持的 token 参数，并选择支持函数调用的模型。 |
| 服务商未返回 token usage | runner 需要输入、输出和总 token 用量来累计预算。 |
| 触发 length、请求次数、token 或上下文限制 | 检查部分产物和 usage，再有针对性地调整限制；原运行仍保留失败状态。 |
| 缺少 Playwright 或 Chromium | 执行上文的 npm 安装与 Chromium 准备命令。 |
| 浏览器报告 CDN 或网络错误 | 检查公开 unpkg 的可访问性，并保留失败证据。 |
| 报告显示 needs-review | 检查源代码、截图和任务要求的交互。 |

## 用例与检查项

`cases/<skill-name>/tasks.json` 保存 prompt 和输入文件名。`cases/<skill-name>/expectations.json` 由检查器读取，不会复制到 Agent 的任务工作区。输入采用可公开分享的合成数据。

当前收录 32 个 VChart 任务、4 个 VTable 任务和 5 个数据叙事任务。各 Skill 的用例目录、分组和验收条件见 [用例说明](cases/README.zh-CN.md)。收录数量与实际执行数量分别统计。VChart 核心组覆盖分组、诊断、堆叠、百分比归一化、空值、解释、澄清和基于文件的续改；扩展组包含 React、图片还原、坐标轴、交互及更多图表类型。

三轮续改任务每轮都会启动独立的 Agent 执行，将上一轮文件状态复制到新工作区。它验证的是对已有产物的修改能力，不是会话记忆。每轮都有独立日志和产物，某轮失败后，后续轮次不会执行。纯文本任务不要求 HTML；如果生成了未要求的输出文件，则判定失败。

`--browser` 通过本地回环地址打开生成的 HTML，记录 JavaScript、控制台和网络错误，检查非空白 canvas，保存截图；数据类 case 还会检查运行时记录。季度筛选 case 会实际选择 Q1、Q2 和全部，并对比展示的数据。仅能渲染 canvas，不足以证明图表编码正确或设计质量合格。

## 日志

每次运行都会在被 Git 忽略的 `evals/runs/` 下创建新的独立目录，保留原始执行证据：

- `README.md`：各 case 的结果与产物链接。
- `model-config.json`：运行级别的实际 API 配置，只记录凭据环境变量名。
- `metadata.json`：完整任务、runner、启动命令、runner/Agent 版本、配置的模型，以及输入和已安装 Skill 的 SHA-256 哈希。
- `expectations.json`：当前任务轮次的检查要求快照，位于 Agent 工作区外。
- `prompt.txt`：实际传入的 prompt。
- `events.jsonl`：脱敏后的请求与 usage 事件、工具参数与结果、完成的回复，或可选 Codex CLI 模式下的事件流。
- `request-NNN.json`、`response-NNN.json`：API 请求与响应正文，已移除配置的 API Key。图片 data URL 替换为哈希，实际图片仍保存在工作区输入中。
- `usage.json`：累计请求数、工具调用数、输入/输出/总 token 数、服务商报告的缓存输入 token、完成状态和耗时。服务商报错或缺少 usage 时，会标记用量统计不完整。父进程超时可能只留下最后一次部分快照，因此应同时查看 `execution.json`。
- `stderr.log`、`execution.json`：诊断日志、退出状态、超时与耗时。
- `final-response.md`：从事件流中提取的已完成助手回复。
- `workspace/`：已安装的 Skill 快照、输入文件和生成产物。
- `browser.json`、`browser-command.log`、`screenshot.png`：启用浏览器检查后保存的证据。
- `runtime-spec.json`：模板暴露图表实例时，从浏览器获取的 VChart 配置；无法获取时为 null。函数体表示为 `[function]`，检查回调行为时应查看源代码。
- `result.json`：产物清单与哈希、自动检查结果，以及单独的视觉复核清单。

工具不会虚构宿主未提供的数据，也无法承诺记录私有模型推理或宿主未暴露的事件。它不会输出整个环境或鉴权文件。进程日志会脱敏已知凭据格式及含密钥的环境变量值。输入和产物仍可能包含用户数据，分享运行目录前请先检查。

进程成功且存在产物时，结果为 `needs-review`，不会自动判为“全部通过”。检查失败时为 `failed`。未执行的浏览器检查或视觉复核标记为 `not-run`。

人工视觉复核时，请按照 case 清单检查截图和实际 HTML，再单独保存 `review.json`，包含 `status`、`reviewer`、`notes` 和已复核产物的哈希。保留原始自动报告。当前不包含参考图片相似度计算或模型视觉评分。

如需不重新生成产物，只重跑浏览器检查：

```bash
node evals/scripts/check-browser.mjs evals/runs/RUN/CASE
```

该命令只替换浏览器证据；原 `result.json` 仍记录初次评测结果。修改 Skill 或输入后，应创建新运行。

## 图表与表格基础任务的真实 API 记录（2026-10-09）

使用本地配置的 `gpt-5.4-2026-03-05` 接口和 40,000 tokens 累计阈值，两个代表性用例都未完成。`vchart-grouped` 发起 3 次请求，服务商报告共 56,700 tokens，写出了 `spec.js`，但尚未生成 HTML 就停止。`vtable-list` 发起 5 次请求，报告共 49,748 tokens，写出了 `spec.js` 和 `demo.html`，但未给出最终回复，浏览器检查也未通过。阈值在两次请求之间检查，因此最后一次请求可能超过阈值。两次运行报告的缓存输入 tokens 均为 0。详细日志保存在本地被 Git 忽略的 `evals/runs/` 中。

这两次失败不能证明 VChart/VTable 任务无法通过模型 API 完成，但也不能称当前 harness 已可靠支持这些基础用例。评估 Skill 修改时，应结合生成产物、用量和独立复核，而不只看 runner 退出码。

## 数据叙事调试

数据叙事端到端任务推荐在 Codex / Claude Code 中运行。API harness 虽暴露部分计划、VSeed、素材、HTML/PPT 和 JavaScript 脚本，但目前的有限工具循环与不断增长的上下文尚未完成真实模型故事用例。它不提供 Python 分析沙箱、浏览器工具或图片生成。不能仅凭 API harness 失败判定故事质量或 Skill 正确性。

```bash
uv run python evals/scripts/run.py --skill data-storytelling --list
```

用例、输入和验收条件见 [数据叙事用例](cases/data-storytelling/README.zh-CN.md)，可在完整 Agent 中使用。API 直跑仍可用于调查，但不作为推荐的端到端评测方式。故事需要读取更多参考资料并写多个中间文件；单纯提高预算不能解决上下文增长。已尝试一个真实模型用例，结果和用量见下文；其余用例尚未运行。

浏览器保存编译后的图表 spec、截图、页面和网络错误；Web-PPT 另检查翻页。它不自动判定叙事质量、所有数字或整页布局，不做像素相似度验收。

### 首次真实模型运行（2026-10-09）

`story-retention-html` 使用 `evals/visactor.local.json` 中的 `gpt-5.4-2026-03-05`，通过 OpenAI 兼容 API 发起 5 次请求。模型读取了输入与多份 Skill 参考资料，写出了 `runtime/dataset_map.json`（4 条月度记录、3 条分群记录及排序副本）。第 5 次请求后，服务商累计报告 166,990 tokens，超过本地配置的 160,000 上限，runner 停止；`plan.md`、HTML 与其余中间产物均未生成，评测结果为 `failed`。日志在被忽略的 `evals/runs/20261009T094650Z-99a5c791/`。

5 次请求的 prompt tokens 分别为 9,910、29,998、36,085、43,379、46,693；服务商报告的缓存 tokens 均为 0。此前读取的 Skill 内容随对话历史再次进入后续请求。这个结果不能说明模型生成的故事质量，只说明该用例与当前 API harness / 预算组合未完成。不要直接批量提高预算；先检查参考资料读取与上下文开销。
