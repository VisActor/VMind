import { GenerateChartInput } from '../types/transform';
import { arrayData, color } from './common';

export const gaugeField = (context: GenerateChartInput) => {
  const { spec, cell } = context;
  spec.valueField = cell.size;
  spec.categoryField = cell.color;
  return { spec };
};

export const gaugeDisplayConf = (context: GenerateChartInput) => {
  const { spec } = context;
  spec.outerRadius = 0.8;
  spec.innerRadius = 0.5;
  spec.startAngle = -180;
  spec.endAngle = 0;
  return { spec };
};

export const pipelineGauge = [arrayData, color, gaugeField, gaugeDisplayConf];
