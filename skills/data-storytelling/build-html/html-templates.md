# HTML 共享组件

章节级模板已迁入 `patterns/` 目录，按 Pattern 查阅：

| Pattern | 文件 |
|---------|------|
| hero-impact | [patterns/hero-impact.md](patterns/hero-impact.md) |
| cover-intro | [patterns/cover-intro.md](patterns/cover-intro.md) |
| scrollytelling | [patterns/scrollytelling.md](patterns/scrollytelling.md) |
| chart-narrative | [patterns/chart-narrative.md](patterns/chart-narrative.md) |
| baseline-kpis | [patterns/baseline-kpis.md](patterns/baseline-kpis.md) |
| comparison | [patterns/comparison.md](patterns/comparison.md) |
| timeline | [patterns/timeline.md](patterns/timeline.md) |
| action | [patterns/action.md](patterns/action.md) |

本文件只定义 **共享组件 HTML 片段**、**组件级 runtime hook** 和 **组件 fallback 规则**。最终页面外壳、CDN 顺序、runtime JS 内联与初始化逻辑统一由 [compose_story.py](../scripts/compose_story.py) 承担。

---

## A. 共享组件 Markup 原则

共享组件是在既定 pattern 内复用的表达单元，不负责决定章节骨架，也不在本文件里决定选择时机。

在 Build 阶段，pattern 已经由 `plan.md` 确定。Build 的任务是在该 pattern 提供的骨架和内容槽位内，复用这里的 canonical markup。

组件选择规则统一在 `visual-primitives.md`。本文件只定义 canonical markup、允许的 modifier、必须保留的 runtime hook 和必要 fallback。

- 不要在 pattern 文档外再写第三套 shared markup。
- 不要根据 CSS 文件反推组件结构；组件结构只看本文件。
- 不要把本文件中的示例文案当成最终文案；示例只说明 DOM 结构。
- 模板中的 `asset_id`、`data_uri`、`chartId` 等是构建期契约名称，最终 HTML 必须替换为真实值或按 fallback 规则移除。

## B. 共享组件 HTML 片段

以下组件在多个 Pattern 中复用。直接复制使用，所有类名来自本文件的 canonical markup 与 `visual-primitives.md` 的组件清单，不要自创。

Pattern 文档里如果写到 `section-heading`、`section-intro`、`chart-wrapper`、`kpi-row`、`data-artifact`、`highlight-box`、`big-stat`、`quote-block`、`footer` 等 shared block，默认都引用这里的 canonical 片段。

### 章节标题

Canonical `plain` heading：标题组件不承载过渡、正文解释或图表证据。

```html
<div class="section-heading animate-on-scroll">
  <span class="label">内容型标签</span>
  <h2 data-text-layout="headline">结论驱动的章节标题</h2>
</div>
```

### 章节标题 / Bar

```html
<div class="section-heading with-bar animate-on-scroll">
  <span class="label">内容型标签</span>
  <h2 data-text-layout="headline">结论驱动的章节标题</h2>
</div>
```

规则：

- 只允许 `plain`（无 modifier）和 `bar`（`.with-bar`）两种 canonical markup。
- `.label` 必须是内容型标签，例如 `Revenue structure`、`Supply gap`、`Method note`；不要使用 `Chapter 1`、`Section 2` 或机械编号。
- 好的 `.label` 命名阅读视角，例如 `排放重心`、`历史账本`、`增量压力`、`区域分化`、`口径说明`。
- `hero-impact` 和 `cover-intro` 使用各自 pattern 的 title anatomy，不使用这些 shared heading variants。

### 章节引言

```html
<p class="section-intro" data-text-layout="body">1-2 句背景说明，引出图表。</p>
```

### Inline Cite

```html
<p data-text-layout="body">
  到 2024 年，排放并没有回到旧基线
  <span class="inline-cite" tabindex="0">
    <span class="inline-cite-index">1</span>
    <span class="inline-cite-panel">
      <strong>Source 1</strong>
      IEA annual CO2 update，用于支持“高于旧基线”的判断。
    </span>
  </span>
  ，而是在更高平台上停住。
</p>
```

规则：

- panel 只放短来源标签和 1-2 句支持说明，不要塞长引文或扩展分析
- `.inline-cite` 负责上标位置；数字必须放在 `.inline-cite-index` 内，保证圆内居中
- 永久来源归档仍应放在 footnote 或 source 区域
- `tabindex="0"` 必须保留，保证键盘可访问

### Context Note

```html
<div class="context-note">
  <span class="tag">Context</span>
  <p>把这里理解成“水平抬升”，而不是一次短暂冲高。</p>
</div>
```

### Context Note Bracket

```html
<div class="context-note bracket">
  <span class="tag">Context</span>
  <p>真正值得停下来读的不是峰值本身，而是之后维持在更高平台上的停留。</p>
</div>
```

规则：

- `.context-note` 必须包含 `.tag` 和一个短段落
- `.bracket` 是唯一已定义的 stronger note modifier

### Delta Chip

```html
<p>
  <span class="delta-chip positive">
    <span class="icon">▲</span>
    <strong>+12%</strong> YoY
  </span>
  <span class="delta-chip neutral">
    <span class="icon">●</span>
    <strong>Plateau</strong> after rebound
  </span>
  <span class="delta-chip negative">
    <span class="icon">▼</span>
    <strong>-8pp</strong> vs baseline
  </span>
</p>
```

规则：

- 它不是当前 `.badge` 的换色版；`.badge` 仍主要服务 `action-card` 的优先级语义
- 只使用 `.positive`、`.neutral`、`.negative` 三种 polarity modifier
- `.icon` 与 `strong` 必须保留；没有 polarity 时不要输出 `delta-chip`

### 图表容器

```html
<div class="chart-wrapper animate-on-scroll" data-chart-id="{chartId}">
  <h3 class="chart-title">图表揭示了什么（写结论）</h3>
  <div class="chart-container" id="chart-{chartId}"></div>
  <p class="source-line">数据来源: ...</p>
</div>
```

规则：

- 标准图表区只在一个 `.chart-wrapper` 上挂 `data-chart-id`
- 图表容器 id 固定为 `chart-{chartId}`
- `chart-title`、`source-line` 按需保留，但不要改写 `chart-wrapper > chart-container` 这条基本结构
- `scrollytelling` 继续复用同一套 `chart-wrapper` contract；仅允许在共享 `.chart-container` 上追加 `.scrolly` modifier，同时保留 `id="chart-{chartId}"`

### Image Evidence

```html
<figure class="image-evidence animate-on-scroll" data-asset-id="asset_id">
  <img src="{resolved_data_uri}" alt="描述图片中可见证据，不写装饰性空话" loading="lazy">
  <figcaption>一句话说明这张图片如何支持本章判断。</figcaption>
</figure>
```

规则：

- 只用于 `placement: evidence_image` 的已解析图片资产。
- 根节点必须带 `data-asset-id`。
- `img` 必须使用已解析的 `data_uri`，保留 `loading="lazy"`，并填写具体 alt。
- `figcaption` 必须解释图片的证据读法；不能只是“图片来源”或“现场图”。
- 不要追加 inline style、局部 `<style>`、gallery、卡片包裹或 `data-chart-id`。

### KPI 卡片组

```html
<div class="kpi-row animate-on-scroll">
  <div class="kpi-card">
    <div class="kpi-value metric-shell">
      <span class="metric-value-slot">
        <span class="metric-value" data-target="42">0</span>
      </span>
      <span class="metric-suffix">%</span>
    </div>
    <div class="kpi-label">指标名</div>
  </div>
  <!-- 重复 2-4 个 kpi-card -->
</div>
```

Variant: `.cols-2`, `.cols-4`（控制列数），`.with-stripe`（带色条），`.with-icon`（图标与文案并排）

<!-- preview:exclude-shared-components -->
### 共享指标数值契约

`metric-shell` 是指标数值节点必须保留的内部结构标记，不是新的外层组件，也不是一个可自由嵌套的 wrapper。外层继续使用当前组件语义（如 `.hero-number`、`.kpi-value`、`.stat-value`、`.big-stat-value`），并固定带上 `.metric-shell`。Build 只输出 canonical DOM；格式化、数字动画、digit 拆分和宽度预留由运行时与 CSS 自动处理。

标准结构如下。外层示例使用 `.stat-value.metric-shell`；在具体组件里，外层类名应替换为对应的数值节点类名，例如 `.hero-number.metric-shell`、`.kpi-value.metric-shell`、`.big-stat-value.metric-shell` 或 `.data-artifact-value.metric-shell`。

```html
<div class="stat-value metric-shell">
  <!-- optional: <span class="metric-prefix">+</span> -->
  <span class="metric-value-slot">
    <span class="metric-value" data-target="82">0</span>
  </span>
  <!-- optional: <span class="metric-suffix">%</span> -->
</div>
```

规则：

- 复制这个 anatomy：可选 `.metric-prefix`、必选 `.metric-value-slot > .metric-value[data-target]`、可选 `.metric-suffix`。不要在这三层之间插入额外 wrapper。
- `data-target` 只放可解析的 numeric core，例如 `82`、`12.05`、`-8`。不要包含 `%`、货币符号、单位、千分位逗号或解释性文本。
- 货币符号、正号、百分号、pp、单位等静态 affix 放 `.metric-prefix` 或 `.metric-suffix`。例如 `+12.05pp` 应写成 `.metric-prefix` 为 `+`、`data-target="12.05"`、`.metric-suffix` 为 `pp`。
- 外层类名必须是对应组件的数值节点类名 + `.metric-shell`；例如 comparison card 用 `.stat-value.metric-shell`，不要借用 `.kpi-value`。

### Data Artifact

```html
<aside class="data-artifact animate-on-scroll" data-artifact-mode="hero">
  <div class="data-artifact-meta">
    <span>2023 entry</span>
    <span>latest complete period</span>
  </div>
  <div class="data-artifact-value metric-shell">
    <span class="metric-value-slot">
      <span class="metric-value" data-target="38094">0</span>
    </span>
    <span class="metric-suffix">MtCO2</span>
  </div>
  <p class="data-artifact-unit">million tonnes · annual emissions</p>
  <div class="data-artifact-trace" aria-hidden="true">
    <!-- inline SVG trace 或归一化后的 generated asset -->
  </div>
  <p class="data-artifact-caption">一句话说明这个数字应该如何被读，而不是重复数值本身。</p>
</aside>
```

规则：

- `data-artifact-trace` 只能表达趋势记忆或主题隐喻，不能取代图表
- meta、unit、caption、trace 都是按内容需要使用的辅助层；不要输出空容器
- 如果 trace / asset 不可用，保留核心 value 和仍然有意义的辅助层，移除 trace 容器，并在根节点增加 `.data-artifact-no-trace`
- `.data-artifact-no-trace` 是布局降级标记，不是新的 mode；它必须继续保留 `data-artifact-mode="hero"`
- `data-artifact-mode="hero"` 是当前唯一已定义 mode

### 带图标的 KPI 卡片

```html
<div class="kpi-card with-icon">
  <div class="kpi-icon">{svg markup}</div>
  <div class="kpi-value metric-shell">
    <span class="metric-value-slot">
      <span class="metric-value" data-target="42">0</span>
    </span>
    <span class="metric-suffix">%</span>
  </div>
  <div class="kpi-label">核心指标</div>
</div>
```

### 高亮框

```html
<div class="highlight-box animate-on-scroll">
  <span class="highlight-label">读法</span>
  <p class="highlight-title" data-text-layout="headline">先判断图表回答的问题，再判断排名意味着什么。</p>
  <p class="highlight-note" data-text-layout="body">色块内收，少一点警示框感，多一点 editorial annotation 的感觉。</p>
</div>
```

Variant: `.bordered`（更安静的完整边框背景）

#### Text Accent

`text-accent` variant（无重点色边，用 label 文本承担重点色）：

```html
<div class="highlight-box text-accent animate-on-scroll">
  <span class="highlight-label">解读</span>
  <p class="highlight-title" data-text-layout="headline">这张图的作用不是给出答案，而是说明答案取决于核算边界。</p>
  <p class="highlight-note" data-text-layout="body">这一行承接标题，补充读者应该如何理解这个判断。</p>
</div>
```

#### Corner Asset

`text-accent` with corner asset：

```html
<div class="highlight-box text-accent with-corner-asset animate-on-scroll" data-asset-id="asset_id">
  <span class="highlight-label">解读</span>
  <p class="highlight-title" data-text-layout="headline">这张图的作用不是给出答案，而是说明答案取决于核算边界。</p>
  <p class="highlight-note" data-text-layout="body">角落素材只能做主题记忆或背景纹理，不表达精确数值。</p>
  <div class="highlight-corner-asset" aria-hidden="true">
    <!-- 归一化后的 inline SVG asset -->
  </div>
</div>
```

规则：

- 默认 `highlight-box` 是内收的 editorial annotation，不再使用外贴重点色边
- `.text-accent` 的重点色只出现在 label 文本上
- `.highlight-label` 必须跟随正文语言，不要照抄英文示例词
- `highlight-corner-asset` 必须来自已解析 asset；不可用时移除该节点
- `.bordered`、`.text-accent`、`.with-corner-asset` 是当前允许的 modifier

### 大数字

```html
<div class="big-stat animate-on-scroll">
  <div class="big-stat-value metric-shell">
    <span class="metric-value-slot">
      <span class="metric-value" data-target="1200000">0</span>
    </span>
  </div>
  <div class="big-stat-label">总用户数</div>
  <div class="trend up">↑ 34% YoY</div>
</div>
```

### 引用

```html
<blockquote class="quote-block animate-on-scroll">
  <p data-text-layout="body">引用内容</p>
  <cite>— 引用来源</cite>
</blockquote>
```

规则：

- `cite` 可选；没有来源时直接省略，不要保留空标签

### Footer

```html
<footer>
  <div class="story-container">
    <p>数据来源: ... | 时间范围: ... | 局限性: ...</p>
  </div>
</footer>
```
