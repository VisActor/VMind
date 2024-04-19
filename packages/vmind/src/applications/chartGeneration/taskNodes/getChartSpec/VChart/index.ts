import { RuleBasedTaskNodeMeta } from 'src/base/metaTypes';
import { TaskNodeType } from 'src/base/taskNode/types';
import { GetChartSpecContext, GetChartSpecOutput } from '../types';
import { getChartPipelines } from './chartPipeline';

const getVChartSpecTaskNodeMeta: RuleBasedTaskNodeMeta<GetChartSpecContext, GetChartSpecOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: getChartPipelines
};

export default getVChartSpecTaskNodeMeta;
