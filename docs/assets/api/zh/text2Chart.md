# text2Chart

## 接口描述：
text2Chart函数用于调用LLM完成数据提取，图表智能生成两个任务，返回生成的图表spec、图表二维数据表，图表类型和字段映射等。实现一步从普通文本生成图表的智能化过程。

## 支持模型：
- GPT模型
- 豆包模型
- DeepSeek模型
- [chart-advisor](../guide/Basic_Tutorial/Chart_Advisor)
- 其他任意模型

## 图表类型列表
VMind支持25种常见的图表类型：
```typescript
export enum ChartType {
  DynamicBarChart = 'Dynamic Bar Chart',
  BarChart = 'Bar Chart',
  LineChart = 'Line Chart',
  AreaChart = 'Area Chart',
  PieChart = 'Pie Chart',
  ScatterPlot = 'Scatter Plot',
  WordCloud = 'Word Cloud',
  RoseChart = 'Rose Chart',
  RadarChart = 'Radar Chart',
  SankeyChart = 'Sankey Chart',
  FunnelChart = 'Funnel Chart',
  DualAxisChart = 'Dual Axis Chart',
  WaterFallChart = 'Waterfall Chart',
  BoxPlot = 'Box Plot',
  LinearProgress = 'Linear Progress chart',
  CircularProgress = 'Circular Progress chart',
  LiquidChart = 'Liquid Chart',
  BubbleCirclePacking = 'Bubble Circle Packing',
  MapChart = 'Map Chart',
  RangeColumnChart = 'Range Column Chart',
  SunburstChart = 'Sunburst Chart',
  TreemapChart = 'Treemap Chart',
  Gauge = 'Gauge Chart',
  BasicHeatMap = 'Basic Heat Map',
  VennChart = 'Venn Chart'
}
```
可通过options参数中的chartTypeList限制生成的图表类型。

## 接口参数：

```typescript
interface GenerateChartParams {
  text: string,
  userPrompt: string;
  dataset?: Array<Record<string, any>>;
  options?: {
    fieldInfo?: FieldInfo[];
    chartTypeList?: ChartType[];
    colorPalette?: string[];
    animationDuration?: number;
    theme?: ChartTheme | string;
    enableDataQuery?: boolean;
  }
}
```

- text (string): 必选，原始文本内容
- userPrompt (string): 可选，用户的可视化意图（你想从文本中主要提取哪些数据，如何用图表进行展示）
- options: 可选，选项参数，包括以下内容：

  - fieldInfo (Array): 文本类型中包含的字段信息，包括字段名称，类型等;传递了fieldInfo的场景，VMind会只提取跟传入fieldInfo相关联的内容
  - chartTypeList (ChartType[]，可选): 支持的图表类型列表。若不为undefined，则会从该列表指定的图表类型中选择生成。
  - enableDataQuery (boolean, 可选): 决定是否在图表生成过程中开启数据聚合
  - colorPalette (Array<string>, 可选): 用于设置图表的调色板
  - animationDuration (number, 可选): 用于设置图表动画的播放持续时间
  - theme (ChartTheme | string, 可选): 设置最终sepc的主题样式，默认为空，VMind会默认使用带渐变颜色的主题样式，可以设置 VChart 通用深浅主题（'light' | 'dark')或者符合你使用场景下的主题样式

## 返回值类型：

```typescript
interface GenerateChartResult {
  /** 图表spec */
  spec: Record<string, any>;
  /** 提取出来的数据 */
  dataTable: DataTable;
  /** 字段信息 */
  fieldInfo: FieldInfo[];
  /** 图表类型*/
  chartType: ChartType;
  /** 最终的视觉通道映射  */
  cell: Cell;
  /** token 消耗量 */
  usage: Usage;
  /* 生成当前图表的具体指令，在user prompt的情况下跟user prompt一致 */
  command: string;
  /** 转唯gif/video时所用的配置时间 *//
  time: {
    totalTime : number;
    frameArr: number[];
  };
  /** 基于规则的图表推荐结果，在手动设置规则或者大模型生成有误情况下产生 */
  chartAdvistorRes: {
    /** 图表spec */
    spec: Record<string, any>;
    /** 图表类型*/
    chartType: ChartType;
    /** 推荐得分 */
    score: number
  }[]
}
```

- spec (Object): 生成的VChart图表spec。若dataset为空，则为不包含数据的spec模板
- dataTable (Record<string, string | number>[]): 从文本中提取到的二维表数据
- fieldInfo (FieldInfo): 在用户没有传入fieldInfo的情况下，从文本中提取到到字段信息，即二维表的表头信息
- chartType (ChartType): 生成的图表类型，参见`图表类型列表`章节
- cell (Record<string, string | string[]>): 图表中的字段映射，描述数据集中的字段如何映射到图表的各个视觉通道上
- usage (any): LLM token总消耗
- time (number): 图表动画的时长信息，可用于导出GIF和视频
- chartAdvistorRes(Array): 该结果是根据当前数据和字段信息，通过VMind的内置规则推导得到的图表推荐结果，在设置模型为`Model.CHART_ADVISOR`或者用户的大模型设置有误，无法获取结果时兜底产生。详见：[基于规则的图表生成](../guide/Basic_Tutorial/Chart_Advisor)

# 使用实例
[数据提取——从文本一步生成图表](../guide/Basic_Tutorial/Data_Extraction)