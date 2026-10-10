# Pattern: baseline-kpis

基线指标章节。它把 plan 中已经选定的 2-4 个并列 KPI 落成同一层级的指标组。

---

## Pattern Job

`baseline-kpis` 的构建职责是输出一个并列 KPI row。所有 KPI 共享同一视觉权重；同一章只有 `.kpi-row` 一个主表达面。

---

## Variant Contract

Section root 必须保留 `data-pattern="baseline-kpis"`。

| Variant | Root / list hook | Required | Optional |
|---------|------------------|----------|----------|
| `standard` | `.kpi-row.cols-2` 或 `.kpi-row.cols-4` | `heading`, 2-4 `.kpi-card` | `context` |
| `lead-icon` | `.kpi-row` 内的 `.kpi-card.with-icon` | standard contract | one lead `.kpi-icon` |

Pattern 文档只定义 named slots 和组合约束。Shared primitive 的选择细节见 `visual-primitives.md`，canonical markup 见 `html-templates.md`。

---

## Slot Grammar

| Slot | 接受内容 | 约束 |
|------|---------|------|
| `heading` | `section-heading` | 标题说明这些指标共同建立什么坐标 |
| `context` | `section-intro` 或短正文 | 可选；只解释读法，不展开分析 |
| `kpi-row` | 包含 2-4 个 `.kpi-card` 的 `.kpi-row` | 所有卡片权重并列；不能混入主图 |
| `lead-icon` | `.kpi-icon` 内的已解析 inline SVG asset | 最多一个 lead KPI card 使用 |

---

## Layout Skeletons

Skeleton 只说明合法 slot 位置。最终 HTML 必须替换注释，不要输出 slot 注释或占位文案。

### standard

```html
<section data-pattern="baseline-kpis">
  <div class="story-container">
    <!-- slot: heading / shared: section-heading -->
    <!-- optional slot: context / shared: section-intro or prose -->
    <div class="kpi-row cols-4">
      <!-- slot: kpi-row / shared: kpi-card x 2-4 -->
    </div>
  </div>
</section>
```

### lead-icon add-on

只有存在 resolved `kpi_lead_icon` 时，`.kpi-row` 内最多一张卡片可使用 `html-templates.md#带图标的 KPI 卡片` canonical variant。不要在本 pattern 里手写第二套 `.kpi-card` 内部结构。

---

## Rules

- KPI 数量必须是 2-4 个；`.cols-2` 用于 2 个，`.cols-4` 用于 3-4 个。
- KPI label 承载指标名和必要上下文；数值节点只放数值、前缀、后缀。
- KPI 数值宿主是 `.kpi-value.metric-shell`，内部直接复用 `html-templates.md#共享指标数值契约`。
- `lead-icon` 最多出现一次；不要给每张 KPI card 都加 icon。
- 不要在 `baseline-kpis` 内放 `chart-wrapper`、主图、KPI 之外的第二表达面或完整分析段落。

---

## Required Hooks

以下 hook 属于结构 contract，不要删除或改名：

- Section root: `data-pattern="baseline-kpis"`
- KPI row: `.kpi-row`, `.cols-2` or `.cols-4`
- KPI card: `.kpi-card`, optional `.with-icon`, `.kpi-icon`
- KPI metric host: `.kpi-value.metric-shell`
