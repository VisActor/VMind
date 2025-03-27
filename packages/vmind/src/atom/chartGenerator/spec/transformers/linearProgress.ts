import type { GenerateChartCellContext } from '../../type';
import { color, data, revisedVChartType, theme } from './common';

export const linearProgressField = (context: GenerateChartCellContext) => {
  //assign field in spec according to cell
  const { cell, spec } = context;

  spec.xField = cell.y;
  spec.yField = cell.x;
  if (cell.color) {
    spec.seriesField = cell.color;
  }
  spec.cornerRadius = 20;

  return { spec };
};

export const linearProgressAxes = (context: GenerateChartCellContext) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  const hasSingleData = spec.data.values && spec.data.values.length === 1;

  spec.axes = [
    {
      orient: 'left',
      type: 'band',
      domainLine: { visible: false },
      tick: { visible: false },
      label: {
        formatMethod: hasSingleData ? (val: any) => `${cell.x}: ${val}` : null,
        style: {
          fontSize: 16
        }
      }
    },
    {
      orient: 'bottom',
      type: 'linear',
      visible: true,
      grid: {
        visible: false
      },
      label: {
        formatMethod: (val: number) => {
          return val >= 0 && val <= 1 ? `${val * 100}%` : val;
        },
        flush: true
      }
    }
  ];

  return { spec };
};

export const linearProgressStyle = (context: GenerateChartCellContext) => {
  const { spec } = context;
  spec.progress = {
    ...spec.progress,
    style: {}
  };
  return { spec };
};

export const pipelineLinearProgress = [data, color, linearProgressField, linearProgressAxes, linearProgressStyle];
