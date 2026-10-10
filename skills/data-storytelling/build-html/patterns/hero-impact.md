# Pattern: hero-impact

全屏强入口或强回收章节。它只负责在分析开始前建立一个主视觉锚点。

---

## Pattern Job

`hero-impact` 只允许两种锚点：

| Mode | 主锚点 | 适用条件 |
|------|--------|----------|
| `stat` | 一个主数字、主比例、主差值或主变化幅度 | 读者必须先记住一个尺度，再进入分析 |
| `image` | 一张已解析的 `hero_background_image` | 读者必须先感受到场景、情绪或反直觉事实 |

---

## Mode Contract

Section root 必须保留 `.hero` 和 `data-pattern="hero-impact"`。

| Mode | Root class | Required | Optional | Background |
|------|------------|----------|----------|------------|
| `stat` | `.hero-bigstat` + `data-hero-mode="stat"` | `title`, `primary-stat` | `lead-meta`, `supporting-copy` | 默认 `with-gradient`；可用已解析图片时可用 `with-image overlay-dark/light`；图片不可用时回退 gradient |
| `image` | `.hero-image` + `data-hero-mode="image"` | `title`, 已解析 `hero_background_image` | `lead-meta`, `.hero-title-accent` | 只能用 `with-image overlay-dark/light`；图片不可用时不输出 image mode DOM |

`hero-bigstat` / `hero-image` 是可读 class，必须与 `data-hero-mode` 同步。背景素材的生成、归一化和可用性由 Build asset contract 管；本 pattern 只消费已解析结果。

---

## Mode Selection

- Build 根据可用主锚点选择 mode；plan 不需要提供 `data-hero-mode`。
- `stat`: 存在一个主数字、主比例、主差值或主变化幅度，且这个数字应成为首屏记忆点。
- `image`: 存在 resolved `hero_background_image`，且背景氛围本身是首屏记忆点。
- 同时存在数字锚点和 resolved image 时，优先选择更能承载章节入口的单一主锚点；不要同时输出主数字和 image-mode hero。

---

## Slot Grammar

| Slot | Mode | 接受内容 | 约束 |
|------|------|---------|------|
| `lead-meta` | `stat`, `image` | `.hero-meta` | 组织名、日期、系列名、版本等轻量封面信息 |
| `title` | `stat`, `image` | `h1` | 解释主锚点含义；可选一个短 `.hero-title-accent` 片段；不能只写指标名或图片字面内容 |
| `supporting-copy` | `stat` only | subtitle / `.hero-number-context` | 补 context 或阅读引导；不能复述 title |
| `primary-stat` | `stat` only | `.hero-number.metric-shell` 或 `data-artifact` | 二选一；同一 hero 只能有一个主数字锚点 |
| `background` | `stat`, `image` | gradient 或 Build-resolved `hero_background_image` treatment | `image` mode 必须有已解析图片；`stat` mode 可无图片 |
| `transition` | `stat`, `image` | 仅正文 | 低权重承接文案；不是 shared component |

Pattern 文档只定义 named slots 和组合约束。Shared primitive 的选择细节见 `visual-primitives.md`，canonical markup 见 `html-templates.md`。

---

## Layout Skeletons

Skeleton 只说明合法 slot 位置。最终 HTML 必须替换注释，不要输出 slot 注释或占位文案。

### stat

```html
<section class="hero hero-bigstat with-gradient" data-pattern="hero-impact" data-hero-mode="stat">
  <div class="hero-inner">
    <!-- optional slot: lead-meta / .hero-meta -->
    <!-- slot: title / h1 -->
    <!-- optional slot: supporting-copy -->
    <!-- slot: primary-stat / shared metric hosted by .hero-number.metric-shell OR data-artifact -->
  </div>
</section>
```

### image

```html
<section class="hero hero-image with-image overlay-dark" data-pattern="hero-impact" data-hero-mode="image" data-story-background="{asset_id}">
  <div class="hero-inner">
    <!-- optional slot: lead-meta / .hero-meta -->
    <!-- slot: title / h1; optional .hero-title-accent inside h1 -->
  </div>
</section>
```

---

## Primary Stat Choice

`stat` mode 先判断主数字需要什么视觉角色，再选择 `primary-stat`：

| Primitive | 何时使用 |
|-----------|----------|
| `.hero-number` | 数字只需要强排版强调；`title` / `supporting-copy` 已经能说明读法 |
| `data-artifact` | 数字本身需要成为更具表现力的独立视觉物件，并且至少有一个 non-redundant 辅助层能提供标题和 supporting copy 没有表达的读法，例如物件化 meta、来源/口径单位、caption 或轻量 trace |

unit/time 本身不构成使用 `data-artifact` 的理由；它们只有在帮助数字成为独立视觉物件时才加入。`data-artifact` 的辅助层按需选择，不要求这些元素全部出现。

`data-artifact` 不是 `.hero-number` 的升级皮肤。选择前必须做一次去重判断：

- 如果 `title` 已经包含完整主数字，`primary-stat` 优先使用 `.hero-number`，避免同一数字在首屏出现两次。
- 如果 `supporting-copy` 已经解释了数字的读法，`data-artifact-caption` 不能复述同一句判断；要么写新的读法，要么省略 caption。
- 如果没有 trace / asset，仍可使用 `data-artifact`，但必须输出无 trace 降级结构；若剩余 meta、unit、caption 都只是复述标题或导语，回退到 `.hero-number`。

---

## Rules

- 一个 hero 只允许一个主锚点：主数字或强背景图氛围。
- `stat` mode 的 `primary-stat` 使用 `.hero-number.metric-shell` 或 `data-artifact`，不能同时出现。
- 如果输入有两个数值，先提炼为一个主差值、主比例、主变化幅度或净变化；不要在 hero 里并列展示两个主数值。
- `image` mode 只允许 `lead-meta`、`title` 和背景图；不要放 supporting copy、主数字、`data-artifact`、KPI、Charts 或证据段落。
- `.hero-title-accent` 只强调标题中的一个短片段，是可选项，不要为了套样式强行拆标题。
- 使用背景图时只能复用 `with-image + overlay-dark/light` 机制，不要在 hero 内自建素材解析逻辑或额外背景 DOM。
- 不要在 hero 里放双主体数值、起终点数值、排行榜、并列 KPI、scrollytelling、sticky chart 或多段正文。

---

## Required Hooks

以下 hook 属于结构 contract，不要删除或改名：

- Section root: `.hero[data-pattern="hero-impact"][data-hero-mode="stat|image"]`
- Mode class: `.hero-bigstat` for `stat`; `.hero-image` for `image`
- Stat metric host when used: `.hero-number.metric-shell`
- Optional meta: `.hero-meta`
- Optional title accent: `.hero-title-accent` inside hero `h1`
