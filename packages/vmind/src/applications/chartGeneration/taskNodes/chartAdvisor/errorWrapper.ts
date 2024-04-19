import { TaskNodeMeta } from 'src/base/metaTypes';
import { TaskNodeType } from 'src/base/taskNode/types';
import { ChartAdvisorContext, ChartAdvisorOutput } from './types';
import { chartGenerationErrorWrapper } from './transformers';

const ChartAdvisorErrorWrapper: TaskNodeMeta<ChartAdvisorContext, ChartAdvisorOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [chartGenerationErrorWrapper]
};

export default ChartAdvisorErrorWrapper;
