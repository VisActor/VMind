import { DataItem, ILLMOptions, SimpleFieldInfo, VMindDataset } from 'src/typings';

export type SQL = string;

export type DataAggregationContext = {
  llmOptions: ILLMOptions;
  userInput: string;
  fieldInfo: SimpleFieldInfo[];
  sourceDataset: DataItem[];
};

export type DataAggregationResult = {
  dataset: VMindDataset;
  fieldInfo: SimpleFieldInfo[];
  usage: any;
};
