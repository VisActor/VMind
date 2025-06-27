import { GenerateChartInput } from '../types/transform';
import { color, data } from './common';

export const bubbleCirclePackingData = (context: GenerateChartInput) => {
  const { dataTable, spec, cell } = context;
  if (cell.size) {
    dataTable.forEach(data => {
      data.value = data[cell.size as string];

      if (cell.size !== 'value') {
        delete data[cell.size as string];
      }
    });
  }
  return { spec };
};

export const bubbleCirclePackingField = (context: GenerateChartInput) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  spec.categoryField = cell.color || cell.x;

  if (cell.size) {
    spec.valueField = cell.size;
  }

  return { spec };
};

export const bubbleCirclePackingDisplayConf = (context: GenerateChartInput) => {
  const { spec } = context;
  spec.drill = true;
  spec.layoutPadding = 5;
  return { spec };
};

export const pipelineBubbleCirclePacking = [
  bubbleCirclePackingData,
  data,
  color,
  bubbleCirclePackingField,
  bubbleCirclePackingDisplayConf
];
