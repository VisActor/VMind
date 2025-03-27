import type { GenerateChartCellContext } from '../../type';
import { color, data, revisedVChartType, theme } from './common';

export const rangeColumnField = (context: GenerateChartCellContext) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  spec.yField = cell.x;

  spec.xField = [cell.y[0], cell.y[1]];

  return { spec };
};

export const rangeColumnDisplayConf = (context: GenerateChartCellContext) => {
  const { spec } = context;
  spec.direction = 'horizontal';
  spec.label = {
    visible: true
  };
  return { spec };
};

export const pipelineRangeColumn = [data, color, rangeColumnField, rangeColumnDisplayConf];
