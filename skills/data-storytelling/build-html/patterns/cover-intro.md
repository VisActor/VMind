# Pattern: cover-intro

克制开篇章节。它把 plan 中已经选定的开篇标题、导语和可选入口装饰落成 editorial entry。

---

## Pattern Job

`cover-intro` 的构建职责是输出 title、intro、可选 meta，以及至多一种背景 treatment。不要在 build 层改变已选 pattern。

---

## Treatment Contract

Section root 必须保留 `.cover-intro[data-pattern="cover-intro"]`。

| Treatment | Root / hook | Required | Optional |
|-----------|-------------|----------|----------|
| `plain` | `.cover-intro` | `title`, `section-intro` | `lead-meta` |
| `svg-background` | `.cover-intro.with-svg-bg` + `.cover-intro-bg[data-asset-id]` | plain contract, resolved `opener_motif_background` | `lead-meta` |
| `ghost-word` | `.cover-intro.with-ghost` + `.cover-intro-ghost` | plain contract, memory token | `lead-meta` |

`svg-background` 和 `ghost-word` 二选一，不能混用。Pattern 文档只定义 named slots 和组合约束。Shared primitive 的选择细节见 `visual-primitives.md`，canonical markup 见 `html-templates.md`。

---

## Treatment Selection

- Build 在 `cover-intro` 内部选择 treatment；plan 只需要选中 `cover-intro`，不需要提供 `.with-*` class 或 ghost 字段。
- 默认使用 `plain`。
- `svg-background`: 有 resolved `opener_motif_background` 时使用。
- `ghost-word`: 没有 resolved background asset，且标题、主题或章节语义中存在一个可作为章节记忆锚点的短 token 时使用。
- 没有合适 token 时保持 `plain`；不要为了装饰强行生成 ghost word。

---

## Slot Grammar

| Slot | Treatment | 接受内容 | 约束 |
|------|-----------|---------|------|
| `title` | all | `h1` | 读者可见主标题，直接表达故事主题 |
| `section-intro` | all | `.cover-intro-intro` | 2-4 句，建立视角、语气和为什么现在讲 |
| `lead-meta` | all | `.cover-intro-meta` | 可选；组织名、日期、版本等轻量信息 |
| `background` | `svg-background` | resolved `opener_motif_background` SVG `data_uri` | 只作为弱背景层；不承载正文、证据、来源或方法说明 |
| `ghost-word` | `ghost-word` | `.cover-intro-ghost` | 极低权重背景字；只允许已有短英文、年份、业务缩写或章节编号 |

## Layout Skeletons

Skeleton 只说明合法 slot 位置。最终 HTML 必须替换注释，不要输出 slot 注释或占位文案。

### plain

```html
<section class="cover-intro" data-pattern="cover-intro">
  <div class="story-container cover-intro-shell">
    <div class="cover-intro-copy">
      <!-- slot: title / h1 -->
      <!-- slot: section-intro / .cover-intro-intro -->
      <!-- optional slot: lead-meta / .cover-intro-meta -->
    </div>
  </div>
</section>
```

### svg-background

```html
<section class="cover-intro with-svg-bg" data-pattern="cover-intro">
  <div class="cover-intro-bg" data-asset-id="asset_id" aria-hidden="true" style="background-image: url('{resolved_data_uri}')"></div>
  <!-- cover-intro-shell -->
</section>
```

### ghost-word

```html
<section class="cover-intro with-ghost" data-pattern="cover-intro">
  <div class="cover-intro-ghost" aria-hidden="true">SHIFT</div>
  <!-- cover-intro-shell -->
</section>
```

---

## Rules

- 默认保持 `plain`；有 resolved `opener_motif_background` 时使用 `svg-background`，没有 asset 且存在章节记忆锚点时才使用 `ghost-word`。
- `opener_motif_background` 不可用时，不输出 `.cover-intro-bg` 空节点。
- SVG 背景只作为弱背景层；Build 只写 `background-image`，不写尺寸、透明度、overlay 或定位 patch。
- Ghost word 只能使用 1 个已有短 token；不要新造抽象装饰词，也不要放中文长句、数据读数、source、method、action cue 或解释性文字。
- `.cover-intro-ghost` 是纯装饰层，必须保留 `aria-hidden="true"`，避免屏幕阅读器把背景字当作正文朗读。
- 标题和导语是唯一正文入口；不要加入 chart-wrapper、KPI row、side rail、method notes 或来源摘要。
- 不要把 `Intent`、`Claim` 或方法说明直接复制成导语。

---

## Required Hooks

以下 hook 属于结构 contract，不要删除或改名：

- Section root: `.cover-intro[data-pattern="cover-intro"]`
- Copy shell: `.cover-intro-shell`, `.cover-intro-copy`, `.cover-intro-intro`, optional `.cover-intro-meta`
- SVG background: `.with-svg-bg`, `.cover-intro-bg[data-asset-id]`
- Ghost word: `.with-ghost`, `.cover-intro-ghost`
