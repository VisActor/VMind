import { isArray } from '@visactor/vutils';

import { spearmanCoefficient } from '../statistics';
import type { InsightAlgorithm } from '../../type';
import { InsightType, type DataInsightExtractContext, type Insight } from '../../type';
import { ChartType } from '../../../../types';
import type { DataTable } from '@visactor/generate-vchart';

export interface SpearmanOptions {
  threshold?: number;
}

const spearmanAlgo = (context: DataInsightExtractContext, options: SpearmanOptions) => {
  const { seriesDataMap, cell } = context;
  const { threshold = 0.95 } = options || {};
  const { y: celly } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];

  const result: Insight[] = [];

  const seriesNames = Object.keys(seriesDataMap);
  yField.forEach(measureId => {
    for (let i = 0; i < seriesNames.length; i++) {
      const iDataset: DataTable = seriesDataMap[seriesNames[i]].map((d: any) => d.dataItem);
      const iMeasureset = iDataset.map(d => d[measureId]) as number[];
      for (let j = i + 1; j < seriesNames.length; j++) {
        const jDataset: DataTable = seriesDataMap[seriesNames[j]].map((d: any) => d.dataItem);
        const jMeasureset = jDataset.map(d => d[measureId]) as number[];

        if (iMeasureset.length !== jMeasureset.length) {
          continue;
        }
        const spearmanCoff = spearmanCoefficient(iMeasureset, jMeasureset);
        if (Math.abs(spearmanCoff) > threshold) {
          result.push({
            type: InsightType.Correlation,
            fieldId: measureId,
            seriesName: [seriesNames[i], seriesNames[j]],
            significant: Math.abs(spearmanCoff),
            info: {
              correlationType: spearmanCoff > 0 ? 'positive' : 'negative'
            }
          } as unknown as Insight);
        }
      }
    }
  });
  return result;
};

export const LineChartCorrelation: InsightAlgorithm = {
  name: 'spearman',
  chartType: [ChartType.LineChart, ChartType.DualAxisChart],
  insightType: InsightType.Correlation,
  algorithmFunction: spearmanAlgo
};
