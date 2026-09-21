# 基础仪表盘

## 适用场景
- 展示单一指标的完成进度
- KPI 达成率展示
- 性能指标监控

## 基础配置

```javascript
const spec = {
  type: 'gauge',
  data: [
    {
      id: 'gaugeData',
      values: [
        { value: 75 }
      ]
    }
  ],
  valueField: 'value',
  startAngle: -180,
  endAngle: 0
};

const vchart = new VChart(spec, { dom: 'container' });
// ⚠️ CDN/HTML 环境中须改为: new VChart.default(spec, { dom: 'container' })
vchart.renderSync();
```

## 必填配置项

| 配置项 | 类型 | 说明 |
|-------|------|------|
| `type` | `'gauge'` | 图表类型 |
| `data` | `Array` | 数据配置 |
| `valueField` | `string` | 数值字段 |

## 常用可选配置

### 角度范围
```javascript
startAngle: -180,    // 起始角度
endAngle: 0,         // 结束角度
// 常用配置：
// 半圆：startAngle: -180, endAngle: 0
// 3/4圆：startAngle: -225, endAngle: 45
// 全圆：startAngle: -270, endAngle: 90
```

### 半径配置
```javascript
outerRadius: 0.8,    // 外半径
innerRadius: 0.6,    // 内半径
```

### 轨道样式
```javascript
track: {
  style: {
    fill: '#f0f0f0'
  }
}
```

### 指针样式
```javascript
pointer: {
  visible: true,
  width: 0.5,
  height: 0.5,
  style: {
    fill: '#1890ff'
  }
}
```

### 刻度配置
```javascript
axes: [
  {
    type: 'linear',
    orient: 'angle',
    min: 0,
    max: 100,
    tick: {
      visible: true,
      tickCount: 5
    },
    label: {
      visible: true,
      formatMethod: (val) => `${val}%`
    }
  }
]
```

## ⚠️ gauge 背景系列配置（关键）

> **必须包含 `type` 字段！** `gauge` 属性用于配置表盘背景，它是一个联合类型 `IGaugeSeriesSpec | ICircularProgressSeriesSpec`，必须通过 `type` 字段指定使用哪种系列。

### gauge 背景系列类型选择

| type 值 | 系列类型 | 说明 | 适用场景 |
|---------|---------|------|---------|
| `'gauge'` | 仪表盘系列 | 扇形分段背景，支持渐变色、cornerRadius | 仪表盘、速度表、分段色带 |
| `'circularProgress'` | 环形进度条系列 | 单一进度弧线 | 简洁进度环、加载指示器 |

### ⚠️ 缺少 type 导致的报错

如果 `gauge` 属性中**不写 `type` 字段**，会报以下错误：

```
Uncaught TypeError: Cannot read properties of undefined (reading 'transformerConstructor')
```

**原因**：VChart 内部需要根据 `type` 字段查找对应的系列转换器（SeriesSpecTransformer）。当 `type` 缺失时，VChart 无法确定使用 gauge 系列还是 circularProgress 系列，导致查找到 `undefined` 的 transformer。

**错误示例**：

```javascript
// ❌ 错误：gauge 属性中缺少 type 字段
gauge: {
  style: {
    fill: {
      gradient: 'conical',
      stops: [
        { offset: 0, color: '#52c41a' },
        { offset: 0.5, color: '#faad14' },
        { offset: 1, color: '#f5222d' }
      ]
    },
    cornerRadius: 10
  }
}
// 报错: Cannot read properties of undefined (reading 'transformerConstructor')
```

**正确示例**：

```javascript
// ✅ 正确：必须添加 type: 'gauge'
gauge: {
  type: 'gauge',               // ← 必须指定！
  style: {
    fill: {
      gradient: 'conical',
      stops: [
        { offset: 0, color: '#52c41a' },
        { offset: 0.5, color: '#faad14' },
        { offset: 1, color: '#f5222d' }
      ]
    },
    cornerRadius: 10
  }
}
```

## 环形进度条 (circularProgress)

更简洁的进度展示：

```javascript
const spec = {
  type: 'circularProgress',
  data: [
    {
      id: 'progressData',
      values: [
        { type: '完成', value: 0.75 }
      ]
    }
  ],
  valueField: 'value',
  categoryField: 'type',
  outerRadius: 0.9,
  innerRadius: 0.7,
  cornerRadius: 10,
  progress: {
    style: {
      fill: '#1890ff'
    }
  },
  track: {
    style: {
      fill: '#f0f0f0'
    }
  }
};
```

## 完整示例

```javascript
const spec = {
  type: 'gauge',
  data: [
    {
      id: 'gaugeData',
      values: [
        { value: 78 }
      ]
    }
  ],
  valueField: 'value',
  startAngle: -225,
  endAngle: 45,
  outerRadius: 0.85,
  innerRadius: 0.65,
  // 轨道
  track: {
    style: {
      fill: '#f0f0f0'
    }
  },
  // 进度弧 - ⚠️ 注意必须包含 type 字段
  gauge: {
    type: 'gauge',           // ← 必须！
    style: {
      fill: {
        gradient: 'conical',
        startAngle: -225,
        endAngle: 45,
        stops: [
          { offset: 0, color: '#52c41a' },
          { offset: 0.5, color: '#faad14' },
          { offset: 1, color: '#f5222d' }
        ]
      },
      cornerRadius: 10
    }
  },
  // 指针
  pointer: {
    visible: true,
    width: 0.4,
    height: 0.6,
    style: {
      fill: '#333'
    }
  },
  // 中心文字
  indicator: {
    visible: true,
    offsetY: '30%',
    title: {
      visible: true,
      autoLimit: true,
      style: {
        text: '完成率',
        fontSize: 14,
        fill: '#666'
      }
    },
    content: {
      visible: true,
      style: {
        text: (datum) => `${datum.value}%`,
        fontSize: 36,
        fontWeight: 'bold',
        fill: '#333'
      }
    }
  },
  // 坐标轴（刻度）
  axes: [
    {
      type: 'linear',
      orient: 'angle',
      min: 0,
      max: 100,
      inside: true,
      outerRadius: 0.88,
      innerRadius: 0.85,
      grid: { visible: false },
      tick: {
        visible: true,
        tickCount: 5,
        style: {
          stroke: '#999',
          lineWidth: 2
        }
      },
      subTick: {
        visible: true,
        tickCount: 4,
        style: {
          stroke: '#ccc',
          lineWidth: 1
        }
      },
      label: {
        visible: true,
        space: 10,
        style: {
          fill: '#666',
          fontSize: 12
        }
      }
    }
  ],
  title: {
    visible: true,
    text: 'KPI 完成进度'
  }
};

const vchart = new VChart(spec, { dom: 'container' });
// ⚠️ CDN/HTML 环境中须改为: new VChart.default(spec, { dom: 'container' })
vchart.renderSync();
```

## 多指标仪表盘

```javascript
const spec = {
  type: 'common',
  layout: {
    type: 'grid',
    col: 3
  },
  region: [
    { id: 'gauge1' },
    { id: 'gauge2' },
    { id: 'gauge3' }
  ],
  series: [
    {
      type: 'gauge',
      regionId: 'gauge1',
      // ...配置
    },
    {
      type: 'gauge',
      regionId: 'gauge2',
      // ...配置
    },
    {
      type: 'gauge',
      regionId: 'gauge3',
      // ...配置
    }
  ]
};
```

## 相关文档
- [仪表盘配置项](https://www.visactor.io/vchart/option/gaugeChart)
- [仪表盘示例](https://www.visactor.io/vchart/example/gauge-chart/basic-gauge)
