import type { BasemapOption, ChartTheme, ChartType, FieldInfo, ToolCall, ToolMessage } from '../types';
import type { LLMManage } from '../core/llm';
import type { AlgorithmType, AlgorithmOptions, InsightType } from './dataInsight/type';

export interface BaseOptions {
  /** llm manage instance */
  llm?: LLMManage;
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

export interface ChartGeneratorOptions extends BaseOptions {
  useChartAdvisor?: boolean;
  useChartRule?: boolean;
  /** supported chart list */
  chartTypeList?: ChartType[];
  /** un-supported chart list */
  unsupportChartTypeList?: ChartType[];
  animationDuration?: number;
  basemapOption?: BasemapOption;
  colorPalette?: string[];
  theme?: ChartTheme | string;
}

export interface DataInsightOptions extends BaseOptions {
  /** max number of insight */
  maxNum?: number;
  /** detail number limits of insight, higher priority than maxNum */
  detailMaxNum?: {
    types: InsightType[];
    maxNum: number;
  }[];
  /** using algorithms list */
  algorithms?: AlgorithmType[];
  /** options of each algorithms */
  algorithmOptions?: AlgorithmOptions;
  /** insight limited by chartType, eg. cluster only in scatter chart */
  isLimitedbyChartType?: boolean;
  /** polish insights by llm or not */
  usePolish?: boolean;
  /** add insights into spec */
  enableInsightAnnotation?: boolean;
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

export interface SchemaFieldInfo extends Pick<FieldInfo, 'description' | 'role' | 'location' | 'type'> {
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
