import type { DataTable, FieldInfo, Model } from '../../../../../src';

export interface ChartGeneratorCase {
  dataset: string;
  model: Model;
  type: 'default' | 'fieldInfo';
  context: {
    dataTable: DataTable;
    fieldInfo: FieldInfo[];
    datasets: any[];
    text: string;
  };
  command?: string;
  spec?: any;
  chartRes?: {
    context: {
      dataTable: DataTable;
      fieldInfo: FieldInfo[];
      spec: any;
      command: string;
    };
    textRange: [string, string];
  }[];
  timeCost: number;
  extractionCost: number;
  generationCost: number;
}

export type ChartGeneratorResult = ChartGeneratorCase[];
