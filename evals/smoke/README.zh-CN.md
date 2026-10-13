# 浏览器 smoke 用例

[English](README.md) | [简体中文](README.zh-CN.md)

用固定配置验证各 Skill 的本地脚本、模板和浏览器运行链路。runner 使用独立复制的 Skill 和固定版本的 npm 资源，不调用模型；自动发现 `<skill>/<case>/` 下的 `config.json`，CI 默认执行所有用例。

| Skill | 用例 | 覆盖范围 |
| --- | --- | --- |
| vchart-skill | [vchart-grouped](vchart-skill/vchart-grouped) | 分组图表生成、渲染、完整数据记录 |
| vtable-skill | [vtable-list](vtable-skill/vtable-list) | 明细表生成、渲染、完整数据记录 |
| data-storytelling | [story-html](data-storytelling/story-html) | 计划、图表组装、素材规范化、HTML 渲染 |
| data-storytelling | [story-ppt](data-storytelling/story-ppt) | Web-PPT 组装、图表渲染、前进及返回翻页 |

## 用例结构

```text
evals/smoke/<skill-name>/<case-id>/
  config.json
  expectations.json
  spec.js                 # 仅 demo builder 使用
  inputs/
```

- `config.json`：构建方式和配置。Skill 和 case ID 由目录名确定；case ID 在 smoke 目录内唯一。
- `inputs/`：该用例独立维护的数据和预先编写的页面输入。HTML 与 PPT 各自保存一份小型共享观测数据，完整复制单个用例即可运行。文件名采用平铺结构，与现有任务工作区约定一致。
- `expectations.json`：浏览器验收配置及必须执行的检查。运行时复制到证据目录，不放入安装后的 Skill 工作区。
- demo 用例的固定 JavaScript 放在 `spec.js`。runner 读取 `records` 指定的 CSV，将 `numericFields` 列出的字段转为数字，再替换源码中的 `{{RECORDS}}` 占位符，交给 Skill 的 HTML 生成脚本。数据直接写入配置对象，以兼容 VChart 编辑器对 `spec` 的独立解析。
- story 用例在 `config.json` 中声明 `target`（`html` 或 `ppt`）、`preset` 和 `body`。输入包括 `plan.md`、`dataset_map.json`、`chart_specs.json`、`page.json` 和声明的正文文件；runner 将它们交给 Skill 内置脚本处理。

## 本地运行

在仓库根目录执行：

```bash
uv sync --locked
npm ci --prefix evals --ignore-scripts
node evals/node_modules/playwright/cli.js install chromium

uv run python evals/scripts/smoke.py --list
uv run python evals/scripts/smoke.py
uv run python evals/scripts/smoke.py --skill data-storytelling
uv run python evals/scripts/smoke.py --case story-ppt
```

可重复传入 `--case` 选择多个用例，同时指定 `--skill` 时，用例必须属于该 Skill。列出用例不需要浏览器或模型凭据。Linux 缺少浏览器系统依赖时使用 `install --with-deps chromium`。

每次运行在 `.cache/` 下新建证据目录；`--output-dir PATH` 可以指定尚不存在的目录。保留配置、验收文件、输入、生成的源码/HTML、构建日志、浏览器报告和截图；story 还保留编译后的图表配置及中间产物。CI 将同样的证据保存七天。有用例失败时命令返回非零退出码，其余已选用例仍会继续运行。

## 验收与维护

浏览器断言实现在 [check-browser.mjs](../scripts/check-browser.mjs)。当前每个用例都要求图表/表格画布非空、没有页面或资源错误、本地资源加载成功。图表和表格用例将运行时记录与自己的 CSV 对比；story 要求图表编译成功；Web-PPT 另检查页面数量、前进翻页、返回后的坐标和可见性，完整 Chromium headless 模式下保持动画开启。

`requiredChecks` 声明必须执行的检查名称。如果某项检查未执行，即使其余检查通过，报告仍会失败。可选的 `review` 是人工复核提示，CI 不做视觉或叙事评审。截图用于保留证据，不作为逐像素对比的标准答案。

新增用例时，在对应 Skill 下创建目录，补齐配置、输入和验收文件，再单独运行该用例；不需要修改 runner 中的 case ID 清单。使用小型、合成或公开输入，声明必要的验收检查，并保留失败结果和日志。smoke 数据和 [模型任务目录](../cases/README.zh-CN.md) 独立维护：模型任务用 `run.py`，固定浏览器 smoke 用 `smoke.py`。
