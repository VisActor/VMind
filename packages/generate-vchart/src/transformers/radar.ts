import { array, isBoolean, isValid } from '@visactor/vutils';
import { GenerateChartInput, SimpleChartAxisInfo } from '../types/transform';
import { color, data, discreteLegend, labelForDefaultHide, parseAxesOfChart } from './common';

export const radarField = (context: GenerateChartInput) => {
  const { cell, spec } = context;
  const categoryField = cell.x ?? cell.angle ?? cell.category;
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
  const { spec, axes } = context;

  spec.axes = parseAxesOfChart(context, [
    {
      defaultConfig: {
        orient: 'radius', // radius axis
        type: 'linear',

        domainLine: {
          visible: false
        },
        label: {
          visible: true
        }
      },
      userConfig: {
        zIndex: 100,
        label: {
          space: 0
        },
        grid: {
          smooth: false
        }
      },
      filters: [axis => axis.type === 'linear']
    },
    {
      defaultConfig: {
        orient: 'angle', // angle axis
        type: 'band',
        tick: {
          visible: false
        },
        domainLine: {
          visible: false
        }
      },
      userConfig: {
        zIndex: 50,
        label: {
          space: 20
        }
      },
      filters: [axis => axis.type === 'band']
    }
  ]);

  return { spec };
};

export const pipelineRadar = [
  data,
  color,
  radarField,
  radarDisplayConf,
  radarAxis,
  discreteLegend,
  labelForDefaultHide
  // commonLabel,
  //animationCartisianLine,
];
