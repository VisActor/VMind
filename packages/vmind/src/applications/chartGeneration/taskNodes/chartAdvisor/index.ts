import { TaskNodeMeta } from 'src/base/metaTypes';
import { TaskNodeType } from 'src/base/taskNode/types';
import { ChartAdvisorContext, ChartAdvisorOutput } from './types';
import { getAdvisedListTransformer } from './transformers';

const GetAdvisedListTaskNodeMeta: TaskNodeMeta<ChartAdvisorContext, ChartAdvisorOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [getAdvisedListTransformer]
};

export default GetAdvisedListTaskNodeMeta;
