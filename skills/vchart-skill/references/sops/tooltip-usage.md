# VChart Tooltip 配置与使用排查指南

## 适用场景

当用户遇到以下 Tooltip 问题时使用本 SOP：

- Tooltip 不显示 / 显示空白
- Tooltip 内容不正确 / 缺少数据
- Tooltip 触发方式不符合预期
- Tooltip 样式自定义
- mark / dimension / group 类型选择困惑
- 自定义 Tooltip 渲染

> **多图表联动场景**：如果用户的问题涉及多个图表之间的 Tooltip 联动（如 `setDimensionIndex`、`uniqueTooltip`），请转到 `tooltip-crosshair-sync.md`。

---

## Step 1：问题分类

根据用户描述，判断属于以下哪类问题：

| 问题类型 | 用户描述示例 | 跳转 |
|---------|-------------|------|
| **Tooltip 不显示** | "tooltip 没反应"、"鼠标悬浮没提示" | Step 2 |
| **Tooltip 内容错误** | "tooltip 里数据不对"、"显示 undefined" | Step 3 |
| **Tooltip 类型选择** | "怎么配置 tooltip"、"mark 和 dimension 有什么区别" | Step 4 |
| **Tooltip 样式自定义** | "tooltip 改颜色"、"字体太小" | Step 5 |
| **Tooltip 自定义渲染** | "完全自定义 tooltip"、"用 HTML 渲染" | Step 6 |

---

## Step 2：Tooltip 不显示

**按顺序排查**：

### 2.1 检查 visible 配置

```javascript
// ❌ 常见错误：显式关闭了 tooltip
tooltip: { visible: false }

// ✅ 修复
tooltip: { visible: true }  // 或直接删除 visible 字段（默认 true）
```

### 2.2 检查 activeType 与 trigger 匹配

这是**最常见的 Tooltip 不显示原因**：

```javascript
// ❌ 错误：activeType 与实际触发方式不匹配
tooltip: {
  activeType: 'mark',      // 只响应图元触发
  trigger: 'hover'
}
// 但用户期望在 X 轴位置触发（dimension 类型），此时 tooltip 不响应

// ✅ 修复方案一：改为 dimension
tooltip: {
  activeType: 'dimension'
}

// ✅ 修复方案二：同时支持两种
tooltip: {
  activeType: ['mark', 'dimension']
}
```

**activeType 选择指南**：

| activeType | 触发方式 | 适用图表 | 说明 |
|-----------|---------|---------|------|
| `'mark'` | 鼠标悬浮到具体图元（柱子/点/扇形）才触发 | 散点图、饼图、气泡图 | 只有精确悬浮到图形上才显示 |
| `'dimension'` | 鼠标在 X 轴位置范围内即触发 | 折线图、柱状图、面积图 | 适合需要对比同一维度多个系列的场景 |
| `'group'` | 基于分组数据触发 | 折线图、面积图 | 显示分组内所有系列数据 |
| `['mark', 'dimension']` | 同时支持两种触发方式 | 通用 | 推荐：兼顾精确触发和维度触发 |

### 2.3 检查数据是否为空

```javascript
// ❌ 数据为空时 tooltip 无法触发
data: { values: [] }

// ✅ 确保 data.values 非空且格式正确
data: {
  values: [
    { category: 'A', value: 10 },
    { category: 'B', value: 20 }
  ]
}
```

### 2.4 检查容器 DOM

```javascript
// ❌ tooltip 渲染到不可见的容器
tooltip: {
  renderMode: 'html',
  parentElement: document.getElementById('hidden-div')  // display: none
}
```

---

## Step 3：Tooltip 内容错误

### 3.1 mark 类型回调参数

```javascript
tooltip: {
  mark: {
    title: {
      // datum 是单条数据对象
      value: (datum) => datum.category
    },
    content: [
      {
        key: (datum) => datum.type,
        value: (datum) => datum.value
        // datum 格式示例：{ category: 'A', type: '系列1', value: 100, ... }
      }
    ]
  }
}
```

### 3.2 dimension 类型回调参数

> **关键差异**：dimension 的 `title.value` 接收的参数是**数据数组**，不是单条数据。

```javascript
tooltip: {
  dimension: {
    title: {
      // ❌ 常见错误：当作单条数据处理
      value: (datum) => datum.category  // 返回 undefined！

      // ✅ 正确：data 是数组，取第一条的 datum
      value: (data) => data?.[0]?.datum?.category
    },
    content: [
      {
        // content 中的回调参数是单条 datum
        key: (datum) => datum.type,
        value: (datum) => `${datum.value.toLocaleString()} 元`
      }
    ]
  }
}
```

### 3.3 显示 undefined / NaN

**排查清单**：
1. 字段名拼写是否与数据一致（区分大小写）
2. 回调函数是否有返回值（`return` 语句）
3. 数据中该字段是否存在（使用 `?.` 可选链）
4. 数值类型是否正确（`value` 可能是 string 而非 number）

---

## Step 4：Tooltip 类型选择（配置生成指导）

当用户不知道如何配置 Tooltip 时，按此决策树引导：

```
用户需要什么触发方式？
├── 精确悬浮到图形上才显示 → activeType: 'mark'
│   └── 适合：散点图、饼图、气泡图、独立柱子
│
├── 在 X 轴位置范围内显示（对比同维度数据）→ activeType: 'dimension'
│   └── 适合：折线图、面积图、柱状图多系列对比
│
├── 不确定 / 都需要 → activeType: ['mark', 'dimension']
│   └── 推荐默认选择
│
└── 分组触发 → activeType: 'group'
    └── 适合：需要按组显示数据的折线/面积图
```

**快速配置模板**：

```javascript
// 通用推荐配置
tooltip: {
  visible: true,
  activeType: ['mark', 'dimension'],
  mark: {
    title: { value: (datum) => datum[用户的类目字段] },
    content: [
      {
        key: (datum) => datum[用户的系列字段] || '数值',
        value: (datum) => datum[用户的数值字段]
      }
    ]
  },
  dimension: {
    title: { value: (data) => data?.[0]?.datum?.[用户的类目字段] },
    content: [
      {
        key: (datum) => datum[用户的系列字段] || '数值',
        value: (datum) => datum[用户的数值字段]
      }
    ]
  }
}
```

---

## Step 5：Tooltip 样式自定义

```javascript
tooltip: {
  style: {
    panel: {
      backgroundColor: '#fff',
      border: { color: '#e8e8e8', width: 1, radius: 8 },
      shadow: { x: 0, y: 4, blur: 12, color: 'rgba(0,0,0,0.15)' },
      padding: { top: 12, bottom: 12, left: 16, right: 16 }
    },
    titleLabel: { fontSize: 14, fontWeight: 'bold', fill: '#333' },
    keyLabel: { fontSize: 12, fill: '#666' },
    valueLabel: { fontSize: 12, fill: '#333', fontWeight: 500 },
    shape: { size: 8, spacing: 6 }
  }
}
```

---

## Step 6：自定义渲染

### 6.1 HTML 模式 + handler

```javascript
tooltip: {
  renderMode: 'html',
  handler: {
    showTooltip: (activeType, data, params) => {
      const container = document.getElementById('custom-tooltip');
      // 自定义 DOM 渲染逻辑
      container.innerHTML = `<div class="my-tooltip">
        <h4>${data[0]?.datum?.category}</h4>
        <p>${data[0]?.datum?.value}</p>
      </div>`;
      container.style.display = 'block';
      container.style.left = params.event.x + 'px';
      container.style.top = params.event.y + 'px';
    },
    hideTooltip: () => {
      document.getElementById('custom-tooltip').style.display = 'none';
    }
  }
}
```

### 6.2 updateElement 回调

```javascript
tooltip: {
  renderMode: 'html',
  updateElement: (el, activeType, data) => {
    // 在默认渲染后修改 DOM 元素
    el.style.maxWidth = '300px';
    el.style.borderRadius = '12px';
  }
}
```

---

## 高频问题速查表

| 问题 | 原因 | 修复 |
|------|------|------|
| tooltip 完全不显示 | `visible: false` 或 `activeType` 不匹配 | 检查 Step 2 |
| dimension tooltip 标题是 undefined | title.value 回调参数是数组，不是单条数据 | `data?.[0]?.datum?.field` |
| mark tooltip 只显示一个系列 | content 未配置多系列映射 | 使用 `seriesField` 字段做 key |
| tooltip 闪烁 | 与图元重叠导致反复触发 | 设置 `enterable: true` 和 `hideDelay` |
| tooltip 被裁切 | 超出画布边界 | 设置 `confine: true` |
| 多图只显示一个 tooltip | 全局限制 | `VChart.globalConfig.uniqueTooltip = false`（详见 tooltip-crosshair-sync.md） |

---

## 输出

根据当前对话上下文选择输出格式：

- 用户配置不对 → 指出错误 + 给出修复代码片段
- 用户从零开始配置 → 给出完整 tooltip 配置 + 完整 spec
- 用户需要可运行 demo → 参考对应 workflow 的输出规范
