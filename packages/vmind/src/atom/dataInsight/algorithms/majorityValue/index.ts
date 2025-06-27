import { isArray, isNumber } from '@visactor/vutils';
import type { InsightAlgorithm } from '../../type';
import { InsightType, type DataInsightExtractContext, type Insight } from '../../type';
import { ChartType } from '../../../../types';
import type { DataItem } from '@visactor/generate-vchart';

const getMajorityInGroup = (
  dataset: { index: number; dataItem: DataItem }[],
  measureId: string | number,
  seriesId: string | number,
  dimensionId: string | number,
  threshold = 0.85
) => {
  const result: Insight[] = [];
  const sum = dataset.reduce((prev, cur) => {
    const dataValue = parseFloat(cur.dataItem[measureId] as string);
    const value = isNumber(dataValue) ? Math.abs(dataValue) : 0;
    return prev + value;
  }, 0);
  if (sum - Number.EPSILON < 0) {
    return [];
  }
  dataset.forEach(d => {
    const seriesName = d.dataItem[seriesId];
    const dimensionName = d.dataItem[dimensionId];
    const dataValue = parseFloat(d.dataItem[measureId] as string);
    const seriesValue: number = isNumber(dataValue) ? Math.abs(dataValue) : 0;
    const ratio = seriesValue / sum;
    if (ratio > threshold) {
      result.push({
        type: InsightType.MajorityValue,
        data: [d],
        fieldId: measureId,
        value: d.dataItem[measureId] as unknown as number,
        significant: ratio,
        seriesName,
        info: {
          ratio,
          dimensionName
        }
      } as unknown as Insight);
    }
  });
  return result;
};

export interface MajorityValueOptions {
  threshold?: number;
}

/** The rules are too simple */
const calcMajorityValue = (context: DataInsightExtractContext, options: MajorityValueOptions): Insight[] => {
  const result: Insight[] = [];
  const { cell, dimensionDataMap, seriesDataMap } = context;
  const { threshold } = options || {};
  const { y: celly, x: cellx, color } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];
  const xField: string = isArray(cellx) ? cellx[0] : cellx;
  let groupField: string | undefined;
  if (isArray(cellx) && cellx.length > 1) {
    groupField = cellx[1];
  } else {
    groupField = isArray(color) ? color[0] : color;
  }
  if (!groupField || !xField) {
    return [];
  }
  if (Object.keys(seriesDataMap).length <= 1) {
    return [];
  }

  Object.keys(dimensionDataMap).forEach(dimension => {
    const dimensionDataset = dimensionDataMap[dimension];
    const dimensionInsights = getMajorityInGroup(dimensionDataset, yField[0], groupField, xField, threshold);
    result.push(...dimensionInsights);
  });
  // return [];
  return result;
};

export const LineChartMajorityValue: InsightAlgorithm = {
  name: 'majorityValue',
  forceChartType: [ChartType.BarChart, ChartType.AreaChart, ChartType.WaterFallChart],
  insightType: InsightType.MajorityValue,
  algorithmFunction: calcMajorityValue
};
