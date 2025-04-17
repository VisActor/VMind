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
  const { type, transpose, stackOrPercent, coordinate, data, series, palette } = simpleVChartSpec;
  const cell: Cell = {};
  const dataTable =
    data ??
    series.reduce((acc, cur) => {
      acc.push(...cur.data);
      return acc;
    }, []);
  const firstDatum = dataTable?.[0];
  const chartType =
    type === 'common'
      ? series && series.length >= 2 && series.some((s, index) => index > 0 && s.type !== series[0].type)
        ? type
        : series?.[0]?.type === 'bar' && coordinate === 'polar'
        ? 'rose'
        : series?.[0]?.type ?? type
      : type;

  if (firstDatum && 'group' in firstDatum) {
    cell.color = 'group';
  } else if (palette && palette.length === dataTable.length && palette.length > 1) {
    cell.color = 'name';
  }

  if (coordinate === 'polar') {
    if (type === 'pie') {
      cell.angle = 'value';
    } else {
      cell.angle = 'name';
      cell.radius = 'value';
    }
    cell.category = 'name';
  } else if (coordinate === 'rect' || chartType === 'funnel') {
    cell.x = 'name';
    cell.y = 'value';
  } else if (chartType === 'circlePacking') {
    cell.size = 'value';
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
      CHART_TYPE: formatTypeToVMind(chartType) as ChartType,
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
