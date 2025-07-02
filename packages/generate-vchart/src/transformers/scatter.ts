import { DEFAULT_ANIMATION_DURATION, DEFAULT_VIDEO_LENGTH, ONE_BY_ONE_GROUP_SIZE } from '../utils/constants';
import { GenerateChartInput, SimpleChartAxisInfo } from '../types/transform';
import {
  color,
  data,
  discreteLegend,
  formatSizeFields,
  formatXFields,
  labelForDefaultHide,
  oneByOneDelayFunc
} from './common';
import { DataRole } from '../utils/enum';
import { array, isBase64, isBoolean, isValid } from '@visactor/vutils';

export const scatterField = (context: GenerateChartInput) => {
  //assign field in spec according to cell
  const { spec, cell } = context;
  spec.xField = cell.x;
  spec.yField = cell.y;
  if (isValid(cell.color)) {
    spec.seriesField = cell.color;
  }
  if (isValid(cell.size)) {
    spec.sizeField = cell.size;
    spec.size = {
      type: 'linear'
    };
  }

  return { spec };
};

export const scatterAxis = (context: GenerateChartInput) => {
  const { spec, axes, fieldInfo } = context;
  const bottomAxis =
    axes === false ? undefined : (array(axes) as SimpleChartAxisInfo[]).find(axis => axis.orient === 'bottom');
  const topAxis =
    axes === false ? undefined : (array(axes) as SimpleChartAxisInfo[]).find(axis => axis.orient === 'top');
  const leftAxis =
    axes === false ? undefined : (array(axes) as SimpleChartAxisInfo[]).find(axis => axis.orient === 'left');
  const rightAxis =
    axes === false ? undefined : (array(axes) as SimpleChartAxisInfo[]).find(axis => axis.orient === 'right');

  const xField = spec.xField;
  const yField = spec.yField;
  const xFieldInfo = fieldInfo?.find(field => xField === field.fieldName);
  const yFieldInfo = fieldInfo?.find(field => yField === field.fieldName);

  spec.axes = [
    {
      visible: !(axes === false || (axes && !bottomAxis && !topAxis)),
      orient: !bottomAxis && topAxis ? 'top' : 'bottom',
      type: xFieldInfo?.role === DataRole.DIMENSION ? 'band' : 'linear',
      title: {
        visible: false
      },
      ...(isBoolean((bottomAxis ?? topAxis)?.hasGrid) ? { grid: { visible: (bottomAxis ?? topAxis).hasGrid } } : {})
    },
    {
      visible: !(axes === false || (axes && !leftAxis && !rightAxis)),
      orient: !leftAxis && rightAxis ? 'right' : 'left',
      type: yFieldInfo?.role === DataRole.DIMENSION ? 'band' : 'linear',
      title: {
        visible: false
      },
      ...(isBoolean((leftAxis ?? rightAxis)?.hasGrid) ? { grid: { visible: (leftAxis ?? rightAxis).hasGrid } } : {})
    }
  ];
  return { spec };
};

export const animationScatter = (context: GenerateChartInput) => {
  const { spec, animationOptions } = context;

  const totalTime = animationOptions?.totalTime ?? DEFAULT_VIDEO_LENGTH;
  const dataLength = spec.data.values.length;
  const groupNum = Math.ceil(dataLength / ONE_BY_ONE_GROUP_SIZE);
  const delay = totalTime / groupNum;
  spec.animationAppear = {
    duration: DEFAULT_ANIMATION_DURATION,
    delay: oneByOneDelayFunc(delay)
  };
  return { spec };
};

export const pipelineScatterPlot = [
  formatXFields,
  data,
  color,
  scatterField,
  scatterAxis,
  discreteLegend,
  labelForDefaultHide
  //animationOneByOne,
];
