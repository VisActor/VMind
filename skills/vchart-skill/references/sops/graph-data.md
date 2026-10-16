# Sankey 图数据、节点键与交互

`data` 是数据源描述；`values` 才是数据。Sankey 的 `values` 包含一个图对象，不直接接收平铺的 source/target/value 行：

```js
const edges = [
  { from: 'Search', to: 'Landing', count: 27 },
  { from: 'Landing', to: 'Signup', count: 19 },
  { from: 'Landing', to: 'Exit', count: 8 }
];
const nodes = [...new Set(edges.flatMap(e => [e.from, e.to]))].map(id => ({ id }));
const spec = {
  type: 'sankey',
  data: { values: [{ nodes, links: edges }] },
  nodeKey: 'id', categoryField: 'id',
  sourceField: 'from', targetField: 'to', valueField: 'count',
  nodeAlign: 'justify', nodeGap: 16,
  label: { visible: true },
  emphasis: { enable: true, trigger: 'hover', effect: 'related' }
};
```

未要求数据加工时，将用户提供的边原样放入 `links`；明确要求保留原始边时不要聚合。用户要求合并重复流向或其他聚合时，按指定分组字段和计算口径处理，核对聚合前后总量，并保留可追溯的原始输入。节点从处理后的端点派生，已有节点元信息应保留。端点是名称或业务 ID 时，`nodeKey` 必须返回相同的标识，`categoryField` 负责显示。用整数索引连线时保持原节点顺序。数据字段名按实际输入配置，不限定为示例中的名字。

另一种合法输入是两个数据集，id 分别为 `nodes` 和 `links`；层级 Sankey 也可以使用 `values: [{nodes: [...带 children 的根节点]}]`。参见 [基础示例](../examples/sankey/basic-sankey.md) 与[层级示例](../examples/sankey/hierarchy-sankey.md)。合法空输入允许 `values: []` 或空图。不要把这些合法形式自动改成某一个固定格式。

`spec.data` 与 `series[i].data` 均可使用。移动挂载位置不会把平铺边转换为图。`sourceField`/`targetField`/`valueField` 只指定图内边的字段，并不承担转换。

只有业务明确规定阶段时才使用 `setNodeLayer`；它接收节点原始数据。布局回调与 tooltip 收到的节点可能包含 `datum`，不要在不确认结构时把它当原始行。优先使用内置 label/tooltip，扩展时参考类型定义。不要仅因用户再次反馈空白就猜 CDN 注册或版本问题。

## 标签、颜色与图例使用不同的输入契约

VChart 2.0.21 的 Sankey `label.formatMethod` 签名为 `(text, originalNode) => string`，第一个参数是文本，不是节点。只要显示 `categoryField` 就使用 `label: {visible: true}`，无需回调。需要短名称时写 `formatMethod: (text, originalNode) => originalNode.shortName ?? text`；不能写 `datum => datum.name`，它会把文本当对象而返回 undefined，使所有节点名称消失。这里传入第二参数的是原始节点，与 Treemap 的布局节点不同，不能混用两个图的回调假设。

`node.style.fill` 收到的却是布局节点，原始节点在 `layoutNode.datum`。例如阶段字段在原始节点上，`layoutNode.stage` 是 undefined；用统一回退色会掩盖错误并把所有阶段画成同色。默认优先用 `seriesField: '<分组字段>'` 配合 `color` 色板，保留内置节点、连线和图例的共同映射。若需要自定义颜色，先取 `const row = layoutNode.datum ?? layoutNode`，再按实际字段映射，不能用兜底色冒充所有分组都正确。

`setNodeLayer` 接收原始节点，可直接读取其阶段序号。节点 tooltip 的自定义回调通常接收布局节点，`value` 是布局计算的流量，节点名称/业务字段从原始节点读取；连线则读取其 source/target/value。没有特殊需求时保留内置 tooltip，避免把节点当连线显示 `undefined → undefined`。新增回调必须分别实际悬停节点和边检查。

离散图例 `legends.data` 是数据转换**函数**，不是图例数组。默认根据 `seriesField` 生成；如确需自定义，按 [IDiscreteLegendSpec](../type-details/ILegendSpec-Type-Definition.md) 返回图例项，并保证筛选语义与图中分组一致。不要在没有业务需求时额外创建无法正确筛选的静态图例。

修改旧图时，也要一起检查上述既有回调；只移动 data 位置、缩小字体或保留旧的 `datum => datum.name` 都不能修复节点名称缺失。节点/边数量正确仍不足以通过：实际文字、分组颜色、图例和 tooltip 必须与数据对应。

悬停完整相关路径使用 `emphasis: {enable: true, trigger: 'hover', effect: 'related'}`。`adjacency` 只突出邻边，`self` 只突出自身；普通 hover 样式不能替代路径遍历。请检查实际节点/连线高亮及无关分支变暗，并验证离开后复原。自定义 `node.state` / `link.state` 时不要覆盖内置 `emphasis` / `blur` 状态导致效果消失。

**固定运行版本的边界：** VChart 2.0.21 的普通 nodes/links 图 `related` 路径存在库内异常：节点处理器访问旧的 `graphic.data[0]`，实际图元数据在 `graphic.context.data`；连线处理器还可能把普通图边当作带 `parents` 的层级路径。若堆栈来自 `_handleNodeRelatedClick` / `_handleLinkRelatedClick`，不能归因于用户数据、改 callback 名称或伪造 parents 来绕过。记录准确运行版本和错误，让宿主/图表库修复这一运行边界；不要擅自升级 CDN、猴子补丁私有方法、禁用交互，或把 adjacency 冒充完整路径。其他源码问题仍须修复和交付，但此版本下完整路径交互必须明确标为未通过，不能宣称全部完成。其他版本也需实际验证，不能仅凭版本号推定已修复。

使用实际部署的 VChart 版本运行验收：非空有效输入应产生预期节点和连线，边权符合原始输入或用户要求的聚合结果，标签可读，节点和连线 tooltip 取值正确。执行[交付流程](../../workflows/artifact-delivery.md)，不能把校验通过等同于完成浏览器验收。
