# 本地生成 VSeed

HTML / Web-PPT Build 在 plan 含 `Charts` 时读取本文件。由当前 Agent 把已确定的图表意图转成 VSeed 配置；支持范围沿用 [chart-contract.md](chart-contract.md)。Plan 仍负责叙事、数据引用、映射、强调对象和 step progression。

使用时同时读取 `chart-contract.md`：它定义图表选择、编码和叙事合同；本文件定义从该合同到配置的写法。当前模板固定使用 VSeed 0.6.5，具体表达还受下方“版本边界”约束。

## 产物与执行

读取 `plan.md` 和 `runtime/dataset_map.json`。需要确认字段类型、系列取值或标注对象时，按需检查对应数据；计算可以用本地脚本完成。原始数据由组装脚本注入，不在模型输出里重复抄写。

生成 `runtime/chart_specs.json`：一个 JSON 对象，key 为 plan 中的 chart id，value 为 **不含 dataset 的 VSeed 配置**。普通图一项；scrollytelling 的每个 step 一项，使用 `chartId__step0`、`chartId__step1` 等从零开始的连续编号。每项包含完整配置，不是增量 patch。

```json
{
  "ch2-chart1": {
    "chartType": "line",
    "dimensions": [
      { "id": "month", "encoding": "xAxis" },
      { "id": "region", "encoding": "color" }
    ],
    "measures": [{ "id": "revenue", "encoding": "yAxis" }],
    "lineStyle": [
      { "selector": { "field": "region", "operator": "not in", "value": ["华东"] }, "lineColorOpacity": 0.2 }
    ],
    "annotationPoint": [
      { "selector": { "month": "2026-06", "region": "华东" }, "measureId": "revenue", "text": "转折点" }
    ]
  }
}
```

示例假设数据中确有对应字段和值。保留 Plan 的 `chartType`、字段 id、encoding 和顺序；显示名由 `alias` 表达。不要加 `spec` / `steps` 包装，也不写 `dataset`、`renderer`、`theme` 或运行时标注 hints。

写好配置后执行：

```bash
python3 "$SKILL_DIR/scripts/assemble_story_specs.py" \
  --plan-file /path/to/runtime/plan.md \
  --dataset-json /path/to/runtime/dataset_map.json \
  --specs-json /path/to/runtime/chart_specs.json \
  --output /path/to/runtime/spec_map.json
```

脚本负责本地组装。它检查配置覆盖、映射和数据粒度，注入对应 dataset、别名、双轴标题、主题与标注 hints，并保留已有密度和透明度处理。最终 `spec_map.json` 由脚本生成；缺少图表配置或结构、映射等硬校验失败时，修正 `chart_specs.json` 后重跑。没有图表的 Plan 可省略 `--specs-json`，输出空 map。

`--requests-output <path>` 可输出 chart id / datasetRef 清单用于排查。

### 处理缺失标注 warning

Plan 标注缺失或数量不足时，脚本在 stderr 输出 `WARNING ANNOTATION_MISSING`，包含 chart id（scrolly 含 `__stepN`）、标注类型及 expected / actual 数量；不阻塞组装或其他图表，也不自动补写标注。**非阻塞是为了保留有效产物，不代表遗漏无需处理或 Plan 已完整实现。**

当前 Agent 结合该 chart / step 的 `annotationList`、实际数据和本文件的标注写法、版本边界判断下一步：

- 当前版本明确支持、目标清楚且在任务允许的修改范围内时，优先在 `chart_specs.json` 补齐对应标注，再重新组装并检查受影响图表；无需改变已确认的 Plan、数据或映射。不要仅因命令输出 `OK` 就跳过可修复的遗漏。
- 版本不支持、目标有歧义、修复超出授权范围或验证未通过时，可保留有效图表，但在执行记录和交付说明中写明 chart / step、未实现的标注意图及具体原因。若需要改变 Plan 或数据，先与用户确认，不为消除 warning 静默改写它们。
- 修复由 Agent 判断和执行，不由脚本自动补写。不为凑齐数量添加空标注、错误目标或未定义字段；验证失败后根据新证据决定是否继续，没有新的修复依据时停止重复尝试并披露剩余问题。

已有标注的非法结构、字段/数据错误及其他硬校验仍然报错。warning 只是 DSL 覆盖检查；即使消失，也不代表标注已实际渲染或落点正确。

## 图表骨架

- 按 Plan 原样生成 `chartType / dimensions / measures`。不要重新选择图表、改变字段、聚合粒度或排序。`line / area` 的分类系列使用 `color`，`detail` 不能替代系列。
- `bar` 的类别在 `yAxis`，数值在 `xAxis`；`column` 相反。堆叠与并列遵循既定 chartType，多指标不自动切换成 Parallel 类型。
- `dualAxis` 的每个 measure 还可用 `chartType` 指定图元，例如 `primaryYAxis + column`、`secondaryYAxis + line`；按 Plan 的表达要求选择。`axisTitles` 由组装脚本注入。
- `column / bar` 的多系列默认堆叠；并列与百分比使用相应 `Parallel / Percent` 类型。百分比图保留输入值，由图表做归一化，不提前重复换算。
- 散点的两项数值分别映射 `xAxis / yAxis`，气泡大小映射 `size`；`color` 只表示真实分类。单指标漏斗使用 `color + size`；宽表多阶段漏斗按 Plan 的 measures 顺序声明多个 `size`，无需编造分类列。
- 本模块消费 chart-ready 数据。TopN、均值或关键节点需要计算时，先计算实际目标，再写静态选择器 / 阈值。排序、过滤、分箱等数据变化仍由数据准备阶段负责。

## 高亮与 selector

高亮沿用图表主题，通过弱化其他对象的透明度建立主次。写全局默认样式加局部覆盖时注意覆盖顺序；简单场景直接为非焦点对象写条件样式即可。

| 图表图元 | 配置项与透明度 |
|---|---|
| 柱 / 条 | `barStyle`：`barColorOpacity`、`barBorderOpacity` |
| 线 | `lineStyle.lineColorOpacity`；必要时 `lineWidth` |
| 面积 | `areaStyle.areaColorOpacity`，并协调边界线和点 |
| 散点 / 线上的点 | `pointStyle.pointColorOpacity` |

`pie / donut / radar` 不使用上述条件 style 字段。饼/环按类别、雷达按系列使用 `color.colorMapping` 显式映射焦点色与弱化色（例如同色相的 rgba 透明色）；不要给它们写 `areaStyle`。配色仍应取自 Story Preset。

条件样式可以是对象数组。选择器常用两种形式：

- 精确数据条件：`{"month":"2026-06","region":"华东"}`；多个字段共同定位对象，值类型与数据一致。
- 集合或数值条件：`{"field":"region","operator":"not in","value":["华东"]}`，或 `{"field":"value","operator":">=","value":80}`。

趋势图只高亮完整系列；局部时间段使用区域标注。宽表多指标系列可用指标 id 字符串，例如 `lineStyle: [{"selector":"profit","lineColorOpacity":0.2}]`。同时包含分类系列和多个指标时，条件数组取交集：`selector: [{"region":"华东"}, "profit"]`。不要编造内部 color id。

静态配置覆盖本模块的需求，不生成 `dynamicFilter`、`valueDynamicFilter` 或 `quickHighlight*` 代码。数据关键点计算留在本地数据分析步骤。

## 标注

从 Plan 的 `annotationList` 翻译；保留它的目标和文本，解析 Key Numbers 引用为实际值。默认外观交给主题和 renderer，不主动复制字体、颜色、背景与偏移设置。

| Plan 意图 | VSeed 配置 |
|---|---|
| `point` | `annotationPoint: [{selector, text, measureId}]` |
| `line`，`target.y` | `annotationHorizontalLine: [{yValue, text}]` |
| `line`，`target.x` | `annotationVerticalLine: [{xValue, text}]` |
| `area` | `annotationArea: [{selector, text}]` 类别带，或 `[{range, text}]` 数值区间 / 矩形；两种模式互斥 |
| `difference` | `annotationDifferenceLine: [{start: {selector}, end: {selector}, differenceType}]` |

注意这些容易混淆的边界：

- **Point**：selector 写全定位 mark 所需的维度，`measureId` 保留 Plan 中的指标 id，包括多指标同时带 `color` 的情况。不要把 `target.measureId` 当 dataset 字段塞进 selector。组合例子：`{"selector":{"month":"2026-06","region":"华东"},"measureId":"profit","text":"拐点"}`。单指标时 VSeed 可省略 measureId，但保留它更容易核对 Plan。目标必须唯一且存在。
- **Line**：水平线固定 y，垂直线固定 x。横向条形图上的数值阈值通常是垂直线。`text` 是短标签；样式只在明确需要时补充。
- **Area**：按下方两种模式翻译 Plan 的 `xStart / xEnd / yStart / yEnd`，不要直接把这些语义字段写进 DSL。`between` 是数据筛选条件，不等于连续坐标范围。
- **Difference**：起终点各用 selector 定位一个逻辑锚点；堆叠图定位 stack group。`differenceType` 取 `absolute` 或 `percent`，VSeed 自动计算标签，不写 `text / label`。百分比差值起点不得为零；含正负混合的堆叠总量不使用此标注。
- 比率之间的百分点差用 `absolute`；`percent` 表示相对增减幅度。自动标签沿用数值格式，“百分点”的业务含义在旁边的叙述中说明，不能靠编造标注字段改写。
- Plan 的 chartType 能力表决定哪些标注可用。生成多条标注时使用对象数组。

Key Numbers 的显式引用应先求值：`month: \`latest_month\`` 替换成实际月份，而 dataset 中字面值为 `latest_month` 的分类名保持原样。标注文案中的数值沿用对应指标单位、小数位和语言；不要把 0.253 直接写进面向读者的百分比标签。

### 区域标注：类别带与数值范围

每条 `annotationArea` 必须选择 `selector` 或 `range`，不能同时写。两类区域可作为独立对象共存于同一个数组；`textPosition: "middle"` 可把短标签放在区域中心。默认样式仍交给主题，不生成 `dx / dy` 等未暴露字段。

- **类别 / 月份带用 selector**。例如 Plan 要给二月到三月加背景色带，图表 x 轴为 `month`，数据实际取值为 `2026-02 / 2026-03`，生成：

```json
{ "annotationArea": [{ "selector": { "field": "month", "operator": "in", "value": ["2026-02", "2026-03"] }, "text": "活动窗口" }] }
```

这会覆盖二月与三月之间的类别位置，并铺满另一轴；不是围绕某条线画框。必须命中真实类别，按当前数据 / 轴顺序展开区间内的类别；不要按字符串字典序推断月份顺序。多个不连续窗口分开写，单条区域会覆盖所选类别的最小到最大位置。分类轴不能使用 `range.x`，也不能用月份字符串、时间戳或类别序号伪造数值轴。

- **线性数值轴用 range**。在本 Skill 的 chartType 子集中支持 `line / area / column / columnParallel / columnPercent / bar / barParallel / barPercent / scatter`；只对实际为线性数值轴的方向指定范围。每个已指定的轴都要同时写 `min / max`：有限数值且 `min < max`，或使用 `min: "axisMin"` / `max: "axisMax"` 表示当前可见轴端点。至少指定 x/y 中的一项；未指定的方向铺满绘图区。

Plan `area.target: {yStart: 0.2, yEnd: 0.4}`、数据比率以 0–1 存储时，对应 20%–40% 的水平色带：

```json
{ "annotationArea": [{ "range": { "y": { "min": 0.2, "max": 0.4 } }, "text": "目标区间 20%–40%" }] }
```

普通图若原始值以 20 / 40 存储、格式只是百分号后缀，边界也用 20 / 40；不要按显示文本改变数据坐标。`columnPercent / barPercent` 的数值轴则是归一化后的 0–1，20%–40% 用 0.2 / 0.4，不用输入计数。横向条形图数值在 x 轴，改用 `range.x`。

散点 Plan `area.target: {xStart: 0, xEnd: 100, yStart: 0.2, yEnd: 0.4}` 转成二维矩形：

```json
{ "annotationArea": [{ "range": { "x": { "min": 0, "max": 100 }, "y": { "min": 0.2, "max": 0.4 } }, "text": "目标区域", "textPosition": "middle" }] }
```

范围按轴坐标绘制，不需要区域里恰有数据点。部分越界会裁剪，完全越界不绘制；不会为显示区域自动扩大坐标轴。`axisMin / axisMax` 指当前可见轴边界，不是 dataset 极值。反向轴仍按数值大小写 min/max，位置由 renderer 映射。

### 散点决策分区与四象限

Plan 已确定两条业务阈值时，每个象限生成独立的 `range` 对象，不用 selector 先筛选象限内的点。以 x 阈值 50、y 阈值 0.4 为例（仅演示语法，不是默认业务阈值）：

```json
{
  "annotationArea": [
    { "range": { "x": { "min": "axisMin", "max": 50 }, "y": { "min": 0.4, "max": "axisMax" } }, "text": "低 X / 高 Y", "textPosition": "middle" },
    { "range": { "x": { "min": 50, "max": "axisMax" }, "y": { "min": 0.4, "max": "axisMax" } }, "text": "高 X / 高 Y", "textPosition": "middle" },
    { "range": { "x": { "min": "axisMin", "max": 50 }, "y": { "min": "axisMin", "max": 0.4 } }, "text": "低 X / 低 Y", "textPosition": "middle" },
    { "range": { "x": { "min": 50, "max": "axisMax" }, "y": { "min": "axisMin", "max": 0.4 } }, "text": "高 X / 低 Y", "textPosition": "middle" }
  ]
}
```

替换为 Plan 的阈值和短标签；用同一对阈值拼接四个区域，避免缝隙或重叠。空象限保留其决策含义，不因没有点就漏掉背景。阈值必须落在当前可见轴内部，才能显示四格；若需改动已确认 Plan 的轴范围，先说明原因。单个目标区 / 风险角只输出相应一个矩形，不机械复制四格。

默认沿用主题。如果相邻区域需要辨认，可从 Story Preset 取克制的 `areaColor / areaColorOpacity`；保持点、系列和文字可读，不用四块高饱和色盖住数据。`middle` 是标签的区域中心锚点，不是自动避让；中心有点时，可按阅读需要使用 `topLeft / topRight / bottomLeft / bottomRight` 等支持位置，或把解释放进正文，不编造 offset 字段。

## 数值与基础组件

`measures[].numFormat` 控制指标显示；使用自定义格式时设置 `autoFormat: false`。同一数值轴上指标格式一致且轴未指定格式时，组装脚本会同步轴格式。

```json
{ "id": "rate", "encoding": "yAxis", "autoFormat": false, "numFormat": { "type": "percent", "fractionDigits": 1 } }
```

`0.253` 转为 `25.3%` 用 `type: percent`；原值已是 `25.3`、只增加百分号，用 `type: number, suffix: "%"`。显示单位缩放用 `ratio`，例如 `ratio: 10000, symbol: "万"`；不要再改原始 dataset 数值。

**100% 构成图单独处理轴与指标。** `columnPercent / barPercent` 的数值轴固定使用归一化的 0–1 坐标，与原始输入是计数、金额还是份额无关。轴格式默认省略；要控制精度时使用 `autoFormat: false, numFormat: {type: "percent", fractionDigits: 0}`，不能用 `number + suffix: "%"`。指标格式仍对应输入值：原始金额保留金额格式，输入份额 0.253 则使用 percent。组装器不再把原始指标格式复制到归一化轴。浏览器核对轴上的 0 / 0.5 / 1 应显示 0% / 50% / 100%，同时核对 tooltip 的输入值读法。

同轴指标混用普通数字、比例或百分数格式时，组装器发出 `SHARED_AXIS_FORMAT_MISMATCH` 提示，不阻断输出。格式不是业务单位：依据 `chart-contract.md` 核对数据与尺度，必要时修正映射或换算后重新组装；格式差异有合理依据时保留。没有提示也不代表量纲已通过验证。

常用组件只在 Plan 要求或实际阅读需要时设置：

- 标签：`label.enable`、`label.showValue`、`label.labelPosition`（不是 `visible / position`）。
- 图例：`legend.enable`；分类系列需要可辨认身份。
- 轴：`xAxis / yAxis` 的 `visible`，标题为 `title: {visible, titleText}`；双轴使用 `primaryYAxis / secondaryYAxis`。
- 点：`pointStyle.pointVisible`；线：`lineStyle.lineSmooth / lineWidth`。
- 精确配色为 `color.colorMapping`，色板为 `color.colorScheme`。通常使用现有 Story Preset，不另建主题。

## Scrollytelling 与检查

各 step 共享 chart-level 骨架、格式和基础样式，分别使用该 step 的 `dataRef`、高亮和标注。每个 step 是完整状态；取消上一阶段的强调时，应从基础配置重新生成当前状态，避免数组合并导致旧标注残留。组装脚本按零起始序号生成最终 `steps`。

## 版本边界

不要把字段能通过 schema 解析当作表达已实现：

- `annotationArea.range` 只支持上述图表的线性数值轴，不支持分类 / 时间 / 对数轴、透视或组合图。`dualAxis` 仍只能使用类别带，不用 `range` 指定左右轴数值区域。连续数值区间、散点矩形必须使用 `range`，不能靠 selector 数值筛选来模拟。
- `dualAxis` 的 point 可用 `measureId` 定位左右轴指标；水平线配置只有 `yValue`，没有右轴绑定字段。右轴专属阈值不能通过添加 `axisId` 等未定义字段实现。
- 多指标差值必须能以 Plan 的维度锚点唯一确定两个 mark 或 stack group。无法唯一定位时不能自行挑一个指标。

遇到这些情形，明确指出哪项 Plan 意图无法表达；可先保留有效图表并报告未实现的标注，若需调整 Plan 中的图表/标注方案，再与用户确认。不要删除 Plan 中的意图、改数据或声称完整完成。合法类别带、线性数值区域、点、单轴阈值与合法差值不受上述限制。

本地组装通过只说明合同检查通过，不代表所有 VSeed 字段有效或叙事已实现。最终用作品实际加载的 VSeed 版本检查图表：所有图可渲染、标注落点正确、强调目标正确；scrolly 逐步检查数据范围、标注增删和系列连续性。发现配置问题就修正对应配置并重新组装，无须重新设计已确认的 Plan。
