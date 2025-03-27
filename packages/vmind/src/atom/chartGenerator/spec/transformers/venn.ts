import { registerVennChart } from '@visactor/vchart';
import { color, discreteLegend, revisedVChartType, theme } from './common';
import type { GenerateChartCellContext } from '../../type';
import type { DataCell } from '../../../../types/base';

export const vennData = (context: GenerateChartCellContext) => {
  const { dataTable, spec, cell } = context;
  const id2dataMap: Record<
    DataCell,
    {
      sets: DataCell[];
      value: DataCell;
    }
  > = {};
  const setsField = cell.color[0];
  const nameField = cell.color[1];
  dataTable.forEach(data => {
    if (id2dataMap[data[setsField]]) {
      id2dataMap[data[setsField]].sets.push(data[nameField]);
    } else {
      id2dataMap[data[setsField]] = { sets: [data[nameField]], value: data[cell.size] };
    }
  });
  spec.data = {
    values: Object.values(id2dataMap)
  };

  return { spec };
};

export const vennField = (context: GenerateChartCellContext) => {
  const { spec } = context;
  spec.valueField = 'value';
  spec.categoryField = 'sets';
  spec.seriesField = 'sets';
  return { spec };
};

export const registerChart = (context: GenerateChartCellContext) => {
  const { spec } = context;
  if (spec.type === 'venn') {
    registerVennChart();
  }
  return { spec };
};

export const pipelineVenn = [registerChart, vennData, color, vennField, discreteLegend];
