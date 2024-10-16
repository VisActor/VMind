import { isArray } from '@visactor/vutils';

import clustering from 'density-clustering';
import normalize from 'array-normalize';
import type { InsightAlgorithm } from '../../type';
import { InsightType, type DataInsightExtractContext, type Insight } from '../../type';
import { ChartType, type DataItem } from '../../../../types';

export interface DbscanOptions {
  eps?: number;
  minPts?: number;
}

const dbscanAlgo = (context: DataInsightExtractContext, options: DbscanOptions) => {
  const { seriesDataMap, cell } = context;
  const { eps = 0.2, minPts = 5 } = options || {};
  const { y: celly, x: cellx, color } = cell;

  const yField: string[] = isArray(celly) ? celly.flat() : [celly];
  const xField: string = isArray(cellx) ? cellx[0] : cellx;
  const seriesField: string = isArray(color) ? color[0] : color;

  const result: Insight[] = [];
  Object.keys(seriesDataMap).forEach(series => {
    const seriesDataset: { index: number; dataItem: DataItem }[] = seriesDataMap[series];
    if (seriesDataset.length <= minPts || seriesDataset.length < 5) {
      return;
    }
    const flatDataset = seriesDataset.reduce(
      (prev: any, cur: any) => [...prev, cur.dataItem[xField] ?? 0, cur.dataItem[yField[0]] ?? 0],
      []
    );

    const normalizedDataset = normalize(flatDataset, 2);

    const clusterDataset = [];
    for (let index = 0; index < normalizedDataset.length; index += 2) {
      const x = normalizedDataset[index];
      const y = normalizedDataset[index + 1];
      clusterDataset.push([x, y]);
    }

    const dbscan = new clustering.DBSCAN();
    /** @todo add clusters */
    const clusters = dbscan.run(clusterDataset, eps, minPts);
    const noises = dbscan.noise;

    const insights = noises.map((noiseIndex: number) => {
      const d = seriesDataset[noiseIndex];
      return {
        type: InsightType.Outlier,
        data: [d],
        fieldId: [xField, yField[0]],
        value: [d.dataItem[xField], d.dataItem[yField[0]]],
        significant: 1,
        seriesName: series
      } as unknown as Insight;
    });
    result.push(...insights);
  });
  return result;
};

export const DBSCANOutlier: InsightAlgorithm = {
  name: 'dbscan',
  chartType: [ChartType.ScatterPlot],
  forceChartType: [ChartType.ScatterPlot],
  insightType: InsightType.Outlier,
  algorithmFunction: dbscanAlgo
};
