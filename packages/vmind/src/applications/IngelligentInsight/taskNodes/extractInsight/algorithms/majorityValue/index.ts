import { isArray, isNumber } from '@visactor/vutils';
import type { DataItem } from '../../../../../../common/typings';
import { ChartType } from '../../../../../../common/typings';
import type { InsightAlgorithm, VMindInsight } from '../../../../types';
import { InsightType } from '../../../../types';
import { DEFAULT_SERIES_NAME } from '../../../dataProcess/constants';

const getMajorityInGroup = (
  dataset: DataItem[],
  measureId: string | number,
  seriesId: string | number,
  propsThreshold?: number
) => {
  const result: VMindInsight[] = [];
  const threshold = propsThreshold ?? 0.8;
  const sum = dataset.reduce((prev, cur) => {
    const value = isNumber(cur[measureId] as number) ? Math.abs(cur[measureId] as number) : 0;
    return prev + value;
  }, 0);
  if (sum - Number.EPSILON < 0) {
    return [];
  }
  dataset.forEach(dataItem => {
    const seriesName = dataItem[seriesId];
    const seriesValue: number = isNumber(dataItem[measureId] as number) ? Math.abs(dataItem[measureId] as number) : 0;
    const ratio = seriesValue / sum;
    if (ratio > threshold) {
      result.push({
        type: InsightType.MajorityValue,
        data: [dataItem as any],
        fieldId: measureId,
        value: dataItem[measureId] as unknown as number,
        significant: ratio,
        seriesName: seriesName === DEFAULT_SERIES_NAME ? undefined : seriesName,
        info: {
          ratio
        }
      } as unknown as VMindInsight);
    }
  });
  return result;
};

const calcMajorityValue = (context: any) => {
  const result: VMindInsight[] = [];
  const { cell, dimensionDataMap } = context;
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

  Object.keys(dimensionDataMap).forEach(dimension => {
    const dimensionDataset = dimensionDataMap[dimension];
    const dimensionInsights = getMajorityInGroup(dimensionDataset, yField[0], groupField);
    result.push(...dimensionInsights);
  });
  return result;
};

const LineChartMajorityValue: InsightAlgorithm = {
  name: 'majorityValue',
  chartType: [ChartType.LineChart, ChartType.DualAxisChart],
  insightType: InsightType.MajorityValue,
  algorithmFunction: calcMajorityValue
};

export default LineChartMajorityValue;
