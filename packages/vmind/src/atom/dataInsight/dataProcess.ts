import {
  getCellFromSpec,
  getChartTypeFromSpec,
  getDatasetFromSpec,
  getFieldMappingFromSpec,
  revisedCell,
  sumDimensionValues
} from './utils';
import type { DataCell } from '../../types';
import { ChartType, type DataInsightCtx } from '../../types';
import { isArray } from '@visactor/vutils';
import { DEFAULT_SERIES_NAME } from './const';
import { getFieldInfoFromDataset } from '../../utils/field';
import type { DimValueDataMap } from './type';
import { transferFieldInfo } from '../dataClean/utils';
import { transferMeasureInTable } from '../../utils/dataTable';

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
  dataset = transferMeasureInTable(dataset, fieldInfo);

  const cell = revisedCell(getCellFromSpec(spec, chartType), dataset);

  /** @todo dataset sort maybe difference in some special case */
  const { color, x: cellx, y: celly } = cell;
  const seriesField: string = isArray(color) ? color[0] : color;
  const seriesDataMap: DimValueDataMap = {};
  if (seriesField && ![ChartType.PieChart, ChartType.RoseChart].includes(chartType)) {
    dataset.forEach((dataItem, index) => {
      const groupBy = dataItem[seriesField];
      if (!groupBy) {
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

  const yField: string[] = isArray(celly) ? celly.flat() : [celly];
  const onlyOneSeries = Object.keys(seriesDataMap).length === 1;
  const dimensionSumMap: Record<string, number[]> = {};
  yField.forEach(measureId => {
    dimensionSumMap[measureId] = dimensionValues.map(dimension => {
      const dimensionDataset = dimensionDataMap[dimension].map(d => d.dataItem);
      return sumDimensionValues(dimensionDataset, measureId, onlyOneSeries ? v => v : undefined);
    });
  });
  return { dataset, fieldInfo, chartType, dimensionDataMap, dimensionValues, dimensionSumMap, seriesDataMap, cell };
};
