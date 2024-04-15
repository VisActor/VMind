import type { FFmpeg } from '@ffmpeg/ffmpeg';
import type { ManualTicker, DefaultTimeline } from '@visactor/vrender-core';
import { Cell } from 'src/applications/chartGeneration/types';
//models that VMind support
//more models is under developing
export enum Model {
  GPT3_5 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4',
  SKYLARK = 'skylark-pro',
  SKYLARK2 = 'skylark2-pro-4k',
  CHART_ADVISOR = 'chart-advisor'
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

export type ChartType = string;
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

export type Context = {
  chartType: ChartType;
  cell: Cell;
  dataset: any[];
  colors?: string[];
  totalTime?: number;
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
  CHART_ADVISOR = 'chart-advisor'
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
  cell: Cell;
  dataset: DataItem[];
  fieldInfo: SimpleFieldInfo[];
};

export type PatchPipeline = (
  context: PatchContext,
  _originalContext: PatchContext
) => { chartType: string; cell: Cell; dataset: DataItem[]; fieldInfo: SimpleFieldInfo[] };

export type TaskError = { error: boolean };
