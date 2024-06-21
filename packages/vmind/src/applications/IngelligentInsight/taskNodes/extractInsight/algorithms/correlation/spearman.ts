import { isArray } from '@visactor/vutils';

import { spearmanCoefficient } from '../statistics';
import type { InsightAlgorithm, VMindInsight } from '../../../../types';
import { InsightType } from '../../../../types';
import type { VMindDataset } from '../../../../../../common/typings';
import { ChartType } from '../../../../../../common/typings';

const spearmanAlgo = (context: any) => {
  const { seriesDataMap, cell } = context;
  const { y: celly, spearmanThreshold } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];

  const result: VMindInsight[] = [];

  const threshold = spearmanThreshold ?? 0.8;
  const seriesNames = Object.keys(seriesDataMap);
  yField.forEach(measureId => {
    for (let i = 0; i < seriesNames.length; i++) {
      const iDataset: VMindDataset = seriesDataMap[seriesNames[i]];
      const iMeasureset = iDataset.map(d => d[measureId]) as number[];
      for (let j = i + 1; j < seriesNames.length; j++) {
        const jDataset: VMindDataset = seriesDataMap[seriesNames[j]];
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
            significant: Math.abs(spearmanCoff)
          } as unknown as VMindInsight);
        }
      }
    }
  });
  return result;
};

const LineChartCorrelation: InsightAlgorithm = {
  name: 'spearman',
  chartType: [ChartType.LineChart, ChartType.DualAxisChart],
  insightType: InsightType.Correlation,
  algorithmFunction: spearmanAlgo
};

export default LineChartCorrelation;
