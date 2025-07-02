import { GenerateChartInput } from '../types/transform';
import { color, data, formatColorFields, formatSizeFields, indicator } from './common';

export const circularProgressField = (context: GenerateChartInput) => {
  let { cell } = formatColorFields(context, ['color', 'x', 'label']);
  cell = formatSizeFields({ ...context, cell }, ['size', 'value', 'y']).cell;

  //assign field in spec according to cell
  const { spec } = context;

  spec.categoryField = cell.color;
  spec.valueField = cell.size;
  spec.seriesField = cell.color;

  spec.radius = 0.8;
  spec.innerRadius = 0.7;
  spec.roundCap = true;
  spec.cornerRadius = 20;

  return { spec, cell };
};

export const pipelineCircularProgress = [data, color, circularProgressField, indicator];
