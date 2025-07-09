import { GenerateChartInput } from '../types/transform';
import { color, commonLegend, data, formatColorFields, formatSizeFields, labelForDefaultShow } from './common';

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
  let { cell } = formatColorFields(context, ['color', 'x', 'label']);
  cell = formatSizeFields({ ...context, cell }, ['size', 'value', 'y', 'radius']).cell;
  const { spec } = context;

  spec.categoryField = cell.color ?? cell.x;

  if (cell.size) {
    spec.valueField = cell.size;
  }

  return { spec, cell };
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
  bubbleCirclePackingDisplayConf,
  commonLegend,
  labelForDefaultShow
];
