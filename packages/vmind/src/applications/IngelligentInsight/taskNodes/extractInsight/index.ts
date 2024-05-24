import type { RuleBasedTaskNodeMeta } from '../../../../base/metaTypes';
import { TaskNodeType } from '../../../../base/taskNode/types';
import type { InsightContext, InsightOutput } from '../../../types';
import type { ExtractInsightOutput } from '../../types';

//const executeInsightAlgo: Transformer<InsightContext, ExtractInsightOutput> = (context: InsightContext) => {};

const DataProcessTaskNodeMeta: RuleBasedTaskNodeMeta<InsightContext, InsightOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: []
};

export default DataProcessTaskNodeMeta;
