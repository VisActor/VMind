import { isArray } from '@visactor/vutils';
import type { GenerateChartCellContext } from '../../type';
import {
  DIMENSION_AXIS_ID,
  MAIN_SERIES_ID,
  MEASURE_AXIS_LEFT_ID,
  MEASURE_AXIS_RIGHT_ID,
  SUB_SERIES_ID
} from '../constants';
import { color, data, discreteLegend } from './common';
import { COLOR_FIELD } from '@visactor/chart-advisor';

export const dualAxisSeries = (context: GenerateChartCellContext) => {
  //assign series in dual-axis chart
  const { cell, spec, simpleVChartSpec } = context;
  const { color } = cell;
  const dataValues = spec.data.values;

  if (simpleVChartSpec && simpleVChartSpec.series) {
    spec.series = simpleVChartSpec.series.map(s => {
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
      seriesField: color ? (isArray(color) ? color[0] : color) : COLOR_FIELD,
      bar: {
        style: {}
      }
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
      seriesField: color ? (isArray(color) ? color[0] : color) : COLOR_FIELD,

      line: {
        style: {}
      },
      point: {
        style: {}
      }
    }
  ];
  spec.data = undefined;
  spec.labelLayout = 'region';
  return { spec };
};

export const dualAxisAxes = (context: GenerateChartCellContext) => {
  //assign axes in dual-axis chart
  const { spec, simpleVChartSpec } = context;

  if (simpleVChartSpec && simpleVChartSpec.series) {
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
      orient: 'left',
      label: {
        style: {}
      }
    },
    {
      id: MEASURE_AXIS_RIGHT_ID,
      seriesId: SUB_SERIES_ID,
      type: 'linear',
      orient: 'right',
      tick: { visible: false },
      grid: { visible: false },
      label: {
        style: {}
      }
    }
  ];
  return { spec };
};

export const pipelineDualAxis = [data, color, dualAxisSeries, dualAxisAxes, discreteLegend];
