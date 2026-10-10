# Data storytelling cases

[English](README.md) | [简体中文](README.zh-CN.md)

这些用例使用小型模拟数据，覆盖叙事、图表与素材的不同组合。允许多种正确的文字、风格与章节布局，不要求复制参考页面。

| Case | 分组 | 核心检查 |
| --- | --- | --- |
| story-retention-html | core | 留存百分点、分群差异与事实/假设边界 |
| story-regional-scrolly | core | 同一主图随阅读步骤变化、份额口径 |
| story-retention-deck | core | 图表证据、键盘翻页、最终收束 |
| story-supply-assets | extended | SVG 素材的声明、归一化、引用与实际可见性 |
| story-vegas-feature | extended | 模拟数据声明、feature 呈现、生图或明确 fallback |

固定 prompt 在 tasks.json，输入在 inputs/；expectations.json 的验收条件不提供给 Agent，fixtures.json 记录数据哈希。无需提供已完成的计划、洞察答案或参考成品。

```bash
uv run python evals/scripts/run.py --skill data-storytelling --group all --list
```

端到端复核请在 Codex 或 Claude Code 中使用这些 prompt 和输入；当前不推荐用 API harness 直跑完整故事。[评测指南](../../README.zh-CN.md) 记录了其边界和已尝试的运行。自动检查只覆盖可运行性、图表编译和部分交互；数据准确、素材、滚动同步、可读性和叙事质量按 expectations.json 人工审阅。截图用于复核，不作像素标准答案。生图失败后的合规降级是有效结果；空图框或虚假成功不是。

`story-retention-html` 的模型运行触及 token 上限而失败，其余 4 个任务尚未实跑；固定脚本的浏览器 smoke 与模型表现分别记录。选择侧重可独立复现的小型任务，未纳入内部服务、外部数据下载或真实人物图片依赖。
