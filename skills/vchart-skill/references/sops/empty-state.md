# 空数据与居中提示

适用于任意图表的空数据创建、清空、筛选无结果和恢复数据，不依赖业务字段或固定文案。

## 数据与提示分开

- 保留真实空数据 `values: []`，不补造占位数据，不保留上一版图形。判断是否为空应依据当前有效记录；“记录存在但数值全为 0”不等于“没有记录”，按图表语义另行说明。
- 用户明确要求图中央提示时，标题或副标题不能代替中央提示。使用图表级 `customMark`，不放进依赖业务数据逐条生成的 series mark。
- 独立提示无需 `dataId`、`dataIndex`、`dataKey` 或虚构数据集。只有确实需要逐条绑定已声明数据时才使用这些属性。

## 坐标必须来自布局

`customMark.style.x/y` 是图形像素坐标，不是 CSS：不要写 `'50%'`，也不要把固定画布宽高的一半当成响应式居中。VChart 2.0.21 的样式回调上下文提供 `context.vchart`，可获取当前画布尺寸：

```js
function emptyStateMarks(isEmpty, message) {
  if (!isEmpty) return [];
  return [{
    type: 'text',
    interactive: false,
    style: {
      x: (_datum, context) => context.vchart.getChart().getCanvasRect().width / 2,
      y: (_datum, context) => context.vchart.getChart().getCanvasRect().height / 2,
      text: message,
      textAlign: 'center',
      textBaseline: 'middle',
      fontSize: 18,
      fill: '#64748b'
    }
  }];
}
// 在基于当前数据重新构造 spec 时使用：
// customMark: emptyStateMarks(currentRows.length === 0, requestedMessage)
```

这是整个画布的中央位置。若用户要求绘图区中央，应读取目标 region 的布局起点和尺寸，使用同一坐标系；不能把 customMark 自身文字的包围盒误当作绘图区。长提示需按可用宽度分行或缩短辅助说明，窄屏下不能溢出。

数据恢复时重新计算空状态并更新 `customMark`；只调用 `updateData` 不会重新执行构造 spec 的条件表达式。恢复数据、再次清空都应更新提示状态，不能把首次空状态固化进回调闭包。

## 验证

先执行标准配置校验。具备浏览器能力时，检查空数据、恢复数据、再次清空，以及宽屏到窄屏的 resize：空时无旧图形，提示真实可见且边界在容器内；有数据时无空提示。静态校验不执行布局回调，不能证明居中、换行或可见性。
