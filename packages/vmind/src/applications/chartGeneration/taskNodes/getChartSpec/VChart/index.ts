import type { RuleBasedTaskNodeMeta } from '../../../../../base/metaTypes';
import { TaskNodeType } from '../../../../../base/taskNode/types';
import type { GetChartSpecContext, GetChartSpecOutput } from '../types';
import { getChartPipelines } from './chartPipeline';

const getVChartSpecTaskNodeMeta: RuleBasedTaskNodeMeta<GetChartSpecContext, GetChartSpecOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: getChartPipelines
};

export default getVChartSpecTaskNodeMeta;
