/** Atom Function Types */
import type { Cell, ChartType } from './chart';
import type { Insight } from '../atom/dataInsight/type';
import type { ILLMManage, ToolMessage, LLMMessage } from '../types/llm';
import type { SimpleVChartSpec } from '../atom/imageReader/interface';
import type { DataTable, FieldInfoItem, GenerateChartInput } from '@visactor/generate-vchart';

export interface BaseOptions {
  /** llm manage instance */
  llm?: ILLMManage;
  /** function calls */
  tools?: ToolMessage[];
  /** show llm thoughs or not */
  showThoughts?: boolean;
  /** answer language */
  language?: 'chinese' | 'english';
  /** max history messages saved */
  maxMessagesCnt?: number;
}

export interface DataExtractionOptions extends BaseOptions {
  reGenerateFieldInfo?: boolean;
  isMultiple?: boolean;
}

export interface ChartCommandOptions extends BaseOptions {
  useDataTable?: boolean;
  filterByRule?: boolean;
}

export type RangeValueTransferType = 'string' | 'filter' | 'avg' | 'max' | 'min' | 'first' | 'last';

export interface DataCleanOptions extends BaseOptions {
  needNumericalFields?: boolean;
  filterSameValueColumn?: boolean;
  measureAutoTransfer?: boolean;
  filterSameDataItem?: boolean;
  filterRowWithEmptyValues?: boolean;
  rangeValueTransfer?: RangeValueTransferType;
  hierarchicalClustering?: boolean;
  clusterThreshold?: number;
}

export interface MultipleDataCleanOptions extends DataCleanOptions {
  filterRatioInDataset?: number;
}

export interface DataQueryOptions extends BaseOptions {
  /** use SQL to execute data query or not */
  useSQL?: boolean;
}

export interface SpecInsightOptions extends BaseOptions {
  defaultMarkerLineStyle?: any;
  defaultMarkerSymbolStyle?: any;
  diffMarkerSymbolStyle?: any;
  labelBackground?: any;
  defaultOffsetInGrowthMarkLine?: number;
}

export interface CustomPromptOptions extends BaseOptions {
  /** prompt template */
  promptTemplate: string;
}

export interface SchemaFieldInfo extends Pick<FieldInfoItem, 'description' | 'role' | 'type'> {
  id: string;
  /** aliasName */
  alias?: string;
  /** show or not */
  visible?: boolean;
}

export type VizSchema = {
  chartType?: string;
  fields: SchemaFieldInfo[];
};

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
  SPEC_INSIGHT = 'specInsight',
  CHART_QA_EXTRACTION = 'chartQAExtraction',
  CUSTOM_PROMPT = 'custom_prompt',
  VCHART_SPEC = 'vchart_spec',
  IMAGE_READER = 'imageReader'
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
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
  usage?: Usage;
  /** LLM thoughts */
  thoughts?: string;
  /** function call res */
  toolRes?: any;
}

export interface ClusterDataView {
  /** cluster result */
  dataTable: DataTable;
  /** cluster field */
  fieldInfo: FieldInfoItem[];
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
  fieldInfo: FieldInfoItem[];
  /** data position in text */
  textRange?: [string, string];
}

/** Context of Data Extraction Atom */
export interface DataExtractionCtx extends BaseContext {
  /** text object of data extraction */
  text: string;
  /** extra fieldsInfo of dataTable */
  fieldInfo?: FieldInfoItem[];
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
  fieldInfo?: FieldInfoItem[];
  /** Data Table values */
  dataTable?: DataTable;
  /** command */
  command: string;
}

export interface DataCleanCtx extends BaseContext {
  /** extra fieldsInfo of dataTable */
  fieldInfo?: FieldInfoItem[];
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
  fieldInfo?: FieldInfoItem[];
  /** fieldsInfo of sql query result */
  llmFieldInfo?: FieldInfoItem[];
  /** Data Table values */
  dataTable: DataTable;
  /** user's command */
  command: string;
  /** sql */
  sql?: string;
}

/** Context of Chart Generator Atom */
export interface ChartGeneratorCtx extends BaseContext, GenerateChartInput {
  /** command */
  command?: string;
  /** chart type generator result */
  chartType?: string;
  /** field mapping result */
  cell: Cell;
  /** vizSchema */
  vizSchema?: VizSchema;
  /** chart spec */
  spec?: any;
  /** chart advistor result */
  chartAdvistorRes?: {
    chartType: string;
    spec: any;
    score: number;
  }[];
  chartSource?: string;
  /**
   * simple vchart spec
   * 可以用于生成详细的vchart配置
   */
  simpleVChartSpec?: SimpleVChartSpec;
  /** animation config */
  time?: { totalTime: number; frameArr: any[] };
}

export interface DataInsightCtx extends BaseContext {
  /** spec of chart */
  spec?: any;
  /** data tabel */
  dataTable?: DataTable;
  /** fieldsInfo of dataTable */
  fieldInfo?: FieldInfoItem[];
  /** final insight */
  insights: Insight[];
  /** chartType of vchart */
  vChartType?: string;
  /** chartType */
  chartType?: ChartType;
}

export interface SpecInsightCtx extends BaseContext {
  /** spec of chart */
  spec?: any;
  /** final insight */
  insights: Insight[];
  /** chartType */
  chartType?: ChartType;
  /** spec added with insights */
  newSpec?: any;
}

export interface ChartQAExtractionCtx extends BaseContext {
  text: string;
  question: string;
  answer: string;
  keyList: string[];
  explanation: string;
}

/**
 * 更新vchart spec 的原子操作
 */
export interface IVChartOperationItem {
  /**
   * The type of operation to perform.
   * - "add": Add a new field or array element.
   * - "update": Update an existing field or array element.
   * - "delete": Remove an existing field or array element.
   */
  op: 'add' | 'update' | 'delete' | 'deleteAll';
  /**
   * The target location of the operation in the DSL.
   * - Use dot notation for nested fields (e.g., "settings.theme.color").
   * - Use square brackets for array indices (e.g., "data[2]").
   */
  target: string;
  /**
   * The value to be added or updated
   */
  value?: any;
}

export interface VChartSpecCtx extends BaseContext {
  /**
   * the original spec
   */
  originalSpec: any;
  /**
   * the latest spec
   */
  spec?: any;
  /**
   * the spec before operations
   */
  prevSpec?: any;
  /**
   * The operations to be performed on the spec
   */
  operations?: IVChartOperationItem[];
  /**
   * the result of operations
   */
  opertationsResult?: number[];
}

export interface DialogueChartCtx extends BaseContext {
  spec: any;
  oneSpec: any;
}

export interface IBaseAtom<Ctx extends BaseContext, O extends BaseOptions> {
  name: string;
  options: O;
  isLLMAtom: boolean;
  history: {
    map: Map<number, Ctx>;
    idList: number[];
    id: number;
  };

  undo: (id?: string) => void;
  redo: (id?: string) => void;
  buildDefaultContext: (context: Ctx) => Ctx;
  buildDefaultOptions: () => O;
  updateContext: (context: Partial<Ctx>, replace?: boolean) => Ctx;
  updateOptions: (options: Partial<O>) => void;
  reset: (context?: Partial<Ctx>) => void;
  getContext: () => Ctx;
  getContextBeforeRun: () => Ctx;
  shouldRunByContextUpdate: (context: Ctx) => boolean;
  run: (userInput?: { context?: Ctx; query?: string; messages?: ILLMManage[] }) => Promise<Ctx>;
  runWithChat: (query: string) => Promise<Ctx>;
  setResponses: (messages: LLMMessage[]) => void;
  getResponses: () => LLMMessage[];
  clearHistory: () => void;
}

export interface BaseAtomConstructor<Ctx extends BaseContext = BaseContext, O extends BaseOptions = BaseOptions> {
  new (context: Partial<Ctx>, options: Partial<O>): IBaseAtom<Ctx, O>;
}
