# PPT Slide Markup

本文件定义 Web-PPT 的固定 HTML 外壳、slots 和可用 primitive。它只描述结构，不负责 slide type、layout、素材策略或内容取舍。

## 通用外壳

每张 slide 使用同一外壳：

```html
<section class="deck-slide" data-slide-type="{slideType}" data-layout="{layout}" data-slide-label="{short label}">
  <div class="slide-inner">
    <!-- slide slots -->
  </div>
</section>
```

双栏或网格页面只允许在 `.slide-inner` 上追加既有结构 class：

```html
<section class="deck-slide" data-slide-type="{slideType}" data-layout="{layout}" data-slide-label="{short label}">
  <div class="slide-inner slide-split">
    <!-- left slots -->
    <!-- right slots -->
  </div>
</section>
```

```html
<section class="deck-slide" data-slide-type="{slideType}" data-layout="{layout}" data-slide-label="{short label}">
  <div class="slide-inner slide-grid">
    <!-- grid slots -->
  </div>
</section>
```

可选 `data-bg-polarity="dark|light"` 只用于 resolved 背景图导致 preset polarity 需要调整时。不要把它当成主题切换。

不要在 markup 中加入页面效果相关的属性、class 或逐页脚本。

## 固定 Slot Markup

图表：

```html
<div class="chart-frame" data-chart-id="{chartId}">
  <div class="chart-container" id="ppt-chart-{chartId}"></div>
</div>
```

Scroll scene：

```html
<section class="deck-slide scroll-scene" data-slide-type="scroll-scene" data-layout="scrolly-stage" data-chart-id="{chartId}" data-slide-label="{short label}">
  <div class="slide-inner scroll-scene-inner">
    <div class="scroll-scene-copy">
      <p class="deck-kicker">{kicker}</p>
      <h1 class="headline">{headline}</h1>
      <div class="scroll-step-stage">
        <article class="scroll-step-copy is-active" data-scroll-step="0">
          <p class="step-label">Step 01</p>
          <h2 class="step-title">{step title}</h2>
          <p class="step-body">{step narrative}</p>
        </article>
        <article class="scroll-step-copy" data-scroll-step="1">
          <p class="step-label">Step 02</p>
          <h2 class="step-title">{step title}</h2>
          <p class="step-body">{step narrative}</p>
        </article>
      </div>
    </div>
    <div class="chart-frame scroll-chart-stage" data-chart-id="{chartId}">
      <div class="chart-container" id="ppt-chart-{chartId}"></div>
    </div>
  </div>
</section>
```

`scroll-scene` 的 step 编号必须从 0 连续递增。只有第一个 `.scroll-step-copy` 初始带 `.is-active`。不要使用 `.scrolly-section`，那是 HTML story 的 pattern hook。

Closing：

```html
<section class="deck-slide" data-slide-type="closing" data-layout="closing-stage" data-slide-label="closing">
  <div class="slide-inner closing-inner">
    <p class="deck-kicker">{kicker}</p>
    <h1 class="headline">{final memory line}</h1>
    <p class="cue">{handoff cue}</p>
    <div class="lead-meta">
      <span>{meta}</span>
    </div>
  </div>
</section>
```

`closing` 的 `cue` 和 `lead-meta` 可省略；不要放 chart、quote、image、KPI、流程或行动清单。

背景图必须是 `.deck-slide` 的直接子级，且放在 `.slide-inner` 之前：

```html
<figure class="slide-background" aria-hidden="true">
  <img src="{resolvedAssetDataUri}" alt="">
</figure>
```

主图：

```html
<figure class="primary-image">
  <img src="{resolvedAssetDataUri}" alt="{short factual alt}">
</figure>
```

图片证据网格：

`evidence-grid` 用于 2-6 张图片、截图或版面证据。每张图使用一个 `evidence-figure`。

```html
<div class="evidence-grid">
  <figure class="evidence-figure">
    <div class="evidence-image">
      <img src="{resolvedAssetDataUri}" alt="{short factual alt}">
    </div>
    <figcaption class="image-caption">{caption}</figcaption>
  </figure>
</div>
```

视觉 artifact（仅作为 `text-image` 页内证据对象）：

```html
<div class="visual-artifact">
  {inlineSvgOrImage}
</div>
```

引用：

```html
<blockquote class="quote-block">{quote}</blockquote>
<p class="attribution">{source}</p>
```

双引用：

```html
<div class="quote-pair">
  <article class="quote-card">
    <p class="deck-kicker">{label}</p>
    <blockquote class="quote-block">{quote}</blockquote>
    <p class="attribution">{source}</p>
  </article>
  <article class="quote-card">
    <p class="deck-kicker">{label}</p>
    <blockquote class="quote-block">{quote}</blockquote>
    <p class="attribution">{source}</p>
  </article>
</div>
```

行动 / 流程行：

```html
<article class="action-item">
  <strong>{priority}</strong>
  <span>{title}</span>
  <em>{reason or next step}</em>
</article>
```

```html
<article class="process-step">
  <strong>{label}</strong>
  <span>{title}</span>
  <em>{note}</em>
</article>
```

KPI 指标组：

```html
<div class="metric-tiles">
  <article class="metric-tile">
    <div class="metric-label">{label}</div>
    <div class="metric-value">{value}</div>
    <div class="unit">{unit}</div>
    <p class="metric-reading">{reading}</p>
  </article>
</div>
```

KPI 的短货币符号、正负号等前缀并入 `.metric-value`，后缀单位 / 百分号放 `.unit`。例如：`<div class="metric-value">¥26.88</div><div class="unit">亿元</div>`；若展示值本身已是 `$448.7M` 这类紧凑格式，可整体放入 `.metric-value`，`unit` 省略或留给下一行语义说明。

需要强调单个数字或关键词时，可选追加 `.tone-accent`，但只允许用于 `cover / transition / closing / hero-stat`，且只用于真正的锚点，不要整页滥用。`hero-stat` 的主数字默认已经使用重点色，不要给 `.big-number` 重复追加 `.tone-accent`：

```html
<h1 class="headline">把 <span class="tone-accent">{keyword}</span> 先讲清楚。</h1>
<p class="cue"><span class="tone-accent">{short anchor}</span> 是这一页的记忆点。</p>
```

Hero image 的 canonical markup 是背景层 + 单个 `.slide-inner` 文本栈。`hero_background_image` 进入 `.slide-background`，headline 和 cue/source-note 留在同一阅读栈：

```html
<section class="deck-slide" data-slide-type="hero-image" data-layout="diagonal-stage" data-slide-label="{label}">
  <figure class="slide-background" aria-hidden="true">
    <img src="{resolvedAssetDataUri}" alt="">
  </figure>
  <div class="slide-inner">
    <h1 class="headline">{headline}</h1>
    <p class="cue">{cue}</p>
  </div>
</section>
```

Hero stat 使用 `data-stat-stage` 选择一种数字舞台：
- `monolith`：单一主数字 + 一句记忆点
- `context-cards`：主数字 + 1-4 条短上下文读法
- `delta-compare`：baseline / current / delta 同页
- `ticker`：短数字串或里程碑数字

`delta-compare` 中只能强调 current 侧，baseline 必须保持 muted。

`hero-stat` 可作为 deck 首页，但必须是 title-led：保留 `headline`，让标题先说明故事张力，再用主数字做记忆锚点。

数字锁组规则：
- `.big-number` 只放数字值。
- 单位、货币、百分号等后缀放相邻 `.unit`。
- 展示值必须先压成短数字，例如 `29.21` + `亿元`；不要输出 `2921000000` 这类长原始数，也不要把中文单位塞进 `.big-number`。

默认巨字：

```html
<section class="deck-slide" data-slide-type="hero-stat" data-layout="diagonal-stage" data-stat-stage="monolith" data-slide-label="{label}">
  <div class="slide-inner">
    <h1 class="headline">{chapter Title / judgment headline}</h1>
    <p class="deck-kicker">{metric label}</p>
    <div class="stat-number-line" aria-label="{value} {unit}">
      <span class="big-number">{numeric value}</span>
      <span class="unit">{unit}</span>
    </div>
    <p class="reading-caption">{one-sentence reading}</p>
  </div>
</section>
```

数字 + 上下文卡片：

```html
<section class="deck-slide" data-slide-type="hero-stat" data-layout="diagonal-stage" data-stat-stage="context-cards" data-slide-label="{label}">
  <div class="slide-inner">
    <h1 class="headline">{judgment headline}</h1>
    <div class="stat-stage">
      <div class="stat-primary">
        <p class="deck-kicker">{metric label}</p>
        <div class="stat-number-line" aria-label="{value} {unit}">
          <span class="big-number">{numeric value}</span>
          <span class="unit">{unit}</span>
        </div>
        <p class="reading-caption">{one-sentence reading}</p>
      </div>
      <div class="stat-context-cards">
        <article class="stat-context-card"><span class="stat-context-icon">01</span><p>{context reading}</p></article>
      </div>
    </div>
  </div>
</section>
```

前后对比：

```html
<section class="deck-slide" data-slide-type="hero-stat" data-layout="wide-editorial" data-stat-stage="delta-compare" data-slide-label="{label}">
  <div class="slide-inner">
    <h1 class="headline">{judgment headline}</h1>
    <p class="deck-kicker">{comparison label}</p>
    <div class="stat-delta-compare">
      <div class="stat-compare-side is-previous">
        <p class="stat-compare-label">{baseline label}</p>
        <div class="stat-number-line" aria-label="{baseline value} {baseline unit}">
          <span class="big-number">{baseline numeric value}</span>
          <span class="unit">{baseline unit}</span>
        </div>
      </div>
      <div class="stat-arrow" aria-hidden="true">→</div>
      <div class="stat-compare-side is-current">
        <p class="stat-compare-label">{current label}</p>
        <div class="stat-number-line" aria-label="{current value} {current unit}">
          <span class="big-number">{current numeric value}</span>
          <span class="unit">{current unit}</span>
        </div>
      </div>
    </div>
    <p class="stat-delta-note">{delta reading}</p>
    <p class="reading-caption">{one-sentence meaning}</p>
  </div>
</section>
```

翻牌式数字只放数字位和分隔符；单位放在 `deck-kicker` 或 `reading-caption`，不要混入翻牌字符：

```html
<section class="deck-slide" data-slide-type="hero-stat" data-layout="wide-editorial" data-stat-stage="ticker" data-slide-label="{label}">
  <div class="slide-inner">
    <h1 class="headline">{judgment headline}</h1>
    <p class="deck-kicker">{metric label}</p>
    <div class="stat-ticker" aria-label="{value}">
      <span class="stat-ticker-digit">1</span>
      <span class="stat-ticker-digit">2</span>
      <span class="stat-ticker-separator">,</span>
      <span class="stat-ticker-digit">8</span>
    </div>
    <p class="reading-caption">{one-sentence reading}</p>
  </div>
</section>
```

指标 / 证据读法列表：

```html
<ul class="reading-list">
  <li>{reading}</li>
</ul>
```

流程步骤组：

```html
<div class="process-steps">
  <article class="process-step">
    <strong>{label}</strong>
    <span>{title}</span>
    <em>{note}</em>
  </article>
</div>
```

对照面板：

```html
<div class="slide-grid">
  <article class="comparison-panel">
    <p class="deck-kicker">{left label}</p>
    <h3>{left title}</h3>
    <p class="intro">{left reading}</p>
  </article>
  <article class="comparison-panel">
    <p class="deck-kicker">{right label}</p>
    <h3>{right title}</h3>
    <p class="intro">{right reading}</p>
  </article>
</div>
```

时间节点组：

```html
<div class="timeline-nodes">
  <article class="timeline-node">
    <div class="timeline-time">{time or stage}</div>
    <p class="metric-label">{label}</p>
    <p class="metric-reading">{meaning}</p>
  </article>
</div>
```

行动项组：

```html
<div class="action-items">
  <article class="action-item">
    <strong>{priority}</strong>
    <span>{title}</span>
    <em>{reason or next step}</em>
  </article>
</div>
```

方法说明：

```html
<section class="deck-slide" data-slide-type="methodology" data-layout="rowline-board" data-slide-label="methodology">
  <div class="slide-inner">
    <p class="deck-kicker">Methodology</p>
    <h1 class="headline">{short source title}</h1>
    <ul class="reading-list">
      <li><strong>Data Source</strong><span>{source}</span></li>
      <li><strong>Time Range</strong><span>{time range}</span></li>
      <li><strong>Caveats</strong><span>{caveats}</span></li>
    </ul>
  </div>
</section>
```

## 组合边界

本文件只定义固定 shell 和 primitive markup。

- 先按 `slide-recipes.md` 确认 slide type 和 required / optional slots。
- 再按 `layout-recipes.md` 确认外层结构和视觉关系。
- 素材按 `asset-handling.md` 选择 role 和缺失策略。
- 只组合本文件列出的 primitive；需要新 wrapper 或新 class 时，先更新本文件和 validator。

## Slide Type Primitive Map

这张表只列合法 primitive 组合。required / optional 关系仍按 `slide-recipes.md` 执行。

| Slide type | 可用 primitive |
|---|---|
| `cover` | `slide-background`, `deck-kicker`, `headline`, `intro`, `lead-meta` |
| `hero-stat` | `deck-kicker`, `headline`, `stat-number-line`, `big-number`, `unit`, `reading-caption`, `source-note`, `stat-stage`, `stat-primary`, `stat-context-cards`, `stat-context-card`, `stat-context-icon`, `stat-delta-compare`, `stat-compare-side`, `stat-compare-label`, `stat-delta-note`, `stat-ticker`, `stat-ticker-digit`, `stat-ticker-separator` |
| `hero-image` | `slide-background`, `headline`, `cue`, `source-note` |
| `metric-board` | `headline`, `metric-tiles`, `metric-tile`, `takeaway`, `source-note` |
| `metric-reading` | `headline`, `reading-list`, `takeaway` |
| `chart-read` | `headline`, `chart-frame`, `reading-caption`, `takeaway`, `source-note` |
| `scroll-scene` | `deck-kicker`, `headline`, `scroll-step-stage`, `scroll-step-copy`, `chart-frame` |
| `quote` | `deck-kicker`, `quote-block`, `attribution`, `reading-caption` |
| `quote-pair` | `deck-kicker`, `headline`, `quote-pair`, `quote-card`, `quote-block`, `attribution`, `reading-caption` |
| `image-grid` | `headline`, `evidence-grid`, `evidence-image`, `image-caption`, `reading-caption`, `source-note` |
| `text-image` | `headline`, `primary-image` 或 `visual-artifact`, `reading-caption`, `source-note` |
| `process-flow` | `headline`, `process-steps`, `process-step`, `takeaway` |
| `comparison` | `headline`, `comparison-panel` 或 `action-items`, `chart-frame`, `reading-caption`, `difference-callout`, `source-note` |
| `timeline` | `headline`, `timeline-nodes`, `timeline-node`, `takeaway`, `source-note` |
| `action` | `headline`, `action-items`, `action-item`, `closing-cue` |
| `methodology` | `deck-kicker`, `headline`, `reading-list` |
| `transition` | `deck-kicker`, `transition-title`, `cue` |
| `closing` | `deck-kicker`, `headline`, `cue`, `lead-meta` |

## Markup 输出规则

- 所有 slot 注释和占位符都已替换。
- 没有临时 wrapper、临时 class 或单页样式补丁。
- 没有未登记 primitive、旧属性 `data-slide-role` / `data-composition` 或 page-level treatment。
