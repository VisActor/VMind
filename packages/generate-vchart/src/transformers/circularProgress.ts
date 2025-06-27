import { GenerateChartInput } from '../types/transform';
import { color, data, indicator } from './common';

export const circularProgressField = (context: GenerateChartInput) => {
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

export const pipelineCircularProgress = [data, color, circularProgressField, indicator];
