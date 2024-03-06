import { getAdvisedChartsWithDataset } from './chartAdvisorHandler';
import { vizDataToSpec } from '../vizDataToSpec';
import { estimateVideoTime } from '../vizDataToSpec/utils';
import { DataItem } from 'src/typings';

export { chartAdvisorHandler } from './chartAdvisorHandler';

/**
 *
 * @param originDataset raw dataset used in the chart
 * @param colorPalette color palette of the chart
 * @param animationDuration duration of chart animation.
 * @returns spec and animation duration of the generated charts
 */
export const generateChartWithAdvisor = (
  originDataset: DataItem[],
  colorPalette?: string[],
  animationDuration?: number
) => {
  const advisorRes = getAdvisedChartsWithDataset(originDataset);
  return advisorRes.map(res => {
    const { chartType, cell, dataset } = res;
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
      time: estimateVideoTime(chartType, spec, animationDuration ? animationDuration * 1000 : undefined)
    };
  });
};
