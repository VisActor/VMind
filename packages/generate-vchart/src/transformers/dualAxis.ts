import { isArray } from '@visactor/vutils';
import {
  DIMENSION_AXIS_ID,
  MAIN_SERIES_ID,
  MEASURE_AXIS_LEFT_ID,
  MEASURE_AXIS_RIGHT_ID,
  SUB_SERIES_ID,
  COLOR_FIELD
} from '../utils/constants';
import { color, data, discreteLegend } from './common';
import { GenerateChartInput } from '../types/transform';

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
  const { spec, series } = context;

  if (series) {
    return { spec };
  }

  spec.axes = [
    {
      id: DIMENSION_AXIS_ID,
      type: 'band',
      orient: 'bottom'
    },
    {
      id: MEASURE_AXIS_LEFT_ID,
      seriesId: MAIN_SERIES_ID,
      type: 'linear',
      orient: 'left'
    },
    {
      id: MEASURE_AXIS_RIGHT_ID,
      seriesId: SUB_SERIES_ID,
      type: 'linear',
      orient: 'right',
      tick: { visible: false },
      grid: { visible: false }
    }
  ];
  return { spec };
};

export const pipelineDualAxis = [data, color, dualAxisSeries, dualAxisAxes, discreteLegend];
