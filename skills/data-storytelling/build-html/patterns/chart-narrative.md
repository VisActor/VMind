# Pattern: chart-narrative

标准图表证据章节。它把 plan 中已经选定的图表证据落成一个围绕 `Claim` 的阅读单元。

---

## Pattern Job

`chart-narrative` 的构建职责是组织 heading、reading lead、chart evidence、support 和 takeaway。`chart-evidence` 是唯一主视觉；其他 visual primitives 只能解释、压缩或增强主图读法，不能形成第二表达面。

---

## Variant Contract

Section root 必须保留 `data-pattern="chart-narrative"`。

| Variant | Root / layout hook | Chart count | Required | Optional |
|---------|--------------------|-------------|----------|----------|
| `classic-stack` | `data-layout="classic-stack"` | 1 或 2-3 张顺序图 | `heading`, `chart-evidence`, `takeaway` | `reading-lead`, `support`, `transition` |
| `narrative-rail` | `data-layout="narrative-rail"` + `.chart-narrative-rail` | 1 张图 | `heading`, `chart-evidence`, `takeaway` | `reading-lead`, `support`, `rail-below` |
| `magazine-module` | `data-layout="magazine-module"` + `.chart-narrative-module` | 1 张图 | `heading`, `chart-evidence`, `takeaway` | `reading-lead`, 紧凑 `support` |

Pattern 文档只定义 named slots 和组合约束。Shared primitive 的选择细节见 `visual-primitives.md`，canonical markup 见 `html-templates.md`。

---

## Slot Grammar

| Slot | Variant | 接受内容 | 约束 |
|------|---------|---------|------|
| `heading` | all | `section-heading` | 标题写结论，不写描述；通常来自 `Title` |
| `reading-lead` | all | `section-intro` 或短正文 | 引出图表要回答的问题；不能重复标题 |
| `chart-evidence` | all | `chart-wrapper` | `chart-evidence` 是唯一主视觉；多图只允许 `classic-stack` 的 2-3 张顺序图，且只有 1 个 primary |
| `support` | all | `context-note`、`quote-block`、`big-stat`、`image-evidence`、短正文 | 必须从属主图；rail/module 中最多 1 个紧凑 support |
| `takeaway` | all | `highlight-box` 或短收束正文 | 必须来自 `Claim`；低权重 transition 不能进入 `highlight-box` |
| `rail-below` | `narrative-rail` | `highlight-box`、短 takeaway、transition 正文 | 承接较长 takeaway，避免内容侧被撑高 |
| `transition` | `classic-stack` | 仅正文 | 低权重 handoff；不是 shared component |

## Layout Skeletons

Skeleton 只说明合法 slot 位置。最终 HTML 必须替换注释，不要输出 slot 注释或占位文案。

### classic-stack

```html
<section data-pattern="chart-narrative" data-layout="classic-stack">
  <div class="story-container">
    <!-- slot: heading / shared: section-heading -->
    <!-- optional slot: reading-lead / shared: section-intro or prose -->
    <!-- slot: chart-evidence / shared: chart-wrapper -->
    <!-- optional slot: support / shared primitive or prose -->
    <!-- slot: takeaway / shared: highlight-box or prose -->
    <!-- optional slot: transition / prose only -->
  </div>
</section>
```

### narrative-rail

```html
<section data-pattern="chart-narrative" data-layout="narrative-rail">
  <div class="story-container">
    <div class="alternating-inner chart-narrative-rail">
      <div class="content-side">
        <!-- slot: heading / shared: section-heading -->
        <!-- optional slot: reading-lead -->
        <!-- optional slot: support / supporting explanation paragraphs -->
        <!-- slot: takeaway -->
      </div>
      <div class="visual-side">
        <!-- slot: chart-evidence / one chart-wrapper -->
      </div>
      <div class="rail-below">
        <!-- optional slot: rail-below / takeaway or transition when side rail would be too tall -->
      </div>
    </div>
  </div>
</section>
```

### magazine-module

```html
<section data-pattern="chart-narrative" data-layout="magazine-module">
  <div class="story-container">
    <div class="alternating-inner chart-narrative-module">
      <div class="visual-side">
        <!-- slot: chart-evidence / one chart-wrapper -->
      </div>
      <aside class="content-side">
        <!-- slot: heading / shared: section-heading -->
        <!-- optional slot: reading-lead / short supporting explanation paragraph -->
        <!-- optional slot: support / compact rail support block -->
      </aside>
    </div>
    <!-- slot: takeaway -->
  </div>
</section>
```

---

## Rules

- `classic-stack` 的顺序是 `heading` -> optional `reading-lead` -> `chart-evidence` -> optional `support` -> `takeaway` -> optional `transition`。
- 多图顺序分析只允许出现在 `classic-stack`；每张图回答同一 `Claim` 分析链中的一个子问题。
- `narrative-rail` 和 `magazine-module` 只允许单图；内容侧保持短，heading/lead 后最多放一个 support。
- `narrative-rail` 的内容侧只放短句 takeaway；较长 takeaway 放入 `rail-below`。
- `rail-below` 只属于 `narrative-rail`，用于容纳较长 takeaway 或 transition prose。
- `highlight-box` 只用于章节级 takeaway；局部 caveat 使用 `context-note`。
- `image-evidence` 只能作为 support，不能替代 `chart-evidence` 主图。
- `big-stat` 只能作为单个短数字锚点；不要用于 KPI 网格、排行或长数字。
- 不要在内容侧放第二组图、完整 KPI card 组、额外主栏或新卡片组件。
- 不要让 KPI、引用、高亮或 asset 与主图形成多中心视觉竞争。

---

## Required Hooks

以下 hook 属于结构 contract，不要删除或改名：

- Section root: `data-pattern="chart-narrative"`
- Layout: `data-layout="classic-stack"`, `data-layout="narrative-rail"`, or `data-layout="magazine-module"`
- Rail: `.chart-narrative-rail`, `.rail-below`
- Module: `.chart-narrative-module`
