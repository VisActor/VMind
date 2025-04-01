import { sumDimensionValues } from './utils';
import type { DataCell, DataTable } from '../../types';
import { ChartType, type DataInsightCtx } from '../../types';
import { isArray, isValidNumber } from '@visactor/vutils';
import { DEFAULT_SERIES_NAME } from './const';
import { getFieldInfoFromDataset } from '../../utils/field';
import {
  getCellFromSpec,
  getChartTypeFromSpec,
  getDatasetFromSpec,
  getFieldMappingFromSpec,
  revisedCell
} from '../../utils/spec';
import type { DimValueDataMap } from './type';
import { transferFieldInfo } from '../dataClean/utils';
import { transferMeasureInTable } from '../../utils/dataTable';

interface AxesDataInfoCtx {
  spec: any;
  chartType: ChartType;
  seriesField: string;
  yField: string[];
  xField: string;
}

const getDimensionDataInfo = (context: {
  onlyOneSeries: boolean;
  xField: string;
  yField: string[];
  dataset: DataTable;
}) => {
  const { xField, yField, onlyOneSeries, dataset } = context;
  //group the data by xField
  const dimensionDataMap: DimValueDataMap = {};
  const dimensionValues: DataCell[] = [];
  dataset.forEach((dataItem, index) => {
    const groupBy = dataItem[xField];
    if (!groupBy) {
      return;
    }
    if (!dimensionDataMap[groupBy]) {
      dimensionDataMap[groupBy] = [];
      dimensionValues.push(groupBy);
    }
    dimensionDataMap[groupBy].push({ index, dataItem });
  });

  const dimensionStackSumMap: Record<string, number[]> = {};
  const dimensionSumMap: Record<string, number[]> = {};
  yField.forEach(measureId => {
    dimensionStackSumMap[measureId] = [];
    dimensionSumMap[measureId] = dimensionValues.map(dimension => {
      const dimensionDataset = dimensionDataMap[dimension].map(d => d.dataItem);
      dimensionStackSumMap[measureId].push(sumDimensionValues(dimensionDataset, measureId, v => v));
      return sumDimensionValues(dimensionDataset, measureId, onlyOneSeries ? v => v : undefined);
    });
  });
  return {
    dimensionDataMap,
    dimensionValues,
    dimensionSumMap,
    dimensionStackSumMap
  };
};

const getDataBySeries = (context: AxesDataInfoCtx & { position: string[] }) => {
  const { spec, xField, seriesField, position, yField } = context;
  const { series = [], _vmindAxesDiffKey = '_editor_axis_orient', data, axes = [] } = spec;
  const currentAxis = axes.find((v: any) => position.includes(v.orient));
  const axisTitle = currentAxis?.title?.text;
  let currentSeries = [];
  let seriesIndex = null;
  let seriesId = '';
  if (currentAxis?.seriesId) {
    seriesId = currentAxis?.seriesId;
    currentSeries = series.filter((s: any) => currentAxis.seriesId.includes(s.id));
  } else if (currentAxis?.seriesIndex) {
    seriesIndex = currentAxis?.seriesIndex;
    currentSeries = currentAxis.seriesIndex.map((v: any) => series[v]).filter((s: any) => !!s);
  } else {
    series.filter((s: any) => position.includes(s[_vmindAxesDiffKey]));
    seriesId = (series || []).map((v: any) => v.id).filter((v: any) => !!v);
  }
  const dataList: DataTable = [];
  currentSeries.forEach((s: any) => {
    if (s?.data?.values) {
      dataList.push(...s.data.values);
    } else if (s?.dataId) {
      dataList.push(...(data.find((subData: any) => subData.id === s.dataId)?.values || []));
    } else if (isValidNumber(s?.dataIndex)) {
      dataList.push(...(data?.[s.dataIndex]?.values || []));
    }
  });
  const seriesNames = seriesField ? [...new Set(dataList.map(d => d[seriesField] as string))] : [];
  return {
    dataset: dataList,
    series: currentSeries,
    seriesNames,
    axisTitle,
    seriesIndex: isArray(seriesIndex) ? seriesIndex[0] : seriesIndex,
    seriesId: isArray(seriesId) ? seriesId?.[0] : seriesId,
    yField: currentSeries?.[0]?.yField,
    ...getDimensionDataInfo({ xField, yField, onlyOneSeries: seriesNames.length === 1, dataset: dataList })
  };
};

export const extractAxesData = (context: AxesDataInfoCtx) => {
  const { chartType } = context;
  if (chartType !== ChartType.DualAxisChart) {
    return {};
  }
  return {
    leftAxesDataList: getDataBySeries({ ...context, position: ['left'] }),
    rightAxesDataList: getDataBySeries({ ...context, position: ['right'] })
  };
};

export const extractDataFromContext = (context: DataInsightCtx) => {
  const { spec, fieldInfo: inputFieldInfo, dataTable, vChartType } = context;

  const chartType = getChartTypeFromSpec(spec, vChartType);
  if (!chartType) {
    console.error('unsupported spec type');
    return null;
  }

  let dataset = dataTable;
  if (!dataset || dataset?.length === 0) {
    //no dataset in the input, extract from spec
    dataset = getDatasetFromSpec(spec);
  }
  const specFieldMapping = getFieldMappingFromSpec(spec);

  let fieldInfo = inputFieldInfo;
  if (!fieldInfo || fieldInfo?.length === 0) {
    fieldInfo = getFieldInfoFromDataset(dataset);
  }
  fieldInfo = transferFieldInfo(
    {
      fieldInfo
    },
    specFieldMapping
  )?.fieldInfo;
  const originDataset = dataset;
  dataset = transferMeasureInTable(dataset, fieldInfo);

  const cell = revisedCell(getCellFromSpec(spec, chartType), dataset);

  /** @todo dataset sort maybe difference in some special case */
  const { color, x: cellx, y: celly } = cell;
  const seriesField: string = isArray(color) ? color[0] : color;
  const seriesDataMap: DimValueDataMap = {};
  if (seriesField && ![ChartType.PieChart, ChartType.RoseChart].includes(chartType)) {
    dataset.forEach((dataItem, index) => {
      const groupBy = dataItem[seriesField];
      if (!groupBy || (chartType === ChartType.WaterFallChart && groupBy === 'total')) {
        return;
      }
      if (!seriesDataMap[groupBy]) {
        seriesDataMap[groupBy] = [];
      }
      seriesDataMap[groupBy].push({ index, dataItem });
    });
  } else {
    seriesDataMap[DEFAULT_SERIES_NAME] = dataset.map((dataItem, index) => ({ index, dataItem }));
  }

  const xField: string = isArray(cellx) ? cellx[0] : cellx;

  const yField: string[] = isArray(celly) ? celly.flat() : [celly];
  const onlyOneSeries = Object.keys(seriesDataMap).length === 1;
  return {
    dataset,
    originDataset,
    fieldInfo,
    chartType,
    seriesDataMap,
    cell,
    ...getDimensionDataInfo({ xField, yField, onlyOneSeries, dataset }),
    ...extractAxesData({ spec, chartType, seriesField, yField, xField })
  };
};
