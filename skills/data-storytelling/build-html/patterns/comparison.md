# Pattern: comparison

对比章节。它把 plan 中已经选定的对比对象、状态或维度落成同一口径下的差异阅读单元。

---

## Pattern Job

`comparison` 的构建职责是选择 pair 或 alternating，并把对比对象、差异口径、局部量化锚点和收束判断放进同一个 comparison frame。不要在 build 层改变已选 pattern。

---

## Mode Contract

Section root 必须保留 `data-pattern="comparison"` 和 `data-comparison-mode="pair|alternating"`。

| Mode | Root / layout hook | Unit count | Required | Optional |
|------|--------------------|------------|----------|----------|
| `pair` | `data-comparison-mode="pair"` + `.comparison-pair` | 2 个 `.comparison-card` | `heading`, `comparison-frame`, `entities` | `support-metric`, `chart-evidence`, `comparison-copy`, `takeaway` |
| `alternating` | `.alternating-section[data-index]` + `.alternating-inner` | 每个 section 一个维度 | `heading`, `comparison-frame` | `chart-evidence`, `comparison-copy`, `support-metric`, `takeaway` |

Pattern 文档只定义 named slots 和组合约束。Shared primitive 的选择细节见 `visual-primitives.md`，canonical markup 见 `html-templates.md`。

---

## Mode Selection

- Build 根据对比对象、状态数量和维度结构选择 mode；plan 不需要提供 `data-comparison-mode`。
- `pair`: 两个主体、两个状态或 before/after 直接对照，且两张 card 共享同一比较口径。
- `alternating`: 同一 `Claim` 下有多个对比维度，需要按维度连续阅读；每个维度生成一个 `.alternating-section[data-index]`。
- 不要为了视觉变化选择 `alternating`；`data-index` 顺序必须来自对比维度顺序。

---

## Slot Grammar

| Slot | Mode | 接受内容 | 约束 |
|------|------|---------|------|
| `heading` | `pair`, `alternating` | `section-heading` | 标题写对比结论，不写“对比分析” |
| `comparison-frame` | `pair`, `alternating` | `.comparison-pair` 或 `.alternating-inner` | 由 `data-comparison-mode` 决定 |
| `entities` | `pair` | 2 个 `.comparison-card` | 只允许两个主体或两个状态 |
| `chart-evidence` | `pair`, `alternating` | `chart-wrapper` 或 `image-evidence` | 服务同一个 `Claim`；不形成第二个问题 |
| `comparison-copy` | `pair`, `alternating` | 短正文 / `context-note` | 解释差异口径或读法 |
| `support-metric` | `pair`, `alternating` | `.stat-value.metric-shell` 或 `delta-chip` | 只做局部量化锚点 |
| `takeaway` | `pair`, `alternating` | `highlight-box` 或短收束正文 | 只用于章级对比结论 |

---

## Layout Skeletons

Skeleton 只说明合法 slot 位置。最终 HTML 必须替换注释，不要输出 slot 注释或占位文案。

### pair

```html
<section data-pattern="comparison" data-comparison-mode="pair">
  <div class="story-container">
    <!-- slot: heading / shared: section-heading -->
    <div class="comparison-pair">
      <article class="comparison-card before">
        <p class="comparison-label"><!-- slot: first entity or state label --></p>
        <!-- optional slot: support-metric / shared metric hosted by .stat-value.metric-shell or delta-chip -->
        <p class="comparison-desc"><!-- slot: first entity or state description --></p>
      </article>
      <article class="comparison-card after">
        <p class="comparison-label"><!-- slot: second entity or state label --></p>
        <!-- optional slot: support-metric / shared metric hosted by .stat-value.metric-shell or delta-chip -->
        <p class="comparison-desc"><!-- slot: second entity or state description --></p>
      </article>
    </div>
    <!-- optional slot: chart-evidence / shared: chart-wrapper or image-evidence -->
    <!-- optional slot: comparison-copy / prose or context-note -->
    <!-- optional slot: takeaway / highlight-box or prose -->
  </div>
</section>
```

### alternating

```html
<section class="alternating-section" data-pattern="comparison" data-comparison-mode="alternating" data-index="0">
  <div class="story-container">
    <div class="alternating-inner">
      <div class="visual-side">
        <!-- optional slot: chart-evidence / shared: chart-wrapper, image-evidence, or comparison surface -->
      </div>
      <div class="content-side">
        <!-- slot: heading / shared: section-heading -->
        <!-- optional slot: comparison-copy / prose or context-note -->
        <!-- optional slot: support-metric / shared metric hosted by .stat-value.metric-shell or delta-chip -->
      </div>
    </div>
    <!-- optional slot: takeaway / highlight-box or prose -->
  </div>
</section>

<!-- repeat one section per comparison dimension with continuous data-index -->
```

---

## Rules

- `pair` 只允许两个 `.comparison-card`；不要加入第三个主体。
- Pair card 内的 metric host 是 `.stat-value.metric-shell`，内部直接复用 `html-templates.md#共享指标数值契约`；不要借用 `.kpi-value`、`.kpi-label` 或 `.kpi-card` anatomy。
- Pair card label 和说明分别使用 `.comparison-label` 与 `.comparison-desc`；不要把语义标签塞进数值节点。
- `alternating` 每个 section 只表达一个对比维度；`data-index` 从 0 开始连续递增。
- 奇偶换边由 CSS 根据 `data-index` 处理；Build 不要为了换边新建结构。
- 每个 alternating section 只放一个 `.visual-side` 和一个 `.content-side`，最多一个主图或一个主对比面。
- `image-evidence` 只能作为对比证据面，不能和同一 comparison section 内的 `chart-wrapper` 并列制造双主视觉。
- 不要为了视觉变化而换边；换边必须对应真实的分析维度变化。
- 不要把多个独立分析问题并排塞进同一 comparison。
- 不要自创两栏布局；使用 `.comparison-pair` 或 `.alternating-inner`。

## Required Hooks

以下 hook 属于结构 contract，不要删除或改名：

- Section root: `data-pattern="comparison"`, `data-comparison-mode="pair|alternating"`
- Pair: `.comparison-pair`, `.comparison-card`, `.before`, `.after`, `.comparison-label`, `.comparison-desc`
- Alternating: `.alternating-section[data-index]`, `.alternating-inner`, `.visual-side`, `.content-side`
- Support metric host when present: `.stat-value.metric-shell` or `.delta-chip`
