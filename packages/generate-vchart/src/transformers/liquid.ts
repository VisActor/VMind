import { isValid } from '@visactor/vutils';
import { GenerateChartInput } from '../types/transform';
import { color, commonLegend, data, findRequiredMeasureField, formatSizeFields, indicator } from './common';

export const liquidField = (context: GenerateChartInput) => {
  const { spec, cell } = context;

  const valueField = findRequiredMeasureField(context, ['value', 'size']);

  spec.valueField = valueField;
  spec.indicatorSmartInvert = true;

  return { spec, cell: isValid(valueField) ? { ...cell, value: valueField } : cell };
};

export const pipelineLiquid = [data, color, liquidField, indicator, commonLegend];
