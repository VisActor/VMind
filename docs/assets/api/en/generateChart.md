
# generateChart

## Interface Description:
The generateChart function is used to call LLM to complete intelligent generation of charts, and returns the generated chart spec, chart type, and field mapping, etc.
If the passed in dataset is undefined, a spec template will be generated, and fillSpecWithData can be called later to fill data into the spec.

## Supported Models:
- GPT models
- Doubao models
- DeepSeek models
- [chart-advisor](../guide/Basic_Tutorial/Chart_Advisor)
- Any other models

## Chart Type List
VMind supports 25 common chart types:
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
You can restrict the type of chart generated through the chartTypeList in the options parameter.


## Interface Parameters:

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
    theme?: ChartTheme | string;
  }
}
```

- userPrompt (string): User's visualization intention (What information you want to show in the chart)
- fieldInfo (Array): Information about the fields in the dataset, including field name, type, etc
- dataset (Array): The raw dataset used in the chart, it can be undefined. If dataset is undefined, a spec template will be generated and fillSpecTemplateWithData can be called later to fill data into the spec template.
- options: Optional, option parameters, include the following:

  - chartTypeList (ChartType[], optional): Supported chart type list. If not undefined, a chart will be generated from the chart types specified in this list.
  - enableDataQuery (boolean, optional): Determines whether to enable data aggregation during chart generation
  - colorPalette (Array<string>, optional): Used to set the color palette of the chart
  - animationDuration (number, optional): Used to set the playback duration of the chart animation
  - theme (ChartTheme | string, optional): Sets the theme style of the final spec. By default, VMind uses a theme style with gradient colors. You can set VChart's general light or dark theme ('light' | 'dark') or a theme style that suits your usage scenario.

## Return Value Type:

```typescript
interface GenerateChartResult {
  /** Chart spec */
  spec: Record<string, any>;
  /** Chart type */
  chartType: ChartType;
  /** Final visual channel mapping */
  cell: Cell;
  /** Token consumption */
  usage: Usage;
  /* Specific command to generate the current chart, consistent with user prompt in the case of user prompt */
  command: string;
  /** Configuration time used for converting to gif/video */
  time: {
    totalTime : number;
    frameArr: number[];
  };
  /** Rule-based chart recommendation results, generated as a fallback when manually setting rules or when the large model generation is incorrect */
  chartAdvistorRes: {
    /** Chart spec */
    spec: Record<string, any>;
    /** Chart type */
    chartType: ChartType;
    /** Recommendation score */
    score: number
  }[]
}
```

- spec (Object): The generated VChart chart spec. If the dataset is empty, it is a spec template that does not contain data
- chartType (ChartType): The type of the chart generated, see `Chart Type List` section
- cell (Record<string, string | string[]>): The field mapping in the chart, describing how the fields in the dataset map to the various visual channels on the chart
- usage (any): Total LLM token consumption
- time (number): The duration of the chart animation, which can be used to export GIF and video
- chartAdvistorRes (Array): This result is the chart recommendation result derived based on the current data and field information through VMind's built-in rules, generated as a fallback when the model is set to `Model.CHART_ADVISOR` or the user's large model settings are incorrect and no result can be obtained. For details, see: [Rule-Based Chart Generation](../guide/Basic_Tutorial/Chart_Advisor)- 

## Usage Example:

```typescript
import VMind from '@visactor/vmind';

const vmind = new VMind(options)
const dataset=[
{
"Product Name": "Coke",
"region": "south",
"Sales": 2350
},
{
"Product Name": "Coke",
"region": "east",
"Sales": 1027
},
{
"Product Name": "Coke",
"region": "west",
"Sales": 1027
},
{
"Product Name": "Coke",
"region": "north",
"Sales": 1027
}
]
const userPrompt = 'Show product sales in different regions';
const fieldInfo=vmind.getFieldInfo(dataset)

const { spec } = await vmind.generateChart(userPrompt, fieldInfo, dataset);
```

### Generate a chart with a custom color palette
```typescript
//Setting up a custom color palette
const colorPalette = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

const { spec } = await vmind.generateChart(userPrompt, fieldInfo, dataset, {colorPalette});
```

VMind also comes built-in with [Arco-design](https://www.visactor.io/vchart/theme/demo/arco), [Semi-design](https://www.visactor.io/vchart/theme/demo/semi), [VeO design](https://www.visactor.io/vchart/theme/demo/arco), and other multiple theme color palettes, which can be directly imported to use:
```typescript
import VMind, {ArcoTheme} from '@visactor/vmind';

// Use Arco-design color palette
const {spec} = await vmind.generateChart(describe, finalFieldInfo, finalDataset, {
colorPalette: ArcoTheme.colorScheme
});
```
Built-in color palette list:
- `SemiTheme`: Semi design theme color palette
- `ArcoTheme`: Arco design theme color palette
- `VeOTheme`: VeO design theme color palette
- `VeOThemeFinance`: VeO design for finance industry theme color palette
- `VeOThemeGovernment`: VeO design for government industry theme color palette
- `VeOThemeConsumer`: VeO design for consumer industry theme color palette
- `VeOThemeAutomobile`: VeO design for automobile industry theme color palette
- `VeOThemeCulturalTourism`: VeO design for cultural tourism industry theme color palette
- `VeOThemeMedical`: VeO design for medical industry theme color palette
- `VeOThemeNewEnergy`: VeO design for new energy industry theme color palette

### Limit the type of charts generated
```typescript
import VMind, {ChartType} from '@visactor/vmind';

//Restrict the generation of the following types of charts: bar charts, line charts, scatter plots, pie charts, word clouds
const chartTypeList = [
ChartType.BarChart,
ChartType.LineChart,
ChartType.ScatterPlot,
ChartType.PieChart,
ChartType.WordCloud
]

const { spec } = await vmind.generateChart(userPrompt, fieldInfo, dataset, {chartTypeList});
```

### Generate a spec template without a dataset
In some cases, we may generate a chart without a specific dataset, but only with data fields (for example, generate a chart based on the fields in the dataset before querying, and then complete the relevant query based on the type and fields of the chart generated), and then call the fillSpecWithData method to get the final spec for chart rendering:

```typescript
import VMind from '@visactor/vmind';

const vmind = new VMind(options)

const userPrompt = 'Show product sales in different regions';
const fieldInfo=[
{
"fieldName": "Product Name",
"type": "string",
"role": "dimension",
"domain": [
"Coke",
"Sprite",
"Fanta",
"Awake"
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
"fieldName": "Sales",
"type": "int",
"role": "measure",
"domain": [
28,
2350
]
}
]
//Do not pass in the dataset, generate a spec template
const { spec } = await vmind.generateChart(userPrompt, fieldInfo);

//Fill in data into the template
const dataset=[
{
"Product Name": "Coke",
"region": "south",
"Sales": 2350
},
{
"Product Name": "Coke",
"region": "east",
"Sales": 1027
},
{
"Product Name": "Coke",
"region": "west",
"Sales": 1027
},
{
"Product Name": "Coke",
"region": "north",
"Sales": 1027
}
]

const spec = vmind.fillSpecWithData(spec, dataset)
```

## Notes:

- The generateChart method will pass the userPrompt and fieldInfo to the large language model for chart generation, but the detailed data in the dataset will not be passed.
- In the process of generating the chart, VMind will first use the large language model, according to the userPrompt and fieldInfo, to recommend a suitable chart type. Then, it will map the fields in the fieldInfo to the x-axis, y-axis, color, size and other visual channels of the chart.
- VMind will add an entrance animation to the generated chart by default, so it will also return the duration of the chart animation time. If you want to turn off the chart animation, you can set spec.animation to false.
- When the model type is set to chart-advisor, it will not call a large language model to generate charts. The results generated will include multiple types of charts. For details, please refer to [Rule-based Chart Generation](../guide/Basic_Tutorial/Chart_Advisor).

## Related Tutorials
- [Intelligent Chart Generation](../guide/Basic_Tutorial/Chart_Generation)
- [Rule-based Chart Generation](../guide/Basic_Tutorial/Chart_Advisor)

