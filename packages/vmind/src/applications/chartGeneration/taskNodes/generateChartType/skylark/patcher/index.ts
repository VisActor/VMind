import type { Transformer } from 'src/base/tools/transformer';
import type { GenerateChartTypeOutput } from '../../types';
import { SUPPORTED_CHART_LIST } from 'src/applications/chartGeneration/constants';
import { replaceAll } from 'src/common/utils/utils';

export const patchChartType: Transformer<GenerateChartTypeOutput, Partial<GenerateChartTypeOutput>> = (
  context: GenerateChartTypeOutput
) => {
  const { chartType } = context;
  const chartTypeNew = replaceAll(chartType, '-', ' ');

  if (!SUPPORTED_CHART_LIST.includes(chartTypeNew)) {
    throw Error('Unsupported Chart Type. Please Change User Input');
  }

  return { chartType: chartTypeNew.toUpperCase() };
};
