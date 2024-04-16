import { RuleBasedTaskNodeMeta } from 'src/base/metaTypes';
import { TaskNodeType } from 'src/base/taskNode/types';
import { GetChartSpecContext, GetChartSpecOutput } from '../types';
import { getChartPipelines } from './chartPipeline';
import { estimateVideoTime } from 'src/common/utils/utils';
import { animationDuration } from './constants';
import { uniqBy } from 'lodash';
import { ChartGenerationOutput } from 'src/applications/types';
import { Transformer } from 'src/base/tools/transformer';

const runPipelines = (pipelines: any, context: any) => {
  const result = pipelines.reduce((pre: any, transformer: any) => {
    const res = transformer(pre);
    return { ...pre, ...res };
  }, context);
  return result;
};

const getSpecFromList: Transformer<any, { advisedList: ChartGenerationOutput[] }> = (context: any) => {
  const { advisedList } = context;
  const resultList = uniqBy(advisedList, 'chartType').map((res: any) => {
    const { chartType, cell, dataset, score, chartSource, usage } = res;
    const contextNew = {
      ...context,
      chartType,
      cell,
      dataset,
      chartSource,
      usage
    };
    const pipelines = getChartPipelines(contextNew);
    const { spec } = runPipelines(pipelines, contextNew);
    return {
      chartSource: 'chartAdvisor',
      spec,
      cell,
      chartType,
      score,
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      },
      time: estimateVideoTime(chartType, spec, animationDuration ? animationDuration * 1000 : undefined)
    };
  });
  return { advisedList: resultList };
};

const getVChartSpecFromListTaskNodeMeta: RuleBasedTaskNodeMeta<GetChartSpecContext, GetChartSpecOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [getSpecFromList]
};

export default getVChartSpecFromListTaskNodeMeta;