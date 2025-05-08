import type { GenerateChartCellContext } from '../../type';
import { color, data, revisedVChartType, theme } from './common';

export const bubbleCirclePackingData = (context: GenerateChartCellContext) => {
  const { dataTable, spec, cell } = context;
  if (cell.size) {
    dataTable.forEach(data => {
      data.value = data[cell.size];

      if (cell.size !== 'value') {
        delete data[cell.size];
      }
    });
  }
  return { spec };
};

export const bubbleCirclePackingField = (context: GenerateChartCellContext) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  spec.categoryField = cell.color || cell.x;

  if (cell.size) {
    spec.valueField = cell.size;
  }

  return { spec };
};

export const bubbleCirclePackingDisplayConf = (context: GenerateChartCellContext) => {
  const { spec } = context;
  spec.drill = true;
  spec.layoutPadding = 5;
  spec.animationEnter = {
    easing: 'cubicInOut'
  };
  spec.animationExit = {
    easing: 'cubicInOut'
  };
  spec.animationUpdate = {
    easing: 'cubicInOut'
  };
  return { spec };
};

export const pipelineBubbleCirclePacking = [
  bubbleCirclePackingData,
  data,
  color,
  bubbleCirclePackingField,
  bubbleCirclePackingDisplayConf
];
