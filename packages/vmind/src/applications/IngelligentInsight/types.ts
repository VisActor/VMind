import type { ChartType, SimpleFieldInfo, VMindDataset } from '../../common/typings';
import type { Cell } from '../chartGeneration/types';

export type VMindInsight = {
  type: string; // Insight type
  data: {
    // Abnormal data points
    index: number; // The index of the data point in the dataset
    item: Record<string, string>; // Data item
  }[];
  text: {
    // The text explanation of the insight, generated by LLM, can be used for chart annotation.
    content: string; // Text content
    color?: string; // Text color
    icon?: string; // Icon
    type?: 'number' | 'text' | 'percentage';
  }[]; // The text array is composed of text fragments, and all elements in the array are combined to form a complete text.
  number?: number; // The specific value of the insight
  significant: number; // The prominence of insights, used for sorting
};

export type DataProcessOutput = {
  chartType: ChartType;
  cell: Cell;
  fieldInfo: SimpleFieldInfo[];
  dataset: VMindDataset;
};