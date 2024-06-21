import { isArray, isNumber } from '@visactor/vutils';

import BayesianChangePoint from 'bayesian-changepoint';
import { ChartType, type DataItem } from '../../../../../../common/typings';
import type { InsightAlgorithm, VMindInsight } from '../../../../types';
import { InsightType } from '../../../../types';
import { DEFAULT_SERIES_NAME } from '../../../dataProcess/constants';

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

const turningPointAlgo = (context: any): VMindInsight[] => {
  const result: VMindInsight[] = [];
  const { seriesDataMap, cell } = context;
  const { y: celly, x: cellx, color } = cell;

  const yField: string[] = isArray(celly) ? celly.flat() : [celly];

  Object.keys(seriesDataMap).forEach(series => {
    const seriesDataset = seriesDataMap[series];
    yField.forEach(measureId => {
      const bayesianResult = bayesianDetection(seriesDataset, measureId);
      bayesianResult.forEach(res => {
        const { index } = res;
        const dataItem = seriesDataset[index];
        result.push({
          type: InsightType.TurningPoint,
          data: [dataItem as any],
          fieldId: measureId,
          seriesName: series === DEFAULT_SERIES_NAME ? undefined : series,
          value: dataItem[measureId] as unknown as number
        } as unknown as VMindInsight);
      });
    });
  });
  //TODO: add info for each change point.
  return result;
};

const TurningPoint: InsightAlgorithm = {
  name: 'turningPoint',
  chartType: [ChartType.DualAxisChart, ChartType.LineChart],
  insightType: InsightType.ExtremeValue,
  algorithmFunction: turningPointAlgo
};

export default TurningPoint;
