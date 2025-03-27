import type { GenerateChartCellContext } from '../../type';
import { color, data, discreteLegend, revisedVChartType, theme } from './common';

export const waterfallField = (context: GenerateChartCellContext) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  spec.xField = cell.x;
  spec.yField = cell.y;
  spec.total = {
    type: 'end',
    text: '总计'
  };

  return { spec };
};

export const waterfallAxes = (context: GenerateChartCellContext) => {
  //assign axises
  const { spec } = context;
  spec.axes = [
    {
      orient: 'left',
      title: { visible: true, text: 'favorability' },
      label: {
        formatMethod: (v: any) => {
          return v + '%';
        }
      }
    },
    {
      orient: 'bottom',
      label: { visible: true },
      type: 'band',
      paddingInner: 0.4,
      title: { visible: true, text: 'date' }
    }
  ];
  return { spec };
};

export const waterfallStackLabel = (context: GenerateChartCellContext) => {
  //assign axises
  const { spec } = context;
  spec.stackLabel = {
    valueType: 'absolute',
    formatMethod: (text: any) => {
      return text + '%';
    }
  };
  return { spec };
};

export const pipelineWaterfall = [data, color, waterfallField, waterfallAxes, waterfallStackLabel, discreteLegend];
