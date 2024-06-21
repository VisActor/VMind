import { isArray } from '@visactor/vutils';

import { pearsonCorrelationCoeff, studentTQuantile } from '../statistics';
import type { InsightAlgorithm, VMindInsight } from '../../../../types';
import { InsightType } from '../../../../types';
import type { DataItem, VMindDataset } from '../../../../../../common/typings';
import { ChartType } from '../../../../../../common/typings';

const pearsonAlgo = (context: any) => {
  const { seriesDataMap, cell, insights, pearsonThreshold: propsPearsonThreshold } = context;
  const { y: celly, x: cellx, color } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];
  const xField: string = isArray(cellx) ? cellx[0] : cellx;
  const seriesField: string = isArray(color) ? color[0] : color;

  const pearsonThreshold = propsPearsonThreshold ?? 0.8;

  const result: VMindInsight[] = [];

  const alpha = 0.05;

  const seriesNames = Object.keys(seriesDataMap);
  seriesNames.forEach(series => {
    let seriesDataset: VMindDataset = seriesDataMap[series];
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
              od[yField[0]] === dataItem[yField[0]] &&
              (!seriesField || dataItem[seriesField] === od[seriesField])
          )
      );
    }
    const xMeasureSet = seriesDataset.map(d => d[yField[0]]) as number[];
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
        fieldId: [xField, yField[0]],
        significant: Math.abs(pearsonCoefficient),
        seriesName: series,
        info: {
          isLinearCorrelation: true
        }
      } as unknown as VMindInsight);
    }
  });
  return result;
};

const ScatterPlotCorrelation: InsightAlgorithm = {
  name: 'pearson-coefficient',
  chartType: [ChartType.ScatterPlot],
  insightType: InsightType.Correlation,
  algorithmFunction: pearsonAlgo
};

export default ScatterPlotCorrelation;
