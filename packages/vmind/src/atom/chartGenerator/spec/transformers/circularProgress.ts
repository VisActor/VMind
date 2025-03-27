import type { GenerateChartCellContext } from '../../type';
import { color, data, indicator, revisedVChartType, theme } from './common';

export const circularProgressField = (context: GenerateChartCellContext) => {
  //assign field in spec according to cell
  const { cell, spec } = context;

  spec.categoryField = cell.color;
  spec.valueField = cell.value;
  spec.seriesField = cell.color;

  spec.radius = 0.8;
  spec.innerRadius = 0.7;
  spec.roundCap = true;
  spec.cornerRadius = 20;

  return { spec };
};

export const circularProgressStyle = (context: GenerateChartCellContext) => {
  const { spec } = context;
  spec.progress = {
    ...spec.progress,
    style: {}
  };
  return { spec };
};

export const pipelineCircularProgress = [data, color, circularProgressField, circularProgressStyle, indicator];
