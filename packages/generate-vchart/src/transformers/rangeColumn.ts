import { getAllFieldsByDataType, getRemainedFields } from '../utils/field';
import { GenerateChartInput } from '../types/transform';
import { color, commonLegend, data, formatXFields, labelForDefaultShow } from './common';
import { DataType } from '../utils/enum';
import { axis } from './cartesian';

export const formatFieldsOfRangeColumn = (context: GenerateChartInput) => {
  // Range Column Chart's y field must length == 2
  const { cell, fieldInfo } = context;
  const cellNew = { ...cell };
  const remainedFields = getRemainedFields(cellNew, fieldInfo);
  const numericFields = getAllFieldsByDataType(remainedFields, [DataType.FLOAT, DataType.INT]);

  if (cellNew.y && cellNew.y instanceof Array && cellNew.y.length === 2) {
    return { cell: cellNew };
  }
  if (numericFields.length >= 2) {
    cellNew.y = [numericFields[0].fieldName, numericFields[1].fieldName];
  }

  return {
    cell: cellNew
  };
};

export const rangeColumnField = (context: GenerateChartInput) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  spec.yField = cell.x;

  spec.xField = [cell.y[0], cell.y[1]];

  return { spec };
};

export const rangeColumnDisplayConf = (context: GenerateChartInput) => {
  const { spec } = context;
  spec.direction = 'horizontal';

  return { spec };
};

export const pipelineRangeColumn = [
  formatXFields,
  formatFieldsOfRangeColumn,
  data,
  color,
  rangeColumnField,
  commonLegend,
  labelForDefaultShow,
  axis,
  rangeColumnDisplayConf
];
