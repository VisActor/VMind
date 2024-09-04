import type { Transformer } from '../../../base/tools/transformer';
import type { GenerateChartAndFieldMapContext, GenerateChartAndFieldMapOutput } from './generateTypeAndFieldMap/types';
import type { ChartType } from '../../../common/typings';
import { replaceAll } from '../../../common/utils/utils';
import { COMBINATION_CHART_LIST } from '../constants';
import type { Cell } from '../types';

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
  const chartTypeNew: ChartType = replaceAll(chartType, '-', ' ') as ChartType;

  if (!chartTypeList.includes(chartTypeNew)) {
    throw Error('Unsupported Chart Type. Please Change User Input');
  }

  return { chartType: chartTypeNew.toUpperCase() as ChartType };
};

export const isCombinationChartType = (chartType: ChartType) => {
  return COMBINATION_CHART_LIST.some(
    combinationChartType => combinationChartType.toUpperCase() === chartType.toUpperCase()
  );
};

export const getCell = (cells: Cell[], index?: number) => {
  if (index && cells.length >= index) {
    return cells[index];
  }
  // By default, the element with index 0 is returned
  return cells[0];
};
