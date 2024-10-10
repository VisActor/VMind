import type { FieldInfo } from 'src/types';
import type { LLMManage } from '../core/llm';
import { extend } from 'dayjs';

export interface BaseOptions {
  /** llm manage instance */
  llm?: LLMManage;
  /** show llm thoughs or not */
  showThoughts?: boolean;
}

export interface DataExtractionOptions extends BaseOptions {
  reGenerateFieldInfo?: boolean;
}

export interface ChartCommandOptions extends BaseOptions {
  useDataTable?: boolean;
}

export type RangeValueTransferType = 'string' | 'filter' | 'avg' | 'max' | 'min';

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

export interface DataQueryOptions extends BaseOptions {
  /** use SQL to execute data query or not */
  useSQL?: boolean;
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
