import type { GenerateChartCellContext } from '../../type';
import { color, commonLabel, data, discreteLegend, revisedVChartType, theme } from './common';

export const roseField = (context: GenerateChartCellContext) => {
  const { cell, spec } = context;
  spec.valueField = cell.radius || cell.angle;
  if (cell.color) {
    spec.categoryField = cell.color;
    spec.seriesField = cell.color;
  }
  spec.outerRadius = 0.8;
  spec.innerRadius = 0.2;

  return { spec };
};

export const roseAxis = (context: GenerateChartCellContext) => {
  const { spec } = context;

  spec.axes = [
    {
      orient: 'angle',
      domainLine: {
        visible: false
      },
      grid: {
        visible: false,
        alignWithLabel: false
      },
      label: {
        visible: true
      }
    },
    {
      orient: 'radius',
      grid: {
        visible: false,
        smooth: true
      }
    }
  ];
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
