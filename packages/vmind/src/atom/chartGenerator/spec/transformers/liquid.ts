import type { GenerateChartCellContext } from '../../type';
import { color, data, indicator, revisedVChartType, theme } from './common';

export const liquidField = (context: GenerateChartCellContext) => {
  const { cell, spec } = context;

  spec.valueField = cell.value;
  spec.indicatorSmartInvert = true;

  return { spec };
};

export const liquidStyle = (context: GenerateChartCellContext) => {
  const { spec } = context;
  spec.liquid = {
    ...spec.liquid,
    style: {}
  };
  return { spec };
};

export const pipelineLiquid = [data, color, liquidField, liquidStyle, indicator];
