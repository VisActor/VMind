import type { SimpleVChartSpec } from '../../../atom/imageReader/interface';
import { ROLE, DataType, ChartType } from '../../../types';
import type { Cell, ChartGeneratorCtx } from '../../../types';
import type { GenerateChartCellContext, SimpleVChartSpecMockContext } from '../type';
import { formatTypeToVMind } from '../spec/chartTypeUtils';
import { unfoldTransform } from '../../../utils/unfold';

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

const formatDataTable = (simpleVChartSpec: SimpleVChartSpec, data: any[]): any[] => {
  if (simpleVChartSpec.type === 'rangeColumn') {
    const firstDatum = data[0];

    if (firstDatum && 'group' in firstDatum) {
      const groups = data.reduce((acc: any[], cur: any) => {
        if (!acc.includes(cur.group)) {
          acc.push(cur.group);
        }
        return acc;
      }, []);

      if (groups.length === 2) {
        const newData = unfoldTransform(
          {
            keyField: 'group',
            valueField: 'value',
            groupBy: 'name'
          },
          data
        );

        return newData.map(entry => {
          return {
            name: entry.name,
            value: entry[groups[0]],
            value1: entry[groups[1]]
          };
        });
      }
    }
  }

  return data;
};

export const getCellContextBySimpleVChartSpec = (simpleVChartSpec: SimpleVChartSpec): SimpleVChartSpecMockContext => {
  const { type, transpose, stackOrPercent, coordinate, data, series, palette } = simpleVChartSpec;
  const cell: Cell = {};

  const dataTable = formatDataTable(
    simpleVChartSpec,
    data ??
      series.reduce((acc: any[], cur: any) => {
        acc.push(...cur.data);
        return acc;
      }, [])
  );

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
    } else if (type === 'rose') {
      cell.angle = 'name';
      cell.radius = 'value';
    } else if (type === 'radar') {
      cell.x = 'name';
      cell.y = 'value';
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

  if (chartType === 'rangeColumn' && 'value1' in firstDatum) {
    cell.y = ['value', 'value1'];
    fieldInfo.push({
      fieldName: 'value1',
      type: DataType.FLOAT,
      role: ROLE.MEASURE
    });
  }

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
