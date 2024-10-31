import { isArray } from '@visactor/vutils';

import { coefficientVariation } from '../statistics';
import type { DataInsightExtractContext } from '../../type';
import { InsightType, type Insight, type InsightAlgorithm } from '../../type';
import type { DataTable } from '../../../../types';
import { ChartType } from '../../../../types';

export interface VolatilityOptions {
  threshold?: number;
}

const volatilityAlgo = (context: DataInsightExtractContext, optioins: VolatilityOptions) => {
  const { seriesDataMap, cell } = context;
  const { threshold = 0.8 } = optioins || {};
  const { y: celly } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];

  const result: Insight[] = [];

  const seriesNames = Object.keys(seriesDataMap);
  seriesNames.forEach(series => {
    const seriesDataset: DataTable = seriesDataMap[series].map((d: any) => d.dataItem);
    yField.forEach(measureId => {
      const measureSet = seriesDataset.map(d => Number(d[measureId]));

      const cv = coefficientVariation(measureSet);
      if (Math.abs(cv) > threshold) {
        result.push({
          type: InsightType.Volatility,
          fieldId: measureId,
          value: cv as unknown as number,
          significant: cv,
          seriesName: series,
          info: {
            cv
          }
        } as unknown as Insight);
      }
    });
  });
  return result;
};

/** @todo @czx add fluctuation period */
export const Volatility: InsightAlgorithm = {
  name: 'volatility',
  chartType: [ChartType.LineChart, ChartType.DualAxisChart, ChartType.BarChart, ChartType.AreaChart],
  insightType: InsightType.Volatility,
  algorithmFunction: volatilityAlgo,
  supportStack: true,
  supportPercent: false
};
