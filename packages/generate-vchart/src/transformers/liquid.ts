import { GenerateChartInput } from '../types/transform';
import { color, data, indicator } from './common';

export const liquidField = (context: GenerateChartInput) => {
  const { cell, spec } = context;

  spec.valueField = cell.value;
  spec.indicatorSmartInvert = true;

  return { spec };
};

export const pipelineLiquid = [data, color, liquidField, indicator];
