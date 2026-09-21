# 层级桑基图

## 适用场景

- 展示层级数据的流向
- 分析父子节点之间的流量分配
- 树形结构数据的可视化

## 数据结构

层级桑基图的数据通常采用树形结构（Tree），通过父子关系来表达流向。

- **nodes**: 根节点数组。
  - `name`: 节点名称。
  - `value`: 节点值（可选，如果不传则通过子节点累加）。
  - `children`: 子节点数组，表示流向下一级的节点。

构建方式：

1. 从根节点开始构建，每个节点可以包含多个子节点。
2. VChart 会自动根据父子关系生成连线，父节点为 `source`，子节点为 `target`。
3. 节点的 `value` 决定了流量大小。

## 基础配置

```javascript
const spec = {
  type: "sankey",
  data: [
    {
      name: "data",
      values: [
        {
          nodes: [
            {
              value: 100,
              name: "A",
              children: [
                {
                  name: "top",
                  value: 40,
                  children: [
                    { name: "00", value: 15 },
                    { name: "01", value: 10 },
                    { name: "02", value: 10 },
                  ],
                },
                {
                  name: "middle",
                  value: 30,
                  children: [
                    { name: "00", value: 10 },
                    { name: "01", value: 10 },
                    { name: "02", value: 10 },
                  ],
                },
                {
                  name: "bottom",
                  value: 30,
                },
              ],
            },
            {
              value: 80,
              name: "B",
              children: [
                {
                  name: "top",
                  value: 40,
                  children: [
                    { name: "00", value: 100 },
                    { name: "01", value: 40 },
                  ],
                },
                {
                  name: "middle",
                  value: 10,
                },
                {
                  name: "bottom",
                  value: 30,
                },
              ],
            },
            {
              value: 50,
              name: "C",
              children: [
                {
                  name: "top",
                  value: 20,
                },
                {
                  name: "middle",
                  value: 20,
                },
                {
                  name: "bottom",
                  value: 10,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  categoryField: "name",
  valueField: "value",

  nodeAlign: "left",
  nodeGap: 8,
  nodeWidth: 10,
  minNodeHeight: 4,
  nodeKey: (datum) => datum.name,

  label: {
    visible: true,
    state: {
      blur: {
        fill: "#e8e8e8",
        fillOpacity: 0.15,
      },
    },
  },

  node: {
    state: {
      hover: {
        fill: "red",
      },
      blur: {
        fill: "#e8e8e8",
        fillOpacity: 0.15,
      },
    },
  },

  link: {
    backgroundStyle: { fill: "#ccc", fillOpacity: 0.2 },
    fillOpacity: 0.8,
    state: {
      hover: {
        stroke: "#000000",
      },
      blur: {
        fill: "#e8e8e8",
      },
    },
  },

  emphasis: {
    enable: true,
    effect: "related",
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

## 常用可选配置

### 节点布局

```javascript
nodeAlign: 'left',   // 节点对齐方式
nodeGap: 8,          // 节点间距
nodeWidth: 10,       // 节点宽度
minNodeHeight: 4,    // 最小节点高度
nodeKey: datum => datum.name // 节点唯一标识
```

### 样式与交互

```javascript
emphasis: {
  enable: true,
  effect: 'related' // 高亮相关联的节点和连线
}
```

## 完整示例

```javascript
const spec = {
  type: "sankey",
  data: [
    {
      name: "data",
      values: [
        {
          nodes: [
            {
              value: 100,
              name: "A",
              children: [
                {
                  name: "top",
                  value: 40,
                  children: [
                    { name: "00", value: 15 },
                    { name: "01", value: 10 },
                    { name: "02", value: 10 },
                  ],
                },
                {
                  name: "middle",
                  value: 30,
                  children: [
                    { name: "00", value: 10 },
                    { name: "01", value: 10 },
                    { name: "02", value: 10 },
                  ],
                },
                {
                  name: "bottom",
                  value: 30,
                },
              ],
            },
            {
              value: 80,
              name: "B",
              children: [
                {
                  name: "top",
                  value: 40,
                  children: [
                    { name: "00", value: 100 },
                    { name: "01", value: 40 },
                  ],
                },
                {
                  name: "middle",
                  value: 10,
                },
                {
                  name: "bottom",
                  value: 30,
                },
              ],
            },
            {
              value: 50,
              name: "C",
              children: [
                {
                  name: "top",
                  value: 20,
                },
                {
                  name: "middle",
                  value: 20,
                },
                {
                  name: "bottom",
                  value: 10,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  categoryField: "name",
  valueField: "value",

  nodeAlign: "left",
  nodeGap: 8,
  nodeWidth: 10,
  minNodeHeight: 4,
  nodeKey: (datum) => datum.name,

  label: {
    visible: true,
    state: {
      blur: {
        fill: "#e8e8e8",
        fillOpacity: 0.15,
      },
    },
  },

  node: {
    state: {
      hover: {
        fill: "red",
      },
      blur: {
        fill: "#e8e8e8",
        fillOpacity: 0.15,
      },
    },
  },

  link: {
    backgroundStyle: { fill: "#ccc", fillOpacity: 0.2 },
    fillOpacity: 0.8,
    state: {
      hover: {
        stroke: "#000000",
      },
      blur: {
        fill: "#e8e8e8",
      },
    },
  },

  emphasis: {
    enable: true,
    effect: "related",
  },
};

const vchart = new VChart(spec, { dom: "container" });
// ⚠️ CDN/HTML 环境中须改为: new VChart.default(spec, { dom: 'container' })
vchart.renderSync();
```

## 相关文档

- [桑基图配置项](https://www.visactor.io/vchart/option/sankeyChart)
- [层级桑基图示例](https://www.visactor.com/vchart/demo/sankey-chart/hierarchical-sankey)
