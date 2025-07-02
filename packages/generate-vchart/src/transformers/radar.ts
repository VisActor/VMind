import { array, isBoolean, isValid } from '@visactor/vutils';
import { GenerateChartInput, SimpleChartAxisInfo } from '../types/transform';
import { color, data, discreteLegend, labelForDefaultHide } from './common';

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
  const { spec, axes } = context;
  const bandAxisCfg: SimpleChartAxisInfo =
    axes === false ? { visible: false, hasGrid: false, type: 'band' } : array(axes).find(axis => axis.type === 'band');
  const linearAxisCfg: SimpleChartAxisInfo =
    axes === false
      ? { visible: false, hasGrid: false, type: 'linear' }
      : array(axes).find(axis => axis.type === 'linear');

  spec.axes = [
    {
      visible: linearAxisCfg?.visible ?? true,
      orient: 'radius', // radius axis
      zIndex: 100,
      type: 'linear',

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
      visible: bandAxisCfg?.visible ?? true,
      orient: 'angle', // angle axis
      type: 'band',
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
  if (isBoolean(linearAxisCfg?.hasGrid)) {
    spec.axes[0].grid = {
      ...spec.axes[0].grid,
      visible: linearAxisCfg.hasGrid
    };
  }

  if (isBoolean(bandAxisCfg?.hasGrid)) {
    spec.axes[1].grid = {
      visible: bandAxisCfg.hasGrid
    };
  }

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
