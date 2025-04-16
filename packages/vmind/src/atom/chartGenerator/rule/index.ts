import type { SimpleVChartSpec } from 'src/atom/imageReader/interface';
import { ROLE, DataType, ChartType } from '../../../types';
import type { Cell, ChartGeneratorCtx } from '../../../types';
import type { GenerateChartCellContext } from '../type';
import { formatTypeToVMind } from '../spec/chartTypeUtils';

/**
 * 根据规则去模拟LLM 生成结果
 * @param context
 * @returns
 */
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

export const getCellContextBySimpleVChartSpec = (
  simpleVChartSpec: SimpleVChartSpec
): {
  ctx: Partial<GenerateChartCellContext>;
  mockLLMContent: {
    CHART_TYPE: ChartType;
    FIELD_MAP: Cell;
    stackOrPercent?: 'stack' | 'percent';
    transpose?: boolean;
  };
} => {
  const { type, transpose, stackOrPercent, coordinate, data, series } = simpleVChartSpec;
  const cell: Cell = {};
  const dataTable =
    data ??
    series.reduce((acc, cur) => {
      acc.push(...cur.data);
      return acc;
    }, []);
  const firstDatum = dataTable?.[0];

  if (firstDatum && 'group' in firstDatum) {
    cell.color = 'group';
  }

  if (coordinate === 'polar') {
    cell.angle = 'name';
    cell.radius = 'value';
    cell.category = 'name';
  } else if (coordinate === 'rect') {
    cell.x = 'name';
    cell.y = 'value';
  } else {
  }

  const fieldInfo = ['name', 'value', 'group'].reduce((res, field) => {
    if (firstDatum && field in firstDatum) {
      res.push({
        fieldName: field,
        type: field === 'value' ? DataType.FLOAT : DataType.STRING,
        role: field === 'value' ? ROLE.MEASURE : ROLE.DIMENSION
      });
    }

    return res;
  }, []);

  return {
    mockLLMContent: {
      CHART_TYPE: formatTypeToVMind(type) as ChartType,
      FIELD_MAP: cell,
      stackOrPercent,
      transpose
    },
    ctx: {
      dataTable,
      fieldInfo
    }
  };
};
