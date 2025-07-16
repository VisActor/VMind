import type { SimpleVChartSpec } from '../../../atom/imageReader/interface';
import { ChartType } from '../../../types';
import type { Cell, ChartGeneratorCtx } from '../../../types';
import { unfoldTransform } from '../../../utils/unfold';
import type { DataTable } from '@visactor/generate-vchart';
import { DataRole, DataType, generateChart, getFieldInfoFromDataset } from '@visactor/generate-vchart';

/**
 * 根据规则去模拟LLM 生成结果
 * @param context
 * @returns
 */
export const getRuleLLMContent = (context: ChartGeneratorCtx) => {
  const { fieldInfo } = context;
  const measureFields = fieldInfo.filter(field => field.role === DataRole.MEASURE);
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

const formatDataTable = (simpleVChartSpec: SimpleVChartSpec, data: DataTable) => {
  if (simpleVChartSpec.type === 'rangeColumn') {
    const firstDatum = data[0];

    if (firstDatum && 'group' in firstDatum) {
      const groups = data.reduce((acc, cur) => {
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

export const getContextBySimpleVChartSpec = (simpleVChartSpec: SimpleVChartSpec) => {
  const { type, data, series, coordinate, palette } = simpleVChartSpec;
  const dataTable = formatDataTable(
    simpleVChartSpec,
    data ??
      series.reduce((acc, cur) => {
        acc.push(...cur.data);
        return acc;
      }, [] as typeof data)
  );
  const chartType =
    type === 'common'
      ? series && series.length >= 2 && series.some((s, index) => index > 0 && s.type !== series[0].type)
        ? type
        : series?.[0]?.type === 'bar' && coordinate === 'polar'
        ? 'rose'
        : series?.[0]?.type ?? type
      : type;

  const cell: Cell = {};
  const firstDatum = dataTable?.[0];
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

  const fieldInfo = getFieldInfoFromDataset(dataTable);

  if (chartType === 'rangeColumn' && 'value1' in firstDatum) {
    cell.y = ['value', 'value1'];
    fieldInfo.push({
      fieldName: 'value1',
      type: DataType.FLOAT,
      role: DataRole.MEASURE
    });
  }

  const context: ChartGeneratorCtx = generateChart(chartType, { ...simpleVChartSpec, dataTable, cell, fieldInfo });
  context.chartType = chartType;
  return context;
  // return { ...simpleVChartSpec, dataTable, cell, fieldInfo, chartType };
};
