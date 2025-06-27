import { isArray, uniqArray } from '@visactor/vutils';
import type { Cell } from '../types';
import type { DataTable } from '@visactor/generate-vchart';
import { DataRole, DataType, type FieldInfoItem } from '@visactor/generate-vchart';

export const getRoleByFieldType = (type: string) => {
  if (([DataType.DATE, DataType.TIME, DataType.STRING, DataType.REGION] as string[]).includes(type)) {
    return DataRole.DIMENSION;
  }
  return DataRole.MEASURE;
};

/** Format FieldInfo, add role or location attribtuion, it will change fieldInfo directly */
export const formatFieldInfo = (fieldInfo: FieldInfoItem[]) => {
  fieldInfo.forEach(info => {
    info.role = getRoleByFieldType(info.type);
    info.ratioGranularity = info?.type === DataType.RATIO ? info?.ratioGranularity || '%' : null;
  });
  return fieldInfo;
};

export const getDataListByField = (dataset: DataTable, fieldName: string) => {
  return uniqArray(dataset.map(d => d[fieldName])) as (string | number)[];
};

export const getRemainedFields = (cell: Cell, fieldInfo: FieldInfoItem[]) => {
  const usedFields = Object.values(cell).flat();
  const remainedFields = fieldInfo.filter(f => !usedFields.includes(f.fieldName));
  return remainedFields;
};

export const hasMeasureField = (fieldInfo: FieldInfoItem[]) => {
  return fieldInfo.some(f => f.role === DataRole.MEASURE);
};
