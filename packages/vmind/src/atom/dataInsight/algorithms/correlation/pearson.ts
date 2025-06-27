import { isArray } from '@visactor/vutils';

import { pearsonCorrelationCoeff, studentTQuantile } from '../statistics';
import type { InsightAlgorithm } from '../../type';
import { InsightType, type DataInsightExtractContext, type Insight } from '../../type';
import { ChartType } from '../../../../types';
import type { DataItem, DataTable } from '@visactor/generate-vchart';

export interface PearsonOptions {
  threshold?: number;
  withoutSeries?: boolean;
}

const pearsonAlgo = (context: DataInsightExtractContext, options: PearsonOptions) => {
  const { seriesDataMap, cell, insights } = context;
  const { threshold: pearsonThreshold = 0.8, withoutSeries = false } = options || {};
  const { y: celly, x: cellx, color } = cell;
  const yField: string = isArray(celly) ? celly[0] : celly;
  const xField: string = isArray(cellx) ? cellx[0] : cellx;
  const seriesField: string = isArray(color) ? color[0] : color;

  const result: Insight[] = [];

  const alpha = 0.05;

  const seriesNames = Object.keys(seriesDataMap);
  if (withoutSeries && seriesNames.length > 1) {
    return [];
  }
  seriesNames.forEach(series => {
    let seriesDataset: DataTable = seriesDataMap[series].map((d: any) => d.dataItem);
    const outlierData: DataItem[] = insights
      .filter(
        (insight: any) =>
          insight.type === InsightType.Outlier && (!seriesField || String(insight.data[0][seriesField]) === series)
      )
      .map((i: any) => i.data[0]);
    //exclude outliers
    if (outlierData.length > 0) {
      seriesDataset = seriesDataset.filter(
        dataItem =>
          !outlierData.find(
            od =>
              od[xField] === dataItem[xField] &&
              od[yField] === dataItem[yField] &&
              (!seriesField || dataItem[seriesField] === od[seriesField])
          )
      );
    }
    const xMeasureSet = seriesDataset.map(d => d[yField]) as number[];
    const yMeasureSet = seriesDataset.map(d => d[xField]) as number[];

    if (xMeasureSet.length !== yMeasureSet.length) {
      return;
    }
    const pearsonCoefficient = pearsonCorrelationCoeff(xMeasureSet, yMeasureSet);
    //t-distribution test
    const degree = yMeasureSet.length - 2;
    const tValue = (pearsonCoefficient * Math.sqrt(degree)) / Math.sqrt(1 - pearsonCoefficient ** 2);

    const threshold = studentTQuantile(1 - alpha / 2, degree);

    if (Math.abs(pearsonCoefficient) > pearsonThreshold && Math.abs(tValue) >= threshold) {
      //Correlation is significant
      result.push({
        type: InsightType.Correlation,
        fieldId: [xField, yField],
        significant: Math.abs(pearsonCoefficient),
        seriesName: series,
        info: {
          isLinearCorrelation: true
        }
      } as unknown as Insight);
    }
  });
  return result;
};

export const ScatterPlotCorrelation: InsightAlgorithm = {
  name: 'pearson-coefficient',
  chartType: [ChartType.ScatterPlot],
  forceChartType: [ChartType.ScatterPlot],
  insightType: InsightType.Correlation,
  algorithmFunction: pearsonAlgo
};
