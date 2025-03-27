import type { GenerateChartCellContext } from '../../type';
import { color, data, discreteLegend, revisedVChartType, theme } from './common';

export const radarField = (context: GenerateChartCellContext) => {
  const { cell, spec } = context;
  if (cell.x || cell.angle) {
    spec.categoryField = cell.x ?? cell.angle;
  }
  if (cell.y || cell.value) {
    spec.valueField = cell.y ?? cell.value;
  }
  if (cell.color) {
    spec.seriesField = cell.color;
  }
  if (!spec.categoryField && spec.seriesField) {
    spec.categoryField = spec.seriesField;
    delete spec.seriesField;
  }
  return { spec };
};

export const radarDisplayConf = (context: GenerateChartCellContext) => {
  const { spec, chartTheme } = context;
  if (chartTheme) {
    return { spec };
  }
  spec.area = {
    visible: true // show area
  };
  return { spec };
};

export const radarAxis = (context: GenerateChartCellContext) => {
  const { spec } = context;

  spec.axes = [
    {
      orient: 'radius', // radius axis
      zIndex: 100,

      domainLine: {
        visible: false
      },
      label: {
        visible: true,
        space: 0,
        style: {
          //textAlign: 'center',
          //stroke: '#fff',
          //lineWidth: 4
        }
      },
      grid: {
        smooth: false,
        style: {
          //lineDash: [0]
        }
      }
    },
    {
      orient: 'angle', // angle axis
      zIndex: 50,
      tick: {
        visible: false
      },
      domainLine: {
        visible: false
      },
      label: {
        space: 20
      },
      grid: {
        style: {
          //lineDash: [0]
        }
      }
    }
  ];

  return { spec };
};

export const pipelineRadar = [
  data,
  color,
  radarField,
  radarDisplayConf,
  radarAxis,
  discreteLegend
  // commonLabel,
  //animationCartisianLine,
];
