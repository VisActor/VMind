import { GenerateChartInput } from '../types/transform';
import { isValidDataTable } from '../utils/data';
import { color, commonLabel, discreteLegend } from './common';

export const funnelData = (context: GenerateChartInput) => {
  const { dataTable, cell, spec } = context;
  // spec.data = [dataTable]
  spec.data = {
    id: 'data',
    values: isValidDataTable(dataTable)
      ? dataTable.sort((a: any, b: any) => b[cell.y as string] - a[cell.y as string])
      : []
  };

  return { spec };
};

export const funnelField = (context: GenerateChartInput) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  spec.categoryField = cell.color || cell.x;
  spec.valueField = cell.value || cell.y;

  return { spec };
};

export const pipelineFunnel = [funnelData, color, funnelField, discreteLegend, commonLabel];
