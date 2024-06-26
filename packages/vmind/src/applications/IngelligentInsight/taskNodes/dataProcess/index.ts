import type { RuleBasedTaskNodeMeta } from '../../../../base/metaTypes';
import { TaskNodeType } from '../../../../base/taskNode/types';
import type { InsightContext, InsightOutput } from '../../../types';
import type { Transformer } from '../../../../base/tools/transformer';
import { getCellFromSpec, getChartTypeFromSpec, getDatasetFromSpec } from '../../../../common/specUtils';
import { getFieldInfoFromDataset } from '../../../../common/dataProcess';
import type { DataProcessOutput } from '../../types';
import { isArray } from '@visactor/vutils';
import type { DataItem } from '../../../../common/typings';
import { DEFAULT_SERIES_NAME } from './constants';

const extractDataFromContext: Transformer<InsightContext, DataProcessOutput> = (context: InsightContext) => {
  const { spec, fieldInfo: inputFieldInfo, cell: inputCell, dataset: inputDataset } = context;

  const chartType = getChartTypeFromSpec(spec);
  if (!chartType) {
    throw new Error('unsupported spec type');
  }
  let dataset = inputDataset;
  if (!dataset) {
    //no dataset in the input, extract from spec
    dataset = getDatasetFromSpec(spec);
  }
  let cell = inputCell;
  if (!cell) {
    cell = getCellFromSpec(spec);
  }

  let fieldInfo = inputFieldInfo;
  if (!fieldInfo) {
    fieldInfo = getFieldInfoFromDataset(dataset);
  }

  const { color, x: cellx } = cell;

  const seriesField: string = isArray(color) ? color[0] : color;
  const seriesDataMap: Record<string | number, DataItem[]> = {};
  if (seriesField) {
    dataset.forEach(dataItem => {
      const groupBy = dataItem[seriesField];
      if (!groupBy) {
        return;
      }
      if (!seriesDataMap[groupBy]) {
        seriesDataMap[groupBy] = [];
      }
      seriesDataMap[groupBy].push(dataItem);
    });
  } else {
    seriesDataMap[DEFAULT_SERIES_NAME] = dataset;
  }
  const xField: string = isArray(cellx) ? cellx[0] : cellx;
  //group the data by xField
  const dimensionDataMap: Record<string | number, DataItem[]> = {};
  dataset.forEach(dataItem => {
    const groupBy = dataItem[xField];
    if (!groupBy) {
      return;
    }
    if (!dimensionDataMap[groupBy]) {
      dimensionDataMap[groupBy] = [];
    }
    dimensionDataMap[groupBy].push(dataItem);
  });
  return { dataset, cell, fieldInfo, chartType, seriesDataMap, dimensionDataMap };
};

const DataProcessTaskNodeMeta: RuleBasedTaskNodeMeta<InsightContext, InsightOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [extractDataFromContext]
};

export default DataProcessTaskNodeMeta;
