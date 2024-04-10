import { RuleBasedTaskNode } from 'src/base/taskNode/ruleBasedTaskNode';
import { executeDataQuery, getFinalQueryResult, patchSQLBeforeQuery, restoreDatasetAfterQuery } from './transformers';
import { ExecuteQueryContext, ExecuteQueryOutput } from '../../types';

export const ExecuteQueryTaskNode = new RuleBasedTaskNode<ExecuteQueryContext, ExecuteQueryOutput>([
  patchSQLBeforeQuery,
  executeDataQuery,
  restoreDatasetAfterQuery,
  getFinalQueryResult
]);
