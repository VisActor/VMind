import type { ChartType, ILLMOptions, SimpleFieldInfo, VMindDataset } from '../common/typings';
import type { Cell } from './chartGeneration/types';

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
} & {
  totalTime?: number;
  colors?: string[];
};

export type ChartGenerationOutput = {
  chartType: ChartType;
  cell: Cell;
  spec: any;
  chartSource: string;
  usage: any; //token usage of the LLM
  time?: { totalTime: number; frameArr: any[] };
};
