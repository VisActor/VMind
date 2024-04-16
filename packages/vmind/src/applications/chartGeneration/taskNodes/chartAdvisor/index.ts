import { TaskNodeMeta } from 'src/base/metaTypes';
import { TaskNodeType } from 'src/base/taskNode/types';
import { ChartAdvisorContext, ChartAdvisorOutput } from './types';
import { chartAdvisorTransformer } from './transformers';

const ChartAdvisorTaskNodeMeta: TaskNodeMeta<ChartAdvisorContext, ChartAdvisorOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [chartAdvisorTransformer]
};

export default ChartAdvisorTaskNodeMeta;
