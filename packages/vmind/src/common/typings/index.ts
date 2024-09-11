import type { FFmpeg } from '@ffmpeg/ffmpeg';
import type { ManualTicker, DefaultTimeline } from '@visactor/vrender-core';
import type { Cell } from '../../applications/chartGeneration/types';
//models that VMind support
//more models is under developing
export enum Model {
  GPT3_5 = 'gpt-3.5-turbo',
  GPT3_5_1106 = 'gpt-3.5-turbo-1106',
  GPT4 = 'gpt-4',
  GPT_4_0613 = 'gpt-4-0613',
  SKYLARK2 = 'skylark2-pro-4k',
  SKYLARK2_v1_2 = 'skylark2-pro-4k-v1.2',
  CHART_ADVISOR = 'chart-advisor'
}
export enum InputType {
  CSV_INPUT = 'csv-format-input',
  TEXT_INPUT = 'text-format-input'
}

export type LLMResponse = {
  choices: {
    index: number;
    message: any;
  }[];
  usage: any;
  [key: string]: any;
};

export type RequestFunc = (
  prompt: string,
  userMessage: string,
  options: ILLMOptions | undefined
) => Promise<LLMResponse>;

export interface ILLMOptions {
  url?: string; //URL of your LLM service. For gpt, default is openAI API.
  /** llm request header, which has higher priority */
  headers?: HeadersInit; // this will be used directly as the header of the LLM request.
  method?: 'POST' | 'GET'; //post or get
  model?: Model | string;
  max_tokens?: number;
  temperature?: number;
  showThoughts?: boolean;
  customRequestFunc?: {
    chartAdvisor?: RequestFunc;
    dataProcess?: RequestFunc;
    dataQuery?: RequestFunc;
    dataExtraction?: RequestFunc;
    IntelligentInsight?: RequestFunc;
  };
  [key: string]: any;
}

export type SimpleFieldInfo = {
  fieldName: string;
  description?: string; //additional description of the field. This will help the model have a more comprehensive understanding of this field, improving the quality of chart generation.
  type: DataType;
  role: ROLE;
  domain?: (string | number)[];
};

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
  VennChart = 'Venn Chart',
  SingleColumnCombinationChart = 'Single Column Combination Chart',
  DynamicScatterPlotChart = 'Dynamic Scatter Plot Chart',
  DynamicRoseChart = 'Dynamic Rose Chart'
}

export enum CombinationChartType {
  SingleColumnCombinationChart = 'Single Column Combination Chart'
}

export enum CombinationBasicChartType {
  BarChart = 'Bar Chart',
  LineChart = 'Line Chart'
}

export type GPTChartAdvisorResult = {
  CHART_TYPE: ChartType;
  DOUBLE_CHECK: string;
  FIELD_MAP: Cell;
  THOUGHT: string;
  VIDEO_DURATION?: number;
  COLOR_PALETTE?: string[];
  error?: boolean;
};

export type NLToChartResult = {
  CHART_TYPE: ChartType;
  USEFUL_FIELDS: string[];
  DOUBLE_CHECK: string;
  FIELD_MAP: Cell;
  THOUGHT: string;
  COLOR_PALETTE?: string[];
  error?: boolean;
};

export type TimeType = {
  totalTime: number;
  frameArr: any[];
};

export type OuterPackages = {
  VChart: any;
  FFmpeg: FFmpeg;
  fetchFile: (data: string | Buffer | Blob | File) => Promise<Uint8Array>;
  ManualTicker: typeof ManualTicker;
  defaultTimeline: DefaultTimeline;
  createCanvas: any;
};

export enum DataType {
  INT = 'int',
  STRING = 'string',
  FLOAT = 'float',
  DATE = 'date'
}

export enum ROLE {
  DIMENSION = 'dimension',
  MEASURE = 'measure'
}

export enum LOCATION {
  DIMENSION = 'dimension',
  MEASURE = 'measure'
}

export type FieldInfo = {
  id: string;
  alias: string;
  description: string;
  visible: boolean;
  type: DataType;
  role: ROLE;
  location: LOCATION;
};

export type VizSchema = {
  chartType?: string;
  fields: FieldInfo[];
};

export enum ModelType {
  GPT = 'gpt',
  SKYLARK = 'skylark',
  CHART_ADVISOR = 'chart-advisor',
  CUSTOM = 'custom'
}

export type ChartGenerationProps = {
  model: Model | string; //models to finish data generation task
  userPrompt: string; //user's intent of visualization, usually aspect in data that they want to visualize
  dataFields: FieldInfo[];
};

export type DataItem = Record<string, number | string>;

export type VMindDataset = DataItem[];

export type PatchContext = {
  chartType: string;
  cells: Cell[];
  dataset: DataItem[];
  fieldInfo: SimpleFieldInfo[];
};

export type PatchPipeline = (
  context: PatchContext,
  _originalContext: PatchContext
) => { chartType: string; cells: Cell[]; dataset: DataItem[]; fieldInfo: SimpleFieldInfo[] };

export type TaskError = { error: boolean };

export type VMindTheme = {
  colorScheme: string[];
  background: string;
};

export type { ITheme as ChartTheme } from '@visactor/vchart';

export enum mapRegionProjectionType {
  ALBERS = 'albers',
  ALBERS_USA = 'albersUsa',
  AZIMUTHAL_EQUAL_AREA = 'azimuthalEqualArea',
  AZIMUTHAL_EQUIDISTANT = 'azimuthalEquidistant',
  CONIC_CONFORMAL = 'conicConformal',
  CONIC_EQUAL_AREA = 'conicEqualArea',
  CONIC_EQUIDISTANT = 'conicEquidistant',
  EQUAL_EARTH = 'equalEarth',
  EQUIRECTANGULAR = 'equirectangular',
  GNOMONIC = 'gnomonic',
  MERCATOR = 'mercator',
  NATURAL_EARTH1 = 'naturalEarth1',
  ORTHOGRAPHIC = 'orthographic',
  STEREOGRAPHIC = 'stereographic',
  TRANSVERSE_MERCATOR = 'transverseMercator'
}

export enum MapRegionCoordinate {
  CARTESIAN = 'cartesian',
  POLAR = 'polar',
  GEO = 'geo'
}

export type BasemapOption = {
  regionProjectType: mapRegionProjectionType;
  regionCoordinate: MapRegionCoordinate;
  zoom: number;
  center: number[];
};
