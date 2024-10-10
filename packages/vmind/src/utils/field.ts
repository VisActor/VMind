import { uniqArray } from '@visactor/vutils';
import type { Cell, DataTable, FieldInfo } from '../types';
import { DataType, ROLE } from '../types';

export const getRoleByFieldType = (type: DataType) => {
  if ([DataType.DATE, DataType.TIME, DataType.STRING, DataType.REGION].includes(type)) {
    return ROLE.DIMENSION;
  }
  return ROLE.MEASURE;
};

/** Format FieldInfo, add role or location attribtuion, it will change fieldInfo directly */
export const formatFieldInfo = (fieldInfo: FieldInfo[]) => {
  fieldInfo.forEach(info => {
    info.role = getRoleByFieldType(info.type);
    info.location = getRoleByFieldType(info.type) as any;
  });
  return fieldInfo;
};

export const getDataListByField = (dataset: DataTable, fieldName: string) => {
  return uniqArray(dataset.map(d => d[fieldName])) as (string | number)[];
};

export const getRemainedFields = (cell: Cell, fieldInfo: FieldInfo[]) => {
  const usedFields = Object.values(cell).flat();
  const remainedFields = fieldInfo.filter(f => !usedFields.includes(f.fieldName));
  return remainedFields;
};

export const getFieldByRole = (fields: FieldInfo[], role: ROLE) => {
  return fields.find(f => f.role === role);
};

export const getFieldByDataType = (fields: FieldInfo[], dataTypeList: DataType[]) => {
  return fields.find(f => dataTypeList.includes(f.type));
};
export const getFieldsByDataType = (fields: FieldInfo[], dataTypeList: DataType[]) => {
  return fields.filter(f => dataTypeList.includes(f.type));
};
