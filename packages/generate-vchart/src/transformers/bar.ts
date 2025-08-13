import { getFieldsByRoleType } from '../utils/field';
import { FieldInfoItem, GenerateChartInput } from '../types/transform';
import { COLOR_THEMES, DEFAULT_VIDEO_LENGTH } from '../utils/constants';
import { axis, seriesField } from './cartesian';
import { data, discreteLegend, formatXFields, labelForDefaultHide, onlyUnique } from './common';
import { DataRole } from '../utils/enum';
import { array, isValid } from '@visactor/vutils';

export const formatFieldsOfBar = (context: GenerateChartInput) => {
  const { cell, transpose, fieldInfo } = context;

  if (transpose) {
    const { x, y } = cell;
    const arrayX = array(x);
    const arrayY = array(y);
    const fieldMapping: Record<string, FieldInfoItem> = fieldInfo.reduce(
      (prev, curv) => ({
        ...prev,
        [curv.fieldName]: curv
      }),
      {}
    );

    if (
      arrayX.every(field => !!fieldMapping[field] && fieldMapping[field].role === DataRole.MEASURE) &&
      arrayY.every(field => !!fieldMapping[field] && fieldMapping[field].role === DataRole.DIMENSION)
    ) {
      return {
        ...context,
        cell: {
          ...cell,
          x: y,
          y: x
        }
      };
    }
  }
  return context;
};

export const colorBar = (context: GenerateChartInput) => {
  const { colors, chartTheme, spec } = context;
  // spec.data = [dataTable]

  if (chartTheme) {
    return { spec };
  }
  if (colors && colors.length > 0) {
    spec.color = colors;
  } else if (spec.stack) {
    const colorThemes = COLOR_THEMES.default;

    spec.color = colorThemes.slice();
  } else if ('palette' in context && context.palette) {
    spec.color = context.palette;
  } else {
    const colorThemes = COLOR_THEMES.default;
    //apply transparent gradient
    spec.color = colorThemes.map(c => ({
      gradient: 'linear',
      x0: 0.01,
      y0: 0,
      x1: 0.01,
      y1: 1,
      stops: [
        {
          offset: 0,
          color: `#${c.split('#')[1]}FF`
        },
        {
          offset: 1,
          color: `#${c.split('#')[1]}00`
        }
      ]
    }));
  }

  return { spec };
};

export const cartesianBar = (context: GenerateChartInput) => {
  //assign fields according to cell
  const { cell, fieldInfo = [], stackOrPercent, spec } = context;
  const cellNew = { ...cell };
  const flattenedXField = Array.isArray(cell.x) ? cell.x : [cell.x];
  const colorField = array(cell.color)?.[0];

  /**
   * 柱图只允许一个color Field
   */
  if (isValid(colorField) && !flattenedXField.includes(colorField)) {
    flattenedXField.push(cell.color as string);
  }
  spec.xField = flattenedXField;
  spec.yField = cell.y;
  if (isValid(colorField)) {
    spec.seriesField = colorField;
  } else {
    //没有分配颜色字段，从剩下的字段里选择一个离散字段分配到颜色上
    const remainedFields = fieldInfo.filter(
      ({ fieldName }) => !spec.xField.includes(fieldName) && spec.yField !== fieldName
    );
    const colorField = getFieldsByRoleType(remainedFields, DataRole.DIMENSION);
    if (colorField) {
      spec.seriesField = colorField.fieldName;
      spec.xField.push(colorField.fieldName);
      cellNew.color = colorField.fieldName;
    }
  }
  if (spec.xField.length > 1 && stackOrPercent) {
    spec.xField = [spec.xField[0]];
    spec.stack = !!stackOrPercent;
    spec.percent = stackOrPercent === 'percent';
  }
  return { spec, cell: cellNew };
};

export const transposeField = (context: GenerateChartInput) => {
  const { transpose, spec } = context;

  if (transpose) {
    const newSpec = { ...spec, xField: spec.yField, yField: spec.xField, direction: 'horizontal' };

    return {
      spec: newSpec
    };
  }
  return context;
};

export const animationCartesianBar = (context: GenerateChartInput) => {
  const { spec, animationOptions } = context;

  const totalTime = animationOptions?.totalTime ?? DEFAULT_VIDEO_LENGTH;
  const groupKey = Array.isArray(spec.xField) ? spec.xField[0] : spec.xField;
  const dataValues = spec.data.values as any[];
  const groupNum = dataValues.map(d => d[groupKey]).filter(onlyUnique).length;
  //const delay = totalTime / groupNum - 1000;
  spec.animationAppear = {
    oneByOne: Number.MIN_VALUE,
    duration: totalTime / groupNum
  };
  return { spec };
};

export const pipelineBar = [
  formatXFields,
  formatFieldsOfBar,
  data,
  cartesianBar,
  colorBar,
  seriesField,
  axis,
  discreteLegend,
  labelForDefaultHide,
  transposeField
];
