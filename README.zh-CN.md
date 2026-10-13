# VisActor Agent Skills

[English](README.md) | [简体中文](README.zh-CN.md)

面向具备文件读写和命令执行能力的 Agent，提供 VChart、VTable 和数据叙事 Skills。用于生成图表、表格、HTML 数据故事与 Web-PPT，并诊断图表配置问题。

## Skills

| Skill | 能力 |
| --- | --- |
| [vchart-skill](skills/vchart-skill/SKILL.md) | 图表生成、问题诊断、图片还原和 React 集成 |
| [vtable-skill](skills/vtable-skill/SKILL.md) | 明细表、透视表与透视图、交互和问题诊断 |
| [data-storytelling](skills/data-storytelling/SKILL.md) | 数据分析与叙事设计、滚动故事、HTML 报告和 Web-PPT |

每个 Skill 都包含完整指令、本地参考资料、模板和脚本。无需额外安装 VisActor CLI、MCP 服务，也无需为 Skill 单独配置模型 Key 或访问 VisActor 托管 API。模型能力由宿主 Agent 提供。

**推荐直接在 Codex 或 Claude Code 中使用 Skills。** 模型访问与工具执行由你使用的 Agent 提供。其他兼容的 Agent 也可以尝试使用，目前不提供专门的接入说明。

## 安装

在你准备使用 Skills 的项目目录中执行：

```bash
npx skills add VisActor/skills --skill vchart-skill
npx skills add VisActor/skills --skill vtable-skill
npx skills add VisActor/skills --skill data-storytelling
```

按照安装器提示选择 Codex 或 Claude Code。每个 Skill 都可以按需单独安装。更多安装选项见 [Skills CLI 说明](https://github.com/vercel-labs/skills#usage)。

运行要求：

- Node.js 和 npm，用于执行上述安装命令。
- 具备文件系统和 Shell 工具的 Agent，以及该 Agent 自身的模型访问权限。
- VChart/VTable 脚本需要 Python 3.9+；data-storytelling 需要 Python 3.10+ 和 Node.js（校验 JavaScript）。脚本使用 Python 标准库。
- 浏览器和网络连接，用于打开生成的 HTML。模板通过公开的 unpkg CDN 加载固定版本的 VChart/VTable、React（需要时）和 Monaco，因此并非完全离线运行。data-storytelling 另加载固定版本的 VSeed 与 GSAP。

VChart 知识检索在本地读取随 Skill 附带的示例和 SOP，采用关键词匹配，无需托管的语义检索服务。未匹配的问题可继续查阅内置类型定义与 API 参考资料。

## 使用

安装后，在 Agent 中指定所需 Skill，并提供你的数据。例如：

- “用 VChart 对比这个 CSV 中各地区、各季度的销售额，给我可编辑的源码和 HTML。”
- “使用这个文件中的全部数据，用 VTable 创建一个支持排序的明细表。”
- “使用 data-storytelling，向增长负责人解释这个 CSV 的留存变化，生成可分享的 HTML 故事。”

data-storytelling 由当前 Agent 生成 VSeed 配置，再用本地脚本组装；不依赖托管图表生成服务。图片生成使用宿主能力，没有生图工具时采用计划声明的 fallback。Web-PPT 是浏览器演示稿，不是 `.pptx`。

生成的 JavaScript/HTML 是可执行代码。请在本地预览自己生成或已审查的产物；评测浏览器并不是用于执行任意不可信提交的安全沙箱。

## 开发与维护

本节面向需要修改 Skills 或运行本地测试的贡献者。默认分支和主维护分支均为 `develop`，请先阅读 [贡献指南](CONTRIBUTING.md)。

### 从本地仓库安装

在本地仓库根目录执行，安装当前工作副本中的 Skill：

```bash
npx skills add ./skills/vchart-skill
npx skills add ./skills/vtable-skill
npx skills add ./skills/data-storytelling
```

也可以将 Skill 的完整目录复制到 Agent 的技能目录中，包括参考资料、模板和脚本，不要只复制 `SKILL.md`。Codex 和 Claude Code 的调试工作区准备方式见 [本地调试指南](docs/debugging.md)。修改 Skill 后，请先更新安装副本，再重新测试。

### 回归测试

Python 维护环境要求 Python 3.12+ 和 [uv](https://docs.astral.sh/uv/)：

```bash
uv sync --locked
uv run pytest tests -q
uv run ruff check skills tests evals/scripts
```

固定浏览器 smoke 用例按 Skill 集中在 [evals/smoke/](evals/smoke/README.zh-CN.md)，每个用例的配置、输入和验收文件放在一起。按指南准备浏览器后，用 `uv run python evals/scripts/smoke.py` 执行全部用例，也可通过 `--skill data-storytelling` 或 `--case story-ppt` 单独选择。

### 通过模型 API 调试任务

对于持有模型 API 的用户，轻量 harness 可以加载指定 Skill，执行固定 case 或自定义 prompt 与输入文件，支持 OpenAI 兼容的 Chat Completions 接口。目前应将它视为输入、产物边界清晰的 VChart/VTable 任务的实验性调试入口，而不是已验证可替代通用 Agent 的方案。数据叙事端到端任务及日常交互式调试推荐使用 Codex 或 Claude Code。

固定 prompt/数据任务、可观察的执行日志、浏览器检查与截图，详见 [评测说明](evals/README.zh-CN.md)。这些是维护工具，不属于用户安装的 Skill。默认 runner 使用用户自行配置的模型 API 和 Key，无需安装 Codex 或 Claude Code；模型调用可能产生费用。将 `evals/model.example.json` 复制为被 Git 忽略的 `evals/model.local.json`，配置 endpoint、model 和 Key 环境变量后，运行 `uv run python evals/scripts/run.py --case vchart-grouped --browser`。环境准备和用量限制详见快速上手。

[用例目录](evals/cases/README.zh-CN.md) 收录 32 个 VChart 任务、4 个 VTable 任务和 5 个数据叙事任务，按 Skill 分目录维护，并提供明确的验收条件。runner 默认执行包含 8 个任务的 VChart 核心组；收录用例并不代表所有任务均已执行。

## 版本管理

Skills 按整个仓库统一管理版本。每次正式发布使用 Git tag 标识一个包含 Skill 指令、参考资料、模板和脚本的版本快照，各 Skill 不单独维护版本号。

反馈问题或复现结果时，请记录发布 tag 或 commit SHA；分支内容会随开发变化。VTable `1.26.8` 等依赖版本表示底层库的版本，不是 Skill 的发布版本。历史 VMind SDK 的 tag 保持不变，仍归属于原 SDK。

## VMind 历史版本

原 VMind SDK 不再维护，其代码和文档仍可通过 [历史发布版本](https://github.com/VisActor/skills/releases) 获取。

[MIT 许可证](LICENSE)
