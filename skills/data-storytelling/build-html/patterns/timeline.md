# Pattern: timeline

时间维度叙事章节。它把 plan 中已经选定的时间节点、阶段转折或时间锚点落成按时间阅读的结构。

---

## Pattern Job

`timeline` 的构建职责是选择 vertical、chart-stack 或 split-sync，并输出按旧到新排列的节点。时间节点是主结构；可选主图只能作为同一时间线的证据锚点。

---

## Variant Contract

Section root 必须保留 `data-pattern="timeline"`。

| Variant | Root / hook | Required | Optional |
|---------|-------------|----------|----------|
| `vertical` | `.timeline-vertical` | `heading`, `events` x >= 3 | `takeaway` |
| `chart-stack` | `data-timeline-mode="chart-stack"` + `.timeline-strip` | `heading`, `chart-evidence`, `event-strip` x 3-5 | `takeaway` |
| `split-sync` | `data-timeline-mode="split-sync"` + `.timeline-sync` | `heading`, `chart-evidence`, `sync-rail` x 3-5 | `takeaway` |

Pattern 文档只定义 named slots 和组合约束。Shared primitive 的选择细节见 `visual-primitives.md`，canonical markup 见 `html-templates.md`。

---

## Variant Selection

- Build 根据时间节点与图表证据的关系选择 variant；plan 不需要提供 `data-timeline-mode`。
- `vertical`: 时间顺序本身是主结构，节点说明可以独立成立。
- `chart-stack`: 一张主图需要 3-5 个短 milestone 在图下作为时间锚点。
- `split-sync`: 一张主图需要同屏右侧紧凑 rail 解释关键时间锚点。

---

## Slot Grammar

| Slot | Variant | 接受内容 | 约束 |
|------|---------|---------|------|
| `heading` | all | `section-heading` | 标题写时间变化的判断 |
| `events` | `vertical` | `.timeline-item` x >= 3 | 每个节点包含时间、标题、短说明 |
| `chart-evidence` | `chart-stack`, `split-sync` | `chart-wrapper` | 只能有一张主图 |
| `event-strip` | `chart-stack` | `.timeline-strip` with `.timeline-strip-item` x 3-5 | 只写 milestone，不写长段解释 |
| `sync-rail` | `split-sync` | `.timeline-vertical.timeline-compact-rail` | 3-5 个 milestone，只锚定主图 |
| `takeaway` | all | `highlight-box` 或短收束正文 | 只用于时间线章节的最终判断 |

---

## Layout Skeletons

Skeleton 只说明合法 slot 位置。最终 HTML 必须替换注释，不要输出 slot 注释或占位文案。

### vertical

```html
<section data-pattern="timeline">
  <div class="story-container">
    <!-- slot: heading / shared: section-heading -->
    <div class="timeline-vertical">
      <!-- slot: events / timeline-item x >= 3 -->
    </div>
    <!-- optional slot: takeaway / highlight-box or prose -->
  </div>
</section>
```

### chart-stack

```html
<section data-pattern="timeline" data-timeline-mode="chart-stack">
  <div class="story-container">
    <!-- slot: heading / shared: section-heading -->
    <!-- slot: chart-evidence / shared: chart-wrapper -->
    <div class="timeline-strip">
      <!-- slot: event-strip / timeline-strip-item x 3-5 -->
    </div>
    <!-- optional slot: takeaway / highlight-box or prose -->
  </div>
</section>
```

### split-sync

```html
<section data-pattern="timeline" data-timeline-mode="split-sync">
  <div class="story-container">
    <!-- slot: heading / shared: section-heading -->
    <div class="timeline-sync">
      <div class="timeline-sync-main">
        <!-- slot: chart-evidence / shared: chart-wrapper -->
      </div>
      <aside class="timeline-sync-rail">
        <div class="timeline-vertical timeline-compact-rail">
          <!-- slot: sync-rail / timeline-item x 3-5 -->
        </div>
      </aside>
    </div>
    <!-- optional slot: takeaway / highlight-box or prose -->
  </div>
</section>
```

---

## Rules

- 事件按旧到新排列。
- `vertical` 使用 `.timeline-vertical`；事件顺序本身是主阅读结构。
- `chart-stack` 主图在上，`.timeline-strip` 在下；strip 只承担图表锚点，不写成长段解释。
- `split-sync` 使用 `.timeline-sync`；主图负责趋势和结构，右侧紧凑 rail 负责关键时间锚点。
- 不要倒序排列。
- 不要在 `chart-stack` 或 `split-sync` 里塞完整历史长文。
- 不要加入 sticky、滚动状态切换或 step activation。
- 不要使用多张主图。

---

## Required Hooks

以下 hook 属于结构 contract，不要删除或改名：

- Section root: `data-pattern="timeline"`
- Chart-coupled variants: `data-timeline-mode="chart-stack|split-sync"`
- Vertical timeline: `.timeline-vertical`, `.timeline-item`, `.timeline-dot`, `.timeline-content`, `.timeline-year`
- Strip: `.timeline-strip`, `.timeline-strip-item`
- Split sync: `.timeline-sync`, `.timeline-sync-main`, `.timeline-sync-rail`, `.timeline-compact-rail`
