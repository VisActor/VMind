import { isArray, isValidNumber } from '@visactor/vutils';
import { longestTrendInterval, originalMKTest, TrendType } from '../statistics';
import type { InsightAlgorithm } from '../../type';
import { InsightType, type DataInsightExtractContext, type Insight } from '../../type';
import { ChartType } from '../../../../types';
import { isPercentChart, isStackChart } from '../../utils';
import { findLastIndex } from '../../../../utils/common';

export interface OverallTrendingOptions {
  alpha?: number;
  calcScope?: boolean;
}

export const overallTrendingAlgo = (context: DataInsightExtractContext, options: OverallTrendingOptions) => {
  const { cell, dimensionSumMap, dimensionValues } = context;
  const { alpha = 0.05, calcScope = false } = options || {};
  const result: Insight[] = [];
  const { y: celly, x: cellx } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];
  const xField = isArray(cellx) ? cellx[0] : cellx;
  yField.forEach(measureId => {
    const overallDataset = dimensionSumMap[measureId];
    const { trend, pValue, zScore, slope, intercept } = originalMKTest(overallDataset, alpha, calcScope);
    if (trend !== TrendType.NO_TREND) {
      const { length, start, end, maxTrend } = longestTrendInterval(overallDataset, trend);
      const overallEndIndex = findLastIndex(overallDataset, v => isValidNumber(v));
      const onverallStartIndex = overallDataset.findIndex(v => isValidNumber(v));
      const overallChange =
        overallDataset[onverallStartIndex] === 0
          ? -overallDataset[overallEndIndex]
          : overallDataset[overallEndIndex] / overallDataset[onverallStartIndex] - 1;
      if (
        (trend === TrendType.INCREASING && overallChange > 0) ||
        (trend === TrendType.DECREASING && overallChange < 0)
      ) {
        result.push({
          type: InsightType.OverallTrend,
          fieldId: measureId,
          value: trend,
          significant: 1 - pValue,
          info: {
            slope,
            intercept,
            length,
            overall: {
              coordinates: [
                { [xField]: dimensionValues[onverallStartIndex], [measureId]: overallDataset[onverallStartIndex] },
                { [xField]: dimensionValues[overallEndIndex], [measureId]: overallDataset[overallEndIndex] }
              ],
              start: onverallStartIndex,
              end: overallEndIndex,
              change: overallChange,
              startValue: overallDataset[onverallStartIndex],
              endValue: overallDataset[overallEndIndex],
              startDimValue: dimensionValues[onverallStartIndex],
              endDimValue: dimensionValues[overallEndIndex]
            },
            start,
            end,
            maxTrend,
            change:
              overallDataset[start] === 0 ? -overallDataset[end] : overallDataset[end] / overallDataset[start] - 1,
            startDimValue: dimensionValues[start],
            endDimValue: dimensionValues[end],
            startValue: overallDataset[start],
            endValue: overallDataset[end]
          }
        } as unknown as Insight);
      }
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
