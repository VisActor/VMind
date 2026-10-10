# PPT Slide Recipes

本文件定义 `plan.md` 如何转成 Web-PPT slide sequence。Recipe 只负责“这一页是什么类型、承载什么阅读任务”，不负责具体 HTML 结构和视觉舞台。

使用方式：先用 `Source Map` 确定候选 slide type；生成具体 slide 前再读取对应 `### {slideType}` 小节。layout、markup 和 asset role 的细节分别以 `layout-recipes.md`、`slide-markup.md` 和 `asset-handling.md` 为准。

## 全局规则

- 一张 slide 只承担一个阅读任务：入口、数据证据、非数据证据、对比、时间节点、行动或过渡。
- 拆页只能解决单页内容过载，不改变 chapter 顺序、Claim、Title、Charts 或 Story Breaks。
- 没有显式 `Story Breaks` 时，不生成独立过渡页。
- 最多生成 1 张 `closing`，且只能来自最后一个 `Role: ending` chapter；它不是过渡页，也不新增证据。
- 最后一个 `Role: ending` chapter 决定收束表达；普通证据页不能替代收束。
- 每个 chart slide 最多承载一个主图；多图章节按图表阅读顺序拆成多页。
- 首张 slide 是 title-led opening：只能输出 `cover`、`hero-stat` 或 `hero-image`。无论使用哪种 slide type，第一阅读对象都必须是 headline；数字、问题或场景图只能服务开篇判断，不能替代标题。
- 非数据证据页只能使用 plan 中已经存在的 quote、图片 / 截图 asset、流程步骤或定性观察；不要为 PPT 新增证据。
- 被 `SectionVisual.assets` 引用的素材按 `asset-handling.md` 分配合法 role，并按 `slide-markup.md` 放入对应 slot。

## Source Map

| Source | Slide type | 输出 |
|---|---|---|
| first hook whose primary anchor is title / stakes | `cover` | 1 张 title-led opening；可含问题、stakes 或数字局部锚点 |
| first hook whose primary anchor is one number | `hero-stat` | 1 张 title-led numeric opening；必须 `monolith`，headline 先行，主数字作为锚点 |
| first hook whose primary anchor is resolved background image | `hero-image` | 1 张 title-led image opening；背景只承担氛围，不替代标题 |
| non-first `hero-impact` with main number | `hero-stat` | 1 张强数字页，用于中段节奏峰值或强收束 |
| non-first `hero-impact` with background image | `hero-image` | 1 张强图像氛围页，用于中段转折 |
| `scrollytelling` | `scroll-scene` | 1 张沉浸式 step 推进页 |
| `baseline-kpis` | `metric-board` | 1 张指标板；解释过长则追加 `metric-reading` |
| `chart-narrative` | `chart-read` | 1-N 张图表读法页 |
| `comparison` | `comparison` | 1-N 张对照页 |
| `timeline` | `timeline` | 1-N 张时间页 |
| `action` | `action` | 1-2 张行动页 |
| quote / source excerpt | `quote` / `quote-pair` | 1-N 张引用证据页 |
| image / screenshot / generated artifact | `image-grid` / `text-image` | 1-N 张视觉证据页 |
| process / workflow steps | `process-flow` | 1-N 张流程页 |
| `Story Breaks` | `transition` | 1 张过渡页 |
| `Methodology` | `methodology` | 可选系统说明页；仅在需要展示数据口径时生成 |
| 最后一个 `Role: ending`，且无新证据或行动清单 | `closing` | 1 张最终收束页 |

## Ending Output

最后一个 `Role: ending` 可按收束意图输出：

| 收束意图 | Slide type |
|---|---|
| 最终判断、警示、开放问题或 Q&A handoff | `closing` |
| 明确下一步、决策事项或 owner handoff | `action` |
| 单一数字成为最终记忆点 | `hero-stat` |
| 强背景图或氛围作为收尾 | `hero-image` |

`chart-read`、`comparison`、`timeline` 可服务最后一章的证据，但不作为最终收束表达。

## System Slides

### `methodology`

用于需要在 deck 中展示的 plan 顶层 `Methodology`。它不是 chapter，也不是 Section Pattern；Build 默认不生成 methodology slide。

必须使用：
- Data Source
- Time Range
- Caveats

固定使用 `rowline-board`。只有用户明确要求展示方法说明，或数据来源、时间范围、限制条件会显著影响结论理解时才生成；如需展示，放在最终收束前。

## Slide Types

### `cover`

用于开篇主锚点是标题、问题或 stakes，且没有需要作为背景承载的 resolved hero image 时。首页必须先让读者看到标题和故事张力；问题、时间点或小数字只能做局部锚点。

必须使用：
- `Story Meta.Title` 或 Ch1 `Title`
- `SectionIntro`；若 plan 未显式提供，用 Ch1 `Claim` / `SectionVisual.focus` 改写成一句 tension / stakes intro
- 可选 `LeadMeta`
- 可选 `opener_motif_background`

可选对 headline 中 1-2 处短锚点使用 `.tone-accent`，但不要给整句上色。若主锚点已经是独立大数字，使用 `hero-stat`，不要在 cover 中手写 `.big-number`。

固定使用 `wide-editorial`。

不要添加 chart、KPI 组、comparison、证据卡、主证据图或全屏大数字。

### `hero-stat`

用于 `hero-impact` 的单一主数字锚点。它可以作为首页、中段关键转折或强收束，但不能是裸数字海报；所有 `hero-stat` 都必须先给出 chapter `Title` 或判断 headline。普通图表阅读或 KPI 组不要用 `hero-stat`。

必须使用：
- chapter `Title`
- 一个主数字 / 比例 / 差值 / 变化幅度；展示值必须先压成短数字，数字值与单位拆开写，单位放 `.unit`
- 数字读法和记忆点

内部舞台的主数字默认使用重点色；不要为了主数字重复追加 `.tone-accent`。

只允许一个主数字。两个以上主数字应转为 `metric-board` 或拆成后续数据页。

`hero-stat` 使用一个 `data-stat-stage` 变体：
- 单一数字 + 一句记忆点：`monolith`；作为首张 slide 时必须使用此变体
- 主数字 + 1-4 条类比 / 上下文读法：`context-cards`
- baseline / current / delta 同时存在：`delta-compare`
- 里程碑、实时数或短数字串需要仪式感时：`ticker`

`monolith` 也必须保留 chapter `Title` 或同义判断 headline，不能只输出 kicker、数字和 caption。如果主数字无法压成短展示值，改用 `cover` 的局部文字锚点或拆成证据页。若页面只是章节过渡而不是数字证据，使用 `transition`。

### `hero-image`

用于 `hero-impact` 的强背景图氛围锚点。PPT 中它可以出现在开篇，也可以作为中段转折的氛围页；不要把背景图当成主证据图使用。

`hero-image` 的标准结构是：`.slide-background` 承载 `hero_background_image`，`.slide-inner` 承载 headline + cue/source-note 的单栈阅读。背景图负责氛围和语境锚点，前景只保留文本判断。

必须使用：
- chapter `Title`
- resolved `hero_background_image`
- 可选 `Transition` 或短 cue

背景图不可用时不能自动改成 cover；回到 plan / asset 修正。

### `metric-board`

用于 `baseline-kpis` 或管理层概览指标。

必须使用：
- 2-4 个 KPI
- 每个 KPI 的 label、value、unit、reading
- 一个短 takeaway

若每个 KPI 都需要解释，追加 1 张 `metric-reading`，不要把解释塞进指标板。

### `metric-reading`

用于指标板之后，解释为什么这些指标要一起读。

必须使用：
- 2-5 条 reading
- 一个收束 takeaway

不重复展示完整 KPI 板。

### `chart-read`

用于 `chart-narrative` 或任何以单图为主证据的章节。

必须使用：
- chapter `Title`
- primary chart id
- 一个图表读法
- 一个 takeaway
- 可选 source note

图表读法不能复述标题；takeaway 必须来自 `Claim`。同章有多张图时，每张图生成一页。

### `scroll-scene`

用于 plan 中明确选择的 `scrollytelling`。它是一张固定 16:9 slide 内部的 virtual step scene，不是原生长滚动页。

必须使用：
- chapter `Title`
- 一个 primary chart id
- 2 个以上 step copy
- 每个 step 对应的图表状态、筛选、标注或高亮变化

规则：
- Build 不能把普通 `chart-narrative`、`timeline` 或 `comparison` 临时升级成 `scroll-scene`。
- 一张 `scroll-scene` 只能控制一个主图；需要第二张主图时拆成后续 slide。
- 每个 step 只解释当前图表状态，不提前写下一章结论。
- step 到最后才继续翻到下一张 slide；反向同理。

### `comparison`

用于单一对照维度或连续对照。

必须使用：
- 对比对象或状态
- 对比维度
- 差异结论

一页只比较一个主要维度。多个维度拆成多页，并保持口径一致。
清单式 readiness / risk / before-after 对照使用 `rowline-board`；不要生成左右两栏长文本。两组清单合计超过 6 行时拆成连续两页。

支持：
- 2 个对照面板或 1 个差异表述。
- 清单式对照可用 rowline。
- 可选 1 张 chart evidence，且只能补充说明当前对照结论。

如果使用 chart evidence，必须使用：
- primary chart id
- 一句 chart evidence reading，说明图表 measure 和证据读法
- 一句 `difference-callout`，把对照锚点、chart reading 和差异结论连起来

如果需要 3 个以上 KPI、长解释或第二张图，拆成 `comparison` + `chart-read` 连续页。

### `timeline`

用于真实时间节点、阶段推进或 rollout 节奏。

必须使用：
- 时间 / 阶段标签
- 每个节点的一句意义
- 一个收束 takeaway

没有时间或阶段顺序的趋势解释不要改成 timeline。

### `action`

用于 action chapter。

必须使用：
- 2-5 个行动项
- 每项的 priority、title、reason / next step

不要在 action 页继续解释图表证据，也不要放装饰 asset。行动页的视觉重心就是行动清单本身。若需要最后的记忆句或 Q&A handoff，使用后续 `closing`，不要把 closing 写成第四个行动项。

### `closing`

用于最后一个 `Role: ending` chapter，且该 chapter 只留下最终判断、方向、警示或开放问题。

必须使用：
- 1 个最终 headline
- 可选 deck kicker
- 可选 1 句 cue / handoff
- 可选 1 组低权重 meta

headline 可选对 1 处短锚点使用 `.tone-accent`，用于最后记忆点，不要把 closing 做成彩色口号。

规则：
- 一个 deck 最多 1 张 `closing`，且只能出现在最后。
- 不承载 chart、KPI、quote、image、artifact、流程或行动清单。
- 如果结尾要求具体下一步，使用 `action`，不要同时生成 `closing`。
- 如果结尾仍在证明一个数据判断，回到 `chart-read` / `comparison`，不要用 `closing` 掩盖证据不足。

### `quote`

用于已经在 plan 中出现的关键引述、访谈摘录、文献原句或定性观察。

必须使用：
- quote / excerpt 原文或忠实短摘
- attribution / source
- 当前 chapter 的读法或 cue

普通 quote 页只放一条 quote。两条 quote 共同构成一个判断时使用 `quote-pair`。

### `quote-pair`

用于两条 quote 共同构成同一判断或张力，例如“一线采用信号”与“治理约束声音”。

规则：
- 只允许 2 条 quote
- 每条 quote 都必须有 attribution
- 每条 quote 只保留一句核心短摘；长原文先压成忠实摘录，放不下就拆页
- 两条 quote 需要有共同读法，不能只是并排堆素材

3 条及以上拆成多页。

### `image-grid`

用于 2-6 张图片、截图、版面、产品状态或现场材料共同证明一个观察。

必须使用：
- resolved `evidence_image` assets
- 每张图的短 caption
- 一个总读法

resolved image 缺失时不要输出占位图。图片证据必需时停止；弱装饰缺失时移除该 slot。

### `text-image`

用于一张主图 / 截图 / 照片 / 生成 artifact 需要旁边解释读法。

必须使用：
- resolved `primary_image` 或 `visual_artifact` asset
- chapter `Title` 或短 headline
- 1-2 句 reading / context

不要把它当成 `chart-read`；图像不是 `Charts[*]`。

`visual_artifact` 是 `text-image` 页里的证据对象，不是独立 slide type。它适合治理闸门、流程机制、产品状态拼贴、路演场景等非数据证据。素材内部只保留主体图形和短标签；页面标题、读法和结论由外层 slots 承担。

不要把 asset prompt、brief 或 fallback 说明放到画面里。若同一章还需要步骤解释，拆成 `text-image` + `process-flow`。

### `process-flow`

用于非时间轴的流程、机制、工作流或因果链步骤。

必须使用：
- 3-6 个步骤
- 每步 label、title、short note
- 一个收束读法

如果步骤需要逐项解释，拆成多页。不要用它替代 `timeline`。

### `transition`

用于 `Story Breaks`。

必须使用：
- `after`
- `type`
- `title`
- 可选 `cue`

`title` 可选对 1 处短锚点使用 `.tone-accent`，只用于章节切换的记忆钩子。

插入到 `after` 指定 chapter 后。不要添加数字、图表、来源或新的结论。

## Fail Fast

遇到以下情况，中断并回到 plan：

- PPT 目标里出现没有 Web-PPT recipe 的 HTML-only pattern
- `Story Breaks.after` 指向不存在的 chapter
- `Story Breaks.type` 不在 `divider / pivot / pause / recap`
- 单页必须承载多个主图才能说清
- 需要在 PPT Build 中新写 quote、临时找图片、新增流程步骤或改写定性证据
- 需要改 chapter pattern、Claim、Charts 或 Story Breaks 才能完成 deck
