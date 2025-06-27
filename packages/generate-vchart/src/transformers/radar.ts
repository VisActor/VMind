import { isValid } from '@visactor/vutils';
import { GenerateChartInput } from '../types/transform';
import { color, data, discreteLegend } from './common';

export const radarField = (context: GenerateChartInput) => {
  const { cell, spec } = context;
  const categoryField = cell.x ?? cell.angle;
  if (isValid(categoryField)) {
    spec.categoryField = categoryField;
  }
  const valueField = cell.y ?? cell.value;
  if (isValid(valueField)) {
    spec.valueField = valueField;
  }
  if (isValid(cell.color)) {
    spec.seriesField = cell.color;
  }
  if (!spec.categoryField && spec.seriesField) {
    spec.categoryField = spec.seriesField;
    delete spec.seriesField;
  }
  return { spec };
};

export const radarDisplayConf = (context: GenerateChartInput) => {
  const { spec, chartTheme } = context;
  if (chartTheme) {
    return { spec };
  }
  spec.area = {
    visible: true // show area
  };
  return { spec };
};

export const radarAxis = (context: GenerateChartInput) => {
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
        space: 0
      },
      grid: {
        smooth: false
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
