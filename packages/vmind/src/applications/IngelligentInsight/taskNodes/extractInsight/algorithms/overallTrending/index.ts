import { isArray, isNumber } from '@visactor/vutils';
import { originalMKTest, TrendType } from '../statistics';
import { ChartType, type DataItem } from '../../../../../../common/typings';
import { InsightType, type InsightAlgorithm, type VMindInsight } from '../../../../types';

const sumDimensionValues = (dataset: DataItem[], measureId: string | number) => {
  const sum = dataset.reduce((prev, cur) => {
    const value = isNumber(cur[measureId] as number) ? Math.abs(cur[measureId] as number) : 0;
    return prev + value;
  }, 0);
  return sum;
};

const overallTrendingAlgo = (context: any) => {
  const { dimensionDataMap, cell, calcScope } = context;
  const result: VMindInsight[] = [];
  const { y: celly } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];
  yField.forEach(measureId => {
    const overallDataset = Object.keys(dimensionDataMap).map(dimension => {
      const dimensionDataset = dimensionDataMap[dimension];
      return sumDimensionValues(dimensionDataset, measureId);
    });
    const { trend, pValue, zScore, slope, intercept } = originalMKTest(overallDataset, 0.05, calcScope);
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
      } as unknown as VMindInsight);
    }
  });

  return result;
};

const OverallTrending: InsightAlgorithm = {
  name: 'overallTrending',
  chartType: [ChartType.DualAxisChart, ChartType.LineChart],
  insightType: InsightType.OverallTrend,
  algorithmFunction: overallTrendingAlgo
};

export default OverallTrending;
