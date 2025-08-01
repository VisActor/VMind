import { isArray, isUndefined } from '@visactor/vutils';
import {
  DIMENSION_AXIS_ID,
  MAIN_SERIES_ID,
  MEASURE_AXIS_LEFT_ID,
  MEASURE_AXIS_RIGHT_ID,
  SUB_SERIES_ID,
  COLOR_FIELD
} from '../utils/constants';
import { color, data, discreteLegend, formatXFields, labelForDefaultHide, parseAxesOfChart } from './common';
import { GenerateChartInput } from '../types/transform';

export const formatFieldsOfDualAxis = (context: GenerateChartInput) => {
  const { cell } = context;
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
      const group = color ? (isArray(color) ? color[0] : color) : null;
      return {
        ...s,
        id: s.type,
        data: {
          id: `data_${s.type}`,
          values: s.data
        },
        // 双轴图中有多组数据，则需要补充group
        xField: group ? [cell.x, group] : cell.x,
        yField: cell.y[0],
        seriesField: group
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

const generateAxes = (series: any[]) => {
  const idArr = Object.values(
    series.reduce((mp, ser) => {
      const { type, id } = ser;
      mp[type] ??= [];
      mp[type].push(id);
      return mp;
    }, {})
  );
  return [
    {
      orient: 'left',
      seriesId: idArr[0]
    },
    {
      orient: 'right',
      seriesId: idArr[1]
    },
    {
      orient: 'bottom'
    }
  ];
};

export const dualAxisAxes = (context: GenerateChartInput) => {
  //assign axes in dual-axis chart
  const { spec, series, axes } = context;

  if (series) {
    // 补充axes字段
    spec.axes ??= generateAxes(spec.series);
    return { spec };
  }

  spec.axes = parseAxesOfChart(context, [
    {
      defaultConfig: {
        type: 'band',
        orient: 'bottom'
      },
      userConfig: {
        id: DIMENSION_AXIS_ID
      },
      filters: [axis => axis.type === 'band']
    },
    {
      defaultConfig: {
        type: 'linear',
        orient: 'left'
      },
      userConfig: {
        id: MEASURE_AXIS_LEFT_ID,
        seriesId: MAIN_SERIES_ID
      },
      filters: [axis => axis.type === 'linear' && axis.orient === 'left']
    },
    {
      defaultConfig: {
        type: 'linear',
        orient: 'right',
        tick: { visible: false },
        grid: { visible: false }
      },
      userConfig: {
        id: MEASURE_AXIS_RIGHT_ID,
        seriesId: SUB_SERIES_ID
      },
      filters: [axis => axis.type === 'linear' && axis.orient === 'right']
    }
  ]);

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
