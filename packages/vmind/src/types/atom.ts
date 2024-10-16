/** Atom Function Types */

import type { BasemapOption, Cell, ChartType } from './chart';
import type { VizSchema } from '../atom/type';
import type { FieldInfo, DataTable } from './base';
import type { Insight } from '../atom/dataInsight/type';

export enum AtomName {
  BASE = 'base',
  DATA_EXTRACT = 'dataExtract',
  DATA_CLEAN = 'dataClean',
  DATA_QUERY = 'dataQuery',
  CHART_COMMAND = 'chartCommand',
  CHART_GENERATE = 'chartGenerate',
  DATA_INSIGHT = 'dataInsight'
}

/** Base LLM Context */
export interface BaseContext {
  /** response logId in chat */
  logId?: string;
  /** response id in chat */
  id?: string;
  /** user query */
  query?: string;
  /** llm response content */
  response?: string;
  /** error info */
  error?: string;
}

export interface ClusterDataView {
  /** cluster result */
  dataTable: DataTable;
  /** cluster field */
  fieldInfo: FieldInfo[];
  /** valid count of measure fields */
  validColumnLength: number;
  /** table row length */
  validRowLength: number;
  /** valid cell count */
  validCellCount: number;
}

/** Context of Data Extraction Atom */
export interface DataExtractionCtx extends BaseContext {
  /** text object of data extraction */
  text: string;
  /** current summary of text */
  textSummary?: string;
  /** extra fieldsInfo of dataTable */
  fieldInfo?: FieldInfo[];
  /** Data Table values */
  dataTable?: DataTable;
  /** multiple results */
  dataset?: {
    summary: string;
    textPosition: [number, number];
    fieldInfo: FieldInfo[];
  }[];
}

/** Context of Chart Command Atom */
export interface ChartCommandCtx extends BaseContext {
  /** text object of data extraction */
  text: string;
  /** extra fieldsInfo of dataTable */
  fieldInfo?: FieldInfo[];
  /** Data Table values */
  dataTable?: DataTable;
  /** command */
  command: string;
}

export interface DataCleanCtx extends BaseContext {
  /** extra fieldsInfo of dataTable */
  fieldInfo?: FieldInfo[];
  /** Data Table values */
  dataTable?: DataTable;
  /** clutser result */
  clusterResult?: ClusterDataView[];
  /** original data table */
  originalDataTable?: DataTable;
}

/** Context of Data Query Atom */
export interface DataQueryCtx extends BaseContext {
  /** current summary of dataTable */
  dataTableSummary?: string;
  /** extra fieldsInfo of dataTable */
  fieldInfo?: FieldInfo[];
  /** fieldsInfo of sql query result */
  llmFieldInfo?: FieldInfo[];
  /** Data Table values */
  dataTable: DataTable;
  /** user's command */
  command: string;
  /** sql */
  sql?: string;
}

/** Context of Chart Generator Atom */
export interface ChartGeneratorCtx extends BaseContext {
  /** extra fieldsInfo of dataTable */
  fieldInfo?: FieldInfo[];
  /** Data Table values */
  dataTable: DataTable;
  /** command */
  command: string;
  /** chart type generator result */
  chartType?: ChartType;
  /** field mapping result */
  cell: Cell;
  /** supported chart list */
  chartTypeList?: ChartType[];
  /** only use in map chart */
  basemapOption?: BasemapOption;
  /** vizSchema */
  vizSchema: VizSchema;
  /** chart spec */
  spec: any;
}

export interface DataInsightCtx extends BaseContext {
  /** spec of chart */
  spec?: any;
  /** data tabel */
  dataTable?: DataTable;
  /** fieldsInfo of dataTable */
  fieldInfo?: FieldInfo[];
  /** final insight */
  insights: Insight[];
  /** chartType of vchart */
  vChartType?: string;
}
