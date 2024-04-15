import { TaskNodeMeta } from 'src/base/metaTypes';
import { TaskNodeType } from 'src/base/taskNode/types';
import { ChartAdvisorContext, ChartAdvisorOutput } from './types';
import { chartAdvisorTransformer } from './transformers';

const ChartAdvisorTaskNode: TaskNodeMeta<ChartAdvisorContext, ChartAdvisorOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [chartAdvisorTransformer]
};

export default ChartAdvisorTaskNode;
