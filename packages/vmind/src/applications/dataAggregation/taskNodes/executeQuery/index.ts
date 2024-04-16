import { executeDataQuery, getFinalQueryResult, patchSQLBeforeQuery, restoreDatasetAfterQuery } from './transformers';
import { ExecuteQueryContext, ExecuteQueryOutput } from '../../types';
import { RuleBasedTaskNodeMeta } from 'src/base/metaTypes';
import { TaskNodeType } from 'src/base/taskNode/types';

const ExecuteQueryTaskNodeMeta: RuleBasedTaskNodeMeta<ExecuteQueryContext, ExecuteQueryOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [patchSQLBeforeQuery, executeDataQuery, restoreDatasetAfterQuery, getFinalQueryResult]
};

export default ExecuteQueryTaskNodeMeta;
