import type {
  BasemapOption,
  ChartType,
  ILLMOptions,
  SimpleFieldInfo,
  VMindDataset,
  ChartTheme
} from '../common/typings';
import type { Cell } from './chartGeneration/types';
import type { InsightAlgorithm, VMindInsight } from './IngelligentInsight/types';
import type { CombinationBasicChartType } from '../common/typings';

//context of the DataExtraction Application
export type DataExtractionContext = {
  llmOptions: ILLMOptions;
  userInput: string;
  dataText: string;
  chartTypeList: ChartType[]; //supported chart list
};

//output of the DataExtraction Application
export type DataExtractionOutput = {
  instruction: string;
  dataset: VMindDataset;
  fieldInfo: SimpleFieldInfo[];
};

//context of the DataAggregation Application
export type DataAggregationContext = {
  llmOptions: ILLMOptions;
  userInput: string;
  fieldInfo: SimpleFieldInfo[];
  sourceDataset: VMindDataset; //original dataset
};

//output of the DataAggregation Application
export type DataAggregationOutput = {
  dataset: VMindDataset; //dataset after aggregation
  fieldInfo: SimpleFieldInfo[]; //fieldInfo after aggregation
  usage: any; //token usage of the LLM
};

export type ChartGenerationContext = {
  llmOptions: ILLMOptions;
  userInput: string;
  fieldInfo: SimpleFieldInfo[];
  dataset?: VMindDataset;
  chartTypeList: ChartType[]; //supported chart list
  basemapOption: BasemapOption; // only use in map chart
} & {
  totalTime?: number;
  colors?: string[];
  chartTheme?: ChartTheme | string;
};

export type ChartGenerationOutput = {
  chartType: ChartType;
  subChartType?: CombinationBasicChartType[];
  cells?: Cell[];
  datasets?: VMindDataset[];
  spec: any;
  chartSource: string;
  usage: any; //token usage of the LLM
  time?: { totalTime: number; frameArr: any[] };
};

export enum InsightLanguage {
  ZH = 'zh',
  EN = 'en'
}
export type InsightContext = {
  spec?: any;
  chartType: ChartType;
  dataset?: VMindDataset;
  fieldInfo?: SimpleFieldInfo[];
  cell?: Cell;
  llmOptions: ILLMOptions;
  insightAlgorithms?: InsightAlgorithm[];
  insightNumberLimit?: number;
  generateText?: boolean;
  language?: InsightLanguage;
};

export type InsightOutput = {
  spec: any; //spec with annotations
  insights: VMindInsight[];
};
