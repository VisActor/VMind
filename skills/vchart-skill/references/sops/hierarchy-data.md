# 层级图的数据入口、回调与渲染验收

适用于 Treemap / sunburst 的数据入口与 datum 取值；矩形几何、标签和 `leaf` 样式部分是 Treemap 专用，不要照搬到旭日图。

## 数据源与树节点是两层结构

`data`（根配置或 `series[i]`）是数据源描述对象或描述对象数组；每个描述用 `values` 接收实际数据。不要写成 `data.value`，也不要把树节点直接作为 `data` 数组元素：

```js
const root = { name: 'Total', children: [{ name: 'One', amount: 3 }, { name: 'Two', amount: 7 }] };
const spec = {
  type: 'treemap', categoryField: 'name', valueField: 'amount',
  data: { id: 'tree', values: [root] }
};
```

这是一份在模板固定 VChart 2.0.21 中验证过的根节点数组写法。不同版本的类型注解不能替代运行时验证。原始多级结构放在各节点的 `children`，不把整棵树放在单个 `values` 对象中；合法空输入是 `values: []`。CSV/DSV/TSV 字符串可配对应 `parser`，数据引用可使用 `fromDataId`/`fromDataIndex`，不要误判为节点。

完整保留输入叶子和金额；按实际层级字段分组，保留每个叶子的原始字段，额外组织父节点而不是改写叶子。占比的分母由完整输入求和；不能假设总额为 100。已有层级数据不要套用固定两层结构。

布局默认使用 `splitType: 'binary'`。如明确选择 `splitType: 'squarify'`，同时显式设置有效的 `aspectRatio`（例如 `(1 + Math.sqrt(5)) / 2`）；VChart 2.0.21 会把未设置的 aspectRatio 作为 undefined 传给布局器，覆盖布局默认值，导致 squarify 的比值计算失效而退化为整排细条。`squarify` 本身是支持的值，不能把这种现象误诊为枚举不支持。改变布局算法后须检查实际块状分区与面积比例，不能仅凭没有标签重叠就通过；有空间的标签应保留，不以全隐藏掩盖退化的布局。

## 回调的布局节点不等于原始记录

Treemap 的 fill、标签 `formatMethod` 和 tooltip 回调可收到布局节点。VChart 2.0.21 的 `node.datum` 是祖先链数组，末项为当前节点原始数据；布局节点带 `depth`、`x0/x1/y0/y1` 等。原始记录也可能直接传入，先归一化后统一取字段：

```js
function originalDatum(node) {
  if (Array.isArray(node?.datum)) return node.datum[node.datum.length - 1] ?? node;
  return node?.datum && typeof node.datum === 'object' ? node.datum : node;
}
```

不要写 `node.datum.groupField` 来读取祖先数组，不要以内部 `node.key` 或 `parent.key` 作为名称、分类或业务 ID。颜色、标签和 tooltip 用同一个归一化入口，从原始字段映射取值；palette 覆盖所有实际品类，不以灰色回退掩盖缺失映射。

标签函数用 `label.formatMethod: (text, node) => ...`，`formatter` 是字符串模板。Tooltip 的 `mark.title.value` / `mark.content[].value` 函数也要归一化 datum；内置 tooltip 默认读取实际 category/value 字段，若未要求扩展可优先使用它。

## 先确定哪些层级可以放文字

父节点的矩形包含全部子节点，**父标签能放进父矩形不代表不会盖住子标签**。对父节点调用叶子的 `fitTreemapLabel`、减小字体或检查单个文字是否截断，都不能证明父子文字互不重叠。

默认采用叶子标签：明确设置 `nonLeafLabel: { visible: false }`，分类通过颜色、图例（按需）和 tooltip 表达；合成的总根节点不在树图内部重复显示标题。新增父级标签不是修复窄屏的必要步骤，不要在续改时擅自开启。图表标题使用独立 `title` 组件。

只有用户明确需要分组标题，或它是不可替代的信息时，才启用父级文字。此时先按实际 VChart 版本配置独立标题带，使子节点布局真正避开标题带，再按标题带的宽高测量文字；仅设置 label 的 padding/position、或在父矩形中央绘制文字，不算完成空间分配。不能确认这种布局时，隐藏父标签并在 tooltip 保留分组。不要因为父节点面积大就无条件显示父标题。

已有作品的续改也要检查 `nonLeafLabel`：如果没有独立空间且与子节点重叠，关闭父标签或实现并验证标题带；不能只改叶子 `formatMethod` 就交付。对全部可见层级的文本矩形检查相交，而不是只看叶子标签的 `clipped` 标记。

## 按真实几何决定标签显示

标签内容和精度以用户需求为准，可以是名称、数值、占比或它们的组合，不要固定添加占比。需要判断标签是否完整容纳时，用节点实际 `x1-x0` / `y1-y0` 和匹配字体的 Canvas `measureText` 测量，留出边距；不要用金额乘常数估算面积。空间不足时按需求选择隐藏、换行或省略，tooltip 保留完整信息；不强显重叠文字。父级标题仍需独立空间，不能照搬叶子规则。

**续改不能只保留原来的标签函数。** 如果原任务要求“只能显示完整容纳的名称与占比”，检查旧 `formatMethod` 是否有真实宽高/字体测量条件；无条件返回文本、仅设置 `minVisibleArea` 或依靠 ellipsis 都不满足要求，必须一并修复。用户简短反馈没有重述标签要求，也仍需保留这项条件。

需要“完整名称与占比，放不下就隐藏”时，参考 `fitTreemapLabel`，复制需要的 helper 到本轮源文件。例如（内容和小数位数按需求调整）：

```js
const labelFont = { fontSize: 14, fontFamily: 'sans-serif', fontWeight: 'normal', lineHeight: 18 };
// name 和 percentage 从 originalDatum(node) 与完整输入总额生成。
// 单行优先；确需多行时用数组，并同时测量最大行宽与总行高。
label: {
  visible: true,
  style: { ...labelFont, fill: '#ffffff' },
  formatMethod: (_text, node) => {
    const row = originalDatum(node);
    const name = String(row[categoryField]);
    const percentage = `${(total > 0 ? Number(row[valueField]) / total * 100 : 0).toFixed(0)}%`;
    return fitTreemapLabel(`${name} ${percentage}`, node, labelFont);
  }
}
```

VRender 多行文本使用字符串数组，不能以含 `\n` 的单个字符串代替多行布局。验收要看实际绘制的文字是否被裁剪/省略，以及完整文字是否在叶子内；仅看 text 属性或 AABB 在图块内会漏掉截断。

`spec.data` 和 `series[i].data` 都是合法入口；如果校验与实际布局证明已有入口正常，不要因再次收到“看不到”的反馈就猜它不兼容。先检查当前证据与尚未满足的原需求；没有真实运行证据时说明限制。

## 可执行参考与读取路径

读取完整 [hierarchy-treemap.js](../examples/treemap/hierarchy-treemap.js)，它按参数指定任意层级字段、数值字段和颜色分组字段，保留叶子记录，统一回调取值，并基于布局边界测量标签。将示例输入和 palette 替换为用户的完整数据与映射，复制需要的 helper 到本轮源文件；不要依赖已安装 Skill 的浏览器相对路径。

配置查询使用实际存在的 `references/type-meta/treemap.json`（或 `sunburst.json`）；复杂标签参考 `references/type-details/ILabelSpec-Type-Definition.md`。本 Skill 没有 `ITreemapSeriesSpec-Type-Definition.md`，不要猜这个路径。完成后执行 `workflows/artifact-delivery.md` 的校验与交付。

## 验收依据

- 输入非空时核对布局叶子数量与完整原始记录、金额总和和面积比例；合法空输入不要求可见叶子。
- 实际 leaf fill 对应原始分组；标签内容、精度及省略/隐藏策略符合请求，边界在对应图块内；父级、根级和叶子文字之间没有相交。窄屏与桌面都检查，空字符串不算可见标签。
- 实际 hover 中 tooltip 的业务字段取值正确，需要占比时验证分母和精度；反馈状态符合请求。源码中有回调不代表交互已验证。
- 标题、canvas、`ready`、无异常或 `html_to_json` 的静态内容均不能证明上述条件。
