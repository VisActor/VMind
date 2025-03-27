import { DataType } from '../../../../types/base';
import { getFieldByDataType } from '../../../../utils/field';
import type { GenerateChartCellContext } from '../../type';
import { COLOR_THEMES, DEFAULT_VIDEO_LENGTH } from '../constants';
import { axis, seriesField } from './cartesian';
import { data, discreteLegend, onlyUnique, revisedVChartType, theme } from './common';

export const colorBar = (context: GenerateChartCellContext) => {
  const { colors, spec, chartTheme } = context;
  // spec.data = [dataTable]
  const colorThemes = COLOR_THEMES.default;
  if (chartTheme) {
    return { spec };
  }
  if (colors && colors.length > 0) {
    spec.color = colors;
  } else {
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

export const cartesianBar = (context: GenerateChartCellContext) => {
  //assign fields according to cell
  const { cell, fieldInfo, spec, stackOrPercent } = context;
  const cellNew = { ...cell };
  const flattenedXField = Array.isArray(cell.x) ? cell.x : [cell.x];
  if (cell.color && cell.color.length > 0 && cell.color !== cell.x) {
    flattenedXField.push(cell.color as string);
  }
  spec.xField = flattenedXField;
  spec.yField = cell.y;
  if (cell.color) {
    spec.seriesField = cell.color;
  } else {
    //没有分配颜色字段，从剩下的字段里选择一个离散字段分配到颜色上
    const remainedFields = fieldInfo.filter(
      ({ fieldName }) => !spec.xField.includes(fieldName) && spec.yField !== fieldName
    );
    const colorField = getFieldByDataType(remainedFields, [DataType.STRING, DataType.DATE]);
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

export const displayConfBar = (context: GenerateChartCellContext) => {
  const { spec, chartTheme } = context;

  if (chartTheme) {
    return { spec };
  }
  spec.bar = {
    style: {
      //cornerRadius: [8, 8, 0, 0]
    }
  };

  return { spec };
};

export const transposeField = (context: GenerateChartCellContext) => {
  const { spec, transpose } = context;
  if (transpose) {
    const newSpec = { ...spec, xField: spec.yField, yField: spec.xField, direction: 'horizontal' };
    const bottomAxis = (newSpec.axes || []).find((axis: any) => axis.orient === 'bottom');
    const leftAxis = (newSpec.axes || []).find((axis: any) => axis.orient === 'left');
    if (bottomAxis) {
      bottomAxis.orient = 'left';
    }
    if (leftAxis) {
      leftAxis.orient = 'bottom';
    }
    return {
      ...context,
      spec: newSpec
    };
  }
  return context;
};

export const animationCartesianBar = (context: GenerateChartCellContext) => {
  const { spec } = context;

  const totalTime = context.totalTime ?? DEFAULT_VIDEO_LENGTH;
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
  data,
  colorBar,
  cartesianBar,
  seriesField,
  axis,
  discreteLegend,
  // commonLabel,
  displayConfBar,
  transposeField
  //animationCartesianBar,
];
