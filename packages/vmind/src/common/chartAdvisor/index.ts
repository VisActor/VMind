import { getAdvisedChartsWithDataset } from './chartAdvisorHandler';
import { vizDataToSpec } from '../vizDataToSpec';
import { estimateVideoTime } from '../vizDataToSpec/utils';
import { DataItem, SimpleFieldInfo } from 'src/typings';
import { uniqBy } from 'lodash';

export { chartAdvisorHandler } from './chartAdvisorHandler';

/**
 *
 * @param originDataset raw dataset used in the chart
 * @param colorPalette color palette of the chart
 * @param animationDuration duration of chart animation.
 * @returns spec and animation duration of the generated charts
 */
export const generateChartWithAdvisor = (
  fieldInfo: SimpleFieldInfo[],
  originDataset: DataItem[],
  colorPalette?: string[],
  animationDuration?: number
) => {
  const advisorRes = getAdvisedChartsWithDataset(fieldInfo, originDataset);
  const resultList = uniqBy(advisorRes, 'chartType').map((res: any) => {
    const { chartType, cell, dataset, score } = res;
    const spec = vizDataToSpec(
      dataset,
      chartType,
      cell,
      colorPalette,
      animationDuration ? animationDuration * 1000 : undefined
    );
    spec.background = '#00000033';
    return {
      chartSource: 'chartAdvisor',
      spec,
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
  console.info(resultList);
  return resultList;
};
