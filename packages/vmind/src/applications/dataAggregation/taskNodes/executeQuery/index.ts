import { RuleBasedTaskNode } from 'src/base/taskNode/ruleBasedTaskNode';
import { DataAggregationResult } from '../../types';
import { executeDataQuery, getFinalQueryResult, patchSQLBeforeQuery, restoreDatasetAfterQuery } from './transformers';
import { ExecuteQueryContext, ExecuteQueryInput } from './types';

export const ExecuteQueryTaskNode = new RuleBasedTaskNode<
  ExecuteQueryInput,
  ExecuteQueryContext,
  DataAggregationResult
>([patchSQLBeforeQuery, executeDataQuery, restoreDatasetAfterQuery, getFinalQueryResult]);
