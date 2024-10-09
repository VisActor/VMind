import type { DataTable, FieldInfo, Model } from '../../../../../src';

export interface ChartGeneratorCase {
  dataset: string;
  model: Model;
  type: 'default' | 'fieldInfo';
  context: {
    dataTable: DataTable;
    fieldInfo: FieldInfo[];
    text: string;
  };
  command: string;
  spec: any;
}

export type ChartGeneratorResult = ChartGeneratorCase[];
