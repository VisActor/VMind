import type { GenerateChartCellContext } from '../../type';
import { BASIC_HEAT_MAP_COLOR_THEMES } from '../constants';
import { arrayData, color, revisedVChartType, theme } from './common';

export const basicHeatMapSeries = (context: GenerateChartCellContext) => {
  const { spec, cell } = context;
  spec.series = [
    {
      type: 'heatmap',
      regionId: 'region0',
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
export const basicHeatMapRegion = (context: GenerateChartCellContext) => {
  const { spec } = context;
  spec.region = [
    {
      id: 'region0',
      width: 200, // limit the width of the region
      height: 200, // limit the height of the region
      padding: {
        top: 40
      }
    }
  ];
  return { spec };
};
export const basicHeatMapColor = (context: GenerateChartCellContext) => {
  const { spec, cell } = context;
  spec.color = {
    type: 'linear',
    domain: [
      {
        dataId: 'data',
        fields: [cell.size]
      }
    ],
    range: BASIC_HEAT_MAP_COLOR_THEMES
  };
  return { spec };
};
export const basicHeatMapAxes = (context: GenerateChartCellContext) => {
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
      },
      label: {
        space: 10,
        style: {
          textAlign: 'left',
          textBaseline: 'middle',
          angle: 90,
          fontSize: 8
        }
      },
      bandPadding: 0,
      height: (layoutRect: any) => {
        // canvas height - region height - paddingTop - paddingBottom
        return layoutRect.height - 314;
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
      },
      label: {
        space: 10,
        style: {
          fontSize: 8
        }
      },
      bandPadding: 0
    }
  ];
  return { spec };
};

export const basicHeatMapLegend = (context: GenerateChartCellContext) => {
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
  basicHeatMapRegion,
  basicHeatMapColor,
  basicHeatMapAxes,
  basicHeatMapLegend
];
