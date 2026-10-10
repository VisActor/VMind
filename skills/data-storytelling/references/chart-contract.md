# Charts 合同

`Charts` 是章节里的可选证据视觉字段，不是页面素材系统。它必须服务本章 `Claim`，并绑定 `Evidence.refs` 中已声明的数据引用。

## 1. 定位与数据前提

当前可用 renderer：

- `standard-chart`: 普通统计图表。当前 data-storytelling 的 `Charts` 只支持这一种 renderer，适合数据 insight 优先的场景，支持完整标注、高亮、标签、基础样式和 scrollytelling。

所有 chart entry 都必须满足：

- 显式填写非空、全 Plan 唯一的 chart id（如下方 `chart-main`）；不要省略 id 或依赖自动编号。Build 使用同一个 id 关联配置和页面图表。
- 必须写 `dataRef`
- 必须写 `renderer: standard-chart`
- 必须写 `chartType / dimensions / measures`
- `chartType` 使用下方统一图表类型表
- `dataRef` 必须遵守下方 dataRef grain 规则；renderer 不负责数据变换


## 2. 通用字段

每个 chart entry 都必须包含：

```markdown
- **Charts**:
  - `chart-main`
    - role: primary
    - purpose: 展示本章判断所需的证据任务
    - dataRef: `df_main`
    - renderer: standard-chart
    - chartType: line
    - dimensions:
      - id: month
        encoding: xAxis
    - measures:
      - id: revenue
        encoding: yAxis
        alias: 收入
```

字段说明：

- `role`: `primary` 或 `supporting`。每章最多一个 `primary`。
- `purpose`: 说明这张图承担的证据任务，不要只写图表类型。
- `dataRef`: 指向已准备好的 chart-ready DataFrame 变量；详见下方 grain 规则。
- `renderer`: 固定为 `standard-chart`。
- `chartType`: 统一图表类型，见下方选择表。
- `dimensions / measures`: 描述字段和编码关系。
- `alias`: 可选；当原始字段名不适合直接展示时使用。

`dimensions[*].alias` 与 `measures[*].alias` 属于 local-owned display metadata：

- 用于控制读者最终看到的字段显示名。
- 当字段 id 带明显语义、直接暴露给中文读者会显得像机器名时，推荐补 `alias`。
- 像 `p75`、`GMV` 这类简洁且业内通用的指标名，不要求为了“中文化”强行补 alias。

`measures[*].numformat` 可选，用字符串描述格式化要求，包括百分比、小数位、前后缀等。如果只是增加百分号，明确写“添加百分号后缀”，不要写“转成百分比”，否则可能导致数值变形。

`numformat` 的单位 / 后缀也是可读性合同。不要只是把源数据单位逐字翻译到 suffix；应根据 `Story Meta.Language`、数值量级和读者习惯选择自然单位，并同步换算数值、轴标签和数据标签。中文可使用“万 / 亿 / 万亿”等自然量级，英文可使用 `K / M / B / T` 或 `million / billion / trillion` 等自然表达；目标是让读者直接读懂数量级，而不是看到冗长或别扭的原始单位组合。

### dataRef grain 规则

`dataRef` 不是原始宽表引用，而是这张图的输入表。它必须满足：

- one row per mark grain：每一行对应最终图表中的一个 mark、一个 series point、一个扇区、一个散点或一个矩阵单元。
- 字段粒度与 `dimensions / measures` 匹配；如果原始数据还包含未用于当前图的额外维度，先按图表 grain 聚合成新的 DataFrame。
- Validator 会按 `dimensions[*].id` 组合检查每个 `measures[*].id` 是否出现重复 mark grain；重复通常说明 dataRef 仍带有未声明维度，需要重新生成已聚合数据。
- dataRef 可以包含图表未使用的额外 measure 字段；只要声明的 dimension grain 对每个声明 measure 唯一，就不会因为额外 measure 报错。
- 排序、过滤、topN、时间窗口、分组口径、百分比或累计值都必须在数据准备阶段完成。
- 默认一图一 dataRef。只有多张图使用完全相同的 mark grain、字段集合、过滤条件和排序时，才复用同一个 `dataRef`。

错误例子：`dataRefA` 同时包含 `month / region / channel / revenue`，但图表只声明 `month + revenue`。renderer 不会自动按 month 聚合 revenue；应先准备 `df_revenue_by_month`，其中每个月只有一行。

## 3. chartType 与编码

`dimensions[*].encoding` 允许： `xAxis`, `yAxis`, `angle`, `color`, `detail`, `row`, `column`

`measures[*].encoding` 允许：`xAxis`, `yAxis`, `primaryYAxis`, `secondaryYAxis`, `angle`, `radius`, `size`, `color`, `detail`

### `detail` 默认不用，趋势系列使用 `color`

`detail` 不是通用计算通道。排序、分组、窗口计算、同比、指数等派生逻辑必须在数据准备阶段完成，写入明确的数据字段后再映射。

对 `line` / `area`：

- 一个分类字段如果决定“每个值各是一条趋势线”，必须映射为 `color`。`color` 同时定义系列身份、颜色和图例。
- `detail` 不会替代 `color` 产生分类 series。默认不要写它。
- 只有已经存在明确 `color` series 时，才可把另一个确有辅助展示含义的字段写成 `detail`；仅需 hover/readout 的辅助字段优先使用 `tooltip`。

例如，长表中的 `year / metric / value` 应写为 `year -> xAxis`、`metric -> color`、`value -> yAxis`。不要把 `metric` 写为 `detail`。


### chartType 选择参考

先判断读者要完成的证据任务，再选 `chartType`。不要把所有时间字段都默认做成 `line`，也不要把所有分类字段都默认做成 `column`。

| chartType | 适用 insight / 证据任务 | 换用或避用 | 高亮 | 标注 |
|---|---|---|---|---|
| `line` | 趋势变化、拐点、连续时间变化 | 需要强调趋势下体量感时用 `area`；同一时间轴对比两个不同量纲时用 `dualAxis`；不用于静态排名或普通分类比较 | 支持，按系列高亮 | 支持 point / line / area / difference |
| `area` | 单序列的规模趋势、可加总组成项随时间变化的体量与构成 | 只看方向和拐点，或多序列口径重叠、不可加总时，用 `line`；堆叠条件见下方 | 支持，按系列高亮 | 支持 point / line / area / difference |
| `column` | 纵向类别比较、离散时间段比较、已分箱的分布、增减量和贡献拆解 | 类别名称长、排序阅读更重要或 TopN 排名时用 `bar`；直方图式分布必须先在 dataRef 中完成分箱与计数 | 支持 | 支持 point / line / area / difference |
| `columnParallel` | 同一类别下多系列并列比较、组间对照 | 如果对照对象名称长或排序更重要，用 `barParallel` | 支持 | 支持 point / line / area / difference |
| `columnPercent` | 100% 纵向构成对比，尤其是多时间点或多对象构成 | 只有一个整体、类别 ≤5 且只需粗略看份额时，可用 `donut` / `pie` | 支持 | 支持 line / area |
| `bar` | 横向排名、TopN、长标签类别比较、已排序类别对比 | 数据准备阶段完成降序、TopN 和合并“其他”；不要让 renderer 自动排序 | 支持 | 支持 point / line / area / difference |
| `barParallel` | 分组横向对比、排名对照、两个对象或两种口径并列比较 | 如果类别短且不是排名阅读，用 `columnParallel` | 支持 | 支持 point / line / area / difference |
| `barPercent` | 100% 横向构成对比，尤其是长标签对象的构成对比 | 纵向展示更利于扫读时用 `columnPercent` | 支持 | 支持 line / area |
| `pie` | 少量类别的单一整体构成 | 仅用于类别 ≤9 的粗略份额阅读；多时间点/多对象构成优先 `columnPercent` / `barPercent` | 支持，按扇区高亮 | 不支持 |
| `donut` | 少量类别构成，中心可承载总量概念 | 与 `pie` 同边界；不要用于精确比较多个接近份额 | 支持，按扇区高亮 | 不支持 |
| `scatter` | 两变量关系、异常点、聚类、双阈值下的决策分区 | 第三变量可用 `size`，类别可用 `color`；有明确阈值时可用区域标注表达目标区、风险区或四象限；如果只是单指标类别比较，用 `bar` / `column` | 支持 | 支持 point / line / area |
| `radar` | 少量对象的多维能力轮廓或多指标画像 | 维度 5-8 个最佳；指标超过 8 个或需要精确比较时，改用 `barParallel` 或多图顺序解读 | 支持 | 不支持 |
| `heatmap` | 时间 × 类别热度、风险矩阵、二维矩阵强弱或密度分布 | 只有单时间序列强弱时用 `line` / `area`；只有类别强弱时用 `bar` | 不支持 | 不支持 |
| `funnel` | 转化步骤、漏斗流失、多阶段递减 | 如果是路径/资金流向/多源多目标流，不要硬写 funnel；复杂流向拆成分阶段 `funnel`、`bar` 或后续章节解释 | 不支持 | 不支持 |
| `dualAxis` | 同一 x 轴下两个不同量纲指标，例如绝对值与变化率、规模与转化率 | 只有同量纲多系列时用 `line` / `area` | 支持 | 支持 point / line / area |

### 面积图与堆叠的可加总性

当前 `area` 的多系列表达默认堆叠；不能仅因多个指标共享时间轴、单位相同，就将它们堆在一起。

- 堆叠的组成项必须在同一时间 / 类别粒度下、量纲一致、口径互不重叠且可相加；叠加后的总量必须有明确业务含义。例如互斥区域的销售额可以构成总销售额。
- 总量与其子集、毛额与净额、累计值与当期值不能直接堆叠，否则会重复计算。比率、均值等不可直接相加的指标也不能仅因单位一致而堆叠。
- 若目的是比较各指标自身的趋势，选 `line`；若比较同一类别下的不同口径，选 `columnParallel / barParallel`。单序列 `area` 仍可用于强调规模感。
- 此判断在 Plan 选图时完成；Build 发现已确认 Plan 的堆叠语义不成立时，应指出重复计量并请求调整，不得擅自换图或改数据。上述可加总条件同样适用于堆叠柱 / 条及百分比构成图。

### 最小合法编码组合

| chartType | dimensions 最低要求 | measures 最低要求 |
|---|---|---|
| `line`, `area`, `column`, `columnParallel`, `columnPercent` | =1 `xAxis` | >=1 `yAxis` |
| `bar`, `barParallel`, `barPercent` | =1 `yAxis` | >=1 `xAxis` |
| `pie`, `donut` | =1 `color` | >=1 `angle` |
| `scatter` | `color` 可选 | 必须有 `xAxis` + `yAxis`，`size` 可选 |
| `radar` | =1 `angle` | >=1 `radius` |
| `heatmap` | 必须有 `xAxis` + `yAxis` | 必须有 `color` |
| `funnel` | 单 measure 漏斗：=1 `color`；多 measure 漏斗：0 | 单 measure 漏斗：=1 `size`；多 measure 漏斗：>=2 `size` |
| `dualAxis` | =1 `xAxis` | 必须有 `primaryYAxis` + `secondaryYAxis` |

`dualAxis` 必须显式定义 `axisTitles.primaryYAxis` 与 `axisTitles.secondaryYAxis`，这样才能区分左右轴具体代表内容

## 4. Standard Chart 叙事能力

`renderer: standard-chart` 支持普通统计图表的完整读图能力。

可选字段：

- `highlightDesc`: 改变视觉权重，让读者优先看某个系列、类别或对象。
- `annotationList`: 添加具体读数锚点、阈值、区间或差值。
- `visualInfo`: 描述坐标轴、标签、图例等基础图表样式需求；不要写页面布局或叙事主张。

### 叙事强调层

`highlightDesc` 和 `annotationList` 都属于图表的可选叙事强调层。它们不是默认槽位，也不是装饰层。只有当图表里确实存在需要额外强调的 insight、转折或关键信息时才补；没有明确叙事增益时，两者都不要写。

选择规则只看一件事：你是要改变视觉权重，还是要补一个明确锚点。

- 如果只是想让读者先看某个系列、类别或对象，并通过弱化其他元素来建立主次，用 `highlightDesc`。
- 如果需要明确指出某个点、线、区间或差值，并附一个短标签，用 `annotationList`。
- 如果既不需要建立主次，也不需要补新的读图锚点，就不要补任何一个。
- `highlightDesc` 和 `annotationList` 可以服务同一个章节主旨，甚至落在同一个焦点对象上；这不被禁止。
- 但两者职责必须不同：`highlightDesc` 负责建立主次，`annotationList` 负责补一个明确锚点、阈值、区间或差值。
- 坏写法不是“主旨相同”，而是两层都在做同一件视觉工作；例如既高亮“最大值”，又只用 point annotation 重复写“最大值”。

### highlightDesc

`highlightDesc` 只描述哪些数据元素需要被强调或弱化。使用它当读者应先看一个系列、类别或对象，并通过弱化其他元素建立主次。

```markdown
- highlightDesc: 高亮 `category=服装`，其他类别透明度 0.2
```

规则：

- 弱化只允许使用透明度描述。例如：高亮 `category=服装` 的条形，其余类别降低透明度为 0.2。
- 对 `line` / `area` / `dualAxis`，高亮只支持系列粒度：可以高亮一条或多条完整线 / 面积，不支持只高亮其中某一段。
- 如果想强调某段时间区间、背景范围或局部区域，用 `annotationList` 的区域标注实现，不要写成“线段高亮”。
- 不要把标注线、标注点本身再写成高亮对象；标注层本来就是强调层。
- `highlightDesc` 的强调对象必须与本章 `Claim`、`SectionVisual.focus` 和图表主任务保持一致；如果章节主线是多对象比较，不要无解释地只高亮其中一个对象。

### annotationList

`annotationList` 只描述额外叠加的标注层。使用它当图表需要具体读数锚点。

支持：

- `point`: 标注点，`target` 直接用图表维度 id 定位一个已渲染 mark，并带 `measureId`
- `line`: 标注线，`target` 通常使用 `x` / `y`
- `area`: 标注区域，`target` 使用 `xStart` / `xEnd` 或 `yStart` / `yEnd`，二维矩形同时指定两组边界；写明范围与短标签
- `difference`: 差异标注，只允许 `start`、`end`、`differenceType`

具体 chartType 支持范围以上方 chartType 表为准。

`area` 的能力还取决于轴类型：类别 / 月份窗口表示类别轴上的全跨度带；线性数值轴可表达单向数值带，散点的两条线性数值轴可表达矩形。边界使用实际数值轴坐标，不是格式化后的显示文本：普通图的比率若以 0–1 存储，20%–40% 写为 0.2–0.4；100% 构成图则使用归一化的 0–1 轴坐标，不用输入计数作边界。需要延伸至可见轴边缘时，可明确使用 `axisMin / axisMax`。数值范围不支持 `dualAxis`、透视 / 组合图或分类 / 时间 / 对数轴；分类窗口仍可用真实类别表达。具体 DSL 转换见 [vseed-generation.md](vseed-generation.md) 的区域标注部分。

散点区域标注尤其适合把两变量关系转成决策语言：单个目标矩形说明“什么范围算达标”，边缘区域说明“哪些对象进入风险区”，两条有意义的阈值可划成四象限（例如成本 × 转化、风险 × 影响、增长 × 利润）。先判断分区是否帮助读者决策，不要求每张 scatter 都画区域或四象限。

- 阈值来自用户政策、明确业务基线，或已计算并披露的统计量；不要为了填满四格选择任意中点，也不要把样本均值 / 中位数伪装成业务标准。
- 四象限在 Plan 中写成四条 `type: area`，各自明确 x/y 边界、短标签和决策含义；可用 `axisMin / axisMax` 延伸至轴边缘。边界处的节点归类规则（如 `>=` 为高）在文字中说明，区域本身不是数据过滤器。
- 分区可以没有点；不要为填满象限造数据、改变既有字段映射，或把区域分类说成因果证据。只强调一个风险角时，一条区域标注通常足够。
- 同一图的分区使用一致阈值和可见轴范围；标签不要遮挡点，颜色与透明度服务分区含义，不替代数据系列身份。

```markdown
- annotationList:
  - type: point
    target:
      month: `latest_month`
      measureId: revenue
    text: 最新点
  - type: difference
    differenceType: absolute
    start:
      month: `start_month`
    end:
      month: `latest_month`
```

不要把“高亮谁”写进 `annotationList`。标注点不要拿来充当默认数值标签。

`type: point` 额外遵守：

- `text` 必须是短标签式短语，不是完整解释句。
- point 文案不要写成长句正文；解释放进 `Claim`、章节文案或 step narrative。
- 推荐短语：`最高值`、`最低值`、`最新点`、`异常值`、`转折点`、`风险热点`。
- point 标注必须唯一对应一个已渲染 mark。
- `measureId` 永远必填；即使是单度量图也不能省略。
- 多维度图如果使用 point 标注，`target` 必须写全该 mark 对应的所有维度 id，不能只写一部分 grain。

`type: difference` 额外遵守：

- 只允许包含 `start`、`end`、`differenceType` 三个字段。
- `start` 与 `end` 直接用图表维度 id 定位两个 mark；只写维度，不写 `measureId`。

### 默认标签与 visualInfo

默认数值标签由 renderer / build 默认逻辑处理。标签是读图层，不是叙事层；不要用 `annotationList` 替代常规标签。如果需要突出某个点、线或区间，再用 annotation 做叙事强调。

- 一张图里的 `annotationList` 不要超过 2 个。如果 >=3 个，说明当前 insight 想表达的内容过多，应考虑转成 scrollytelling，或只留下最重要的标注。

`visualInfo` 只描述基础图表样式需求，例如坐标轴、标签、图例。不要在 `visualInfo` 里写叙事主张、页面布局或素材需求。

## 5. Scrollytelling 图表节奏

`scrollytelling` 只支持 `renderer: standard-chart`，且必须只有一个 `primary` chart。主图 chartType 白名单：`line / area / column / columnPercent / bar / barPercent / columnParallel / barParallel / dualAxis`。不要把 `heatmap`、`pie`、`donut`、`radar`、`rose`、`funnel` 等单次静态或密集矩阵图放进 scrollytelling；这些应改为 `chart-narrative`，或重新准备可按 step 推进的趋势 / 排名 / 百分比柱图数据。

`Steps` 描述认知推进；`Charts` 描述承载这些 step 的主图。每个 step 都应该带来可感知的图表状态变化。

```markdown
- **Steps**:
  - Step 2:
    - narrative: 解释高价值用户在当前步暴露出的留存异常
    - dataRef: `df_step_2`
    - highlightDesc: 高亮 `segment=高价值用户`，其他 segment 透明度 0.2
    - annotationList:
      - type: point
        target:
          segment: `high_value`
          measureId: retention
        text: 异常值
- **Charts**:
  - `chart-main`
    - role: primary
    - purpose: 承载随步骤推进而变化的主图
    - dataRef: `df_step_1`
    - renderer: standard-chart
    - chartType: column
    - dimensions: ...
    - measures: ...
```

规则：

- `Charts` 承载基础 chart skeleton；`Steps` 只补当前步新增的图表状态。
- 如果 step 会新增时间段、系列、对象、过滤条件、排序或重排，为该 step 准备自己的 `dataRef`。
- 如果各步共享同一份输入数据，只是 highlight / annotation / narrative 不同，继续使用 chart-level `dataRef`。
- Step-level `highlightDesc / annotationList` 只描述当前步新增的视觉推进。
- 如果相邻 steps 没有可感知的图表状态变化，合并它们。
- Scrollytelling 的章节模式和 step 写法还需遵循 [pattern-scrollytelling-plan.md](pattern-scrollytelling-plan.md)。


## 6. 多图规则

- 默认每章一张图。
- 只有 `chart-narrative` 与 `comparison` 允许多图。
- `scrollytelling` 必须恰好一张 `primary` chart；如果需要第二张图解释 frame shift，拆成后续 `chart-narrative` 或 `comparison` 章节。
- 每章最多 3 张图。
- 每章只能有 1 个 `primary`。
- supporting 图只能支撑同一个章节 `Claim`，不能引入第二个问题。
- 每张图必须显式绑定一个 chart-ready `dataRef`；Build 不负责猜测图表对应哪个 dataset，也不负责重聚合。

## 7. 常见失败

| 失败 | 症状 | 修复 |
|---|---|---|
| 需要排序、过滤或 step 状态变化但 `dataRef` 未准备 | renderer 输出顺序或状态不符合叙事 | 在数据准备阶段生成对应 `dataRef` |
| `dataRef` 粒度比图表更细 | 图表按明细行重复渲染，数值没有按声明的维度聚合 | 先按 chart grain 聚合，生成一图一 dataRef |
| annotation 太多或与 highlight 重复 | 图表变成标注海报，或者两层都在强调同一件事 | 用 scrollytelling，或只保留最强锚点并让 highlight / annotation 分工明确 |
