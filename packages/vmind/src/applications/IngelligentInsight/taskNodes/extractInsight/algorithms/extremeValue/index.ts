import { isArray, isNumber } from '@visactor/vutils';
import type { DataItem } from '../../../../../../common/typings';
import { ChartType } from '../../../../../../common/typings';
import type { InsightAlgorithm, VMindInsight } from '../../../../types';
import { InsightType } from '../../../../types';
import { DEFAULT_SERIES_NAME } from '../../../dataProcess/constants';

const getExtremeValue = (
  dataset: { index: number; dataItem: DataItem }[],
  measureId: string | number,
  seriesName: string,
  propsLowerThreshold?: number,
  propsUpperThreshold?: number
): VMindInsight[] => {
  if (!dataset || dataset.length === 0) {
    return [];
  }

  const lowerThreshold = propsLowerThreshold ?? 0.2;
  const upperThreshold = propsUpperThreshold ?? 5;

  const result: VMindInsight[] = [];
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
        seriesName: seriesName === DEFAULT_SERIES_NAME ? undefined : seriesName,
        info: {
          type: 'extreme_high',
          averageValue: avg,
          percent
        }
      } as unknown as VMindInsight);
    }
    if (percent - 0 > Number.EPSILON && percent < lowerThreshold) {
      result.push({
        type: InsightType.ExtremeValue,
        data: [d] as any,
        value: d.dataItem[measureId] as unknown as number,
        significant: lowerThreshold / percent,
        fieldId: measureId,
        seriesName: seriesName === DEFAULT_SERIES_NAME ? undefined : seriesName,
        info: {
          type: 'extreme_low',
          averageValue: avg,
          percent
        }
      } as unknown as VMindInsight);
    }
  });
  return result;
};

const calcExtremeValue = (context: any): VMindInsight[] => {
  const { seriesDataMap, cell } = context;
  const { y: celly } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];

  //calculate mean value
  const result: VMindInsight[] = [];
  Object.keys(seriesDataMap).forEach(series => {
    const dataset = seriesDataMap[series];
    yField.forEach(measure => {
      const insights = getExtremeValue(dataset, measure, series);
      result.push(...insights);
    });
  });
  return result;
};

const ExtremeValue: InsightAlgorithm = {
  name: 'extremeValue',
  chartType: [ChartType.BarChart, ChartType.LineChart, ChartType.RadarChart, ChartType.DualAxisChart],
  insightType: InsightType.ExtremeValue,
  algorithmFunction: calcExtremeValue
};

export default ExtremeValue;
