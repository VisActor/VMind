import type { DataTable, FieldInfo } from '../../../../../src';

export interface ScoreDetail {
  originIndex: number;
  matchedIndex: number;
  nameScore: number;
  typeScore: number;
  dataScore: number;
}

export interface DataExtractionDataSetResult {
  context: {
    isEnglish?: boolean;
    dataTable: DataTable;
    fieldInfo: FieldInfo[];
    text: string;
  };
  score?: number;
  fieldScore?: number;
  dataScore?: number;
  scoreDetail?: ScoreDetail[];
}
export interface DataExtractionCase {
  llm: string;
  result: {
    dataset: string;
    defaultResult: DataExtractionDataSetResult[];
    fieldInfoResult: DataExtractionDataSetResult[];
  }[];
}

export type DataExtractionResult = DataExtractionCase[];
