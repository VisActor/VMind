/** Atom Function Types */

import type { BasemapOption, Cell, ChartType } from './chart';
import type { VizSchema } from '../atom/type';
import type { FieldInfo, DataTable } from './base';
import type { Insight } from '../atom/dataInsight/type';

export enum AtomName {
  BASE = 'base',
  DATA_EXTRACT = 'dataExtract',
  DATA_CLEAN = 'dataClean',
  MULTIPLE_DATA_CLEAN = 'multipleDataClean',
  DATA_QUERY = 'dataQuery',
  CHART_COMMAND = 'chartCommand',
  MULTIPLE_CHART_COMMAND = 'multipleChartCommand',
  CHART_GENERATE = 'chartGenerate',
  DATA_INSIGHT = 'dataInsight',
  CHART_QA_EXTRACTION = 'chartQAExtraction',
  CUSTOM_PROMPT = 'custom_prompt',
  VCHART_SPEC = 'vchart_spec'
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
  /** prompt usage */
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
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
  /** valid measure cell count */
  validMeasureCellCount: number;
}

/** Multiple Dataset */
export interface DatasetFromText {
  /** text object of data extraction */
  text?: string;
  /** summary of dataset */
  summary: string;
  /** data table of dataset */
  dataTable: DataTable;
  /** field info of dataset */
  fieldInfo: FieldInfo[];
  /** data position in text */
  textRange?: [string, string];
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
  datasets?: DatasetFromText[];
}

/** Context of Chart Command Atom */
export interface ChartCommandCtx extends BaseContext {
  /** text object of data extraction */
  text: string;
  /** summary of data table */
  summary?: string;
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

export interface MultipleDataCleanCtx extends BaseContext {
  /** multiple dataset */
  datasets: DatasetFromText[];
}

export interface MultipleChartCommandsCtx extends BaseContext {
  /** multiple dataset */
  datasets: DatasetFromText[];
  /** commands */
  commands: string[];
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
  /** chartType */
  chartType?: ChartType;
}

export interface ChartQAExtractionCtx extends BaseContext {
  text: string;
  question: string;
  answer: string;
  keyList: string[];
  explanation: string;
}

export interface VChartSpecCtx extends BaseContext {
  spec: any;
  prevSpec?: any;
  // 新增的spec相关配置
  appendSpec?: {
    /**
     * 大模型返回的叶子节点的配置内容
     */
    leafSpec: any;
    /**
     * 配置父路径
     */
    parentKeyPath: string;
    /**
     * 父路径的别名
     */
    aliasKeyPath?: string;
  };
}

export interface DialogueChartCtx extends BaseContext {
  spec: any;
  oneSpec: any;
}
