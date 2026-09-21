# Tooltip 配置

## 基础配置

```javascript
tooltip: {
  visible: true,
  trigger: 'hover',   // 触发事件：'hover' | 'click' | 'none' | string[]
  activeType: 'mark'  // 内容类型：'mark' | 'dimension' | 'group'
}
```

## 触发方式 (trigger)

| 值 | 说明 | 适用场景 |
|---|------|---------|
| `'hover'` | 悬停触发 tooltip | 默认交互 |
| `'click'` | 点击触发 tooltip | 移动端/点选场景 |
| `'none'` | 不自动触发 tooltip | 配合 API 手动控制 |
| `string[]` | 自定义事件名数组 | 高级事件编排 |

```javascript
// 默认：hover 触发
tooltip: {
  trigger: 'hover'
}

// click 触发
tooltip: {
  trigger: 'click'
}

// 不自动触发（手动控制）
tooltip: {
  trigger: 'none'
}
```

> `trigger` 负责“何时触发”；`activeType` 负责“展示 mark / dimension / group 哪种 tooltip 内容”。

## 内容配置

### mark 类型内容

```javascript
tooltip: {
  mark: {
    // 标题
    title: {
      visible: true,
      value: (datum) => datum.category
    },

    // 内容
    content: [
      {
        key: '数值',                    // 左侧标签
        value: (datum) => datum.value   // 右侧数值
      },
      {
        key: '占比',
        value: (datum) => `${(datum.ratio * 100).toFixed(1)}%`
      }
    ]
  }
}
```

### dimension 类型内容（按维度聚合）

```javascript
tooltip: {
  trigger: 'hover',
  activeType: 'dimension',
  dimension: {
    title: {
      value: (datum) => datum[0]?.category
    },
    content: [
      {
        key: (datum) => datum.type,
        value: (datum) => datum.value
      }
    ]
  }
}
```

## Tooltip Formatter（模板字符串格式化）

> **v1.10.0+** 支持。Tooltip 中使用 formatter 模板字符串时，**必须使用 `keyFormatter` 和 `valueFormatter` 专用字段**，不能将模板字符串写在 `key` 或 `value` 中。

### ⚠️ 关键规则：keyFormatter / valueFormatter

| 字段 | 类型 | 说明 |
|------|------|------|
| `key` | `string \| (datum) => string` | 内容行左侧键名，接受静态字符串或回调函数 |
| `keyFormatter` | `string` | key 的 **formatter 模板字符串**，使用 d3-format/d3-time-format 语法 |
| `value` | `string \| (datum) => string` | 内容行右侧数值，接受静态字符串或回调函数 |
| `valueFormatter` | `string` | value 的 **formatter 模板字符串**，使用 d3-format/d3-time-format 语法 |

### formatter 模板用法

```javascript
// ✅ 正确用法：千分位格式化
tooltip: {
  dimension: {
    content: [
      {
        hasShape: true,
        valueFormatter: '{value:,.0f}'      // 使用 valueFormatter 字段
      }
    ]
  }
}

// ✅ 正确用法：百分比格式化
tooltip: {
  mark: {
    content: [
      {
        key: '完成率',
        valueFormatter: '{value:.1%}'       // 值 x100 并显示百分号
      }
    ]
  }
}

// ✅ 正确用法：时间格式化
tooltip: {
  dimension: {
    title: {
      valueFormatter: '{value:%Y-%m-%d}'    // 日期格式化
    },
    content: [
      {
        hasShape: true,
        valueFormatter: '{value:,.2f}'      // 千分位+两位小数
      }
    ]
  }
}
```

### ❌ 常见错误

```javascript
// ❌ 错误：不能在 value 字段中写 formatter 模板
tooltip: {
  mark: {
    content: [
      {
        key: '数值',
        value: '{value:,.0f}'    // ❌ 这会被当作普通字符串显示
      }
    ]
  }
}

// ✅ 正确：使用 valueFormatter 字段
tooltip: {
  mark: {
    content: [
      {
        key: '数值',
        valueFormatter: '{value:,.0f}'    // ✅ 正确格式化
      }
    ]
  }
}
```

## 内容格式化（函数方式）

### 基础格式化

```javascript
tooltip: {
  mark: {
    content: [
      {
        key: '销售额',
        value: (datum) => {
          // 数值格式化
          return datum.value.toLocaleString() + ' 元';
        }
      }
    ]
  }
}
```

### 条件显示

```javascript
tooltip: {
  mark: {
    content: [
      {
        key: '状态',
        value: (datum) => datum.value > 100 ? '达标' : '未达标',
        visible: (datum) => datum.value !== null  // 条件显示
      }
    ]
  }
}
```

### 自定义形状颜色

```javascript
tooltip: {
  mark: {
    content: [
      {
        key: '系列A',
        value: (datum) => datum.value,
        shapeType: 'circle',
        shapeColor: '#1890ff'
      }
    ]
  }
}
```

## 样式配置

```javascript
tooltip: {
  style: {
    // 面板样式
    panel: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: {
        color: '#333',
        width: 1,
        radius: 4
      },
      shadow: {
        x: 0,
        y: 2,
        blur: 10,
        color: 'rgba(0, 0, 0, 0.2)'
      },
      padding: {
        top: 10,
        bottom: 10,
        left: 14,
        right: 14
      }
    },

    // 标题样式
    titleLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      fill: '#fff'
    },

    // 内容键样式
    keyLabel: {
      fontSize: 12,
      fill: '#aaa'
    },

    // 内容值样式
    valueLabel: {
      fontSize: 12,
      fill: '#fff'
    },

    // 形状样式
    shape: {
      size: 8,
      spacing: 6
    }
  }
}
```

## 位置配置

```javascript
tooltip: {
  // 偏移
  offset: { x: 10, y: 10 },

  // dimension tooltip 可通过回调自定义位置
  dimension: {
    position: (event, params) => {
      return {
        x: event.canvasX + 20,
        y: event.canvasY + 20
      };
    }
  },

  // mark tooltip 也支持单独配置
  mark: {
    position: (event, params) => {
      return {
        x: event.canvasX + 12,
        y: event.canvasY + 12
      };
    }
  },

  // 限制在图表区域内
  confine: true
}
```

## 交互配置

```javascript
tooltip: {
  // 进入延迟
  enterable: true,        // 鼠标可进入tooltip

  // 显示延迟
  showDelay: 50,

  // 隐藏延迟
  hideTimer: 100,

  // 显示触发与关闭触发可分离
  trigger: 'hover',
  triggerOff: 'hover',

  // 过渡动画
  transitionDuration: 100
}
```

## 自定义渲染

### 使用 renderMode

```javascript
tooltip: {
  renderMode: 'html',      // 'canvas' | 'html'

  // HTML模式可以完全自定义
  handler: {
    showTooltip: (activeType, data, params) => {
      // 自定义显示逻辑
      const container = document.getElementById('custom-tooltip');
      container.innerHTML = `<div>${data[0].datum.value}</div>`;
      container.style.display = 'block';
    },
    hideTooltip: () => {
      document.getElementById('custom-tooltip').style.display = 'none';
    }
  }
}
```

### DOM 自定义

```javascript
tooltip: {
  mark: {
    content: [
      {
        // 使用DOM配置
        hasShape: true,
        key: (datum) => datum.type,
        value: (datum) => {
          return {
            type: 'rich',
            text: [
              { text: datum.value, fill: '#333', fontWeight: 'bold' },
              { text: ' 元', fill: '#999' }
            ]
          };
        }
      }
    ]
  }
}
```

## 禁用 Tooltip

```javascript
// 完全禁用
tooltip: {
  visible: false
}

// 或在特定系列禁用
series: [
  {
    type: 'bar',
    tooltip: {
      visible: false
    }
  }
]
```

## 完整示例

```javascript
tooltip: {
  visible: true,
  trigger: 'hover',
  activeType: 'dimension',

  dimension: {
    title: {
      value: (datum) => datum[0]?.month || ''
    },
    content: [
      {
        key: (datum) => datum.type,
        value: (datum) => `${datum.value.toLocaleString()} 万元`,
        shapeType: 'square'
      }
    ]
  },

  style: {
    panel: {
      backgroundColor: '#fff',
      border: {
        color: '#e8e8e8',
        width: 1,
        radius: 8
      },
      shadow: {
        x: 0,
        y: 4,
        blur: 12,
        color: 'rgba(0, 0, 0, 0.15)'
      },
      padding: { top: 12, bottom: 12, left: 16, right: 16 }
    },
    titleLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      fill: '#333'
    },
    keyLabel: {
      fontSize: 12,
      fill: '#666'
    },
    valueLabel: {
      fontSize: 12,
      fill: '#333',
      fontWeight: 500
    }
  },

  enterable: false,
  offset: { x: 8, y: 8 },
  confine: true,
  hideTimer: 120,
  transitionDuration: 150
}
```
