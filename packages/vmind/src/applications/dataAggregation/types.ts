import { DataItem, ILLMOptions, SimpleFieldInfo } from 'src/typings';

export type SQL = string;
export type DataAggregationContext = {
  llmOptions: ILLMOptions;
  userInput: string;
  fieldInfo: SimpleFieldInfo[];
  sourceDataset: DataItem[];
};
