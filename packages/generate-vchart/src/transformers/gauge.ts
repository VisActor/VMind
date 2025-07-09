import { GenerateChartInput } from '../types/transform';
import { arrayData, color, commonLegend, formatColorFields, formatSizeFields } from './common';

export const gaugeField = (context: GenerateChartInput) => {
  let { cell } = formatColorFields(context, ['color', 'label']);
  cell = formatSizeFields({ ...context, cell }, ['size', 'value']).cell;

  const { spec } = context;
  spec.valueField = cell.size;
  spec.categoryField = cell.color;
  return { spec, cell };
};

export const gaugeDisplayConf = (context: GenerateChartInput) => {
  const { spec } = context;
  spec.outerRadius = 0.8;
  spec.innerRadius = 0.5;
  spec.startAngle = -180;
  spec.endAngle = 0;
  return { spec };
};

export const pipelineGauge = [arrayData, color, gaugeField, gaugeDisplayConf, commonLegend];
