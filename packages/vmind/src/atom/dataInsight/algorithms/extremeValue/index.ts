import { isArray, isNumber } from '@visactor/vutils';
import type { InsightAlgorithm } from '../../type';
import { InsightType, type DataInsightExtractContext, type Insight } from '../../type';
import { type DataItem } from '../../../../types';
import { isPercenSeries } from '../../utils';

const getExtremeValue = (
  dataset: { index: number; dataItem: DataItem }[],
  measureId: string | number,
  seriesName: string,
  propsLowerThreshold?: number,
  propsUpperThreshold?: number
): Insight[] => {
  if (!dataset || dataset.length === 0) {
    return [];
  }

  const lowerThreshold = propsLowerThreshold ?? 0.2;
  const upperThreshold = propsUpperThreshold ?? 5;

  const result: Insight[] = [];
  const sum = dataset
    .map(d => d.dataItem)
    .reduce((prev, cur) => {
      const numValue = parseFloat(cur[measureId] as string);
      const value = isNumber(numValue as number) ? Math.abs(numValue) : 0;
      return prev + value;
    }, 0);
  const avg = sum / dataset.length;
  if (avg - 0 <= Number.EPSILON) {
    return [];
  }
  dataset.forEach(d => {
    const numValue = parseFloat(d.dataItem[measureId] as string);

    const value = isNumber(numValue as number) ? Math.abs(numValue as number) : 0;

    const percent = value / avg;
    if (percent > upperThreshold) {
      result.push({
        type: InsightType.ExtremeValue,
        data: [d] as any,
        value: d.dataItem[measureId] as unknown as number,
        significant: percent / upperThreshold,
        fieldId: measureId,
        seriesName,
        info: {
          type: 'extreme_high',
          averageValue: avg,
          percent
        }
      } as unknown as Insight);
    }
    if (percent - 0 > Number.EPSILON && percent < lowerThreshold) {
      result.push({
        type: InsightType.ExtremeValue,
        data: [d] as any,
        value: d.dataItem[measureId] as unknown as number,
        significant: lowerThreshold / percent,
        fieldId: measureId,
        seriesName,
        info: {
          type: 'extreme_low',
          averageValue: avg,
          percent
        }
      } as unknown as Insight);
    }
  });
  return result;
};

export interface ExtremeValueOptions {
  upperThreshold?: number;
  lowerThreshold?: number;
}

/** The rules are too simple, they are useless in cases with large variance. */
const calcExtremeValue = (context: DataInsightExtractContext, options: ExtremeValueOptions): Insight[] => {
  const { seriesDataMap, cell, spec } = context;
  const { y: celly } = cell;
  const { upperThreshold, lowerThreshold } = options || {};
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];

  //calculate mean value
  const result: Insight[] = [];
  Object.keys(seriesDataMap).forEach(series => {
    const dataset = seriesDataMap[series];
    yField.forEach(measure => {
      if (isPercenSeries(spec, measure)) {
        return;
      }
      const insights = getExtremeValue(dataset, measure, series, lowerThreshold, upperThreshold);
      result.push(...insights);
    });
  });
  return [];
};

export const ExtremeValue: InsightAlgorithm = {
  name: 'extremeValue',
  insightType: InsightType.ExtremeValue,
  algorithmFunction: calcExtremeValue,
  supportStack: true,
  supportPercent: false
};
