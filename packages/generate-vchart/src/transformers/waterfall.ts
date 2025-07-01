import { GenerateChartInput } from '../types/transform';
import { axis } from './cartesian';
import { color, data, discreteLegend, formatXFields } from './common';

export const waterfallField = (context: GenerateChartInput) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  spec.xField = cell.x;
  spec.yField = cell.y;
  spec.total = {
    type: 'end',
    text: '总计'
  };

  return { spec };
};

export const waterfallStackLabel = (context: GenerateChartInput) => {
  //assign axises
  const { spec } = context;
  spec.stackLabel = {
    valueType: 'absolute'
  };
  return { spec };
};

export const pipelineWaterfall = [
  formatXFields,
  data,
  color,
  waterfallField,
  axis,
  waterfallStackLabel,
  discreteLegend
];
