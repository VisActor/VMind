# Visual Primitives

本文件是 Build 阶段选择共享视觉组件的目录。

先用本文件判断应该选择哪个共享组件；选定组件后，再到 `html-templates.md` 读取对应模板。不要读取 CSS 源文件来反推组件选择或组件结构。

## Selection Rules

- 选择能完成叙事任务的最轻组件。
- 不要为了制造变化而额外添加组件。
- 同一个局部组合中不要出现多个主视觉对象。
- takeaway transition 是合法 pattern slot 内生成的正文，不是共享组件。
- 块级组件必须匹配目标 pattern 的 Slot Grammar；如果 pattern 没有开放对应 slot，不要把组件塞进 prose、card、event 或其他宿主结构。
- 行内组件只能出现在本文件列出的 prose/copy slot 中；不要把它当成块级组件使用。

## Primitive Catalog

### section-heading

Role: 章节定位

Use when:
- pattern 暴露了 `heading` slot
- 章节需要可见标题

Do not use when:
- pattern 自带 title anatomy（`hero-impact`、`cover-intro`）
- 想要的是独立 transition page 或 act break

Allowed slots:
- baseline-kpis/heading
- chart-narrative/heading
- comparison/heading
- scrollytelling/heading
- timeline/heading
- action/heading

Treatment selection:
- 普通章节定位默认使用 `plain`。
- 只有章节是明确结构转折，或承担当前局部最强发现时，才使用 `bar`。
- 不确定时选 `plain`，让 claim、chart 或 takeaway 承担强调。
- Plan 不声明 heading treatment；Build 根据章节重要性和局部层级选择。

Markup:
- `html-templates.md#章节标题`

Conflicts:
- 同一 section 不要使用超过一种 heading treatment
- 不要为了制造变化而使用 `bar`

### chart-wrapper

Role: 精确图表证据

Use when:
- 读者需要从图表中读取数值、排名、趋势或对比
- VSeed 提供证据面

Do not use when:
- 内容只是概念视觉
- 视觉不应该被读作精确数据

Allowed slots:
- chart-narrative/chart-evidence
- scrollytelling/primary-chart
- comparison/chart-evidence
- timeline/chart-evidence

Markup:
- `html-templates.md#图表容器`

### image-evidence

Role: 用户提供的图片证据

Use when:
- plan 已声明 `placement: evidence_image`
- 图片能提供现场、界面、实物、空间或报告页证据
- 图片证据能直接支持章节 `Claim`

Do not use when:
- 图片只是氛围、装饰、品牌或背景素材
- 没有明确证据读法可写进 caption
- 需要 gallery、营销媒体区或交互查看器

Allowed slots:
- chart-narrative/support
- comparison/chart-evidence

Markup:
- `html-templates.md#Image Evidence`

Conflicts:
- 不要放进 `.chart-wrapper`
- 不要挂 `data-chart-id`
- 不要写 inline style 或局部 `<style>`

### kpi-card

Role: 并列指标扫描

Use when:
- 2-4 个指标需要同等扫描权重
- section 需要快速 baseline context

Do not use when:
- 单个数字应该主导故事
- 指标需要 unit、time、reading rule 和 visual trace 作为主对象

Allowed slots:
- baseline-kpis/kpi-row

Markup:
- `html-templates.md#KPI 卡片组`

Conflicts:
- 不要作为 hero 主视觉对象

### data-artifact

Role: 独立的编辑化数字对象

Use when:
- 单个数字承担 hero 入口
- 数字需要比普通 label 更丰富的处理，读起来像一个对象，而不只是放大的文字
- meta label、unit/source context、reading caption 或可选 trace 能提供 non-redundant 读法，帮助读者记住这个数字

Do not use when:
- 数字只是多个并列指标之一
- 数字只需要普通 label
- unit/time 存在但不增加表达价值
- section 已经有另一个主视觉对象
- 标题、supporting copy 和 artifact caption 会重复同一个数字或同一句读法
- 只是因为没有背景图、SVG 或其他素材而想补“物件感”

Allowed slots:
- hero-impact/primary-stat

Markup:
- `html-templates.md#Data Artifact`

Conflicts:
- 不要在同一个 hero 中同时使用 `.hero-number`
- 不要放进 `kpi-row`
- 无 trace / asset 时必须使用无 trace 降级布局；如果剩余辅助层没有独立信息价值，回退为 `.hero-number`

### big-stat

Role: 单个辅助数字

Use when:
- 一个数字需要比正文更高权重
- 数字还不需要升级为 `data-artifact`

Do not use when:
- 多个并列数字需要比较
- 数字需要像图表一样被读取

Allowed slots:
- chart-narrative/support

Markup:
- `html-templates.md#大数字`

Conflicts:
- 不要作为 KPI row 的替代

### highlight-box

Role: 章节级 takeaway 承载面

Use when:
- section 需要清晰的解释或阅读规则
- 内容是来自 claim 的章节级 takeaway

Do not use when:
- 内容只是局部 caveat
- 内容只是 transition sentence
- 内容应该放在正文或 `context-note`

Allowed slots:
- chart-narrative/takeaway
- comparison/takeaway
- timeline/takeaway

Markup:
- `html-templates.md#高亮框`

Conflicts:
- 不要用于低权重 transition prose

### context-note

Role: 局部说明

Use when:
- chart、metric 或 paragraph 需要局部 caveat 或阅读提示
- 内容比 section takeaway 更轻

Do not use when:
- 内容是章节结论
- 内容需要强解释承载面

Allowed slots:
- baseline-kpis/context
- chart-narrative/support
- comparison/comparison-copy

Markup:
- `html-templates.md#Context Note`

Conflicts:
- 不要在同一个 section 中反复升级为 `.bracket`

### delta-chip

Role: 紧凑变化信号

Use when:
- comparison 的 support metric 需要一个小型变化提示

Do not use when:
- 文本只是 taxonomy label
- chip 会变成 tag cloud
- 信号属于 KPI card、action priority、timeline event 或 chart support prose

Allowed slots:
- comparison/support-metric

Markup:
- `html-templates.md#Delta Chip`

Conflicts:
- 不要替换 action-card 优先级语义中的 `badge`

### inline-cite

Role: 行内证据锚点

Use when:
- 句子需要轻量 source 或 provenance anchor

Do not use when:
- 证据需要长解释
- source 应该放在 footer 或 source line

Allowed slots:
- chart-narrative/reading-lead
- chart-narrative/support
- comparison/comparison-copy

Markup:
- `html-templates.md#Inline Cite`

Conflicts:
- 不要替代 quote 或完整 footnote

### quote-block

Role: 独立引用或声音化强调

Use when:
- section 需要一个独立的引用判断或声音

Do not use when:
- 内容只是 source citation
- 内容只是局部 note

Allowed slots:
- chart-narrative/support

Markup:
- `html-templates.md#引用`

Conflicts:
- 不要替代 `inline-cite`
