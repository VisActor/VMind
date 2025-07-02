import { isValid } from '@visactor/vutils';
import { ChartType } from '../../../types';
import type { GenerateChartCellContext } from '../type';
import { estimateVideoTime } from '../utils';
import { getVChartTypeByVmind, llmChartTypeMap } from './chartTypeUtils';
import { fomartSimpleSpec } from './simpleSpec';
import { generateChart } from '@visactor/generate-vchart';

const afterPipe = (context: GenerateChartCellContext) => {
  const { spec, chartType, animationOptions } = context;
  return {
    spec,
    chartType: llmChartTypeMap[chartType],
    time: estimateVideoTime(
      chartType,
      spec,
      isValid(animationOptions?.totalTime) ? animationOptions.totalTime * 1000 : undefined
    )
  };
};

export const revisedVChartType = (context: GenerateChartCellContext) => {
  const { chartType, spec } = context;

  spec.type = getVChartTypeByVmind(chartType);

  return { spec };
};

export const getChartSpecWithContext = (context: GenerateChartCellContext) => {
  context.spec = {};
  const gen = (contenxt: GenerateChartCellContext) => {
    return generateChart(contenxt.chartType, contenxt);
  };

  const chartSpecPipelines = [revisedVChartType, gen, fomartSimpleSpec, afterPipe];
  let newContext = { ...context };
  chartSpecPipelines.forEach(func => {
    newContext = {
      ...newContext,
      ...func(newContext)
    };
  });
  return newContext;
};
