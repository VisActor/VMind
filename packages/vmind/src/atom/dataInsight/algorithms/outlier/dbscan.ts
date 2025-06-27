import { isArray } from '@visactor/vutils';

import clustering from 'density-clustering';
import normalize from 'array-normalize';
import type { InsightAlgorithm } from '../../type';
import { InsightType, type DataInsightExtractContext, type Insight } from '../../type';
import { ChartType } from '../../../../types';
import type { DataItem } from '@visactor/generate-vchart';
import { DataRole, type FieldInfoItem } from '@visactor/generate-vchart';

export interface DbscanOptions {
  eps?: number;
  minPts?: number;
}

const isMeasureField = (field: string, fieldInfo: FieldInfoItem[]) => {
  const fieldInfoItem = fieldInfo.find(v => v.fieldName === field);
  return fieldInfoItem && fieldInfoItem.role === DataRole.MEASURE;
};

const dbscanAlgo = (context: DataInsightExtractContext, options: DbscanOptions) => {
  const { seriesDataMap, cell, fieldInfo } = context;
  const { eps = 0.2, minPts = 5 } = options || {};
  const { y: celly, x: cellx, color, size } = cell;

  const yField: string[] = isArray(celly) ? celly.flat() : [celly];
  const xField: string = isArray(cellx) ? cellx[0] : cellx;
  const colorField: string = isArray(color) ? color[0] : color;
  const sizeField: string = isArray(size) ? size[0] : size;
  const allMeasureFields = [colorField, sizeField].filter(v => !!v && isMeasureField(v, fieldInfo));

  const result: Insight[] = [];
  Object.keys(seriesDataMap).forEach(series => {
    const seriesDataset: { index: number; dataItem: DataItem }[] = seriesDataMap[series];
    if (seriesDataset.length <= minPts || seriesDataset.length < 5) {
      return;
    }
    const flatDataset = seriesDataset.reduce(
      (prev: any, cur: any) => [
        ...prev,
        cur.dataItem[xField] ?? 0,
        cur.dataItem[yField[0]] ?? 0,
        ...allMeasureFields.map(v => cur.dataItem[v] ?? 0)
      ],
      []
    );
    const dimensionCount = 2 + allMeasureFields.length;

    const normalizedDataset = normalize(flatDataset, dimensionCount);

    const clusterDataset = [];
    for (let index = 0; index < normalizedDataset.length; index += dimensionCount) {
      const item = normalizedDataset.slice(index, index + dimensionCount);
      clusterDataset.push(item);
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
