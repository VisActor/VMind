import { LINEAR_COLOR_THEMES } from '../utils/constants';
import { data, discreteLegend, formatXFields, labelForDefaultHide } from './common';
import { axis, seriesField } from './cartesian';
import { GenerateChartInput } from '../types/transform';
import { DataRole } from '../utils/enum';
import { getFieldsByRoleType } from '../utils/field';

export const colorLine = (context: GenerateChartInput) => {
  const { colors, spec, chartTheme } = context;
  // spec.data = [dataTable]
  if (chartTheme) {
    return { spec };
  }
  if (colors && colors.length > 0) {
    spec.color = colors;
  } else {
    //应用渐变色
    spec.color = LINEAR_COLOR_THEMES.map(c => ({
      gradient: 'linear',
      x0: 0.5,
      y0: 0,
      x1: 0.5,
      y1: 1,
      stops: [
        {
          offset: 0,
          color: c[0]
        },
        {
          offset: 1,
          color: c[1]
        }
      ]
    }));
  }
  return { spec };
};

export const cartesianLine = (context: GenerateChartInput) => {
  //assign field in spec according to cell
  const { cell, spec, fieldInfo } = context;
  const cellNew = { ...cell };
  spec.xField = cell.x;
  spec.yField = cell.y;
  if (cell.color) {
    spec.seriesField = cell.color;
  } else {
    //no color field. choose a discrete field among remaining fields
    const remainedFields = fieldInfo.filter(
      ({ fieldName }) => !spec.xField.includes(fieldName) && spec.yField !== fieldName
    );
    const colorField = getFieldsByRoleType(remainedFields, DataRole.DIMENSION);
    if (colorField) {
      spec.seriesField = colorField.fieldName;
      cellNew.color = colorField.fieldName;
    }
  }
  return { spec, cell: cellNew };
};

export const stackLine = (context: GenerateChartInput) => {
  const { spec, stackOrPercent } = context;

  if (spec.seriesField && spec.seriesField !== spec.xField && stackOrPercent) {
    spec.stack = !!stackOrPercent;
    spec.percent = stackOrPercent === 'percent';
  }

  return { spec };
};

export const pipelineLine = [
  formatXFields,
  data,
  colorLine,
  cartesianLine,
  seriesField,
  stackLine,
  axis,
  discreteLegend,
  labelForDefaultHide
  //animationCartisianLine,
];
