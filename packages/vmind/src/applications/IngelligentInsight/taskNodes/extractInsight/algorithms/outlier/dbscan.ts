import { isArray } from '@visactor/vutils';

import clustering from 'density-clustering';
import normalize from 'array-normalize';
import type { InsightAlgorithm } from '../../../../types';
import { InsightType, type VMindInsight } from '../../../../types';
import type { DataItem } from '../../../../../../common/typings';
import { ChartType } from '../../../../../../common/typings';
import { DEFAULT_SERIES_NAME } from '../../../dataProcess/constants';

const dbscanAlgo = (context: any) => {
  const { seriesDataMap, cell, dbscanEps: propsEps, dbscanMinPts: propsPts } = context;
  const { y: celly, x: cellx, color } = cell;

  const yField: string[] = isArray(celly) ? celly.flat() : [celly];
  const xField: string = isArray(cellx) ? cellx[0] : cellx;
  const seriesField: string = isArray(color) ? color[0] : color;

  const eps = propsEps ?? 0.2;
  const pts = propsPts ?? 5;

  const result: VMindInsight[] = [];
  Object.keys(seriesDataMap).forEach(series => {
    const seriesDataset: { index: number; dataItem: DataItem }[] = seriesDataMap[series];
    if (seriesDataset.length <= pts || seriesDataset.length < 5) {
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
    const clusters = dbscan.run(clusterDataset, eps, pts);
    const noises = dbscan.noise;

    const insights = noises.map((noiseIndex: number) => {
      const d = seriesDataset[noiseIndex];
      return {
        type: InsightType.Outlier,
        data: [d],
        fieldId: [xField, yField[0]],
        value: [d.dataItem[xField], d.dataItem[yField[0]]],
        seriesName: series === DEFAULT_SERIES_NAME ? undefined : series
      } as unknown as VMindInsight;
    });
    result.push(...insights);
  });
  return result;
};

const DBSCANOutlier: InsightAlgorithm = {
  name: 'dbscan',
  chartType: [ChartType.ScatterPlot],
  insightType: InsightType.Outlier,
  algorithmFunction: dbscanAlgo
};

export default DBSCANOutlier;
