import { isArray, isNumber } from '@visactor/vutils';
import { originalMKTest, TrendType } from '../statistics';
import type { InsightAlgorithm } from '../../type';
import { InsightType, type DataInsightExtractContext, type Insight } from '../../type';
import { ChartType, type DataItem } from '../../../../types';

const sumDimensionValues = (dataset: DataItem[], measureId: string | number) => {
  const sum = dataset.reduce((prev, cur) => {
    const value = isNumber(cur[measureId] as number) ? Math.abs(cur[measureId] as number) : 0;
    return prev + value;
  }, 0);
  return sum;
};

export interface OverallTrendingOptions {
  alpha?: number;
  calcScope?: boolean;
}

const overallTrendingAlgo = (context: DataInsightExtractContext, options: OverallTrendingOptions) => {
  const { dimensionDataMap, cell } = context;
  const { alpha = 0.05, calcScope = false } = options || {};
  const result: Insight[] = [];
  const { y: celly } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];
  yField.forEach(measureId => {
    const overallDataset = Object.keys(dimensionDataMap).map(dimension => {
      const dimensionDataset = dimensionDataMap[dimension].map((d: any) => d.dataItem);
      return sumDimensionValues(dimensionDataset, measureId);
    });
    const { trend, pValue, zScore, slope, intercept } = originalMKTest(overallDataset, alpha, calcScope);
    if (trend !== TrendType.NO_TREND) {
      result.push({
        type: InsightType.OverallTrend,
        fieldId: measureId,
        value: trend,
        significant: 1 - pValue,
        info: {
          slope,
          intercept
        }
      } as unknown as Insight);
    }
  });

  return result;
};

export const OverallTrending: InsightAlgorithm = {
  name: 'overallTrending',
  chartType: [ChartType.DualAxisChart, ChartType.LineChart, ChartType.BarChart, ChartType.AreaChart],
  insightType: InsightType.OverallTrend,
  algorithmFunction: overallTrendingAlgo
};
