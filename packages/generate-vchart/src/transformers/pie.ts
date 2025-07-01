import { isValid } from '@visactor/vutils';
import { GenerateChartInput } from '../types/transform';
import { color, commonLabel, data, discreteLegend, formatColorFields } from './common';
import { DataRole } from '../utils/enum';
import { getFieldsByRoleType } from '../utils/field';

export const pieField = (context: GenerateChartInput) => {
  const { cell } = formatColorFields(context, ['color', 'category', 'label']);
  //assign field in spec according to cell
  const { spec, fieldInfo } = context;
  const valueField = cell.angle ?? cell.value;
  const cellNew = { ...cell };

  if (isValid(cell.color)) {
    spec.categoryField = cell.color;
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
