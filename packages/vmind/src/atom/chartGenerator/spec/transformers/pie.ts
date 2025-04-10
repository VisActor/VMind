import type { GenerateChartCellContext } from '../../type';
import { color, commonLabel, data, discreteLegend, revisedVChartType, theme } from './common';

export const pieField = (context: GenerateChartCellContext) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  spec.valueField = cell.angle || cell.value;
  if (cell.color || (cell as any).category) {
    spec.categoryField = cell.color || (cell as any).category;
  }
  return { spec };
};

export const pipelinePie = [
  data,
  color,
  pieField,
  discreteLegend,
  commonLabel
  // animationCartesianPie,
];
