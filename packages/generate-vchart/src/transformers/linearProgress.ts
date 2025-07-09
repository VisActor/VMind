import { DataRole } from '../utils/enum';
import { GenerateChartInput, SimpleChartAxisInfo } from '../types/transform';
import { color, commonLegend, data, formatColorFields, labelForDefaultHide, parseAxesOfChart } from './common';
import { getFieldsByRoleType, getRemainedFields } from '../utils/field';
import { array, isBoolean, isValid } from '@visactor/vutils';

export const formatFieldsOfLinearProgressChart = (context: GenerateChartInput) => {
  const { cell, fieldInfo } = context;
  const cellNew = { ...cell };
  const xField = [cellNew.x, cellNew.color].filter(Boolean).flat();
  if (xField.length !== 0) {
    cellNew.x = xField[0];
  } else {
    const remainedFields = getRemainedFields(cellNew, fieldInfo);
    const xField = getFieldsByRoleType(remainedFields, DataRole.DIMENSION);
    if (xField) {
      cellNew.x = xField.fieldName;
    } else {
      cellNew.x = remainedFields?.[0].fieldName;
    }
  }

  const yField = [cellNew.y, cellNew.size, cellNew.value, cellNew.radius, cellNew.angle].filter(Boolean).flat();
  if (yField.length !== 0) {
    cellNew.y = yField[0];
  } else {
    const remainedFields = getRemainedFields(cellNew, fieldInfo);
    const yField = getFieldsByRoleType(remainedFields, DataRole.MEASURE);
    if (yField) {
      cellNew.y = yField.fieldName;
    } else {
      cellNew.y = remainedFields?.[0].fieldName;
    }
  }
  return {
    cell: cellNew
  };
};

export const linearProgressField = (context: GenerateChartInput) => {
  //assign field in spec according to cell
  const { spec } = context;
  const { cell } = formatColorFields(context, ['color', 'x', 'label']);

  spec.xField = cell.y;
  spec.yField = cell.x;
  if (isValid(cell.color)) {
    spec.seriesField = cell.color;
  }
  spec.cornerRadius = 20;

  return { spec, cell };
};

export const linearProgressAxes = (context: GenerateChartInput) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  const hasSingleData = spec.data.values && spec.data.values.length === 1;

  spec.axes = parseAxesOfChart(context, [
    {
      defaultConfig: {
        type: 'band',
        orient: 'left',
        domainLine: { visible: false },
        tick: { visible: false }
      },
      userConfig: {
        label: {
          formatMethod: hasSingleData ? (val: any) => `${cell.x}: ${val}` : null
        }
      },
      filters: [axis => axis.type === 'band']
    },
    {
      defaultConfig: {
        type: 'linear',
        orient: 'bottom',
        grid: { visible: false }
      },
      userConfig: {
        label: {
          formatMethod: (val: number) => {
            return val >= 0 && val <= 1 ? `${val * 100}%` : val;
          },
          flush: true
        }
      },
      filters: [axis => axis.type === 'linear']
    }
  ]);

  return { spec };
};

export const pipelineLinearProgress = [
  formatFieldsOfLinearProgressChart,
  data,
  color,
  linearProgressField,
  linearProgressAxes,
  commonLegend,
  labelForDefaultHide
];
