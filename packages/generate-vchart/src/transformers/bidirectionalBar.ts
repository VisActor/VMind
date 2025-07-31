import { GenerateChartInput } from '../types';
import { data, discreteLegend, formatXFields } from './common';
import { array, isUndefined } from '@visactor/vutils';

export const layout = (context: GenerateChartInput) => {
  const { spec } = context;
  spec.layout = {
    type: 'grid',
    col: 4,
    row: 4,
    elements: [
      { modelId: 'title', col: 0, row: 0, colSpan: 4 },

      { modelId: 'legend', col: 0, row: 3, colSpan: 4 },

      { modelId: 'leftAxesCountry', col: 0, row: 1 },
      { modelId: 'leftRegion', col: 1, row: 1 },
      { modelId: 'leftAxesValue', col: 1, row: 2 },

      { modelId: 'rightRegion', col: 2, row: 1 },
      { modelId: 'rightAxesCountry', col: 3, row: 1 },
      { modelId: 'rightAxesValue', col: 2, row: 2 }
    ]
  };
  spec.region = [{ id: 'leftRegion' }, { id: 'rightRegion' }];
  return { spec };
};

export const bidirectionalBarSeries = (context: GenerateChartInput) => {
  const { spec, series: originalSeries, dataTable, cell } = context;
  let series = originalSeries;
  if (!originalSeries) {
    series = Object.values(
      dataTable.reduce((mp, curr) => {
        curr.value = Math.abs(Number(curr.value));
        if (!mp[curr.group]) {
          mp[curr.group] = [];
        }
        mp[curr.group].push(curr);
        return mp;
      }, {} as Record<string, any[]>)
    ).map(ser => ({ type: 'bar', data: ser }));
  }
  const palette = 'palette' in context ? array(context.palette) : ['#5b9bd5', '#ec7c82'];
  const typeCnt = {};
  spec.series = series.map((s, index) => {
    const type = s.type;
    if (isUndefined(typeCnt[type])) {
      typeCnt[type] = 0;
    } else {
      typeCnt[type]++;
    }
    return {
      ...s,
      regionId: index % 2 === 0 ? 'leftRegion' : 'rightRegion',
      direction: 'horizontal',
      bar: { style: { fill: palette[index % palette.length] } },
      id: `${type}${typeCnt[type]}`,
      data: {
        id: `data_${type}${typeCnt[type]}`,
        values: s.data
      },
      xField: cell.y,
      yField: cell.x
    };
  });
  return { spec };
};

export const bidirectionalBarAxes = (context: GenerateChartInput) => {
  const { spec } = context;
  const { series } = spec;
  spec.axes = [
    {
      id: 'leftAxesCountry',
      seriesId: [series[0].id],
      orient: 'left',
      type: 'band'
    },
    {
      id: 'rightAxesCountry',
      seriesId: [series[1].id],
      orient: 'right',
      type: 'band'
    },
    {
      id: 'leftAxesValue',
      seriesId: [series[0].id],
      orient: 'bottom',
      type: 'linear',
      inverse: true
    },
    {
      id: 'rightAxesValue',
      seriesId: [series[1].id],
      orient: 'bottom',
      type: 'linear'
    }
  ];
  return { spec };
};

export const bidirectionalBarLegend = (context: GenerateChartInput) => {
  const { spec } = context;
  spec.legends = array(spec.legends).map(legend => ({
    ...legend,
    id: 'legend'
  }));
  return { spec };
};

export const bidirectionalBarTitle = (context: GenerateChartInput) => {
  const { spec } = context;
  const { title } = spec;
  spec.title = {
    ...title,
    id: 'title'
  };
  return { spec };
};

export const pipelineBidirectionalBar = [
  bidirectionalBarTitle,
  formatXFields,
  layout,
  data,
  bidirectionalBarSeries,
  bidirectionalBarAxes,
  discreteLegend,
  bidirectionalBarLegend
];
