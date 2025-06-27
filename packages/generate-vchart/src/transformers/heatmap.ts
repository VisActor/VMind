import { GenerateChartInput } from '../types/transform';
import { BASIC_HEAT_MAP_COLOR_THEMES } from '../utils/constants';
import { arrayData, color } from './common';

export const basicHeatMapSeries = (context: GenerateChartInput) => {
  const { spec, cell } = context;
  spec.series = [
    {
      type: 'heatmap',
      xField: cell.x,
      yField: cell.y,
      valueField: cell.size,
      cell: {
        style: {
          fill: {
            field: cell.size,
            scale: 'color'
          }
        }
      }
    }
  ];
  return { spec };
};
export const basicHeatMapColor = (context: GenerateChartInput) => {
  const { spec, cell, colors } = context;
  spec.color = {
    type: 'linear',
    domain: [
      {
        dataId: 'data',
        fields: [cell.size]
      }
    ],
    range: colors ?? BASIC_HEAT_MAP_COLOR_THEMES
  };
  return { spec };
};
export const basicHeatMapAxes = (context: GenerateChartInput) => {
  const { spec } = context;
  spec.axes = [
    {
      orient: 'bottom',
      type: 'band',
      grid: {
        visible: false
      },
      domainLine: {
        visible: false
      }
    },
    {
      orient: 'left',
      type: 'band',
      grid: {
        visible: false
      },
      domainLine: {
        visible: false
      }
    }
  ];
  return { spec };
};

export const basicHeatMapLegend = (context: GenerateChartInput) => {
  const { spec } = context;
  spec.legends = {
    visible: true,
    orient: 'right',
    position: 'start',
    type: 'color',
    field: 'value'
  };
  return { spec };
};

export const pipelineBasicHeatMap = [
  arrayData,
  color,
  basicHeatMapSeries,
  basicHeatMapColor,
  basicHeatMapAxes,
  basicHeatMapLegend
];
