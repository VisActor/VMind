import { DataType } from '../../../../types/base';
import type { GenerateChartCellContext } from '../../type';
import { animationDuration, DEFAULT_VIDEO_LENGTH, oneByOneGroupSize } from '../constants';
import { color, data, discreteLegend, oneByOneDelayFunc, revisedVChartType, theme } from './common';

export const scatterField = (context: GenerateChartCellContext) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  spec.xField = cell.x;
  spec.yField = cell.y;
  if (cell.color) {
    spec.seriesField = cell.color;
  }
  if (cell.size) {
    spec.sizeField = cell.size;
    spec.size = {
      type: 'linear'
    };
  }

  return { spec };
};

export const scatterAxis = (context: GenerateChartCellContext) => {
  const { spec, fieldInfo } = context;

  const xField = spec.xField;
  const yField = spec.yField;
  const xFieldInfo = fieldInfo.find(field => xField === field.fieldName);
  const yFieldInfo = fieldInfo.find(field => yField === field.fieldName);
  spec.axes = [
    {
      orient: 'bottom',
      type: [DataType.DATE, DataType.STRING].includes(xFieldInfo?.type) ? 'band' : 'linear',
      label: {
        style: {
          //fill: '#FFFFFF'
        }
      },
      title: {
        visible: false,
        style: {
          //fill: '#FFFFFF'
        }
      }
    },
    {
      orient: 'left',
      type: [DataType.DATE, DataType.STRING].includes(yFieldInfo?.type) ? 'band' : 'linear',
      label: {
        style: {
          //fill: '#FFFFFF'
        }
      },
      title: {
        visible: false,
        style: {
          //fill: '#FFFFFF'
        }
      }
    }
  ];
  return { spec };
};

export const animationScatter = (context: GenerateChartCellContext) => {
  const { spec } = context;

  const totalTime = context.totalTime ?? DEFAULT_VIDEO_LENGTH;
  const dataLength = spec.data.values.length;
  const groupNum = Math.ceil(dataLength / oneByOneGroupSize);
  const delay = totalTime / groupNum;
  spec.animationAppear = {
    duration: animationDuration,
    delay: oneByOneDelayFunc(delay)
  };
  return { spec };
};

export const pipelineScatterPlot = [
  data,
  color,
  scatterField,
  scatterAxis,
  discreteLegend
  //animationOneByOne,
];
