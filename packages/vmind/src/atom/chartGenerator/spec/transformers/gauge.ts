import type { GenerateChartCellContext } from '../../type';
import { arrayData, color, revisedVChartType, theme } from './common';

export const gaugeField = (context: GenerateChartCellContext) => {
  const { spec, cell } = context;
  spec.valueField = cell.size;
  spec.categoryField = cell.color;
  return { spec };
};

export const gaugeDisplayConf = (context: GenerateChartCellContext) => {
  const { spec } = context;
  spec.outerRadius = 0.8;
  spec.innerRadius = 0.5;
  spec.startAngle = -180;
  spec.endAngle = 0;
  return { spec };
};

export const pipelineGauge = [arrayData, color, gaugeField, gaugeDisplayConf];
