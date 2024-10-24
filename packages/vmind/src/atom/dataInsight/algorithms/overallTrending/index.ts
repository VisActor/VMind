import { isArray, isNumber } from '@visactor/vutils';
import { longestTrendInterval, originalMKTest, TrendType } from '../statistics';
import type { InsightAlgorithm } from '../../type';
import { InsightType, type DataInsightExtractContext, type Insight } from '../../type';
import { ChartType, type DataItem } from '../../../../types';
import { isPercentChart, isStackChart } from '../../utils';

const sumDimensionValues = (dataset: DataItem[], measureId: string | number, getValue = (v: number) => Math.abs(v)) => {
  const sum = dataset.reduce((prev, cur) => {
    const value = isNumber(cur[measureId] as number) ? getValue(cur[measureId] as number) : 0;
    return prev + value;
  }, 0);
  return sum;
};

export interface OverallTrendingOptions {
  alpha?: number;
  calcScope?: boolean;
}

const overallTrendingAlgo = (context: DataInsightExtractContext, options: OverallTrendingOptions) => {
  const { dimensionDataMap, cell, seriesDataMap } = context;
  const { alpha = 0.05, calcScope = false } = options || {};
  const result: Insight[] = [];
  const { y: celly } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];
  const onlyOneSeries = Object.keys(seriesDataMap).length === 1;
  yField.forEach(measureId => {
    const dimensionValues = Object.keys(dimensionDataMap);
    const overallDataset = dimensionValues.map(dimension => {
      const dimensionDataset = dimensionDataMap[dimension].map((d: any) => d.dataItem);
      return sumDimensionValues(dimensionDataset, measureId, onlyOneSeries ? v => v : undefined);
    });
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
          change: overallDataset[end] / overallDataset[start] - (trend === TrendType.INCREASING ? 1 : 0),
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
  const { seriesDataMap } = context;
  return (isStackChart(context.spec) && !isPercentChart(context.spec)) || Object.keys(seriesDataMap).length === 1;
};

export const OverallTrending: InsightAlgorithm = {
  name: 'overallTrending',
  forceChartType: [ChartType.DualAxisChart, ChartType.LineChart, ChartType.BarChart, ChartType.AreaChart],
  insightType: InsightType.OverallTrend,
  canRun,
  algorithmFunction: overallTrendingAlgo
};
