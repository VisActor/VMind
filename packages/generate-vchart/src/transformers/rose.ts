import { array, isValid } from '@visactor/vutils';
import { GenerateChartInput, SimpleChartAxisInfo } from '../types/transform';
import { color, commonLabel, data, discreteLegend, formatColorFields, parseAxesOfChart } from './common';

export const roseField = (context: GenerateChartInput) => {
  const { cell } = formatColorFields(context, ['color', 'category', 'label']);

  const { spec } = context;
  spec.valueField = cell.value ?? cell.radius;
  const colorField = cell.color ?? cell.category;

  if (isValid(colorField)) {
    spec.categoryField = cell.category ?? cell.color;
    spec.seriesField = cell.color ?? cell.category;
  }
  spec.outerRadius = 0.8;
  spec.innerRadius = 0.2;

  return { spec, cell };
};

export const roseAxis = (context: GenerateChartInput) => {
  const { spec } = context;

  spec.axes = parseAxesOfChart(context, [
    {
      defaultConfig: {
        orient: 'angle',
        domainLine: {
          visible: false
        },
        grid: {
          visible: false
        },
        label: {
          visible: true
        }
      },
      userConfig: {
        grid: {
          alignWithLabel: false
        }
      },
      filters: [axis => axis.orient === 'angle']
    },
    {
      defaultConfig: {
        orient: 'radius',
        grid: {
          visible: false
        }
      },
      userConfig: {
        grid: {
          smooth: true
        }
      },
      filters: [axis => axis.orient === 'radius']
    }
  ]);

  return { spec };
};

export const pipelineRose = [
  data,
  color,
  roseField,
  roseAxis,
  discreteLegend,
  commonLabel
  //animationCartesianPie,
];
