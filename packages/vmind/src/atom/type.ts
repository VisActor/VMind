import type { LLMManage } from '../core/llm';

export interface BaseOptions {
  /** llm manage instance */
  llm?: LLMManage;
  /** show llm thoughs or not */
  showThoughts?: boolean;
}

export interface DataCleanOptions extends BaseOptions {
  needNumericalFields?: boolean;
  filterSameValueColumn?: boolean;
}

export interface DataQueryOptions extends BaseOptions {
  /** use SQL to execute data query or not */
  useSQL?: boolean;
}
