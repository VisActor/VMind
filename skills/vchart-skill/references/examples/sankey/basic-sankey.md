# 基础桑基图

## 适用场景

- 展示数据的流向和流量大小
- 分析能量、材料或成本的转移过程
- 多级分类数据的分布与流转

## 数据结构

基础桑基图的数据结构通常包含两个主要部分：`nodes`（节点）和 `links`（连线）。

- **nodes**: 节点数组，每个元素代表一个节点。
  - `nodeName`: 节点的名称或唯一标识符。
- **links**: 连线数组，每个元素代表一条从源节点到目标节点的流。
  - `source`: 源节点的索引，在 `nodes` 数组中的下标。
  - `target`: 目标节点的索引，在 `nodes` 数组中的下标。
  - `value`: 流量的大小，决定连线的宽度。

构建方式：

1. 确定所有参与流转的节点，存入 `nodes` 数组。
2. 确定节点之间的流向关系和流量大小，存入 `links` 数组。

## 基础配置

```javascript
const spec = {
  type: "sankey",
  data: [
    {
      values: [
        {
          nodes: [
            { nodeName: "Agricultural 'waste'" },
            { nodeName: "Bio-conversion" },
            { nodeName: "Liquid" },
            { nodeName: "Losses" },
            { nodeName: "Solid" },
            { nodeName: "Gas" },
            { nodeName: "Biofuel imports" },
            { nodeName: "Biomass imports" },
            { nodeName: "Coal imports" },
            { nodeName: "Coal" },
            { nodeName: "Coal reserves" },
            { nodeName: "District heating" },
            { nodeName: "Industry" },
            { nodeName: "Heating and cooling - commercial" },
            { nodeName: "Heating and cooling - homes" },
            { nodeName: "Electricity grid" },
            { nodeName: "Over generation / exports" },
            { nodeName: "H2 conversion" },
            { nodeName: "Road transport" },
            { nodeName: "Agriculture" },
            { nodeName: "Rail transport" },
            { nodeName: "Lighting & appliances - commercial" },
            { nodeName: "Lighting & appliances - homes" },
            { nodeName: "Gas imports" },
            { nodeName: "Ngas" },
            { nodeName: "Gas reserves" },
            { nodeName: "Thermal generation" },
            { nodeName: "Geothermal" },
            { nodeName: "H2" },
            { nodeName: "Hydro" },
            { nodeName: "International shipping" },
            { nodeName: "Domestic aviation" },
            { nodeName: "International aviation" },
            { nodeName: "National navigation" },
            { nodeName: "Marine algae" },
            { nodeName: "Nuclear" },
            { nodeName: "Oil imports" },
            { nodeName: "Oil" },
            { nodeName: "Oil reserves" },
            { nodeName: "Other waste" },
            { nodeName: "Pumped heat" },
            { nodeName: "Solar PV" },
            { nodeName: "Solar Thermal" },
            { nodeName: "Solar" },
            { nodeName: "Tidal" },
            { nodeName: "UK land based bioenergy" },
            { nodeName: "Wave" },
            { nodeName: "Wind" },
          ],
          links: [
            { source: 0, target: 1, value: 124.729 },
            { source: 1, target: 2, value: 0.597 },
            { source: 1, target: 3, value: 26.862 },
            { source: 1, target: 4, value: 280.322 },
            { source: 1, target: 5, value: 81.144 },
            { source: 6, target: 2, value: 35 },
            { source: 7, target: 4, value: 35 },
            { source: 8, target: 9, value: 11.606 },
            { source: 10, target: 9, value: 63.965 },
            { source: 9, target: 4, value: 75.571 },
            { source: 11, target: 12, value: 10.639 },
            { source: 11, target: 13, value: 22.505 },
            { source: 11, target: 14, value: 46.184 },
            { source: 15, target: 16, value: 104.453 },
            { source: 15, target: 14, value: 113.726 },
            { source: 15, target: 17, value: 27.14 },
            { source: 15, target: 12, value: 342.165 },
            { source: 15, target: 18, value: 37.797 },
            { source: 15, target: 19, value: 4.412 },
            { source: 15, target: 13, value: 40.858 },
            { source: 15, target: 3, value: 56.691 },
            { source: 15, target: 20, value: 7.863 },
            { source: 15, target: 21, value: 90.008 },
            { source: 15, target: 22, value: 93.494 },
            { source: 23, target: 24, value: 40.719 },
            { source: 25, target: 24, value: 82.233 },
            { source: 5, target: 13, value: 0.129 },
            { source: 5, target: 3, value: 1.401 },
            { source: 5, target: 26, value: 151.891 },
            { source: 5, target: 19, value: 2.096 },
            { source: 5, target: 12, value: 48.58 },
            { source: 27, target: 15, value: 7.013 },
            { source: 17, target: 28, value: 20.897 },
            { source: 17, target: 3, value: 6.242 },
            { source: 28, target: 18, value: 20.897 },
            { source: 29, target: 15, value: 6.995 },
            { source: 2, target: 12, value: 121.066 },
            { source: 2, target: 30, value: 128.69 },
            { source: 2, target: 18, value: 135.835 },
            { source: 2, target: 31, value: 14.458 },
            { source: 2, target: 32, value: 206.267 },
            { source: 2, target: 19, value: 3.64 },
            { source: 2, target: 33, value: 33.218 },
            { source: 2, target: 20, value: 4.413 },
            { source: 34, target: 1, value: 4.375 },
            { source: 24, target: 5, value: 122.952 },
            { source: 35, target: 26, value: 839.978 },
            { source: 36, target: 37, value: 504.287 },
            { source: 38, target: 37, value: 107.703 },
            { source: 37, target: 2, value: 611.99 },
            { source: 39, target: 4, value: 56.587 },
            { source: 39, target: 1, value: 77.81 },
            { source: 40, target: 14, value: 193.026 },
            { source: 40, target: 13, value: 70.672 },
            { source: 41, target: 15, value: 59.901 },
            { source: 42, target: 14, value: 19.263 },
            { source: 43, target: 42, value: 19.263 },
            { source: 43, target: 41, value: 59.901 },
            { source: 4, target: 19, value: 0.882 },
            { source: 4, target: 26, value: 400.12 },
            { source: 4, target: 12, value: 46.477 },
            { source: 26, target: 15, value: 525.531 },
            { source: 26, target: 3, value: 787.129 },
            { source: 26, target: 11, value: 79.329 },
            { source: 44, target: 15, value: 9.452 },
            { source: 45, target: 1, value: 182.01 },
            { source: 46, target: 15, value: 19.013 },
            { source: 47, target: 15, value: 289.366 },
          ],
        },
      ],
    },
  ],
  categoryField: "nodeName",
  valueField: "value",
  sourceField: "source",
  targetField: "target",

  nodeAlign: "justify",
  nodeGap: 8,
  nodeWidth: 10,
  minNodeHeight: 4,

  title: {
    text: "How energy is converted or transmitted before being consumed or lost",
    subtext: "Data: Department of Energy & Climate Change via Tom Counsell",
    subtextStyle: {
      fontSize: 12,
    },
  },

  label: {
    visible: true,
    style: {
      fontSize: 10,
    },
  },

  node: {
    state: {
      hover: {
        stroke: "#333333",
      },
      selected: {
        fill: "#dddddd",
        stroke: "#333333",
        lineWidth: 1,
        brighter: 1,
        fillOpacity: 1,
      },
    },
  },

  link: {
    state: {
      hover: {
        fillOpacity: 1,
      },
      selected: {
        fill: "#dddddd",
        stroke: "#333333",
        lineWidth: 1,
        brighter: 1,
        fillOpacity: 1,
      },
    },
  },
};

const vchart = new VChart(spec, { dom: "container" });
// ⚠️ CDN/HTML 环境中须改为: new VChart.default(spec, { dom: 'container' })
vchart.renderSync();
```

## 必填配置项

| 配置项          | 类型       | 说明         |
| --------------- | ---------- | ------------ |
| `type`          | `'sankey'` | 图表类型     |
| `data`          | `Array`    | 数据配置     |
| `categoryField` | `string`   | 节点名称字段 |
| `valueField`    | `string`   | 数值字段     |
| `sourceField`   | `string`   | 连线起点字段 |
| `targetField`   | `string`   | 连线终点字段 |

## 常用可选配置

### 节点布局

```javascript
nodeAlign: 'justify', // 节点对齐方式
nodeGap: 8,           // 节点间距
nodeWidth: 10,        // 节点宽度
minNodeHeight: 4      // 最小节点高度
```

### 样式设置

```javascript
node: {
  state: {
    hover: {
      stroke: '#333333'
    },
    selected: {
      fill: '#dddddd',
      stroke: '#333333',
      lineWidth: 1,
      brighter: 1,
      fillOpacity: 1
    }
  }
},
link: {
  state: {
    hover: {
      fillOpacity: 1
    },
    selected: {
      fill: '#dddddd',
      stroke: '#333333',
      lineWidth: 1,
      brighter: 1,
      fillOpacity: 1
    }
  }
}
```

## 完整示例

```javascript
const spec = {
  type: "sankey",
  data: [
    {
      values: [
        {
          nodes: [
            { nodeName: "Agricultural 'waste'" },
            { nodeName: "Bio-conversion" },
            { nodeName: "Liquid" },
            { nodeName: "Losses" },
            { nodeName: "Solid" },
            { nodeName: "Gas" },
            { nodeName: "Biofuel imports" },
            { nodeName: "Biomass imports" },
            { nodeName: "Coal imports" },
            { nodeName: "Coal" },
            { nodeName: "Coal reserves" },
            { nodeName: "District heating" },
            { nodeName: "Industry" },
            { nodeName: "Heating and cooling - commercial" },
            { nodeName: "Heating and cooling - homes" },
            { nodeName: "Electricity grid" },
            { nodeName: "Over generation / exports" },
            { nodeName: "H2 conversion" },
            { nodeName: "Road transport" },
            { nodeName: "Agriculture" },
            { nodeName: "Rail transport" },
            { nodeName: "Lighting & appliances - commercial" },
            { nodeName: "Lighting & appliances - homes" },
            { nodeName: "Gas imports" },
            { nodeName: "Ngas" },
            { nodeName: "Gas reserves" },
            { nodeName: "Thermal generation" },
            { nodeName: "Geothermal" },
            { nodeName: "H2" },
            { nodeName: "Hydro" },
            { nodeName: "International shipping" },
            { nodeName: "Domestic aviation" },
            { nodeName: "International aviation" },
            { nodeName: "National navigation" },
            { nodeName: "Marine algae" },
            { nodeName: "Nuclear" },
            { nodeName: "Oil imports" },
            { nodeName: "Oil" },
            { nodeName: "Oil reserves" },
            { nodeName: "Other waste" },
            { nodeName: "Pumped heat" },
            { nodeName: "Solar PV" },
            { nodeName: "Solar Thermal" },
            { nodeName: "Solar" },
            { nodeName: "Tidal" },
            { nodeName: "UK land based bioenergy" },
            { nodeName: "Wave" },
            { nodeName: "Wind" },
          ],
          links: [
            { source: 0, target: 1, value: 124.729 },
            { source: 1, target: 2, value: 0.597 },
            { source: 1, target: 3, value: 26.862 },
            { source: 1, target: 4, value: 280.322 },
            { source: 1, target: 5, value: 81.144 },
            { source: 6, target: 2, value: 35 },
            { source: 7, target: 4, value: 35 },
            { source: 8, target: 9, value: 11.606 },
            { source: 10, target: 9, value: 63.965 },
            { source: 9, target: 4, value: 75.571 },
            { source: 11, target: 12, value: 10.639 },
            { source: 11, target: 13, value: 22.505 },
            { source: 11, target: 14, value: 46.184 },
            { source: 15, target: 16, value: 104.453 },
            { source: 15, target: 14, value: 113.726 },
            { source: 15, target: 17, value: 27.14 },
            { source: 15, target: 12, value: 342.165 },
            { source: 15, target: 18, value: 37.797 },
            { source: 15, target: 19, value: 4.412 },
            { source: 15, target: 13, value: 40.858 },
            { source: 15, target: 3, value: 56.691 },
            { source: 15, target: 20, value: 7.863 },
            { source: 15, target: 21, value: 90.008 },
            { source: 15, target: 22, value: 93.494 },
            { source: 23, target: 24, value: 40.719 },
            { source: 25, target: 24, value: 82.233 },
            { source: 5, target: 13, value: 0.129 },
            { source: 5, target: 3, value: 1.401 },
            { source: 5, target: 26, value: 151.891 },
            { source: 5, target: 19, value: 2.096 },
            { source: 5, target: 12, value: 48.58 },
            { source: 27, target: 15, value: 7.013 },
            { source: 17, target: 28, value: 20.897 },
            { source: 17, target: 3, value: 6.242 },
            { source: 28, target: 18, value: 20.897 },
            { source: 29, target: 15, value: 6.995 },
            { source: 2, target: 12, value: 121.066 },
            { source: 2, target: 30, value: 128.69 },
            { source: 2, target: 18, value: 135.835 },
            { source: 2, target: 31, value: 14.458 },
            { source: 2, target: 32, value: 206.267 },
            { source: 2, target: 19, value: 3.64 },
            { source: 2, target: 33, value: 33.218 },
            { source: 2, target: 20, value: 4.413 },
            { source: 34, target: 1, value: 4.375 },
            { source: 24, target: 5, value: 122.952 },
            { source: 35, target: 26, value: 839.978 },
            { source: 36, target: 37, value: 504.287 },
            { source: 38, target: 37, value: 107.703 },
            { source: 37, target: 2, value: 611.99 },
            { source: 39, target: 4, value: 56.587 },
            { source: 39, target: 1, value: 77.81 },
            { source: 40, target: 14, value: 193.026 },
            { source: 40, target: 13, value: 70.672 },
            { source: 41, target: 15, value: 59.901 },
            { source: 42, target: 14, value: 19.263 },
            { source: 43, target: 42, value: 19.263 },
            { source: 43, target: 41, value: 59.901 },
            { source: 4, target: 19, value: 0.882 },
            { source: 4, target: 26, value: 400.12 },
            { source: 4, target: 12, value: 46.477 },
            { source: 26, target: 15, value: 525.531 },
            { source: 26, target: 3, value: 787.129 },
            { source: 26, target: 11, value: 79.329 },
            { source: 44, target: 15, value: 9.452 },
            { source: 45, target: 1, value: 182.01 },
            { source: 46, target: 15, value: 19.013 },
            { source: 47, target: 15, value: 289.366 },
          ],
        },
      ],
    },
  ],
  categoryField: "nodeName",
  valueField: "value",
  sourceField: "source",
  targetField: "target",

  nodeAlign: "justify",
  nodeGap: 8,
  nodeWidth: 10,
  minNodeHeight: 4,

  title: {
    text: "How energy is converted or transmitted before being consumed or lost",
    subtext: "Data: Department of Energy & Climate Change via Tom Counsell",
    subtextStyle: {
      fontSize: 12,
    },
  },

  label: {
    visible: true,
    style: {
      fontSize: 10,
    },
  },

  node: {
    state: {
      hover: {
        stroke: "#333333",
      },
      selected: {
        fill: "#dddddd",
        stroke: "#333333",
        lineWidth: 1,
        brighter: 1,
        fillOpacity: 1,
      },
    },
  },

  link: {
    state: {
      hover: {
        fillOpacity: 1,
      },
      selected: {
        fill: "#dddddd",
        stroke: "#333333",
        lineWidth: 1,
        brighter: 1,
        fillOpacity: 1,
      },
    },
  },
};

const vchart = new VChart(spec, { dom: "container" });
// ⚠️ CDN/HTML 环境中须改为: new VChart.default(spec, { dom: 'container' })
vchart.renderSync();
```

## 相关文档

- [桑基图配置项](https://www.visactor.io/vchart/option/sankeyChart)
- [基础桑基图示例](https://www.visactor.com/vchart/demo/sankey-chart/basic-sankey)
