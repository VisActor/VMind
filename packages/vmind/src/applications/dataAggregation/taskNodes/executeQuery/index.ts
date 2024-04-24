import { executeDataQuery, getFinalQueryResult, patchSQLBeforeQuery, restoreDatasetAfterQuery } from './transformers';
import type { ExecuteQueryContext, ExecuteQueryOutput } from '../../types';
import type { RuleBasedTaskNodeMeta } from '../../../../base/metaTypes';
import { TaskNodeType } from '../../../../base/taskNode/types';

const ExecuteQueryTaskNodeMeta: RuleBasedTaskNodeMeta<ExecuteQueryContext, ExecuteQueryOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [patchSQLBeforeQuery, executeDataQuery, restoreDatasetAfterQuery, getFinalQueryResult]
};

export default ExecuteQueryTaskNodeMeta;
