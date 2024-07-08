import { isArray } from '@visactor/vutils';

import { coefficientVariation } from '../statistics';
import type { InsightAlgorithm, VMindInsight } from '../../../../types';
import { InsightType } from '../../../../types';
import type { VMindDataset } from '../../../../../../common/typings';
import { ChartType } from '../../../../../../common/typings';
import { DEFAULT_SERIES_NAME } from '../../../dataProcess/constants';

const volatilityAlgo = (context: any) => {
  const { seriesDataMap, cell } = context;
  const { y: celly, volatilityThreshold } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];

  const result: VMindInsight[] = [];

  const threshold = volatilityThreshold ?? 0.8;
  const seriesNames = Object.keys(seriesDataMap);
  seriesNames.forEach(series => {
    const seriesDataset: VMindDataset = seriesDataMap[series].map((d: any) => d.dataItem);
    yField.forEach(measureId => {
      const measureSet = seriesDataset.map(d => d[measureId]) as unknown as number[];

      const cv = coefficientVariation(measureSet);
      if (Math.abs(cv) > threshold) {
        result.push({
          type: InsightType.Volatility,
          fieldId: measureId,
          value: cv as unknown as number,
          significant: cv,
          seriesName: series === DEFAULT_SERIES_NAME ? undefined : series,
          info: {
            cv
          }
        } as unknown as VMindInsight);
      }
    });
  });
  return result;
};

const Volatility: InsightAlgorithm = {
  name: 'volatility',
  chartType: [ChartType.BarChart, ChartType.LineChart, ChartType.DualAxisChart, ChartType.RadarChart],
  insightType: InsightType.Volatility,
  algorithmFunction: volatilityAlgo
};

export default Volatility;
