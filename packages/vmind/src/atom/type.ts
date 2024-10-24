import type { FieldInfo } from 'src/types';
import type { LLMManage } from '../core/llm';
import type { AlgorithmType, AlgorithmOptions } from './dataInsight/type';

export interface BaseOptions {
  /** llm manage instance */
  llm?: LLMManage;
  /** show llm thoughs or not */
  showThoughts?: boolean;
  /** answer language */
  language?: 'chinese' | 'english';
}

export interface DataExtractionOptions extends BaseOptions {
  reGenerateFieldInfo?: boolean;
  isCapcut?: boolean;
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
}

export interface DataInsightOptions extends BaseOptions {
  /** max number of insight */
  maxNum?: number;
  /** using algorithms list */
  algorithms?: AlgorithmType[];
  /** options of each algorithms */
  algorithmOptions?: AlgorithmOptions;
  /** insight limited by chartType, eg. cluster only in scatter chart */
  isLimitedbyChartType?: boolean;
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
