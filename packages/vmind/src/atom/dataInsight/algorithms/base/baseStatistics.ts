import { isArray, isValidNumber } from '@visactor/vutils';
import type { AxesDataInfo, DataInsightExtractContext, Insight, InsightAlgorithm } from '../../type';
import { ChartType } from '../../../../types';
import { InsightType } from '../../type';
import { isStackChart, isStackChartInAxes } from '../../utils';

const getMinMaxAvg = (data: number[]) => {
  const min = {
    index: -1,
    value: Infinity
  };
  const max = {
    index: -1,
    value: -Infinity
  };
  let sum = 0;
  let validCount = 0;
  data.forEach((value, index) => {
    if (isValidNumber(value)) {
      sum += value;
      validCount++;
      if (value < min.value) {
        min.index = index;
        min.value = value;
      }
      if (value > max.value) {
        max.index = index;
        max.value = value;
      }
    }
  });
  return {
    min,
    max,
    avg: sum / validCount
  };
};

const getBaseInsightByDataset = (
  context: Pick<AxesDataInfo, 'dataset' | 'dimensionSumMap' | 'dimensionValues' | 'axisTitle'> & {
    xField: string;
    measureId: string | string[];
    isStack: boolean;
    isAxesArea?: boolean;
  }
) => {
  const {
    xField,
    measureId,
    dataset,
    isStack,
    dimensionSumMap,
    dimensionValues,
    axisTitle = [],
    isAxesArea = false
  } = context;
  const dataList = dataset.map((d, index) => ({
    index: index,
    dataItem: d
  }));
  const result: Insight[] = [];
  const yField = isArray(measureId) ? measureId[0] : measureId;
  const valueList = isStack ? dimensionSumMap[yField] : dataList.map(d => Number(d.dataItem[yField]));
  const { min, max, avg } = getMinMaxAvg(valueList);
  const titleName = (isArray(axisTitle) ? axisTitle?.[0] : axisTitle) || '';
  min.index !== -1 &&
    result.push({
      name: 'min',
      type: InsightType.Min,
      fieldId: yField,
      value: min.value,
      significant: 1,
      data: isStack
        ? dataList.filter(d => d.dataItem[xField] === dimensionValues[min.index])
        : [
            {
              index: min.index,
              dataItem: dataList[min.index].dataItem
            }
          ],
      info: {
        isAxesArea,
        titleName,
        isGroup: isStack,
        dimValue: isStack ? dimensionValues[min.index] : dataList[min.index].dataItem[xField]
      }
    });
  max.index !== -1 &&
    result.push({
      name: 'max',
      type: InsightType.Max,
      fieldId: yField,
      value: max.value,
      significant: 1,
      data: isStack
        ? dataList.filter(d => d.dataItem[xField] === dimensionValues[max.index])
        : [
            {
              index: max.index,
              dataItem: dataList[max.index].dataItem
            }
          ],
      info: {
        isAxesArea,
        titleName,
        isGroup: isStack,
        dimValue: isStack ? dimensionValues[max.index] : dataList[max.index].dataItem[xField]
      }
    });
  isValidNumber(avg) &&
    result.push({
      name: 'avg',
      type: InsightType.Avg,
      fieldId: yField,
      value: avg,
      significant: 1,
      data: [],
      info: {
        isAxesArea,
        titleName
      }
    });
  return result;
};

export interface BaseStatisticsOptions {
  defaultLeftAxisName?: string;
  defaultRightAxisName?: string;
}
const BaseStatisticsFunction = (context: DataInsightExtractContext, options: BaseStatisticsOptions) => {
  const result: Insight[] = [];
  const { spec, chartType, cell, leftAxesDataList, rightAxesDataList } = context;
  const { y: celly, x: cellx } = cell;
  const xField: string = isArray(cellx) ? cellx[0] : cellx;
  const yField: string = isArray(celly) ? celly[0] : celly;
  const baseInfo = {
    ...context,
    xField,
    measureId: yField
  };
  leftAxesDataList &&
    result.push(
      ...getBaseInsightByDataset({
        ...baseInfo,
        ...leftAxesDataList,
        isAxesArea: true,
        measureId: leftAxesDataList?.yField,
        axisTitle: leftAxesDataList.axisTitle || options?.defaultLeftAxisName,
        isStack: isStackChartInAxes(leftAxesDataList.series, chartType)
      })
    );
  rightAxesDataList &&
    result.push(
      ...getBaseInsightByDataset({
        ...baseInfo,
        ...rightAxesDataList,
        isAxesArea: true,
        measureId: rightAxesDataList?.yField,
        axisTitle: rightAxesDataList.axisTitle || options?.defaultRightAxisName,
        isStack: isStackChartInAxes(rightAxesDataList.series, chartType)
      })
    );
  !leftAxesDataList &&
    !rightAxesDataList &&
    result.push(
      ...getBaseInsightByDataset({
        ...baseInfo,
        axisTitle: '',
        isStack: isStackChart(spec, chartType, cell)
      })
    );
  return result;
};

export const BaseStatistics: InsightAlgorithm = {
  name: 'base',
  forceChartType: [ChartType.DualAxisChart, ChartType.LineChart, ChartType.BarChart, ChartType.AreaChart],
  insightType: InsightType.Min,
  supportPercent: false,
  algorithmFunction: BaseStatisticsFunction
};
