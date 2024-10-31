import { isArray } from '@visactor/vutils';
import { longestTrendInterval, originalMKTest, TrendType } from '../statistics';
import type { InsightAlgorithm } from '../../type';
import { InsightType, type DataInsightExtractContext, type Insight } from '../../type';
import { ChartType } from '../../../../types';
import { isPercentChart, isStackChart } from '../../utils';

export interface OverallTrendingOptions {
  alpha?: number;
  calcScope?: boolean;
}

export const overallTrendingAlgo = (context: DataInsightExtractContext, options: OverallTrendingOptions) => {
  const { cell, dimensionSumMap, dimensionValues } = context;
  const { alpha = 0.05, calcScope = false } = options || {};
  const result: Insight[] = [];
  const { y: celly } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];
  yField.forEach(measureId => {
    const overallDataset = dimensionSumMap[measureId];
    const { trend, pValue, zScore, slope, intercept } = originalMKTest(overallDataset, alpha, calcScope);
    if (trend !== TrendType.NO_TREND) {
      const { length, start, end } = longestTrendInterval(overallDataset);
      result.push({
        type: InsightType.OverallTrend,
        fieldId: measureId,
        value: trend,
        significant: 1 - pValue,
        info: {
          slope,
          intercept,
          length,
          start,
          end,
          change: overallDataset[end] / overallDataset[start] - 1,
          startDimValue: dimensionValues[start],
          endDimValue: dimensionValues[end],
          startValue: overallDataset[start],
          endValue: overallDataset[end]
        }
      } as unknown as Insight);
    }
  });

  return result;
};

const canRun = (context: DataInsightExtractContext) => {
  const { seriesDataMap, chartType, cell, spec } = context;
  return (
    (isStackChart(spec, chartType, cell) && !isPercentChart(spec, chartType, cell)) ||
    Object.keys(seriesDataMap).length === 1
  );
};

export const OverallTrending: InsightAlgorithm = {
  name: 'overallTrending',
  forceChartType: [ChartType.LineChart, ChartType.BarChart, ChartType.AreaChart],
  insightType: InsightType.OverallTrend,
  canRun,
  algorithmFunction: overallTrendingAlgo
};