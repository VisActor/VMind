import type { TaskNodeMeta } from '../../../../base/metaTypes';
import { TaskNodeType } from '../../../../base/taskNode/types';
import type { ChartAdvisorContext, ChartAdvisorOutput } from './types';
import { getAdvisedListTransformer } from './transformers';

const GetAdvisedListTaskNodeMeta: TaskNodeMeta<ChartAdvisorContext, ChartAdvisorOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [getAdvisedListTransformer]
};

export default GetAdvisedListTaskNodeMeta;
