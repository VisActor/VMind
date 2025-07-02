/**
 * adwin and pageHinkley all based on super parmaeters, so it's difficult to use without data information
 */
import { isArray } from '@visactor/vutils';
import normalize from 'array-normalize';
import type { InsightAlgorithm } from '../../type';
import { InsightType, type DataInsightExtractContext, type Insight } from '../../type';
import { ChartType } from '../../../../types';
import { PageHinkley } from './pageHinkley';
import { getMeanAndstdDev } from '../statistics';
import { isPercenSeries } from '../../utils';
import type { DataItem } from '@visactor/generate-vchart';

export interface PageHinkleyOptions {
  delta?: number;
  lambda?: number;
  threshold?: number;
}
function difference(data: number[]) {
  const diff = [];
  for (let i = 1; i < data.length; i++) {
    diff.push(data[i] - data[i - 1]);
  }
  return diff;
}

export const pageHinkleyFunc = (context: DataInsightExtractContext, options: PageHinkleyOptions) => {
  const result: Insight[] = [];
  const { seriesDataMap, cell, spec } = context;
  const { delta, lambda, threshold } = options || {};
  const { y: celly } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];

  Object.keys(seriesDataMap).forEach(group => {
    const dataset: { index: number; dataItem: DataItem }[] = seriesDataMap[group];
    yField.forEach(field => {
      if (isPercenSeries(spec, field)) {
        return;
      }
      const pageHinkley = new PageHinkley(delta, lambda, threshold);
      /** normalize will amplify differences in small stdDev */
      const dataList = dataset.map(v => Number(v.dataItem[field]));
      const { mean, stdDev } = getMeanAndstdDev(dataList);

      const normalizedDataset = normalize([...dataList, mean + 2 * stdDev, mean - 2 * stdDev]);
      normalizedDataset.pop();
      normalizedDataset.pop();
      const diffDataset = difference(normalizedDataset);
      diffDataset.forEach((d, index) => {
        const isDrift = pageHinkley.setInput(d);
        if (isDrift) {
          result.push({
            type: InsightType.Outlier,
            data: [dataset[index + 1]],
            fieldId: field,
            value: dataset[index + 1].dataItem[field],
            significant: 1,
            seriesName: group
          } as unknown as Insight);
        }
      });
    });
  });
  return result;
};

export const PageHinkleyAlg: InsightAlgorithm = {
  name: 'pageHinkley',
  forceChartType: [ChartType.DualAxisChart, ChartType.LineChart, ChartType.BarChart, ChartType.AreaChart],
  insightType: InsightType.Outlier,
  algorithmFunction: pageHinkleyFunc,
  supportPercent: false
};
