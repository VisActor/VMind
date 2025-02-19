# text2Chart

## Interface Description:
The text2Chart function is used to call the LLM to complete two tasks: data extraction and intelligent chart generation. It returns the generated chart spec, chart two-dimensional data table, chart type, and field mapping, etc. This function enables the intelligent process of generating charts from plain text in one step.

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

- text (string): Required, the original text content
- userPrompt (string): Optional, the user's visualization intent (what data you mainly want to extract from the text and how to display it with a chart)
- options: Optional, option parameters, including:

  - fieldInfo (Array): Field information contained in the text type, including field names, types, etc.; in scenarios where fieldInfo is provided, VMind will only extract content related to the passed fieldInfo
  - chartTypeList (ChartType[], optional): Supported chart type list. If not undefined, a chart will be generated from the chart types specified in this list.
  - enableDataQuery (boolean, optional): Decides whether to enable data aggregation during chart generation
  - colorPalette (Array<string>, optional): Used to set the color palette of the chart
  - animationDuration (number, optional): Used to set the playback duration of the chart animation
  - theme (ChartTheme | string, optional): Sets the theme style of the final spec. By default, VMind uses a theme style with gradient colors. You can set VChart's general light or dark theme ('light' | 'dark') or a theme style that suits your usage scenario

## Return Value Type:

```typescript
interface GenerateChartResult {
  /** Chart spec */
  spec: Record<string, any>;
  /** Extracted data */
  dataTable: DataTable;
  /** Field information */
  fieldInfo: FieldInfo[];
  /** Chart type */
  chartType: ChartType;
  /** Final visual channel mapping */
  cell: Cell;
  /** Token consumption */
  usage: Usage;
  /* Specific command to generate the current chart, consistent with user prompt if provided */
  command: string;
  /** Configuration time used for converting to gif/video */
  time: {
    totalTime : number;
    frameArr: number[];
  };
  /** Rule-based chart recommendation results, generated when manually setting rules or when the large model generation is incorrect */
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

- spec (Object): The generated VChart chart spec. If the dataset is empty, it is a spec template without data
- dataTable (Record<string, string | number>[]): The two-dimensional table data extracted from the text
- fieldInfo (FieldInfo): Field information extracted from the text when the user has not provided fieldInfo, i.e., the header information of the two-dimensional table
- chartType (ChartType): The generated chart type, see the "Chart Type List" section
- cell (Record<string, string | string[]>): Field mapping in the chart, describing how fields in the dataset are mapped to various visual channels of the chart
- usage (any): Total LLM token consumption
- time (number): Duration information of the chart animation, can be used for exporting GIFs and videos
- chartAdvistorRes(Array): This result is the chart recommendation result deduced based on the current data and field information through VMind's built-in rules, generated as a fallback when the model is set to `Model.CHART_ADVISOR` or when the user's large model settings are incorrect. See: [Rule-Based Chart Generation](../guide/Basic_Tutorial/Chart_Advisor)

# Usage Example
[Data Extraction - Generate Chart from Text in One Step](../guide/Basic_Tutorial/Data_Extraction)
