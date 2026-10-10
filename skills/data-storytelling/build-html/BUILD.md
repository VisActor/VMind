# HTML Build Module

## Build Target

Build 阶段输入：`plan.md` + `runtime/dataset_map.json`
输出：单文件自包含 `output.html`

最终 HTML 使用固定 `scripts/compose_story.py` 从磁盘组装。Agent 只生成 `runtime/body.html` 和 `runtime/page.json`；章节、正文、Methodology、图表容器和素材引用写在 HTML 片段中，不生成 Python renderer。输入约定见 [page-composition.md](../references/page-composition.md)。

`runtime/dataset_map.json` 是 Build 的必需外部输入：它由当前 Agent 在 Phase 2/3 完成数据分析后写入 runtime 目录；键为数据引用名，值为记录数组。Build 只消费这个文件，不负责猜测、重建或补写 dataset 内容。

## Responsibility Split

Build 可调用的 workflow 入口只限：

- `build-html/scripts/prepare_story_head.py`
- `scripts/assemble_story_specs.py`
- `scripts/normalize_story_assets.py`
- `scripts/compose_story.py`
- `scripts/validate_js.py`

`scripts/compose_story.py` 会内联共享 `scripts/vseed-render.js` 以及 HTML-only `build-html/scripts/story-*.js`。其他 `scripts/` 文件都是内部 helper，Build 不直接调用。

下方命令中的 `$SKILL_DIR` 表示当前 data-storytelling skill 根目录。

LLM 负责：
- 有 Charts 时按 `references/vseed-generation.md` 生成 `runtime/chart_specs.json`
- 基于 `plan.md` 生成章节 HTML
- 写 body.html / page.json，然后执行固定组装脚本

真源分工固定：
- `BUILD.md`：构建流程、fail-fast 规则、全局边界
- `visual-primitives.md`：shared component selection surface；Build 选择可选视觉组件时先读它
- `patterns/*.md`：section slot grammar、合法 slot、pattern-specific 布局与约束
- `html-templates.md`：shared component markup contract、组件级 runtime hook contract
- [page-composition.md](../references/page-composition.md)：正文、配置与素材引用合同

## Required Runtime Files

- `story-head.html`
- `spec_map.json`
- `resolved_asset_bindings.json`

`spec_map.json` is renderer-aware, but data-storytelling `Charts` currently only supports `renderer: "standard-chart"`. Existing entries without `renderer` are treated as `standard-chart` for backward compatibility.

`scripts/compose_story.py` 会从 skill 目录内联固定 runtime JS；Build agent 不需要读取或改写这些 runtime 源文件。

---

## 1. Section Pattern → HTML 实现

Agent 先读本文件到第 3 节，确认 build 边界、runtime 文件、黄金规则和禁止事项。随后从 `plan.md` 提取章节顺序、每章 `Pattern`、`Charts[*].id`、Style Preset、Methodology 与 asset 引用。生成单个 section 时，读取该 chapter 的 `Pattern`，再读取对应的 pattern 文件拿到 section slot grammar、named slots 和 pattern-specific 约束；需要选择 optional shared primitive 时先读 `visual-primitives.md`，再去 `html-templates.md` 取 canonical markup。

每个 chapter 都按自己的 Pattern 独立组装 section；不要先写一套全篇 body template，再把所有章节塞进同一种 heading / card / chart 骨架。

### 决策流程

```
读本文件到第 3 节，确认全局边界
  ↓
从 plan.md 提取全局输入
  ↓
逐章读取 plan.md chapter
  ↓
Pattern 是什么？
  ↓
读对应 patterns/*.md → 获取外层 section contract + named slots + slot-specific 约束
  ↓
某个 slot 需要选择 optional shared primitive？
  ↓
读 visual-primitives.md → 选择合法 shared component
  ↓
读 html-templates.md → 获取该 component 的 canonical markup
  ↓
保留模板中既有 runtime hook
  ↓
填充内容槽位 → 生成 HTML section
  ↓
全部章节生成完成
  ↓
执行第 6 节输出检查
  ↓
用 scripts/compose_story.py 组装最终 HTML
```

---

## 2. Runtime Hook 体系

页面外壳、CDN、runtime JS 内联和初始化顺序都由 [compose_story.py](../scripts/compose_story.py) 承担。Build 只在 page.json 填 `presentation_mode`，不要重新描述或实现这一层。

Build 只负责章节与组件 DOM：
- Pattern 外层结构和 `data-pattern` / `data-step` / `data-chart-id` 等 hook 来自对应 `patterns/*.md`
- Shared component anatomy 和组件级 hook 来自 `html-templates.md`
- 不新增章节级动画脚本、动画配置字段或可见动效说明

文本输入和最终 DOM markup 必须分层处理。传给 `html.escape`、`md_inline` 或 markdown helper 的参数只能是文本内容；已经成形的 HTML / SVG / 组件片段只能作为 DOM markup 直接拼入对应 slot，不能再当作 markdown 文本二次处理。

## 3. 黄金规则（四条，严格执行）

### 规则 1：Head 资源只通过 prepare_story_head.py 生成

HTML 产物必须自包含。Head 相关资源只认 `build-html/scripts/prepare_story_head.py`，它生成且只生成：

- `story-head.html`

`compose_story.py` 只从磁盘读取这个 head 产物并插入最终 HTML。禁止手写 helper CSS markup、preset token、`:root { ... }`、`body { ... }`，也禁止在实现代码中直接展开 `story-base.css`、component/pattern CSS 正文或 VSeed theme tokens。

### 规则 2：从模板构建 + 专家模式例外

先读 pattern 文件，使用对应 Pattern 的章节骨架构建。若骨架中用到了 shared block，则从 `html-templates.md` 复用 canonical 片段；不要在 pattern 文档外再手写第三套 shared markup。如果现有模板不够用，用已有组件垂直组合（chart-wrapper + kpi-row + highlight-box）。

**专家模式：如果用户提供了具体布局描述，把它解释为当前 pattern grammar 内的约束。** 用户明确给出的视觉布局可以指导合法变体与槽位落点，但不能跳出当前 pattern 已定义的 grammar；如果该 pattern 另有明确内部优先级规则，则以该规则作为变体选择的 source of truth。此时仍需遵守规则 3。

### 规则 3：尊重组件契约，不在产物里 patch 样式

- 最终 HTML 的 head 样式与图表主题配置只来自 `story-head.html`；`compose_story.py` 不提供额外 CSS 或 chart theme 注入口。
- 不写硬编码颜色、尺寸或临时 CSS。Build 选择已有 pattern、shared component 和 preset 产物；不要用 inline `style="color: ..."` 或临时 `<style>` patch 视觉。
- 不覆盖 shared selector、共享宽度约束或 pattern grid。包括但不限于 `.section-heading`、`.cover-intro-bg`、`.action-card`、`.badge`、`.scrolly-section`、`.story-container`、`.chart-wrapper`、`.hero-inner`、`.narrative-rail`、`.chart-narrative-rail`、`.magazine-module-grid`、`.alternating-inner`。尺寸、position、display、grid、padding、border、background、radius 和阅读宽度由 shared CSS / pattern CSS 管。
- 不新增未在 `html-templates.md`、`visual-primitives.md` 与对应 `patterns/*.md` 中定义的 anatomy、类名、metric 结构或标准图表区；标准图表统一复用 shared `chart-wrapper` contract，且普通章节同一 `chartId` 只挂一个 `chart-wrapper`。`scrollytelling` 是唯一例外：section root 必须挂同一个 primary `chartId` 作为滚动 hook，内部主图仍保留 `chart-wrapper` contract。
- 不重写背景机制：不要重写 `.hero::before`、`.cover-intro-bg`、另起 overlay 或额外背景层；背景图只使用 pattern 已定义的背景节点和 helper payload。唯一允许的 inline style 是通过正文中的 `data-story-background` 引用，由固定脚本 把已解析的 `data_uri` 写入该背景节点的 `background-image`。
- 不混用组件槽位：`kpi-value` 只放 `html-templates.md#共享指标数值契约` 定义的 metric DOM（数值、可选 prefix/suffix），`kpi-label` 放指标名和上下文。
- 禁止在章节 HTML 或临时 `<style>` 中声明共享 token：`--max-content-width`、`--space-*`、`--radius-*`、`--font-body`、`--font-display`、`--font-mono`、`--chart-height-*`、`--card-padding`、`--badge-*`。

### 规则 4：遵守全局布局边界

- **默认章节使用 shared container，scrolly 明确例外：** 除 `scrollytelling` 外，标准章节默认遵循 `section > .story-container > content`。`scrolly-section` 自带 grid、sticky 和水平 padding，内部不要再嵌 `.story-container`。
- **footer 不是章节容器：** `footer` 只承载方法论、来源、局限性等收尾信息，不要把章节主体组件直接塞进 footer。
- **疑似要补新全局规则时先停：** 如果一个需求需要新增类名、重定义大量 spacing、或改写现有组件结构，先回到对应 `patterns/*.md` 判断是否选错模板；不要在构建阶段临时发明第二套全局布局规则。

---

## 4. Asset Pipeline 与 Surface Model

Asset 是增强层，不是第二套内容系统。Build 只能把 plan 中已经声明并被章节引用的资产，实现为少数稳定的承载面；不能为了用掉素材而新增布局、可见说明、卡片类型或背景机制。

### 4.1 角色边界

- `plan.md` 定义素材导演意图：`Story Meta.presentation_mode`、`Story Visual Identity`、`Asset Registry` 和每章 `SectionVisual.assets[]` 的 placement / usage。
- Build 生成 raw asset payload，但只生成 `Asset Registry` 中声明、且至少被一个章节引用的 asset。
- `normalize_story_assets.py` 是进入 HTML 前的唯一资产 gate，负责把 raw SVG / image 归一化为稳定 runtime payload。
- `compose_story.py` 只消费 `resolved_asset_bindings.json`，不读取 raw SVG 文件，不渲染 asset brief，不重新解析 `## Assets` 来决定落点。
- Build 可以根据 plan 中的主数字、章节 focus 和允许的 support slot，自行选择 `big-stat` 等组件原生数字表达；它们不是 Asset Registry item，也不经过 asset normalization。

### 4.2 Asset Generation Inputs

Build 生成 raw asset 时只读取 plan 中的 Asset Director contract；registry、placement、fallback 与章节引用的结构校验由后续 `normalize_story_assets.py` fail fast 完成。

生成 prompt 必须同时使用：

- `Style Preset` 的 asset prompt context
- `Story Visual Identity`
- `Story Meta.presentation_mode`
- registry asset 的 `media_hint`、`purpose`、`visual_brief`
- 章节 binding 的 placement 与 usage

生成路径：

- SVG asset 输出为 `runtime/generated-assets/{asset_id}.svg`。
- Image asset 读取并执行共享 [image-generation.md](../references/image-generation.md)，由当前宿主 Agent 的生图能力生成，并按 asset ID 保存真实图片。
- 用户提供素材不生成、不改写，只交给 normalize 阶段解析；生成失败按共享约定执行 Plan fallback 并披露。

### 4.3 Runtime 产物

Raw asset 输出到：

```text
runtime/generated-assets/{asset_id}.svg
runtime/generated-assets/{asset_id}.png
```

归一化后必须生成：

```text
runtime/resolved_asset_bindings.json
runtime/asset_resolution_report.json
```

`resolved_asset_bindings.json` 一定存在，即使所有 SVG 都被过滤后 payload 为空也不例外。最小语义如下：

```text
resolved_asset_bindings.json
- <asset_id>:
  - media_hint: svg | image
  - source: generated | user-provided
  - fallback: remove | gradient | text-only
  - placements: [{ chapter, placement, usage }]
  - data_uri: string        # background surfaces
  - inline_markup: string   # SVG corner / icon / action artifact surfaces
```

Payload 只表达渲染材料：
- `data_uri` 只用于 pattern 已定义的背景节点。
- `inline_markup` 只用于 shared component 或 pattern slot 中的真实 inline SVG。
- `placements` 只用于映射与排查，不是可见文案。

### 4.4 Surface Model

Plan 里的 `SectionVisual.assets[].placement` 是 story 语义，不是 shared component 名。Build 必须先把 placement 映射到少数稳定 surface，再选择 pattern 合法 slot 与 shared component。

| Placement | Surface | Payload | 合法承载 |
|---|---|---|---|
| `hero_background_image` | 强开篇 hero 背景 | image / SVG `data_uri` | `hero-impact` 已定义的 image background treatment |
| `opener_motif_background` | 平稳 opener 弱 motif 背景 | SVG `data_uri` | `cover-intro` 已定义的背景节点 |
| `takeaway_accent` | host 组件内部的弱装饰 | SVG `inline_markup` | highlight/callout 等 host 的 corner slot |
| `kpi_lead_icon` | 单个 lead KPI 小符号 | SVG `inline_markup` | KPI icon slot |
| `action_lead_asset` | action lead 弱资产 | SVG `inline_markup` | action lead card 的 asset slot |
| `evidence_image` | 图片证据 | image `data_uri` | `image-evidence` figure |

### 4.5 映射规则

- 先看 pattern 是否有合法 host slot，再看 asset。没有 host slot 时按 fallback 降级，不新增布局。
- `hero_background_image` 只能进入 `hero-impact` image background treatment；`editorial` 下轻量辅助，`feature` 下允许更强主体识别。禁止数据标签、读数、类图表标记、来源说明或解释性文字。
- `opener_motif_background` 只能进入 `cover-intro` motif background；SVG 必须适合作为弱背景层，不承载文字、标签、读数、来源或方法说明。
- 背景消费规则同第 3 节：Build 只通过 `data-story-background` 引用，由固定脚本 把 `data_uri` 写入已有背景节点的 `background-image`，不额外写 opacity、尺寸、overlay 或定位规则。资产自身控制内部透明度、留白和对比度。
- `opener_motif_background` SVG 不得包含覆盖整个 viewBox 的实色 `<rect>`，不得硬编码整块 page / surface 背景色。Normalization gate 会过滤这种 payload。
- `takeaway_accent`、`kpi_lead_icon`、`action_lead_asset` 必须依附已有 host 组件；它们不是独立卡片、独立栏位或独立章节。
- `evidence_image` 使用 `image-evidence` figure；必须输出 caption / reading sentence，不能作为气氛图、背景图、gallery 或 marketing media block。
- 任何 surface 都不能引入新的 visual world；单个章节不能临时发明与 Story Visual Identity 无关的素材语言。
- 资产 DOM anatomy 以 `html-templates.md` 为准，是否允许该 surface 以对应 `patterns/*.md` 的 slot grammar 为准，组件选择以 `visual-primitives.md` 为准。

### 4.6 Fallback 纪律

资产失败只能降低视觉丰富度，不能让最终 HTML 结构失稳。

- `hero_background_image` 不可用：`stat` hero 保留原有 gradient；`image` hero 不能自动改成其他 pattern。若同章有合法主数字锚点，使用 `hero-impact` 的 `stat` mode；否则中断并回到 plan / asset 修正。
- `opener_motif_background` 不可用：保留 `cover-intro` plain / gradient background，不输出坏图或空背景节点。
- `takeaway_accent` 不可用：保留 host 组件的核心文字、数字或 note，移除 corner visual。
- `kpi_lead_icon` 不可用：输出无 icon 的 KPI。
- `action_lead_asset` 不可用：输出无 asset 的 action lead card。
- `evidence_image` 不可用：移除 image evidence figure；不要生成替代图片，不要留下空 caption 或坏 `<img>`。
- 所有 fallback 都不能留下 `{ASSET_ID}`、`{ICON}`、`{TRI_FRAME_*}`、asset brief、slot 注释、坏 `<img>` 或可见占位文字。

---

## 5. 技术栈

| 层级 | 实现 | 说明 |
|---|---|---|
| 图表 | VSeed + VChart/VTable (CDN) | 通过 `scripts/assemble_story_specs.py` 生成 renderer-aware `spec_map.json`；`standard-chart` 走 VSeed Builder 并路由到 `VChart / PivotChart / ListTable / PivotTable` |
| 页面 shell | `scripts/compose_story.py` | 负责 CDN、runtime JS 内联、初始化顺序与最终 HTML 外壳 |
| 动效 | 内置 motion runtime | Build 只保留 pattern/component hook，不写章节级动画逻辑 |
| 样式 | Head helper 生成的 `story-head.html` | `build-html/scripts/prepare_story_head.py` 从 shared CSS、Style Preset 与 plan-level Style Overrides 组装产物，`compose_story.py` 负责消费 |
| 字体 | 系统字体栈 | `--font-body` 与 `--font-display` 由 shared CSS / preset resolver 管理，禁止外部字体 CDN |
| 交付 | 单个自包含 `.html` 文件 | `compose_story.py` 作为唯一最终组装边界，浏览器打开即可工作 |

---

## 6. 构建步骤

### Step 1：读取 plan.md，提取构建信息

- 提取 `Story Meta`、`Evidence Backbone`、`Chapter Outline`
- `Assets` 只作为素材导演 contract 使用：读取 Story Visual Identity、Asset Registry 与章节 placement 引用；不要把 `## Assets` 章节本身当成可渲染正文输入
- 记录 `Style Preset`
- 若 plan.md 有 `### Style Overrides`，只交给 `build-html/scripts/prepare_story_head.py --plan-file` 解析并映射为 HTML theme layer；Build 不自行解释 token、hex、chart palette 或色彩意图词
- 收集每章 `Pattern`、`Charts[*].id`、素材引用
- 记录 分析阶段生成的 `runtime/dataset_map.json` 路径；缺失则直接中断
- 这一步是 Build 的计划解释阶段，后续 compose 直接消费已固化的生成结果

### Step 2：生成 Head 资产

先执行：

```bash
python3 "$SKILL_DIR/build-html/scripts/prepare_story_head.py" \
  --skill-dir "$SKILL_DIR" \
  --preset "Swiss Modern" \
  --plan-file /path/to/runtime/plan.md \
  --head-output /path/to/runtime/story-head.html
```

### Step 3：本地生成图表并组装 spec_map.json

- 有 `Charts` 时读取 [vseed-generation.md](../references/vseed-generation.md)，由当前 Agent 生成 `runtime/chart_specs.json`；图表类型、数据映射和叙事强调沿用 Plan
- 使用 `scripts/assemble_story_specs.py` 将配置与 `plan.md`、`runtime/dataset_map.json` 本地组装为 `spec_map.json`
- 读取组装输出；标注缺失的 `ANNOTATION_MISSING` 是非阻塞 warning，按上述 reference 决定修正或记录未实现项，其他执行错误仍停止
- 不要手写、复制或改写 `spec_map.json`
- 不要临时猜测 dataset path，也不要把 Python 内存对象重新抄写进 prompt 或 HTML
- 缺省 `renderer` 的 `spec_map` entry 按 `standard-chart` 兼容处理

配置写好后执行（无图表时可省略 `--specs-json`）：

```bash
python3 "$SKILL_DIR/scripts/assemble_story_specs.py" \
  --plan-file /path/to/runtime/plan.md \
  --dataset-json /path/to/runtime/dataset_map.json \
  --specs-json /path/to/runtime/chart_specs.json \
  --output /path/to/runtime/spec_map.json
```

### Step 4：生成并归一化 Story Assets

按第 4 节的 Asset Pipeline 实现 Asset Director contract。Build 读取 `## Assets`，只为“已声明且被章节引用”的资产生成 raw asset，然后通过 Python gate 归一化。

Raw asset 生成必须同时使用 `Style Preset` 的 asset prompt context、`Story Meta.presentation_mode`、`Story Visual Identity`、`media_hint`、placement contract 和该 asset 的 `visual_brief`。不要为未引用资产生成文件；不要把普通 HTML 数字组件登记为 asset。

Image asset 按 [image-generation.md](../references/image-generation.md) 调用宿主生图能力并检查实际落盘图片，不假定特定工具名或返回字段。生成与缺失处理在 normalize 之前完成；normalize 后检查 resolution report，按 Plan fallback 调整 composition，无法保留必需证据时报告 partial/error。

Normalize:

```bash
python3 "$SKILL_DIR/scripts/normalize_story_assets.py" \
  --plan-file /path/to/runtime/plan.md \
  --assets-dir /path/to/runtime/generated-assets \
  --user-assets-dir /path/to/runtime/user-assets \
  --output /path/to/runtime/resolved_asset_bindings.json \
  --report-output /path/to/runtime/asset_resolution_report.json
```

这一步的输出语义、surface 映射和 fallback 统一遵守第 4 节。如需排查被过滤掉的素材，查看 `asset_resolution_report.json`；不要在 compose 阶段读取 raw SVG 或重新解释 asset brief。

### Step 5：按章节生成内容

- 按 `Pattern` 读取对应 `patterns/*.md`
- 选定变体后，再依据该变体已支持的位置放置标题；不要先决定标题形态，再反推 pattern。
- 生成章节 HTML 与读者可见的叙述性文案
- 生成 footer HTML，内容来自 Step 1 已提取的 `Methodology`
- 不直接渲染 authoring-only 内容：`Assets` 清单/brief/说明、pattern slot 注释、slot 名称都必须被替换或省略，不能成为可见正文或新内容 schema。
- 根据第 4 节把每个 asset placement 映射到合法 surface 和 host slot；没有合法 host slot 或 payload 缺失时按 fallback 降级。

章节 DOM / runtime 绑定遵守第 2 节、对应 `patterns/*.md` 与 `html-templates.md` 的 shared component contract。Build 阶段额外只需保证：
- 每个实际渲染的 asset surface 都带 `data-asset-id`
- shared primitive 的选择只看 `visual-primitives.md`
- shared primitive 的 DOM anatomy 只看 `html-templates.md`
- pattern slot 注释、asset brief、asset 清单说明都不能作为可见正文输出

### Step 6：输出检查

在章节 HTML 与可见叙述性文案生成后、最终 compose 前，Build 必须执行一次输出检查。检查过程不进入最终 HTML、注释或可见文案。若检查发现问题，修复将要固化进 `compose_story.py` 的章节内容或 renderer 逻辑。

#### Local presentation check

- 只检查 Build 可控的局部呈现：同一 pattern 内的 shared primitive、treatment、heading treatment、takeaway 承载方式等。
- 如果连续章节视觉过于重复，只能在当前 pattern 已开放 slot 内调整可选 shared primitive / treatment。
- 不改变 chapter 顺序、Pattern、Charts、Title、Claim 或数据结论；如果必须改变这些才能解决，记录为 plan 阶段问题并回到 plan 阶段。
- 不能发明新的组件、布局或 CSS anatomy。

#### Visible prose cleanup

- 清理最终可见文案中的分析备注、过程说明、作者侧旁白和框架词。
- 检查对象包括 `SectionIntro`、`Transition`、解释段落、`scrolly step narrative`、`highlight / quote / action` 文案、chart title、annotation 文案。
- `Transition` 是低权重衔接文案，不是章节收束，也不是 shared component。

### Step 7：通过固定脚本组装最终 HTML

读取并执行 [page-composition.md](../references/page-composition.md)：写 `runtime/body.html`（含 footer）和 `runtime/page.json`，执行 `scripts/compose_story.py --target html --runtime-dir ... --body-file ... --config-file ... --output ...`，再执行 `scripts/validate_js.py output.html`。不复制或改写组装脚本；输入错误修改正文、配置或资产后重跑。检查最终图片可见性，不能只凭 JS 校验交付。

---

## 7. Fail-Fast Rules

以下情况直接中断，不允许回退到手写替代逻辑：
- 分析阶段没有提供 `runtime/dataset_map.json`
- `build-html/scripts/prepare_story_head.py` 执行失败
- `assemble_story_specs.py` 执行失败
- `compose_story.py` 发现必需 runtime 文件缺失，尤其是 `story-head.html`、`spec_map.json` 或 `resolved_asset_bindings.json`
- `runtime/dataset_map.json` 缺少 plan.md 引用的 `dataRef`

禁止通过手写 head/preset 产物、`runtime/dataset_map.json`、`spec_map.json` 或重写 `vseed-render.js` 来“补洞”。

---

## 8. 内容规则

**图表是主角，文字是配角。** 页面视觉重心在图表和数据可视化上。文字只做三件事：提供 context、标注 takeaway、引导下一步。如果信息已通过图表标题（h3）、标注或 KPI 卡片传达，不要用段落文字重复。

**标题直接来自 plan。**
- `Title` 是章节的 canonical 标题，也是 HTML 最终可见标题。
- Build 只做非编辑性处理：安全转义、必要空白规整，以及把标题放进当前 pattern 已支持的合法位置。
- 不能为了容纳溢出文案临时发明新结构；只能使用当前 pattern 已支持的槽位与组件。

**框架是工具，不是模板。** 章节标题必须内容驱动，禁止出现框架术语（"情景"、"困境"、"Context"、"Conflict"）作为读者看到的标题。

**叙述必须面向最终受众。** 最终可见的叙述性文案必须写成受众直接阅读的成品文案，而不是分析备注、过程说明、讲解口吻或作者侧解释。输出检查只负责在 compose 前清理这类可见叙述文本，不处理布局或重复逻辑；`Transition` 仍属于这类可见叙述文本，但不算章节收束。

**标注优先于图例，一图一问。** 图表标题（h3）写结论，不写图表类型。

---

## 9. 质量检查

### 分级自检清单

在交付前逐项确认。P0 未通过时不得交付；P1 未通过时必须修正或明确记录原因。

#### P0: 正确性与合同

- [ ] Step 2–7 已按流程执行：helper 生成 head，`assemble_story_specs.py` 生成 `spec_map.json`，`normalize_story_assets.py` 生成 `resolved_asset_bindings.json`，章节内容生成后已执行输出检查，`compose_story.py` 以内联 runtime 组装最终 HTML
- [ ] 章节 DOM / runtime hook 符合第 2 节、对应 pattern 文件与 `html-templates.md` 的 shared component contract
- [ ] 每张图都显式声明且正确使用 `dataRef`；Build 不存在 dataset 猜测逻辑
- [ ] 执行 Skill 的固定 `scripts/compose_story.py`，没有复制/改写 renderer
- [ ] 正文通过 body.html 输入，素材通过声明式引用绑定，图片实际可见
- [ ] JS 校验通过（`validate_js.py` 未报错）
- [ ] 最终 HTML head 样式与图表主题配置只来自 `story-head.html`，没有额外 shared component / pattern selector override
- [ ] 最终 HTML 中不存在 `{ASSET_ID}`、`{ICON}`、`{TRI_FRAME_*}` 等未替换占位符
- [ ] 最终可见的具体数字、单位、时间范围与 `plan.md` / Key Numbers 精确匹配；Build 不自行计算或估算数字
- [ ] Footer 正确映射 `Methodology` 的 `Data Source / Time Range / Caveats`

#### P1: 结构与风格一致性

- [ ] 图表标题（h3）写结论，不写描述或图表类型
- [ ] Head/preset 资源来自 helper 输出，页面级颜色与背景保持同一 preset 基调
- [ ] 所有背景色在同一明暗基调（深色主题不出现白色图表容器）
- [ ] Hero 明暗极性与 preset 一致

---

## 10. 按需读取的参考文件

按需加载，不要一次全部读入：

| 文件 | 内容 | 何时读取 |
|---|---|---|
| `patterns/<pattern>.md` | 对应 Pattern 的章节骨架 + pattern-specific hook + 约束 | Step 5 构建该章节时 |
| `visual-primitives.md` | shared component selection surface + allowed slots | 当 pattern slot 需要 optional shared primitive 时 |
| `html-templates.md` | shared component markup + component hook contract | 当 pattern 需要 shared block 时 |
| [page-composition.md](../references/page-composition.md) | 固定组装输入与调用约定 | Step 7 |

---

## 11. 常见失败模式

| 失败模式 | 症状 | 修复 |
|----------|------|------|
| 自创类名 | `<div class="my-card">` 无任何样式 | 改用 pattern 文件中的已有类名 |
| 硬编码颜色 | 深色/浅色切换后出现不协调色块 | 改用已有 pattern / shared component / preset 产物，不写临时颜色 |
| 图表 ID 重复 | 第二个图表渲染到第一个容器内 | 每个图表使用唯一 ID |
| Hero 极性冲突 | 浅色 preset + 深色 Hero = 视觉断裂 | 浅色 preset 用 `overlay-light`，深色用 `overlay-dark` |
| story-container 嵌入 scrolly | Scrollytelling 布局错位 | `.scrolly-section` 内不嵌套 `.story-container` |
| scrolly 多图 | 左侧 sticky 区出现两张图或图文滚动脱节 | scrollytelling 只保留 1 张 primary chart；第二张图拆成独立章节 |
| asset 无合法宿主 | 图表下方、正文间或章节根节点出现独立装饰块 | 删除该 asset；资产只能进入 Surface Model 定义的 host |
| 数字不可验证 | 叙述"增长 76%"但数据算出 72% | 所有数字从 Key Numbers 精确引用，不估算 |
