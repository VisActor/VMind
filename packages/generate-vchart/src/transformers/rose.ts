import { array, isValid } from '@visactor/vutils';
import { GenerateChartInput, SimpleChartAxisInfo } from '../types/transform';
import { color, commonLabel, data, discreteLegend, formatColorFields } from './common';

export const roseField = (context: GenerateChartInput) => {
  const { cell } = formatColorFields(context, ['color', 'category', 'label']);

  const { spec } = context;
  spec.valueField = cell.radius ?? cell.angle;
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
  const { spec, axes } = context;
  const bandAxisCfg: SimpleChartAxisInfo =
    axes === false ? { visible: false, hasGrid: false, type: 'band' } : array(axes).find(axis => axis.type === 'band');
  const linearAxisCfg: SimpleChartAxisInfo =
    axes === false
      ? { visible: false, hasGrid: false, type: 'linear' }
      : array(axes).find(axis => axis.type === 'linear');

  spec.axes = [
    {
      visible: bandAxisCfg?.visible ?? true,
      orient: 'angle',
      domainLine: {
        visible: false
      },
      grid: {
        visible: bandAxisCfg?.hasGrid ?? false,
        alignWithLabel: false
      },
      label: {
        visible: true
      }
    },
    {
      visible: linearAxisCfg?.visible ?? true,
      orient: 'radius',
      grid: {
        visible: linearAxisCfg?.hasGrid ?? false,
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
