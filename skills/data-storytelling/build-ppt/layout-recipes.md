# PPT Layout Recipes

本文件定义每张 slide 的合法 `data-layout`。Layout 只决定整页视觉结构：内容重心、列关系、证据舞台和节奏。它不改变 slide type、slot、证据边界或文案含义。

使用方式：先用 `Layout Map` 和选择规则确定候选 `data-layout`；生成具体 slide 前再读取对应 `### {layout}` 小节。slide type 按 `slide-recipes.md`，markup 按 `slide-markup.md`，素材 role 按 `asset-handling.md`。

不要发明临时 layout，也不要新增未登记的 wrapper 或 class。

## Layout Map

| Layout | 适合 slide type | 用途 |
|---|---|---|
| `wide-editorial` | `cover`, `chart-read`, `metric-board`, `transition` | 宽标题 + 宽主体，默认杂志式正文页 |
| `diagonal-stage` | `hero-stat`, `hero-image`, `chart-read`, `text-image` | 强舞台页，适合需要第一眼冲击的页 |
| `split-argument` | `chart-read`, `text-image`, `comparison` | 左侧论点，右侧单一证据对象 |
| `scrolly-stage` | `scroll-scene` | 固定图表舞台 + step 文案 |
| `evidence-stage` | `quote`, `quote-pair`, `image-grid`, `text-image`, `chart-read` | 让证据对象成为页面主角 |
| `rowline-board` | `action`, `timeline`, `process-flow`, `comparison`, `metric-reading`, `methodology` | 行式决策、节奏、流程和清单 |
| `quote-focus` | `quote`, `transition` | 大引用或强停顿页 |
| `closing-stage` | `closing` | 最后一页记忆句 / handoff |

## 选择规则

- 默认使用 `wide-editorial`。
- `cover` 固定使用 `wide-editorial`。
- 页面主角是 chart、quote、image 或 visual artifact 时，优先使用 `evidence-stage`。
- 左侧是判断路径、右侧是单一图表 / 图片证据对象时，使用 `split-argument`。
- `comparison` 根据证据形态选择：chart-backed comparison 使用 `split-argument`，左侧保留对照锚点和差异结论，右侧放 chart evidence 与一句 chart reading；清单式 comparison 使用 `rowline-board`。
- `scroll-scene` 必须使用 `scrolly-stage`。
- 核心数字页、强背景图页或需要强舞台感的证据页，使用 `diagonal-stage`。
- 行动、时间、流程、指标解释、方法说明和清单页，使用 `rowline-board`。
- 大引用或强停顿，使用 `quote-focus`。
- `closing` 必须使用 `closing-stage`。

同一个 deck 不要每页都用强 layout。强 layout 应留给 opener、break、核心证据和决策页。

## Layouts

### `wide-editorial`

默认 layout。适合需要宽标题、宽图表、宽指标板或宽列表的页面。

结构：

```html
<section class="deck-slide" data-slide-type="{slideType}" data-layout="wide-editorial" data-slide-label="{label}">
  <div class="slide-inner">
    ...
  </div>
</section>
```

边界：
- 不额外增加 wrapper。
- 标题、quote 和主证据使用 `.slide-inner` 的完整宽度。
- 正文读法仍由 `cue / reading-caption / takeaway` 控制行长。

### `diagonal-stage`

用于需要更强舞台感的主数字、背景图或证据页。

结构：

```html
<section class="deck-slide" data-slide-type="{slideType}" data-layout="diagonal-stage" data-slide-label="{label}">
  <div class="slide-inner">
    ...
  </div>
</section>
```

边界：
- 默认结构使用普通 `.slide-inner`。
- 当页面同时存在文本栈和明确前景证据对象时，可在 `.slide-inner` 上追加 `.slide-split`。
- 前景证据对象包括 `chart-frame / primary-image / visual-artifact / metric-tiles`；`hero-image` 的背景图属于背景层，保持普通 `.slide-inner`。
- 文字侧只保留 `deck-kicker + headline + cue/reading-caption`。
- 不自己画斜切 SVG、绝对定位色块或临时背景。

### `split-argument`

用于一边讲判断，一边展示单一证据对象。

结构：

```html
<section class="deck-slide" data-slide-type="{slideType}" data-layout="split-argument" data-slide-label="{label}">
  <div class="slide-inner slide-split">
    ...
  </div>
</section>
```

边界：
- 左侧是判断路径，右侧是证据对象。
- 左侧可以组合必要的判断 slots，但不要塞长解释、第二组对照或额外证据对象；右侧只放单一证据对象。
- 可用于 chart-backed comparison；此时左侧最多 2 个紧凑对照锚点，右侧只放一个 `chart-frame` 和一句 `reading-caption`。
- 清单式 comparison 使用 `rowline-board`。
- 不用于多引用页；多引用使用 `quote-pair` + `evidence-stage`。
- 若右侧没有明确证据对象，改用 `wide-editorial`。

Chart-backed comparison 用例：

```html
<section class="deck-slide" data-slide-type="comparison" data-layout="split-argument" data-slide-label="{label}">
  <div class="slide-inner slide-split">
    <div>
      <!-- comparison argument slots -->
    </div>
    <div>
      <!-- chart evidence slot -->
    </div>
  </div>
</section>
```

- 左侧放 `headline`、紧凑对照锚点和 `difference-callout`。
- 右侧放 1 个 `chart-frame` 和 1 句 `reading-caption`。

### `scrolly-stage`

用于 `scroll-scene`。左侧是当前 step 文案，右侧是同一张 sticky chart。

结构：

```html
<section class="deck-slide scroll-scene" data-slide-type="scroll-scene" data-layout="scrolly-stage" data-chart-id="{chartId}" data-slide-label="{label}">
  <div class="slide-inner scroll-scene-inner">
    ...
  </div>
</section>
```

边界：
- 只能用于 `scroll-scene`。
- 左侧不放多个模块，只放 `deck-kicker + headline + scroll-step-stage`。
- 右侧只放一个 `chart-frame`。
- 不当作长页面使用，也不添加操作提示文案。
- 不和 `slide-split` / `slide-grid` 混用。

### `evidence-stage`

用于让 quote、截图、图表、文档摘录或生成 artifact 成为页面主证据。

结构：

```html
<section class="deck-slide" data-slide-type="{slideType}" data-layout="evidence-stage" data-slide-label="{label}">
  <div class="slide-inner">
    ...
  </div>
</section>
```

边界：
- 一页只放一种主证据对象。
- 不把 `quote-block`、`chart-frame`、`primary-image`、`visual-artifact` 同时放成多个主角。
- `chart-read` 使用本 layout 时，只保留一个主图、一个读法和一个收束判断；不要再追加第二段解释或大型 highlight。
- 两条引用必须使用 `quote-pair`。
- attribution / source-note 必须低权重，不抢证据主体。

### `rowline-board`

用于行动、时间、流程、指标读法等列表型页面。它比卡片更像管理层简报，适合高密度但清楚的决策页。

结构：

```html
<section class="deck-slide" data-slide-type="{slideType}" data-layout="rowline-board" data-slide-label="{label}">
  <div class="slide-inner">
    ...
  </div>
</section>
```

边界：
- 每行只表达一个 priority、节点、步骤或 reading。
- 不把 rowline 再包成卡片。
- 清单式 comparison 可以使用两组 rowline，保持同一纵向扫描路径。
- 超过 6 行就拆页。

### `quote-focus`

用于强停顿、转折或核心原声。它不是普通引用说明页，而是节奏页。

结构：

```html
<section class="deck-slide" data-slide-type="quote" data-layout="quote-focus" data-slide-label="{label}">
  <div class="slide-inner">
    ...
  </div>
</section>
```

边界：
- `quote-block` 最多 2-3 行。
- `reading-caption` 可省略；需要解释时只放一句。
- 不放图表、图片、KPI 或行动项。

### `closing-stage`

用于 deck 最后一页。它只承担最终记忆点或 handoff，不继续分析。

结构：

```html
<section class="deck-slide" data-slide-type="closing" data-layout="closing-stage" data-slide-label="{label}">
  <div class="slide-inner closing-inner">
    ...
  </div>
</section>
```

边界：
- 只能用于 `closing`。
- 只放 `deck-kicker + headline + cue/lead-meta`。
- 不放图表、图片、quote、KPI、流程或行动清单。
- 不使用 `quote-focus` 冒充结尾页；quote-focus 是停顿或引用页，不是 deck handoff。

## 不合法情况

- 为了让文本放下而新增未登记结构。
- 同一页同时使用两个 layout 的 wrapper。
- 在 `slide-markup.md` 没定义的 slot 中塞素材或组件。
- 用强 layout 掩盖 plan 中一页承担多个阅读任务的问题。
