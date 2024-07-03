import type { RuleBasedTaskNodeMeta } from '../../../../base/metaTypes';
import { TaskNodeType } from '../../../../base/taskNode/types';
import type { Transformer } from '../../../../base/tools/transformer';
import type { InsightContext, InsightOutput } from '../../../types';
import type { DataProcessOutput, ExtractInsightOutput } from '../../types';

const formatInsightOutput: Transformer<InsightContext & ExtractInsightOutput, Partial<InsightOutput>> = (
  context: InsightContext & ExtractInsightOutput
) => {
  const { spec, insights } = context;

  return {
    spec,
    insights
  };
};

const FormatOutputTaskNodeMeta: RuleBasedTaskNodeMeta<InsightContext, InsightOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [formatInsightOutput]
};

export default FormatOutputTaskNodeMeta;
