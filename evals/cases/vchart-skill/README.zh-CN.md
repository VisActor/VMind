# VChart 评测用例

[English](README.md) | [简体中文](README.zh-CN.md)

[所有 Skill 的用例](../README.zh-CN.md)

这里收录 32 个 VChart 固定任务，用于检查图表生成、问题诊断、数据处理、交互和连续修改。每个任务都有固定 prompt、输入和验收条件，适合在修改 Skill 后做针对性回归。

## 选择与运行

| 分组 | 用例数 | 适用场景 |
| --- | --- | --- |
| `core` | 8 | 常用能力回归：分组、堆叠、百分比、空值、诊断、问答、澄清和续改。 |
| `extended` | 24 | 针对修改范围，检查更多图表类型、坐标轴、布局、交互、React 和图片还原。 |

先按 [评测指南](../../README.zh-CN.md) 配置环境和模型，再从仓库根目录执行：

```bash
uv run python evals/scripts/run.py --skill vchart-skill --group all --list
uv run python evals/scripts/run.py --skill vchart-skill --case vchart-grouped --browser
uv run python evals/scripts/run.py --skill vchart-skill --group core --browser
uv run python evals/scripts/run.py --skill vchart-skill --group extended --list
```

`--list` 只列出任务，不调用模型。可重复传入 `--case` 选择多个用例；`--skill vchart-skill --group all` 选择本 Skill 的全部 32 个任务。指定本 Skill 后，未指定用例或分组时默认运行 core。建议先跑单个用例，查看结果和用量，再扩大范围。

core 中的续改用例包含三轮独立 Agent 执行，所以整组共有 10 轮任务执行；每轮内部可能包含多次模型 API 请求。

## 核心用例（core）

| 用例 | 检查重点 | 验收条件 |
| --- | --- | --- |
| vchart-grouped | 完整分组数据的生成。 | 六根柱的分组、图例、数值标签正确；无遮挡 |
| vchart-diagnosis | 字段错误的诊断与修复。 | 明确解释字段不匹配，East=120、West=80 的修复图正常显示 |
| vchart-stack | 验证累加堆叠，区分堆叠柱与分组柱。 | East总高270、West170、North210；同地区两个季度堆叠而非并排。 |
| vchart-percent | 验证归一化分母和百分比轴。 | 各地区总高100%；East Q1为120/270，West为80/170，North为100/210；金额不冒充百分比。 |
| vchart-line-null | 区分缺失值与零值。 | Feb没有假0且线断开；Mar=0、Jan=10、Apr=20保留。 |
| vchart-qa-label | 验证只需解释的任务路由。 | 解释有效的label显示配置，可附位置与样式；不伪造API，不无谓索要spec；outputs目录为空。 |
| vchart-missing-data | 验证缺少输入时的澄清行为。 | 询问年份、营收数据及必要口径；不编造公司事实，不生成产物。 |
| vchart-edit | 验证基于文件的连续修改及已有内容保留。 | 三轮依次生成、仅改标题、仅改颜色；数据、标签和非目标配置保持；前轮快照不变。 |

## 扩展用例（extended）

| 用例 | 检查重点 | 验收条件 |
| --- | --- | --- |
| vchart-line | 验证系列分组和时间顺序。 | 两条线各3点；顺序正确，无跨系列连接。 |
| vchart-area-stack | 验证堆叠面积的填充边界。 | Jan总高18、Feb32、Mar33；上下边界正确，无系列覆盖冒充堆叠。 |
| vchart-pie | 验证角度编码和标签布局。 | A/B/C/D对应40/30/20/10%；标签无重叠或裁切。 |
| vchart-scatter | 验证两个数值轴。 | A(1,4)、B(2,2)、C(3,5)、D(4,1)，不能使用分类轴等距冒充数值轴。 |
| vchart-heatmap | 验证行列网格数据和零值单元格。 | 四格10、0、20、5均存在；颜色深浅与值一致，0格不缺失。 |
| vchart-radar | 验证极坐标编码和统一尺度。 | 五维80/60/40/90/70正确；统一尺度，不逐维自动归一化。 |
| vchart-funnel | 验证转化阶段的顺序。 | 顺序1000/600/300/100；宽度递减，标签完整。 |
| vchart-dual-axis | 验证不同单位及各系列的坐标轴绑定。 | 营收100/120/90/150；毛利率20/25/10/30%；两系列绑定正确轴。 |
| vchart-negative | 验证正负号和零基线。 | A=-20、B=0、C=30、D=-5；正负在零线两侧。 |
| vchart-long-labels | 验证长标签布局，避免丢失语义。 | 三个完整中文标签可读、无重叠、无裁切；120/80/100正确。 |
| vchart-legend | 验证真实交互中的显隐行为，仅存在图例配置不算通过。 | 真实点击Online图例，Online隐藏但Store仍在；再次点击恢复。 |
| vchart-tooltip | 验证展示数据的绑定与格式化。 | 实际悬停不同柱子，tooltip对应正确地区/季度/金额和单位。 |
| vchart-zoom | 验证视窗筛选，避免截断源数据。 | 源数据40行保留；初始窗口约前10天，实际拖动后能看到第40天。 |
| vchart-reference-line | 验证聚合及坐标空间中的标注。 | 总量270/170/210；参考线准确位于200，标注与线可读。 |
| vchart-empty-data | 验证空数据集的语义。 | 明确零条记录不足以判断趋势，不能称为营收为0，不生成产物。 |
| vchart-chinese-fields | 验证字段名中的 Unicode 字符和标点。 | 杭州90、南京70、上海120；字段正确，单位万元。 |
| vchart-complete-data | 验证超过预览长度的输入仍被完整读取。 | 40条记录及点全部保留，包括第40天120；不从预览补造。 |
| vchart-react | 验证声明式 React 工作流。 | 浏览器中React组件实际渲染；四值40/30/20/10正确，控制台无错误；JSX与HTML一致。 |
| vchart-image-replication | 验证根据图片提取信息并重建图表。 | 与参考图并排复核：Quarterly sales、Q1/Q2/Q3、40/70/55、蓝色柱、零起点、无截图背景替代。 |
| vchart-format | 验证小数转百分比的一致性。 | 20%、25%、10%、30%正确；不能变成0.2%或乘两次。 |
| vchart-numeric-sort | 区分数值排序与字符串排序。 | 顺序Two=2、Ten=10、Twenty=20、Hundred=100，不能按字符串排序。 |
| vchart-bubble | 验证区别于普通散点图的第三个数值编码通道。 | 四个坐标正确；size10/20/40/80对应单调递增大小。 |
| vchart-step-line | 验证插值语义和指定的数据筛选。 | Jan10、Feb20、Mar15；只有Online三点且为阶梯线。 |
| vchart-log-axis | 验证非线性坐标轴的几何关系。 | 1、10、100、1000在纵轴等距；刻度和数据准确，无无效log(0)。 |

## 如何验收

运行报告区分自动检查和人工复核。自动检查通过后仍为 `needs-review`；上表是复核清单，不表示所有条件都已自动验证。

- **HTML 任务**：检查产物；启用 `--browser` 后，检查浏览器错误、非空白 canvas、截图及适用的数据记录。还需对照上表检查源代码、运行时配置和视觉结果。
- **回答任务**：自动检查最终回复非空且未生成输出文件。API 用法、澄清内容和事实准确性需要人工复核。
- **交互任务**：实际点击、悬停或拖动产物并记录结果，仅存在配置不能判为通过。
- **图片还原与 React**：图片还原需要与参考 PNG 并排查看，没有自动像素相似度阈值；React 任务必须确认由 React 组件实际渲染。
- **连续修改**：每轮复制上一轮文件到新工作区，保留各轮日志和快照。某轮失败后停止后续轮次。除了确认文件发生变化，还需对比配置和预览，检查无关内容是否保留。它验证基于文件的修改能力，不验证宿主会话记忆。

按 [评测指南](../../README.zh-CN.md#日志) 保存复核结论及产物哈希。未执行的用例记为 `not-run`；用例清单不代表通过记录。

## 数据与用例维护

- `tasks.json` 定义任务 prompt 和输入文件，`expectations.json` 定义检查要求；预期答案不会复制到 Agent 工作区。
- 表格和 JSON 输入均为合成数据。图片任务使用仓库自带的 `reference-bars.png`，其源文件为 `reference-bars.svg`，两者适用仓库 MIT 许可证。
- 新增用例应覆盖新的能力或失败模式，提供可公开分享的输入和可复核的验收条件。
- 保留失败用例及执行证据。若测试数据或检查器本身有误，应与 Skill 修改分开修复。
