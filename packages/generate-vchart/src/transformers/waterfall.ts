import { isValid } from '@visactor/vutils';
import { GenerateChartInput } from '../types/transform';
import { axis } from './cartesian';
import { color, data, discreteLegend, formatXFields, labelForDefaultHide } from './common';

export const waterfallField = (context: GenerateChartInput) => {
  //assign field in spec according to cell
  const { cell, spec, waterfallTotal, transpose } = context;
  spec.xField = transpose ? cell.y : cell.x;
  spec.yField = transpose ? cell.x : cell.y;
  if (transpose) {
    spec.direction = 'horizontal';
  }

  if (waterfallTotal?.visible !== false) {
    spec.total = {
      type: 'end',
      text: waterfallTotal?.totalText ?? 'total'
    };
  }

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
  discreteLegend,
  labelForDefaultHide
];
