import { array, isArray, isBoolean } from '@visactor/vutils';
import {
  DIMENSION_AXIS_ID,
  MAIN_SERIES_ID,
  MEASURE_AXIS_LEFT_ID,
  MEASURE_AXIS_RIGHT_ID,
  SUB_SERIES_ID,
  COLOR_FIELD
} from '../utils/constants';
import { color, data, discreteLegend, formatXFields, labelForDefaultHide } from './common';
import { GenerateChartInput, SimpleChartAxisInfo } from '../types/transform';

export const formatFieldsOfDualAxis = (context: GenerateChartInput) => {
  const { chartType, cell } = context;
  const cellNew: any = { ...cell };
  //Dual-axis drawing yLeft and yRight

  cellNew.y = [cellNew.y, cellNew.yLeft, cellNew.yRight, cellNew.y1, cellNew.y2].filter(Boolean).flat();

  return {
    cell: cellNew
  };
};

export const dualAxisSeries = (context: GenerateChartInput) => {
  //assign series in dual-axis chart
  const { cell, spec, series } = context;
  const { color } = cell;
  const dataValues = spec.data.values;

  if (series) {
    spec.series = series.map(s => {
      return {
        ...s,
        data: {
          id: `data_${s.type}`,
          values: s.data
        },
        xField: cell.x,
        yField: cell.y[0],
        seriesField: color ? (isArray(color) ? color[0] : color) : null
      };
    });
    return { spec };
  }

  spec.series = [
    {
      type: 'bar',
      id: MAIN_SERIES_ID,
      data: {
        id: spec.data.id + '_bar',
        values: color ? dataValues : dataValues.map((d: any) => ({ ...d, [COLOR_FIELD]: cell.y[0] }))
      },
      dataIndex: 0,
      label: { visible: true },
      xField: cell.x,
      yField: cell.y[0],
      seriesField: color ? (isArray(color) ? color[0] : color) : COLOR_FIELD
    },
    {
      type: 'line',
      id: SUB_SERIES_ID,
      dataIndex: 0,
      data: {
        id: spec.data.id + '_line',
        values: color ? dataValues : dataValues.map((d: any) => ({ ...d, [COLOR_FIELD]: cell.y[1] }))
      },
      label: { visible: true },
      xField: cell.x,
      yField: cell.y[cell.y?.length - 1],
      seriesField: color ? (isArray(color) ? color[0] : color) : COLOR_FIELD
    }
  ];
  spec.data = undefined;
  spec.labelLayout = 'region';
  return { spec };
};

export const dualAxisAxes = (context: GenerateChartInput) => {
  //assign axes in dual-axis chart
  const { spec, series, axes } = context;

  if (series) {
    return { spec };
  }

  const bandAxisCfg: SimpleChartAxisInfo =
    axes === false ? { visible: false, hasGrid: false, type: 'band' } : array(axes).find(axis => axis.type === 'band');
  const leftAxisCfg: SimpleChartAxisInfo =
    axes === false
      ? { visible: false, hasGrid: false, type: 'linear' }
      : array(axes).find(axis => axis.type === 'linear' && axis.orient === 'left');
  const rightAxisCfg: SimpleChartAxisInfo =
    axes === false
      ? { visible: false, hasGrid: false, type: 'linear' }
      : array(axes).find(axis => axis.type === 'linear' && axis.orient === 'right');

  spec.axes = [
    {
      id: DIMENSION_AXIS_ID,
      visible: bandAxisCfg?.visible ?? true,
      type: 'band',
      orient: bandAxisCfg?.orient ?? 'bottom',
      ...(isBoolean(bandAxisCfg?.hasGrid)
        ? {
            grid: { visible: bandAxisCfg.hasGrid }
          }
        : {})
    },
    {
      id: MEASURE_AXIS_LEFT_ID,
      seriesId: MAIN_SERIES_ID,
      visible: leftAxisCfg?.visible ?? true,
      type: 'linear',
      orient: 'left',
      ...(isBoolean(leftAxisCfg?.hasGrid)
        ? {
            grid: { visible: leftAxisCfg.hasGrid }
          }
        : {})
    },
    {
      id: MEASURE_AXIS_RIGHT_ID,
      seriesId: SUB_SERIES_ID,
      type: 'linear',
      orient: 'right',
      visible: rightAxisCfg?.visible ?? true,
      tick: { visible: false },
      grid: { visible: rightAxisCfg?.hasGrid ?? false }
    }
  ];
  return { spec };
};

export const pipelineDualAxis = [
  formatXFields,
  formatFieldsOfDualAxis,
  data,
  color,
  dualAxisSeries,
  dualAxisAxes,
  discreteLegend,
  labelForDefaultHide
];
