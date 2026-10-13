# Pattern: action

结尾行动章节。它把 plan 中已经选定的行动项落成少量可执行下一步。

---

## Pattern Job

`action` 的构建职责是选择 cards 或 rowlines，并为每个行动保留优先级、标题和可执行说明。不要在 build 层改变已选 pattern。

---

## Mode Contract

Section root 必须保留 `data-pattern="action"`。

| Mode | Root / list hook | List count | Required | Optional |
|------|------------------|------------|----------|----------|
| `cards` | `.action-cards` | 2-4 个高层行动 | `heading`, 2-4 `.action-card` | first-card `lead-asset` |
| `rowlines` | `data-action-mode="rowlines"` + `.action-rowlines` | 4-7 个细分执行项 | `heading`, 4-7 `.action-rowline` | none |

`.action-card.with-asset` 只能用于第一张 lead card；其余卡片保持普通 `.action-card`。Pattern 文档只定义 named slots 和组合约束。Shared primitive 的选择细节见 `visual-primitives.md`，canonical markup 见 `html-templates.md`。

---

## Mode Selection

- Build 根据 action item 的数量、粒度和 meta 信息选择 mode；plan 不需要提供 `data-action-mode`。
- `cards`: 2-4 个高层行动，每项需要完整标题和说明。
- `rowlines`: 4-7 个细分执行项，每项适合附 owner、deadline、horizon 或 dependency 这类短 meta。
- `lead-asset` 不是 mode selector；只有 resolved lead asset 存在时才追加到第一张 card。

---

## Slot Grammar

| Slot | Mode | 接受内容 | 约束 |
|------|------|---------|------|
| `heading` | `cards`, `rowlines` | `section-heading` | 标题写行动方向，不写“下一步建议”这类框架词 |
| `action-card` | `cards` | priority badge + title + prose | 每张卡只表达一个高层行动 |
| `action-rowline` | `rowlines` | priority badge + title + prose + meta | 每行只表达一个细分执行项 |
| `lead-asset` | `cards` | 已解析 inline SVG asset | 只放在第一张 `.action-card.with-asset` 的 `.action-card-asset` |

---

## Layout Skeletons

Skeleton 只说明合法 slot 位置。最终 HTML 必须替换注释，不要输出 slot 注释或占位文案。

### cards

```html
<section data-pattern="action">
  <div class="story-container">
    <!-- slot: heading / shared: section-heading -->
    <div class="action-cards">
      <article class="action-card">
        <span class="badge priority-1">Priority 1</span>
        <h4><!-- slot: action title --></h4>
        <p><!-- slot: action prose --></p>
      </article>
      <!-- repeat 1-3 additional action-card items -->
    </div>
  </div>
</section>
```

### lead-asset add-on

只有存在 resolved lead asset 时，第一张 `.action-card` 才能追加 `.with-asset` 和 asset surface：

```html
<article class="action-card with-asset">
  <!-- existing first action-card content -->
  <div class="action-card-asset" data-asset-id="asset_id" aria-hidden="true">
    <!-- optional slot: lead-asset / resolved inline SVG -->
  </div>
</article>
```

### rowlines

```html
<section data-pattern="action" data-action-mode="rowlines">
  <div class="story-container">
    <!-- slot: heading / shared: section-heading -->
    <div class="action-rowlines">
      <article class="action-rowline">
        <span class="badge priority-1">P1</span>
        <div class="action-rowline-main">
          <h4><!-- slot: action title --></h4>
          <p><!-- slot: action prose --></p>
        </div>
        <div class="action-rowline-meta"><!-- owner / horizon --></div>
      </article>
      <!-- repeat 4-7 action-rowline items -->
    </div>
  </div>
</section>
```

---

## Rules

- 不要混用 `.action-cards` 和 `.action-rowlines`。
- 行动按优先级从高到低排列；优先级 class 使用 `.priority-1`、`.priority-2`、`.priority-3`，只表达行动优先级，不当作通用 taxonomy tag。
- 行动说明必须能回答“谁要做什么”和“为什么先做它”；不要写“改善体验”“加强治理”这类抽象口号。
- Rowline 右侧 meta 只放 owner、deadline、horizon、dependency 等执行标签，不放第二段正文。
- 不要只有 1 个行动；只有一个动作时应写成结尾正文或 highlight。
- 不要在 action 里放 chart-wrapper、KPI 网格或新的分析图。

---

## Required Hooks

以下 hook 属于结构 contract，不要删除或改名：

- Section root: `data-pattern="action"`
- Rowline root: `data-action-mode="rowlines"`
- Cards: `.action-cards`, `.action-card`, optional `.with-asset`, `.action-card-asset`
- Rowlines: `.action-rowlines`, `.action-rowline`, `.action-rowline-main`, `.action-rowline-meta`
