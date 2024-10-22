import { ROLE, DataType, ChartType } from '../../../types';
import type { Cell, ChartGeneratorCtx } from '../../../types';

export const getRuleLLMContent = (context: ChartGeneratorCtx) => {
  const { fieldInfo } = context;
  const measureFields = fieldInfo.filter(field => field.role === ROLE.MEASURE);
  let chartType = null;
  const cell: Cell = {};
  if (measureFields.length === 1 && measureFields[0].type === DataType.RATIO) {
    // waterwave spec
    chartType = ChartType.LiquidChart;
    cell.value = measureFields[0].fieldName;
    return {
      CHART_TYPE: chartType,
      FIELD_MAP: cell
    };
  }
  return null;
};
