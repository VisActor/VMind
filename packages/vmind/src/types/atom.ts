/** Atom Function Types */

import type { AutoChartCell } from '@visactor/chart-advisor/src/type';
import type { ChartType } from 'src/common/typings';

/** Base DataCell */
export type DataCell = string | number;

/** Base Data Item */
export type DataItem = Record<string, DataCell>;

/** Data Table */
export type DataTable = DataItem[];

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
}

export enum AtomName {
  BASE = 'base',
  DATA_EXTRACT = 'dataExtract',
  DATA_CLEAN = 'dataClean',
  DATA_QUERY = 'dataQuery',
  CHART_COMMAND = 'chartCommand',
  CHART_GENERATE = 'chartGenerate'
}

export enum DataType {
  DATE = 'date',
  TIME = 'time',
  STRING = 'string',
  REGION = 'region',
  NUMERICAL = 'numerical',
  RATIO = 'ratio',
  COUNT = 'count'
}

export enum ROLE {
  DIMENSION = 'dimension',
  MEASURE = 'measure'
}

export enum LOCATION {
  DIMENSION = 'dimension',
  MEASURE = 'measure'
}

/** field information Of Data Table */
export interface FieldInfo {
  /** field ID */
  fieldId: string;
  /** name of field */
  fieldName: string;
  /** description of field */
  description?: string;
  /** field type, eg: time / category / numerical */
  fieldType: DataType;
  /** field role */
  role: ROLE;
  /** field location */
  location: LOCATION;
  /** example of field value */
  dataExample?: DataCell[];
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
  dataTabel: DataTable;
  /** sql */
  sql?: string;
}

/** Context of Chart Generator Atom */
export interface ChartGeneratorCtx extends BaseContext {
  /** extra fieldsInfo of dataTable */
  fieldInfo?: FieldInfo[];
  /** Data Table values */
  dataTabel: DataTable;
  /** chart type generator result */
  chartType?: ChartType;
  /** field mapping result */
  cells: AutoChartCell;
}
