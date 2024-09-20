import type { FieldInfo } from '../types';
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
    info.role = getRoleByFieldType(info.fieldType);
    info.location = getRoleByFieldType(info.fieldType) as any;
  });
  return fieldInfo;
};
