import { isArray, isNumber } from '@visactor/vutils';

import BayesianChangePoint from 'bayesian-changepoint';
import type { InsightAlgorithm } from '../../type';
import { InsightType, type DataInsightExtractContext, type Insight } from '../../type';
import { ChartType, type DataItem } from '../../../../types';

const breakpointVerifier = (next: any, prev: any): boolean => {
  if (Math.abs(next.data - prev.data) >= 1) {
    return true;
  }

  return false;
};

const bayesianDetection = (dataset: DataItem[], measureId: string | number) => {
  const measureSet = dataset.filter(d => isNumber(d[measureId])).map(d => d[measureId]) as unknown as number[];

  const detection = new BayesianChangePoint<number>({
    breakpointVerifier,
    chunkSize: measureSet.length,
    iteratee: (d: number) => d
  });

  detection.exec(measureSet);
  const result = detection.breakPoints();

  return result;
};

const turningPointAlgo = (context: DataInsightExtractContext): Insight[] => {
  const result: Insight[] = [];
  const { seriesDataMap, cell } = context;
  const { y: celly } = cell;

  const yField: string[] = isArray(celly) ? celly.flat() : [celly];

  Object.keys(seriesDataMap).forEach(series => {
    const seriesDataset = seriesDataMap[series];
    yField.forEach(measureId => {
      const bayesianResult = bayesianDetection(
        seriesDataset.map((d: any) => d.dataItem),
        measureId
      );
      bayesianResult.forEach(res => {
        const { index } = res;
        const d = seriesDataset[index];
        result.push({
          type: InsightType.TurningPoint,
          data: [d as any],
          fieldId: measureId,
          seriesName: series,
          value: d.dataItem[measureId] as unknown as number
        } as unknown as Insight);
      });
    });
  });
  //TODO: add info for each change point.
  return result;
};

export const TurningPoint: InsightAlgorithm = {
  name: 'turningPoint',
  forceChartType: [
    ChartType.DualAxisChart,
    ChartType.LineChart,
    ChartType.BarChart,
    ChartType.AreaChart,
    ChartType.WaterFallChart
  ],
  insightType: InsightType.TurningPoint,
  algorithmFunction: turningPointAlgo
};
