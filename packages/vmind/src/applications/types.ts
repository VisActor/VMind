import { ChartType, ILLMOptions, SimpleFieldInfo, VMindDataset } from 'src/typings';
import { Cell } from './chartGeneration/types';

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
  dataset: VMindDataset;
};

export type ChartGenerationOutput = {
  chartType: ChartType;
  cell: Cell;
  spec: any;
  usage: any; //token usage of the LLM
};
