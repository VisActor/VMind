import type { TaskNodeMeta } from '../../../../base/metaTypes';
import { TaskNodeType } from '../../../../base/taskNode/types';
import type { ChartAdvisorContext, ChartAdvisorOutput } from './types';
import { chartGenerationErrorWrapper } from './transformers';

const ChartAdvisorErrorWrapper: TaskNodeMeta<ChartAdvisorContext, ChartAdvisorOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [chartGenerationErrorWrapper]
};

export default ChartAdvisorErrorWrapper;
