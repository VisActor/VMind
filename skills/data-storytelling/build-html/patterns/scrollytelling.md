# Pattern: scrollytelling

滚动推进章节。它把 plan 中已经选定的主图和状态步骤落成 sticky chart + scrolly steps。

---

## Pattern Job

`scrollytelling` 的构建职责是输出一张固定主图和连续步骤。每个 step 只解释当前主图状态能表达的证据，不引入第二张主图或新的分析面。

---

## Layout Contract

Section root 必须保留 `.scrolly-section[data-pattern="scrollytelling"][data-chart-id]`。这个 `data-chart-id` 是滚动切换主图状态的 root hook。

| Layout | Root / hook | Required | Optional |
|--------|-------------|----------|----------|
| `sticky-steps` | `.scrolly-section` + `.scrolly-chart` + `.scrolly-steps` | `heading`, `primary-chart`, `.scrolly-step[data-step]` sequence | none |

`.scrolly-section` 自带 grid、sticky 和水平 padding，内部禁止嵌套 `.story-container`。Pattern 文档只定义 named slots 和组合约束。Shared primitive 的选择细节见 `visual-primitives.md`，canonical markup 见 `html-templates.md`。

---

## Slot Grammar

| Slot | 接受内容 | 约束 |
|------|---------|------|
| `heading` | `section-heading` | 说明这一段滚动要解释什么 |
| `primary-chart` | `chart-wrapper` | 只能有一张 sticky 主图；内部 `.chart-container` 必须追加 `scrolly` modifier，并保留 `id="chart-{primaryChartId}"` |
| `steps` | `.scrolly-step` sequence | 每步必须对应主图状态变化 |
| `step-title` | `h3` | 写当前图表状态下的观察点 |
| `step-narrative` | 短正文 | 只解释当前主图状态，不引入下一章证据 |

---

## Layout Skeletons

Skeleton 只说明合法 slot 位置。最终 HTML 必须替换注释，不要输出 slot 注释或占位文案。

```html
<section class="scrolly-section" data-pattern="scrollytelling" data-chart-id="{primaryChartId}">
  <!-- slot: heading / shared: section-heading -->
  <div class="scrolly-chart">
    <!-- slot: primary-chart / shared: chart-wrapper；其 .chart-container 必须是 .chart-container.scrolly 且保留 id="chart-{primaryChartId}" -->
  </div>
  <div class="scrolly-steps">
    <article class="scrolly-step is-active" data-step="0">
      <!-- slot: step-title -->
      <!-- slot: step-narrative -->
    </article>
    <article class="scrolly-step" data-step="1">
      <!-- slot: step-title -->
      <!-- slot: step-narrative -->
    </article>
    <!-- repeat for each additional chart state step -->
  </div>
</section>
```

---

## Rules

- `primary-chart` 保持固定视觉锚点，所有 step 围绕它解释。
- 每个 step 的 `data-step` 从 0 开始连续递增。
- 初始 step 保留 `.is-active`。
- Section root 与内部 `chart-wrapper` 共用同一个 `{primaryChartId}`；`.chart-container.scrolly` 和 step item 不挂 `data-chart-id`。
- 图表容器需要稳定高度，避免首次渲染尺寸错误。
- 不要在 `.scrolly-section` 内嵌套 `.story-container`。
- 不要在 step 文案里提前写下一章数据结论。
- 不要自创进度器结构；已有进度指示器若启用必须保持为辅助层。

---

## Required Hooks

以下 hook 属于结构 contract，不要删除或改名：

- Section root: `.scrolly-section[data-pattern="scrollytelling"][data-chart-id]`
- Chart column: `.scrolly-chart`
- Steps column: `.scrolly-steps`
- Step item: `.scrolly-step[data-step="N"]`
- Initial step: `.scrolly-step.is-active[data-step="0"]`
