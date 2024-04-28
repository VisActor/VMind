
# generateChart

## 接口描述：
generateChart函数用于调用LLM完成图表智能生成，返回生成的图表spec、图表类型和字段映射等。
若传入的dataset为undefined，则会生成一个spec模板，后续可调用fillSpecWithData向spec中填入数据。

## 支持模型：
- GPT-3.5
- GPT-4
- [skylark2-pro](https://www.volcengine.com/product/yunque)
- [chart-advisor](../guide/Basic_Tutorial/Chart_Advisor)

## 图表类型列表
VMind支持13种常见的图表类型：
```typescript
export enum ChartType {
  DynamicBarChart = 'Dynamic Bar Chart',
  BarChart = 'Bar Chart',
  LineChart = 'Line Chart',
  PieChart = 'Pie Chart',
  ScatterPlot = 'Scatter Plot',
  WordCloud = 'Word Cloud',
  RoseChart = 'Rose Chart',
  RadarChart = 'Radar Chart',
  SankeyChart = 'Sankey Chart',
  FunnelChart = 'Funnel Chart',
  DualAxisChart = 'Dual Axis Chart',
  WaterFallChart = 'Waterfall Chart',
  BoxPlot = 'Box Plot'
}
```
可通过options参数中的chartTypeList限制生成的图表类型。

## 接口参数：

```typescript
interface GenerateChartParams {
  userPrompt: string;
  fieldInfo: Array<{
    fieldName: string;
    type: string;
    role: string;
  }>;
  dataset?: Array<Record<string, any>>;
  options?: {
    chartTypeList?: ChartType[];
    colorPalette?: string[];
    animationDuration?: number;
    enableDataQuery?: boolean;
  }
}
```

- userPrompt (string): 用户的可视化意图（你想用图表展示什么信息）
- fieldInfo (Array): 数据集中字段的信息，包括字段名称，类型等
- dataset (Array): 图表中使用的原始数据集，可以是undefined。若dataset为undefined，则会生成一个spec模板，后续可以调用fillSpecTemplateWithData将数据填充到spec模板。
- options: 可选，选项参数，包括以下内容：

  - chartTypeList (ChartType[]，可选): 支持的图表类型列表。若不为undefined，则会从该列表指定的图表类型中选择生成。
  - enableDataQuery (boolean, 可选): 决定是否在图表生成过程中开启数据聚合
  - colorPalette (Array<string>, 可选): 用于设置图表的调色板
  - animationDuration (number, 可选): 用于设置图表动画的播放持续时间

## 返回值类型：

```typescript
interface GenerateChartResult {
  spec: Record<string, any>;
  chartType: Record<string, string | string[]>;
  cell: Cell;
  chartSource: string;
  usage: any;
  time: {
    totalTime : number;
    frameArr: number[];
  };
}
```

- spec (Object): 生成的VChart图表spec。若dataset为空，则为不包含数据的spec模板
- chartType (ChartType): 生成的图表类型，参见`图表类型列表`章节
- cell (Record<string, string | string[]>): 图表中的字段映射，描述数据集中的字段如何映射到图表的各个视觉通道上
- chartSource: string: 图表生成来源。若成功使用LLM生成图表，则为具体的模型名；若最终使用[基于规则的图表生成](../guide/Basic_Tutorial/Chart_Advisor)，则为chart-advisor
- usage (any): LLM token总消耗
- time (number): 图表动画的时长信息，可用于导出GIF和视频

## 使用示例：

```typescript
import VMind from '@visactor/vmind';

const vmind = new VMind(options)
const dataset=[
    {
        "商品名称": "Coke",
        "region": "south",
        "销售额": 2350
    },
    {
        "商品名称": "Coke",
        "region": "east",
        "销售额": 1027
    },
    {
        "商品名称": "Coke",
        "region": "west",
        "销售额": 1027
    },
    {
        "商品名称": "Coke",
        "region": "north",
        "销售额": 1027
    }
]
const userPrompt = '展示不同地区商品销售额';
const fieldInfo=vmind.getFieldInfo(dataset)

const { spec } = await vmind.generateChart(userPrompt, fieldInfo, dataset);
```

### 使用自定义色板生成图表
```typescript
//设置自定义色板
const colorPalette = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

const { spec } = await vmind.generateChart(userPrompt, fieldInfo, dataset, {colorPalette});
```

VMind还内置了[Arco-design](https://www.visactor.io/vchart/theme/demo/arco)，[Semi-design](https://www.visactor.io/vchart/theme/demo/semi)，[源力设计](https://www.visactor.io/vchart/theme/demo/arco)等多套主题色板，可直接导入使用：
```typescript
import VMind, {ArcoTheme} from '@visactor/vmind';

//使用Arco-design色板
const {spec} = await vmind.generateChart(describe, finalFieldInfo, finalDataset, {
  colorPalette: ArcoTheme.colorScheme
});
```
内置色板列表：
- `SemiTheme`: Semi design主题色板
- `ArcoTheme`: Arco design主题色板
- `VeOTheme`: 源力设计主题色板
- `VeOThemeFinance`: 源力设计金融行业主题色板
- `VeOThemeGovernment`: 源力设计政务行业主题色板
- `VeOThemeConsumer`: 源力设计消费行业主题色板
- `VeOThemeAutomobile`: 源力设计汽车行业主题色板
- `VeOThemeCulturalTourism`: 源力设计文旅行业主题色板
- `VeOThemeMedical`: 源力设计医药行业主题色板
- `VeOThemeNewEnergy`: 源力设计新能源行业主题色板


### 限制生成的图表类型
```typescript
import VMind, {ChartType} from '@visactor/vmind';

//限制生成以下几种图表类型：柱状图，折线图，散点图，饼图，词云
const chartTypeList = [
  ChartType.BarChart,
  ChartType.LineChart,
  ChartType.ScatterPlot,
  ChartType.PieChart,
  ChartType.WordCloud
  ]

const { spec } = await vmind.generateChart(userPrompt, fieldInfo, dataset, {chartTypeList});
```

### 生成不含dataset的spec模板
某些情况下我们可能在仅有数据字段，没有具体的数据集的情况下生成图表（例如在查询前根据数据集中的字段生成一个图表，再根据生成的图表类型、图表中的字段完成相关查询），此时可在调用generateChart方法时不传入dataset，生成spec模板，随后再调用fillSpecWithData方法，获得最终的spec用于图表渲染：

```typescript
import VMind from '@visactor/vmind';

const vmind = new VMind(options)

const userPrompt = '展示不同地区商品销售额';
const fieldInfo=[
    {
        "fieldName": "商品名称",
        "type": "string",
        "role": "dimension",
        "domain": [
            "可乐",
            "雪碧",
            "芬达",
            "醒目"
        ]
    },
    {
        "fieldName": "region",
        "type": "string",
        "role": "dimension",
        "domain": [
            "south",
            "east",
            "west",
            "north"
        ]
    },
    {
        "fieldName": "销售额",
        "type": "int",
        "role": "measure",
        "domain": [
            28,
            2350
        ]
    }
]
//不传入dataset，生成spec模板
const { spec } = await vmind.generateChart(userPrompt, fieldInfo);

//向模板中填入数据
const dataset=[
    {
        "商品名称": "Coke",
        "region": "south",
        "销售额": 2350
    },
    {
        "商品名称": "Coke",
        "region": "east",
        "销售额": 1027
    },
    {
        "商品名称": "Coke",
        "region": "west",
        "销售额": 1027
    },
    {
        "商品名称": "Coke",
        "region": "north",
        "销售额": 1027
    }
]

const spec = vmind.fillSpecWithData(spec, dataset)
```

## 注意事项：

- generateChart方法会将userPrompt和fieldInfo传递给大语言模型用于生成图表，但是dataset中的详细数据并不会被传递。
- 在生成图表的过程中，VMind首先会利用大语言模型，根据userPrompt和fieldInfo，推荐一个适合的图表类型。然后，它会将fieldInfo中的字段映射到图表的x轴、y轴、颜色、尺寸等视觉通道上。
- VMind默认会为生成的图表添加入场动画，因此它还会返回图表动画的时长time。如果你想关闭图表动画，可以将spec.animation设为false。
- 当设定模型类型为chart-advisor时，将不需调用大型语言模型生成图表，产生的结果将包括多种图表，详情可参见[基于规则的图表生成](../guide/Basic_Tutorial/Chart_Advisor)。
- generateChart方法不传入数据集时，无法使用智能数据聚合。

## 相关教程
- [图表智能生成](../guide/Basic_Tutorial/Chart_Generation)
- [基于规则的图表生成](../guide/Basic_Tutorial/Chart_Advisor)
