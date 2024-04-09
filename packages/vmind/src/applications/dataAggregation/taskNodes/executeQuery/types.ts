import { SimpleFieldInfo } from 'src/typings';
import { DataAggregationContext, SQL } from '../../types';
import { GetQuerySQLResult } from '../getQuerySQL/types';

export type ExecuteQueryContext = DataAggregationContext & GetQuerySQLResult;
export type ExecuteQueryInput = GetQuerySQLResult;
