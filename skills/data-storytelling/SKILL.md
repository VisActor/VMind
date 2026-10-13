---
name: data-storytelling
description: >
  将数据转化为叙事驱动的数据故事计划，并按目标产物生成对应作品。
  当用户想用数据讲故事、创建数据叙事、做 scrollytelling、制作数据报告、展示分析结果、或将数据变成有说服力的视觉传播时使用此 skill。
  也适用于用户说"解释这些数据"、"让数据有说服力"、"可视化分析结果"、"数据叙事"、"data storytelling"，或想把分析结果变成可分享的数据作品。
---

# Data Storytelling

将原始数据转化为有说服力的叙事驱动视觉故事，先产出可跨产物复用的 `plan.md`，再由对应的 build 模块生成具体产物。核心架构：**共享叙事设计（Phase 1-3）+ 按产物执行 Build（Phase 4）**。

## 核心定义

Data Story = **Data**（洞察证据）+ **Narrative**（认知路径）+ **Visuals**（视觉呈现）

数据叙事不是"把分析结果视觉化"，而是把三者组合成一个让特定受众更快理解、更容易决策的产品。

真正的数据故事必须同时回答：
1. 读者最关心什么问题？
2. 哪些证据足以回答这个问题？
3. 页面如何安排顺序，让读者几乎不需要"自我翻译"就能看懂？

---

## 架构概览

```
Phase 1-3（共享叙事核心）
  理解 → 数据分析 → 叙事设计
           ↓
       plan.md
  故事元信息 + 证据骨架 + 章节基础结构 + 样式选择
           ↓
  用户确认 plan.md
           ↓
  Phase 4: Build（按目标产物加载对应 build 模块）
      ↓
build-html/ | build-ppt/
      ↓
    具体产物
```

---

## 运行环境

Python 3.10+ 用于随附的标准库脚本，Node.js 用于 JavaScript 语法校验；浏览器需能访问公开 unpkg CDN。当前 Agent 负责读取数据、推理和生成 VSeed 配置，不需要 VisActor 托管模型服务。普通图表使用 VSeed 0.6.5、VChart 2.1.7 与 VTable 1.26.8；HTML 动效使用 GSAP 3.15.0。图片生成是可选宿主能力，不可用时按 Plan 执行并披露 fallback。Web-PPT 输出 HTML，不输出 `.pptx`。

`runtime/` 表示用户项目的产物目录；在评测或要求统一输出时使用 `outputs/runtime/`。`$SKILL_DIR` 必须指向安装后的完整 Skill 目录。不要改写已安装的 Skill。API harness 的 `run_skill_script` 接受根 scripts 下的文件名，或 `build-html/scripts/prepare_story_head.py` / `build-ppt/scripts/prepare_story_head.py` 这两个相对路径；参数是 argv 数组。

若用户已明确授权端到端生成，可记录假设与计划后直接进入 Build；否则在计划阶段进行一次确认。

## 工作流

### Phase 1: 理解与定义

在一次集中提问里拿齐以下信息：

1. **受众** — 读者是谁？看完后需要理解什么、做什么决策？
2. **核心问题** — 这篇故事试图回答哪个问题？
3. **整体风格** - 这篇故事用什么风格（视觉/语气）来展示？
4. **可用数据** — 现有数据、分析产物、图片各有哪些？
5. **约束** — 发布场景、时间范围

如果关键信息缺失但风险可控，显式写出假设后继续推进。

### Phase 2: 数据分析与洞察发现

先分析数据，再设计故事。这是最关键的一步。

1. **盘点输入** — 表格、截图、报告、图像、已有文案
2. **检查可靠性** — 时间范围、粒度、样本量、缺失值、口径变化
3. **找到 3-5 个发现**，标记 insight 类型：
   - **趋势**: 某事正在上升、下降或周期性变化
   - **异常**: 某事出乎意料地高、低或不同
   - **对比**: 两个实体在有意义的方面不同
   - **构成**: 部分组成整体的方式揭示了什么
   - **相关**: 两件事一起变动（或反向变动）
4. **按重要性排名** — #1 发现成为故事的核心冲突
5. **计算 Key Numbers** — 叙述文字将引用的关键数值，此时从数据精确计算并记录变量名，后续写入 plan.md。最终展示时，数字单位也是可读性的一部分；不要机械翻译原始字段单位或 suffix，应按目标语言、数值量级和读者习惯选择自然单位，并同步换算数值与精度。

将分析后的数据保存为 `runtime/dataset_map.json`（引用名 → 记录数组），保留可复算的输入与计算过程。可使用宿主提供的 Python/DataFrame 工具，但不依赖跨调用持久内存。plan.md 只存数据引用名，不重复内嵌数据。

**如果用户的主张与数据不匹配：直接指出，给出更稳妥的故事角度。**

### Phase 3: 叙事设计

#### 3a: 选择故事弧线

所有数据故事都遵循 **Context → Conflict → Resolution → Ending** 结构。根据主导 insight 类型选择具体的 arc pattern：

| Insight 类型 | Arc Pattern |
|-------------|-------------|
| 有可识别原因的问题 | 情景-困境-解决 (SCR) |
| 令人惊讶/反直觉的发现 | 钩子-张力-高潮-解决 (Dramatic) |
| 需要分解的数字 | "So What?" 层层递进 (Drill-Down) |
| 实体之间有意义的差异 | 对比/对照 (Versus) |
| 时间维度上的变化 | 旅程/变迁 (Timeline) |

→ 读 [story-arc-patterns.md](references/story-arc-patterns.md) 获取每种 pattern 的完整章节结构、过渡语示例和常见错误。

#### 3b: 为每个章节选择 Section Pattern

Section Pattern 是章节级的叙事选择单元。每个章节选一个 Pattern，先决定这章要完成什么认知任务，以及计划阶段必须把哪些语义输入准备清楚。

当前支持 8 个 Section Pattern。

| Pattern | 叙事目的 | 适用场景 | 不适用场景 | 计划阶段必须决定什么 |
|---------|---------|---------|-----------|------------------|
| `hero-impact` | 用单一主数字或强背景图氛围建立强视觉锚点 | hook；PPT 目标下的关键转折、节奏峰值或强收束；HTML story 中除 hook 外只在 feature/editorial 特殊场景慎用 | 只有标题/导语的开篇、常规中段分析章节、主图证据阅读、KPI 组、普通结尾章节 | 主锚点是什么：一个主数字 / 主比例 / 主差值 / 主变化幅度，或一个已规划的 `hero_background_image`；若是数字锚点，说明数字读法和记忆点；若是图像锚点，说明背景氛围承担的叙事作用 |
| `cover-intro` | 用克制、平稳的开场把故事带进来 | hook 章节；需要先建立问题意识、stakes 或 why-now，再进入证据章节 | 中段分析章节、结尾章节、需要主数字作为主视觉锚点的开篇 | `SectionIntro` 必填；`LeadMeta` 可选，用于封面级辅助信息 |
| `scrollytelling` | 逐步推进同一主图的理解 | HTML story 或 Web-PPT 中需要离散步骤控制节奏，且每步都能对应主图状态、筛选、标注或高亮变化 | 单次静态说明、没有逐步视觉推进的章节、多张独立图顺序解读 | step progression、`Charts` 主图、每步对应的图表状态变化 |
| `chart-narrative` | 用图表证据完成一个 Claim | 常规分析章节、直接解读一张主图；或顺序展开 2-3 张服务同一 `Claim` 的图 | 需要多步视觉推进，或以并列对照为主的章节 | 主图、主结论与对应证据；若为多图顺序分析，明确每张图的子问题顺序，且只有一个 primary |
| `baseline-kpis` | 用并列 KPI 建立基线坐标 | 早段需要先交代 2-4 个并列关键指标、让读者先知道盘子多大或当前水平在哪 | hook 章节、需要主图承载证据、需要趋势/结构/分布/缺口形状、需要复杂论证或因果推进、或只有单一主数字 | 哪些指标同时出现、排序方式、每个指标的读法；如需主题符号，只描述语义作用 |
| `comparison` | 并列对照差异 | A/B 对比、前后对比、组间差异、明确以对照为主的口径/账本/指标视角切换 | 只有单对象单结论的章节，或只是顺序分析链的多图章节 | 对比对象或对照视角、对比维度、结论焦点 |
| `timeline` | 按时间顺序组织理解 | 历史演变、阶段变化、里程碑；或单张主图需要时间锚点辅助阅读 | 与时间无关的静态结构分析、没有明确时间节点的趋势解释 | 至少 3 个时间节点、时间分段、关键节点与阶段意义；若与单图组合，压缩成 3-5 个时间锚点，并给每个节点写一句短解释 |
| `action` | 给出明确下一步 | 结尾行动建议、决策建议，且有 2-5 个行动项 | 仍在解释证据、尚未收束的章节，或只有一个行动点 | 行动对象、优先级与行动理由 |

`scrollytelling` 在 HTML story 中渲染为 sticky chart + steps；在 Web-PPT 中渲染为单张 `scroll-scene` slide，滚轮 / 键盘先推进 slide 内部 steps，到边界后再翻页。选择该 pattern 时，计划阶段必须先确定 step progression，并且必须填写 `Charts` 主图；`Steps` 不能替代 `Charts`。Build 阶段不要把普通 `chart-narrative` 临时升级成 scrolling。Scrollytelling 主图只允许使用 `line / area / column / columnPercent / bar / barPercent / columnParallel / barParallel / dualAxis`，不要使用 `heatmap` 等密集矩阵或单次静态图。具体的 step 模式与写法，见 [pattern-scrollytelling-plan.md](references/pattern-scrollytelling-plan.md)。

如果选择 `timeline` 且希望与单图组合展示，计划阶段必须先确认它能被压缩成 `3–5` 个关键节点，且每个节点都只是主图上的一个时间锚点，而不是第二根正文栏。具体上下或左右布局由 HTML Build 阶段决定。

Web-PPT 的最后一章必须有清楚的收束意图：最终判断、下一步、记忆数字或氛围收尾。不要只以新证据、图表解释或方法说明结束。

计划阶段还需遵守：

- `resolution` 回答核心问题并收束证据；`ending` 留下最终判断、方向、警示或开放问题。
- 多图若是并列对照，用 `comparison`；若是同一主图的 step-by-step 状态推进，用 `scrollytelling`。
- Hook 章节只能使用 `cover-intro` 或 `hero-impact`；`chart-narrative`、`baseline-kpis`、`comparison` 不作为 hook。主数字或强背景图开篇用 `hero-impact`；建立问题意识、stakes 或 why-now 用 `cover-intro`。
- `hero-impact` 只建立单一主数字锚点或强背景图氛围锚点，不负责主图证据阅读、KPI 组或普通结尾。HTML story 目标下除 hook 外通常不要在中段选择；PPT 目标下只有当该章本身是关键数字或强背景氛围的节奏峰值时才使用。
- `cover-intro` 只用于 `Role: hook`，必须填写 `SectionIntro`，可选 `LeadMeta`，不承载主图、KPI 组或证据条。
- `baseline-kpis` 只负责建立并列指标基线，不是 dashboard，也不应和主图并排拼成一个章节。

#### 3c: 选择 Presentation Mode 与 Style Preset

1. 先写 `Story Meta.presentation_mode`，只能是：

- `editorial`: 数据报道 / 分析报告 / 决策简报。证据和文字优先，素材低存在感；`hero_background_image` 只在确实需要建立语境时使用，并且必须轻量、克制、低戏剧化。
- `feature`: 专题 / 体育 / 文娱 / 游戏 / 电影 / IP / 城市事件等强叙事入口。需要更强主题识别的首屏视觉和更明确的滚动引导，优先规划 `hero_background_image` 或 opener motif，但不能牺牲图表读数和证据可信度。

2. 再读 [STYLE_PRESETS.md](references/STYLE_PRESETS.md)，根据 preset 选择矩阵选择一个 `Style Preset`。

Preset 是基础风格族：只定义基础风格方向、默认色彩锚点、图表 palette 和适合使用的素材 cue，不是完整品牌主题、场景主题或活动舞台主题。Plan 阶段只写 preset 名称，并把 preset 摘要转写进 `Story Visual Identity` 与每个素材的 `visual_brief`；不要复制 preset 详情里的实现字段、样式片段、字体栈或其他内部细节。页面样式与图表主题由 Build 阶段根据 `Style Preset` 名称解析。

3. 选定 preset 后，再判断是否需要 `### Style Overrides`。

Style Overrides 是给 preset 底座加明确主题补丁，不是让 `feature` 自动变得更酷炫。默认省略。

自然语言主题约束也算明确约束。用户指定具体场景、主题、IP、活动、城市、赛事、品牌气质，并要求 feature 化呈现时，先判断它影响哪一层：

- 如果只影响素材内容、motif、开场图像主体或 `visual_brief`，写入 `Story Visual Identity` / `Asset Registry`，不写 `Style Overrides`。
- 如果需要影响整页舞台背景、重点色或图表 palette，才写最小 Style Overrides。
- 如果用户只说“更酷炫”“更年轻”“更高级”但没有具体视觉世界，选择最接近的 preset，不写 overrides。

只有决定填写 `### Style Overrides` 时，才读取 [style-overrides.md](references/style-overrides.md)。不要写内部 class、自由样式规则、layout 字段或意图词。没有明确需求时省略整个 `### Style Overrides` 区块。

#### 3d: 规划视觉素材 (Asset Director)

`plan.md` 是最终作品的导演脚本。这里不生成最终 SVG / 图片，也不绑定构建层的共享组件名称；这里只定义这篇故事的视觉身份、素材策略、可生成资产，以及每章为什么需要这些资产。

资产可以是装饰性的，但不能是随机装饰。装饰资产必须服务 Story Visual Identity：强化主题、领域、IP 气质、时代感、空间感或叙事记忆点。它们不能抢标题、关键数字、图表证据和 takeaway。

Asset Registry 只记录会实际进入允许放置位置的资产。声明素材前必须同时满足：

- `purpose` 说明它服务的叙事任务：身份识别、语义框定、数据相邻记忆点，或特定承载位置的强调。
- `visual_brief` 描述主题语言、形态、颜色约束和承载方式；不能只写“通用装饰”。
- 素材有合法放置位置和预期章节承载位置；没有合法放置位置时不声明。
- 素材不重复图表已经表达的几何形状、排序关系、趋势证据或标注功能；图表证据优先。
- 同一素材语言服从 Story Visual Identity 和 Style Preset；单个章节不能发明新的视觉世界。

按 `Story Meta.presentation_mode` 控制素材存在感：

- `editorial`: 素材只做辅助层；`hero_background_image` 必须轻量、低戏剧化，偏纹理、氛围或抽象语境。
- `feature`: 优先评估 `hero_background_image` 或 opener motif；开篇视觉可以有更强主体识别、场景和专题感，但仍不能替代图表证据。

`## Assets` 必须包含两个子区块：

### Story Visual Identity

- `theme_subject`: 这篇故事的主题对象或领域，例如 `global carbon ledger`、`wizard merchandise sales`、`space telescope survey`
- `visual_language`: 整体视觉语言，例如“编辑部式技术线稿”“电影感档案拼贴”“博物馆档案”
- `recurring_motifs`: 贯穿全文的 1-3 个 motif，例如轨道线、账本格线、魔法羊皮纸边角
- `avoid`: 明确不要出现的视觉方向，例如通用剪贴画、过强霓虹、无关吉祥物

### Asset Registry

每个素材使用以下字段：

- `id`: 机器可读 id，写作列表标题，例如 ``- `carbon_ledger_grid` ``
- `source`: `generated` | `user-provided`，可选；省略时等同 `generated`
- `media_hint`: `svg` | `image`
- `purpose`: 为什么需要它，以及它服务哪个故事任务
- `visual_brief`: 构建阶段生成素材时使用的视觉简报
- `fallback`: `remove` | `gradient` | `text-only`

`source: generated` 且 `media_hint: image` 是正式 build artifact request，不是可选装饰建议。它必须有具体的 `purpose`、`visual_brief`、`fallback`，并至少被一个章节的 `SectionVisual.assets` 放置引用。Build 阶段要么通过目标产物的官方 generated-image 路径生成它，要么显式执行 plan 中声明的 fallback；不能静默替换成无关的手工占位图。

不要声明不会被章节使用的资产。每个 registry 素材必须至少被一个章节的 `SectionVisual.assets` 引用。

章节内使用资产时，在 `SectionVisual` 中写：

```yaml
- assets:
  - placement: primary_image
    asset: pilot_evidence_wall
    usage: "作为本章主图证据，展示试点现场已经形成可路演、可复盘的真实材料。"
```

允许的放置位置：

- `hero_background_image`: 作为 `hero-impact` 的强开篇背景图；`editorial` 下轻量辅助，`feature` 下允许更强主体识别
- `opener_motif_background`: 作为 `cover-intro` 的弱 opener motif 背景层
- `primary_image`: 作为 PPT / 图像证据页的一等主图证据，不是装饰
- `evidence_image`: 作为 PPT / 多图证据网格中的一张证据图
- `visual_artifact`: 作为 PPT / 生成 SVG 机制关系、流程结构或产品状态的页内证据对象
- `takeaway_accent`: 作为 takeaway / highlight 的弱装饰或角标
- `kpi_lead_icon`: 作为一个 lead KPI card 的轻量符号
- `action_lead_asset`: 作为 action lead card 底部/角落弱资产，而不是标题旁小图标

不要用 `placement` 表达素材来源。`source` 负责 provenance，`placement` 负责页面角色。

- HTML 目标下，`evidence_image` 如果承担现场图、界面截图、报告页截图等事实图片证据，应使用 `source: user-provided`。生成图片不能冒充纪实证据。
- PPT 目标下，`primary_image` 与 `evidence_image` 都是一等图像素材；区别只在单张主图 vs 多图证据组，不在素材等级。

`visual_artifact` 只能作为 `SectionVisual.assets[].placement`，不要把 `visual_artifact` 写成 `Pattern`、chapter 类型、section 类型或 `SectionVisual.structure` 的页面方案。需要机制图时，`SectionVisual.structure` 只描述本章需要一个非数据证据对象和它服务的阅读任务；具体落到目标产物中的哪类页面，由 Build 阶段决定。

`visual_artifact` 的 `visual_brief` 只描述要画的机制关系、流程结构、产品状态或场景拼贴。素材本身不写页面标题、结论句、脚注或正文段落；这些内容留给 chapter `Title`、`Claim`、`SectionIntro`、`SectionVisual.focus` 或 Build 阶段的可见文案。

Plan 阶段不生成 SVG / 图片文件；只定义素材方向、素材清单和章节使用关系，具体素材文件由 Build 阶段处理。

#### 3e: 撰写 plan.md 结构化大纲

先产出完整的 `plan.md` 草稿（见下方模板），再经过一次 `Title Pass` 后展示给用户确认，再进入 Phase 4。

plan.md 是 Phase 3 所有叙事决策的结构化总结，同时承担两个角色：
1. **用户确认点**：Phase 3 结束时展示给用户
2. **Build authoring 输入**：Phase 4 根据它生成具体产物

这里的 Build 输入指“构建阶段写作与编排时读取的导演脚本”。Build 阶段把章节顺序、标题、正文、图表引用、资产使用和 Methodology 等决策固化进目标产物的生成逻辑。

plan.md 顶层结构固定为：

- `## Story Meta`
- `### Style Overrides`（可选；仅 3c 允许时填写）
- `## Evidence Backbone`
  - `### Data References`
  - `### Key Numbers`
  - `### Methodology`
- `## Chapter Outline`
- `## Story Breaks`（可选）
- `## Assets`

**以下是一个最小化plan模版**
不要把某个完整案例当成唯一标准答案。片段只用于说明字段结构、层级关系和最小合法写法，不规定具体行业、语气、文风或章节内容顺序。

```markdown
# Story Plan

## Story Meta
- **Title**:
- **Core Question**:
- **Core Takeaway**:
- **Arc Pattern**:
- **Style Preset**:
- **presentation_mode**: editorial
- **Audience**:
- **Language**:

## Evidence Backbone

### Data References
- `dataset_id`: 数据内容与字段说明

### Key Numbers
- `metric_name` = value
  - meaning:
  - source:

### Methodology
- **Data Source**:
- **Time Range**:
- **Caveats**:

## Chapter Outline

首章 `Title` 可省略；默认直接沿用 `Story Meta.Title`。只有首章需要不同入口句时才显式填写。`Ch2+` 仍必须显式提供 `Title`。

### ChN
- **Role**:
- **Pattern**:
- **Title**: （短标题；完整解释写入 Claim）
- **Intent**:
- **Claim**:
- **Evidence**:
  - refs: [`dataset_id`]
  - key_numbers: [`metric_name`]
- **SectionVisual**:
  - structure:
  - focus:
  - assets: （仅当该章节需要使用 Asset Registry 中的资产时填写）
    - placement: primary_image
      asset: carbon_ledger_wall
      usage: "作为本章主图证据；如果只是弱装饰才使用 takeaway_accent。"
- **LeadMeta**: （可选；无标签封面信息，仅 `cover-intro` 常用）
- **SectionIntro**: （可选；读者可见正文。`cover-intro` 必填）
- **Charts**: （可选；需要普通统计图表证据视觉时，先读 `references/chart-contract.md`）
- **Transition**:

## Story Breaks

仅当目标产物包含 PPT，且故事需要换幕、转向或停顿时填写；不是每章之间都要加。`Transition` 是章节内 handoff 文案，`Story Breaks` 才是可被 PPT Build 渲染成独立过渡页的节奏标记。非 PPT 产物默认忽略该区块。

- after: Ch2
  type: pivot
  title: 从总量，转向结构
  intent: 把读者从总体平台判断带到部门差异分析
  cue: 不是一年峰值，而是新平台

## Assets

### Story Visual Identity
theme_subject: "..."
visual_language: "..."
recurring_motifs:
  - "..."
avoid:
  - "..."

### Asset Registry
- `asset_id`
  - media_hint: svg
  - purpose: "..."
  - visual_brief: "..."
  - fallback: remove
```

模板之外还需遵守：

- 每个 chapter 都必须满足模板中的基础结构：`Role`、`Pattern`、`Intent`、`Claim`、`Evidence`、`SectionVisual`，并按需填写 `Title`、`SectionIntro`、`Charts`、`Transition`。
- `Role` 词表固定为 `hook / context / conflict / deep-dive / resolution / ending`
- `Charts` 是证据视觉，不是页面素材系统。写任何 `Charts` 前必须先读 [chart-contract.md](references/chart-contract.md)；当前只支持普通统计图表，必须绑定 `dataRef`，`renderer` 固定为 `standard-chart`。
- 对长表 `line` / `area`，默认不要写 `detail`：决定每条趋势线的分类字段必须写成 `color`；只有已有 `color` series 时，另一个确有辅助展示意义的字段才可使用 `detail`。派生计算先产出数据字段，不把 `detail` 当计算通道。
- PPT 目标也使用同一份 canonical `Charts` 合同。只要计划中需要图表页，chart id 用反引号条目（推荐 `chN-chartM`），并提供 `dataRef / renderer / chartType / dimensions / measures`，其中 `renderer` 只能写 `standard-chart`。不要写自由格式 `chartId:`、`fields:`，也不要使用 `combo-line`、`horizontal-bar` 这类非合同图表类型；本地组装会拒绝不可解析或不完整的图表合同。
- `scrollytelling` 章节必须同时包含 `Steps` 与 `Charts`；`Steps` 描述状态变化，`Charts` 提供主图证据承载。step 模式见 [pattern-scrollytelling-plan.md](references/pattern-scrollytelling-plan.md)，图表推进合同见 [chart-contract.md](references/chart-contract.md)
- `Story Breaks` 是可选的 PPT-only presentation pacing layer，不是 chapter；它只表达换幕、转向或停顿，不承载 `Evidence / Claim / Charts`。非 PPT 产物默认忽略
- `Story Breaks.type` 只允许 `divider / pivot / pause / recap`；`title` 是可见过渡页标题，`intent` 是内部节奏说明，`cue` 是可选可见副句

#### Title Contract 与 Title Pass

标题不是 Claim。`Title` 是读者会直接看到的最终标题，不是分析备注、内部 review note，或把 insight 原样贴进标题槽。

- `Story Meta.Title` 是故事级 canonical title，用于 story-level headline。
- 首章标题默认沿用 `Story Meta.Title`；只有首章需要单独入口句时，才显式填写 `Ch1.Title`。
- `Ch2+` 的 `Title` 是各章节 canonical title，必须能直接作为 HTML / Doc / PPT 的可见标题。
- `### ChN` 只承担章节编号和结构定位，不承载自然语言标题。
- chapter `Title` 必须短、单焦点、可直接展示；只承载一个对象 + 一个判断、问题或行动方向。
- 开篇标题可以更像故事入口句，用来建立问题意识、张力、尺度感或故事入口；普通章节标题优先直接表达判断、变化、对比、拐点或问题。
- 原因、证据、数字展开和完整解释放进 `Claim`、`SectionIntro`、`Transition`、图表标题或标注；不要把这些职责塞回 `Title`。
- 如果标题读起来像分析摘要，或故事感写法带来歧义，应改短并退回更直接的标题。
- 连续文案里如果需要轻量强调，可直接使用 Markdown `**...**` 包住关键词或极短结论；不要整句滥用加粗。

在 `plan.md` 草稿已经写完、`Claim / Intent / Evidence / SectionVisual` 已稳定之后，单独执行一次 `Title Pass`：

- 只允许改 `Story Meta.Title` 与章节可见标题；不要回写 `Claim`、`Intent`、`Evidence`、`Transition`。
- 输入至少包括：`Audience`、`Style Preset`、`Core Takeaway`、chapter `Role`、`Pattern`、当前 `Title`、`Claim`、`Intent`。
- 目标不是保留尽可能多的信息，而是把标题打磨成可直接展示的最终标题；假设 `Claim` 会完整存在，因此标题不承担解释责任。
- 如果标题已经足够短、单焦点、可直接展示，就直接保留，不为改而改。
- 常见动作只有四种：删解释、删因果、删次级限定语、把长观点句压成单一判断 / 问题 / 行动方向。

#### 3f: 检查并确认 plan.md

进入 Build 前，先检查 `plan.md` 是否满足以下要求：


- [ ] 已用当前 skill 根目录下的 `scripts/validate_story_plan.py` 校验 `plan.md`；如失败，先修 plan，再重新生成 / 复核，不要进入 Build
- [ ] `Story Meta.Title` 与章节可见标题已经过 Title Pass，且适合作为 HTML / PPT 的直接展示标题
- [ ] Key Numbers 与数据精确匹配，叙述引用有来源标注；数字展示单位符合目标语言和量级的可读性，没有机械保留不适合的原始 suffix
- [ ] `Methodology` 完整包含 Data Source / Time Range / Caveats
- [ ] `Story Meta / Evidence Backbone / Chapter Outline / Story Breaks / Assets` 结构完整且字段命名稳定；未使用 `Story Breaks` 时可省略该区块
- [ ] 如章节包含 `Charts`，已按 [chart-contract.md](references/chart-contract.md) 检查普通统计图表合同，且 `renderer` 为 `standard-chart`
- [ ] 每章的 `Title / Intent / Claim / Transition / SectionVisual.focus / Charts[*]` 在语义上服务同一个主旨，不要一章里同时讲多个焦点或在章节中途无说明地切换分析对象
- [ ] `Transition` 与下一章主焦点的 handoff 清晰，不要在过渡里突然切换问题或对象
- [ ] 如包含 `Story Breaks`，每个 break 都指向存在的 chapter，且没有新增数据结论或证据任务
- [ ] `Story Meta.presentation_mode`、Story Visual Identity、Asset Registry 完整；每个 registry 素材都有 `media_hint / purpose / visual_brief / fallback`
- [ ] 每个 registry 素材至少被一个章节的 `SectionVisual.assets` 使用；章节使用关系写成 `placement / asset / usage`
- [ ] `visual_artifact` 只作为 `SectionVisual.assets[].placement`，没有写成 Pattern、chapter/section 类型或完整页面方案

### Phase 4: 构建

按目标产物加载对应的 Build 文档，根据同一个 `plan.md` 生成具体产物。Build 模块在构建时读取 `plan.md`，最终 compose/runtime 边界消费各 Build 文档规定的已生成 runtime 文件和 Agent 编写的正文 HTML / 页面配置。

| 产物 | 加载文件 | 作用 |
|------|---------|------|
| HTML | `build-html/BUILD.md` | 生成交互式 HTML 产物 |
| PPT | `build-ppt/BUILD.md` | 生成演示型产物 |

Phase 4 的具体构建规则、runtime 资产、产物校验和格式约束全部在各自的 Build 文档中定义，`SKILL.md` 不重复。

Build 含图表时，当前 Agent 按需读取 [vseed-generation.md](references/vseed-generation.md)，基于 Plan 生成 VSeed 配置，再由本地脚本组装。

## 核心原则

1. 每个章节只承担一个认知任务
2. 方法、来源、口径、缺口都要显式交代
3. 不要伪造数据、来源或采访对象
4. 每个故事必须有 Resolution + Ending — 这是与 Dashboard 的核心区别

---

## 常见失败模式

| 失败模式 | 症状 | 修复 |
|----------|------|------|
| Data dump | 图很多但没有主线 | 选出 1 个核心 insight，围绕它组织 |
| No Build | 读完 SKILL.md 后直接手写 HTML / Web-PPT | 加载对应 BUILD.md，按 build workflow 生成最终产物 |
| Pattern 选择随意 | 所有章节都用 chart-narrative，或所有 hook 都默认用 hero-impact | 根据入口锚点选择；主数字或强背景图开篇用 hero-impact，问题意识 / stakes / why-now 开篇用 cover-intro；分步主图拆解才用 scrollytelling |
| Scrollytelling step-chart 脱节 | step 文案与当前 step 的图表状态对应不上，或相邻 steps 的图表状态几乎不变 | 每个 step 都必须对应一个明确的图表状态变化；step narrative 只解释当前这一步图上能看到的证据。若相邻 steps 没有可感知的图表变化，就合并步骤；具体写法遵循 [pattern-scrollytelling-plan.md](references/pattern-scrollytelling-plan.md) |

---

## 数据层设计

数据保留在持久化 Python 环境中，贯穿整个会话：

```
Phase 2: 分析数据 → DataFrame 变量（df_quarterly_returns 等）
Phase 3: 计算 Key Numbers → 精确数值 → 写入 plan.md
Phase 4: Build 时 → 基于 plan.md 中的引用、Key Numbers 和 Style Preset 上下文进行构建
```

**plan.md 只存储**：变量名引用 + Key Numbers 精确值 + Style Preset 名称。不重复内嵌原始数据。

**数据一致性保证**：叙述文字中的每个具体数字（"增长 46%"、"占比 82%"）必须来自 plan.md 的 Key Numbers，Key Numbers 必须从 DataFrame 精确计算。禁止凭感觉写数字。

如果图表需要排序、过滤、重排、分组、时间窗口或 step 状态变化，应提前准备对应的 `dataRef`。不要期待 renderer 自动推断排序或数据变换。

---

## 图表抽象层

`Charts` 是可选证据视觉字段，不是装饰素材合同。当前只支持普通统计图表，`renderer` 固定为 `standard-chart`，并且必须绑定 `dataRef`、服务章节 `Claim`。

趋势、对比、分布、构成、指标读数等统计证据必须写入 `Charts`。不要用 `visual_artifact`、`primary_image` 或 `evidence_image` 替代统计图表。

写任何 `Charts` 前，先读 [chart-contract.md](references/chart-contract.md)。字段合同、普通统计图表、scrollytelling 图表推进和多图规则都以该文件为准。

---

## Supporting Files

### 共享参考文件（格式无关）

| 文件 | 用途 | 何时读取 |
|------|------|----------|
| [references/story-arc-patterns.md](references/story-arc-patterns.md) | 5 种 arc pattern + 章节角色 + 过渡语 | Phase 3a |
| [references/STYLE_PRESETS.md](references/STYLE_PRESETS.md) | 视觉风格选择与素材气质指南 | Phase 3d |
| [references/chart-contract.md](references/chart-contract.md) | `Charts` 字段、普通统计图表合同、图表推进与多图规则 | 写任何 `Charts` 前 |
| [references/vseed-generation.md](references/vseed-generation.md) | 当前 Agent 生成 VSeed 配置及本地组装 | Build 含 `Charts` 时 |
| [references/page-composition.md](references/page-composition.md) | 固定组装的正文、配置与素材引用合同 | HTML / PPT 最终组装前 |
| [references/image-generation.md](references/image-generation.md) | 宿主 Agent 生图、落盘与缺失处理约定 | Build 含 generated image asset 时 |

### Build 模块

| 文件 | 用途 | 何时读取 |
|------|------|----------|
| [build-html/BUILD.md](build-html/BUILD.md) | HTML 构建主指令（Pattern 实现、组件规则、质量检查） | Phase 4（HTML） |
| [build-html/patterns/*.md](build-html/patterns/) | 8 个 Section Pattern 的 HTML 实现（模板 + 结构约束） | Phase 4（HTML）按章节 Pattern 按需读取 |
| [build-html/html-templates.md](build-html/html-templates.md) | 共享组件 HTML 片段 | Phase 4（HTML）|
| [build-ppt/BUILD.md](build-ppt/BUILD.md) | Web-PPT 构建主指令（slide mapping、过渡页、容量规则、质量检查） | Phase 4（PPT） |
| [build-ppt/slide-recipes.md](build-ppt/slide-recipes.md) | plan pattern / Story Breaks 到 slide sequence 的转译规则 | Phase 4（PPT）构建每章前 |
| [build-ppt/layout-recipes.md](build-ppt/layout-recipes.md) | 合法 `data-layout` 与整页结构选择 | Phase 4（PPT）选择每页 layout 前 |
| [build-ppt/slide-markup.md](build-ppt/slide-markup.md) | PPT slide shell、slots 和固定 markup | Phase 4（PPT）填充每张 slide 前 |
| [build-ppt/asset-handling.md](build-ppt/asset-handling.md) | SVG / image / 用户素材的合法角色与缺失策略 | Phase 4（PPT）素材落位前 |

### 共享工具脚本

只列 HTML / PPT 共用、Build 可调用的 workflow 入口；build 专属脚本只在对应 `BUILD.md` 中说明。

| 文件 | 用途 |
|------|------|
| [scripts/validate_story_plan.py](scripts/validate_story_plan.py) | Build 前校验 plan 结构 |
| [scripts/assemble_story_specs.py](scripts/assemble_story_specs.py) | 将 Agent 生成的配置与 Plan / 数据本地组装为 `spec_map.json` |
| [scripts/normalize_story_assets.py](scripts/normalize_story_assets.py) | 生成 `resolved_asset_bindings.json` |
| [scripts/compose_story.py](scripts/compose_story.py) | 固定组装 HTML / PPT，绑定 normalized assets |
| [scripts/validate_js.py](scripts/validate_js.py) | 校验最终 HTML / Web-PPT 产物 |
