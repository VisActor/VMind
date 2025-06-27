import { isValid } from '@visactor/vutils';
import { GenerateChartInput } from '../types/transform';
import { color, commonLabel, data, discreteLegend } from './common';
import { DataRole } from '../utils/enum';
import { getFieldsByRoleType } from '../utils/field';

export const pieField = (context: GenerateChartInput) => {
  //assign field in spec according to cell
  const { cell, spec, fieldInfo } = context;
  const valueField = cell.angle ?? cell.value;
  const colorField = cell.color ?? (cell as any).category;
  const cellNew = { ...cell };

  if (isValid(colorField)) {
    spec.categoryField = colorField;
  } else {
    //没有分配颜色字段，从剩下的字段里选择一个离散字段分配到颜色上
    const colorField = getFieldsByRoleType(fieldInfo, DataRole.DIMENSION);
    if (colorField) {
      spec.categoryField = colorField.fieldName;
      cellNew.category = colorField.fieldName;
    }
  }

  if (isValid(valueField)) {
    spec.valueField = valueField;
  } else {
    //没有分配颜色字段，从剩下的字段里选择一个离散字段分配到颜色上
    const valueField = getFieldsByRoleType(fieldInfo, DataRole.MEASURE);
    if (valueField) {
      spec.valueField = valueField.fieldName;
      cellNew.value = valueField.fieldName;
    }
  }

  return { spec, cell: cellNew };
};

export const pipelinePie = [
  data,
  color,
  pieField,
  discreteLegend,
  commonLabel
  // animationCartesianPie,
];
