import { getFieldByDataType } from '../../../../utils/field';
import type { GenerateChartCellContext } from '../../type';
import { LINEAR_COLOR_THEMES } from '../constants';
import { data, discreteLegend, revisedVChartType, theme } from './common';
import { DataType } from '../../../../types/base';
import { axis, seriesField } from './cartesian';

export const colorLine = (context: GenerateChartCellContext) => {
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
      x0: 0,
      y0: 0.5,
      x1: 1,
      y1: 0.5,
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
    spec.point = {
      style: {
        //visible: false
      }
    };
  }
  return { spec };
};

export const cartesianLine = (context: GenerateChartCellContext) => {
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
    const colorField = getFieldByDataType(remainedFields, [DataType.STRING, DataType.DATE]);
    if (colorField) {
      spec.seriesField = colorField.fieldName;
      cellNew.color = colorField.fieldName;
    }
  }
  return { spec, cell: cellNew };
};

export const displayConfLine = (context: GenerateChartCellContext) => {
  const { spec, chartTheme } = context;
  if (chartTheme) {
    return { spec };
  }
  spec.line = {
    style: {
      //curveType: 'monotone',
      //lineWidth: 6,
      //lineCap: 'round'
    }
  };

  return { spec };
};

export const pipelineLine = [
  data,
  colorLine,
  cartesianLine,
  seriesField,
  axis,
  discreteLegend,
  // commonLabel,
  displayConfLine
  //animationCartisianLine,
];
