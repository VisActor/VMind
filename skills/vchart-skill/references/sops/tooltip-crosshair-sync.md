# VChart 多图表 Tooltip 与 Crosshair 联动排查指南

## 适用场景

当用户遇到以下多图表联动问题时使用本 SOP：

- 多个图表之间 Tooltip 无法同步显示
- 页面上只有一个 Tooltip 显示，其他图表无反应
- 联动 Tooltip 的内容与直接悬浮不一致
- Crosshair（十字准星）不随联动同步
- `setDimensionIndex` API 调用不生效

---

## 排查流程：L1 → L2 → L3

> 排查遵循"由外到内"原则：先确认联动信号能发出（L1），再确认对方能收到并响应（L2），最后检查响应内容是否正确（L3）。

---

### L1：联动机制 — 事件绑定与 API 调用

**目标**：确认主图表能正确发出联动信号，从图表能正确接收。

#### 1.1 全局限制检查

**这是最常见的联动失败原因。**

`VChart.globalConfig.uniqueTooltip` 默认值为 `true`，会限制全局只显示一个 Tooltip。多图联动必须关闭：

```javascript
// 必须在所有 VChart 实例化之前设置
VChart.globalConfig.uniqueTooltip = false;
```

**验证方式**：在浏览器控制台执行 `VChart.globalConfig.uniqueTooltip`，确认为 `false`。

#### 1.2 事件监听检查

推荐使用 `dimensionHover` 事件（VChart 1.8.0+），而非底层 `pointermove`：

```javascript
// ✅ 推荐：dimensionHover 事件
chart1.on('dimensionHover', (event) => {
  const dimensionValue = event.dimensionInfo?.[0]?.value;
  chart2.setDimensionIndex(dimensionValue, {
    showTooltipOption: { activeType: 'dimension' }
  });
});
```

**排查清单**：

| 检查项 | 正确做法 | 常见错误 |
|--------|---------|---------|
| 事件名 | `'dimensionHover'`（字符串） | 拼写错误、使用 `pointermove` |
| 事件注册时机 | 在 `renderSync()` 之前或之后均可 | 在图表销毁后注册 |
| 维度值提取 | `event.dimensionInfo?.[0]?.value` | 直接取 `event.value`（不存在） |
| API 调用 | `chart2.setDimensionIndex(value, opts)` | 忘记传 `showTooltipOption` |

#### 1.3 双向联动

若需要双向联动（悬浮任一图表，其他图表同步响应），需为每个图表都注册事件：

```javascript
// chart1 → chart2
chart1.on('dimensionHover', (event) => {
  const v = event.dimensionInfo?.[0]?.value;
  chart2.setDimensionIndex(v, { showTooltipOption: { activeType: 'dimension' } });
});

// chart2 → chart1
chart2.on('dimensionHover', (event) => {
  const v = event.dimensionInfo?.[0]?.value;
  chart1.setDimensionIndex(v, { showTooltipOption: { activeType: 'dimension' } });
});
```

**L1 通过标志**：主图表悬浮时，从图表的 `setDimensionIndex` 被调用（可通过 `console.log` 验证）。

---

### L2：被联动图表的响应 — API 参数与 Tooltip 配置

**目标**：确认从图表收到联动信号后，Tooltip 能正确触发并显示。

#### 2.1 `setDimensionIndex` 参数检查

```javascript
chart2.setDimensionIndex(dimensionValue, {
  showTooltipOption: {
    activeType: 'dimension'  // 必须指定，否则可能触发 mark 类型
  }
});
```

**常见问题**：
- `dimensionValue` 为 `undefined`（上游事件取值路径错误）
- `dimensionValue` 的类型与数据不匹配（如传了 `number` 但数据中是 `string`）

#### 2.2 被联动图表的 Tooltip 配置

**这是 L2 最关键的检查项。** 被联动图表的 Tooltip 必须能响应 dimension 类型触发：

```javascript
// ✅ 正确：支持 dimension 类型触发
tooltip: {
  visible: true,
  activeType: 'dimension'
  // 或 activeType: ['mark', 'dimension']
}

// ❌ 错误：只有 mark 类型，setDimensionIndex 不会触发 tooltip
tooltip: {
  visible: true,
  activeType: 'mark'
}
```

#### 2.3 Crosshair 联动

若需要 Crosshair 同步显示：

```javascript
crosshair: {
  followTooltip: { dimension: true },  // 跟随 tooltip 维度自动联动
  xField: { visible: true, line: { type: 'line' } }
}
```

> 🔍 **深入排查**：若 Tooltip 能触发但**内容为空或与预期不符**（标题 undefined、数值缺失、格式化不生效），
> 此问题超出本 SOP 范围。应从 SOP 路由（SOP_INDEX.md）中检索
> **tooltip 配置** 或 **tooltip 内容排查** 相关的 SOP 继续排查。

**L2 通过标志**：从图表的 Tooltip 能显示出来（即使内容可能不对）。

---

### L3：Tooltip 内容 — 格式化与自定义

**目标**：确认联动触发的 Tooltip 内容正确且格式化生效。

#### 3.1 dimension Tooltip 的回调参数差异

**关键差异**：`setDimensionIndex` 被动触发时，回调参数可能与用户主动悬浮时不同。

```javascript
tooltip: {
  dimension: {
    title: {
      // ✅ 稳定写法：优先从 datum 取值
      value: (data) => data?.[0]?.datum?.category
      // ❌ 不稳定：依赖 params（被动触发时可能不完整）
    },
    content: [{
      // content 回调参数是单条 datum，相对稳定
      key: (datum) => datum.type,
      value: (datum) => datum.value
    }]
  }
}
```

#### 3.2 格式化不生效

> 🔍 **深入排查**：若 Tooltip 内容需要数值格式化（千分位、百分比、自定义格式）但显示为原始数值，
> 此问题超出本 SOP 范围。应从 SOP 路由（SOP_INDEX.md）中检索
> **格式化方法**、**formatter 配置** 相关的 SOP 继续排查。

**快速自检**：
- Tooltip 的格式化模板使用 `valueFormatter` / `keyFormatter` 字段（不是 `value` / `key`）
- 函数方式的 `value: (datum) => ...` 必须有 return 值

#### 3.3 联动内容不一致

当主图表和从图表的 Tooltip 内容不一致时：

1. **数据字段名不同**：两个图表的 `xField` 值不同，`setDimensionIndex` 传递的维度值在从图表中找不到对应数据
2. **数据类型不同**：主图表 `xField` 为 `string`，从图表为 `number`，维度值匹配失败
3. **时间格式不同**：两个图表的时间数据格式不一致（如 `'2024-01'` vs `'2024/01'`）

**L3 通过标志**：联动 Tooltip 的标题、内容、格式化均与直接悬浮时一致。

---

## 完整配置示例

以下是双折线图 Tooltip + Crosshair 联动的规范配置：

```javascript
// 1. 全局设置
VChart.globalConfig.uniqueTooltip = false;

// 2. 图表 Spec（两个图表结构相同，数据不同）
const createSpec = (data, title) => ({
  type: 'line',
  data: { values: data },
  xField: 'time',
  yField: 'value',
  seriesField: 'type',
  title: { text: title, visible: true },
  tooltip: {
    visible: true,
    activeType: 'dimension',
    dimension: {
      title: { value: (data) => data?.[0]?.datum?.time },
      content: [{
        key: (datum) => datum.type,
        value: (datum) => datum.value
      }]
    }
  },
  crosshair: {
    followTooltip: { dimension: true },
    xField: { visible: true, line: { type: 'line' } }
  }
});

// 3. 实例化
const chart1 = new VChart(createSpec(data1, '图表1'), { dom: 'chart1' });
const chart2 = new VChart(createSpec(data2, '图表2'), { dom: 'chart2' });

// 4. 联动逻辑
chart1.on('dimensionHover', (e) => {
  chart2.setDimensionIndex(e.dimensionInfo?.[0]?.value, {
    showTooltipOption: { activeType: 'dimension' }
  });
});
chart2.on('dimensionHover', (e) => {
  chart1.setDimensionIndex(e.dimensionInfo?.[0]?.value, {
    showTooltipOption: { activeType: 'dimension' }
  });
});

// 5. 渲染
chart1.renderSync();
chart2.renderSync();
```

---

## 核心配置速查表

| 配置项 | 正确做法 | 高频错误 |
|--------|---------|---------|
| `VChart.globalConfig.uniqueTooltip` | 实例化前设为 `false` | 忘记设置 / 实例化后才设置 |
| `tooltip.activeType` | `'dimension'` 或 `['mark', 'dimension']` | 仅 `'mark'`，导致维度 API 不触发 |
| `dimensionHover` 事件 | `event.dimensionInfo?.[0]?.value` | 取错路径 |
| `setDimensionIndex` | 传 `showTooltipOption: { activeType: 'dimension' }` | 不传 options |
| `crosshair.followTooltip` | `{ dimension: true }` | 手动监听事件控制，逻辑复杂易错 |
| dimension title.value | `(data) => data?.[0]?.datum?.field` | 当作单条 datum 处理 |
