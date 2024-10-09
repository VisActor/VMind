import type { Transformer } from '../../../base/tools/transformer';
import type { GenerateChartAndFieldMapContext, GenerateChartAndFieldMapOutput } from './generateTypeAndFieldMap/types';
import type { ChartType } from '../../../common/typings';
import { replaceAll } from '../../../common/utils/utils';

export const addChartSource: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  const { llmOptions } = context;
  return { chartSource: llmOptions.model };
};

export const patchChartType: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  const { chartType, chartTypeList } = context;
  const chartTypeNew: ChartType = replaceAll(replaceAll(chartType, '/', ''), '-', ' ') as ChartType;

  if (!chartTypeList.includes(chartTypeNew)) {
    throw Error('Unsupported Chart Type. Please Change User Input');
  }

  return { chartType: chartTypeNew.toUpperCase() as ChartType };
};
