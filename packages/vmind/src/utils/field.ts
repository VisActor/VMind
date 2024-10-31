import { isArray, uniqArray } from '@visactor/vutils';
import type { Cell, DataItem, DataTable, FieldInfo } from '../types';
import { DataType, ROLE } from '../types';
import { sampleSize, validateDate } from './common';
import { isInteger } from '@visactor/calculator';

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

export const getFieldDomain = (dataset: DataItem[], column: string, role: ROLE) => {
  //calculate domain of the column
  const domain: (string | number)[] = dataset.map(d => (role === ROLE.DIMENSION ? d[column] : Number(d[column])));
  return role === ROLE.DIMENSION
    ? (uniqArray(domain) as string[]).slice(0, 20)
    : [Math.min(...(domain as number[])), Math.max(...(domain as number[]))];
};

export const detectFieldType = (dataset: DataItem[], column: string): FieldInfo => {
  let fieldType: DataType | undefined;
  //detect field type based on rules
  //The data types have the following inclusion relationships:
  //date=>string
  //int=>float=>string
  //detect field type from strict to loose

  dataset.every(data => {
    const value = data[column];
    const numberValue = Number(value);
    if (!fieldType) {
      //no accurate fieldType at the beginning, make the first one as fieldType
      if (!isNaN(numberValue)) {
        if (isInteger(numberValue)) {
          fieldType = DataType.INT;
        } else {
          fieldType = DataType.FLOAT;
        }
      } else if (validateDate(value)) {
        //check if the value is date
        fieldType = DataType.DATE;
      } else {
        fieldType = DataType.STRING;
      }
      return true;
    }
    //already has a fieldType, check consistency
    if (fieldType === DataType.DATE && !validateDate(value)) {
      //current value is not date, field is string type
      fieldType = DataType.STRING;
      return false;
    }
    if (fieldType === DataType.INT) {
      if (isNaN(numberValue)) {
        //current value is not number, field is string type
        fieldType = DataType.STRING;
        return false;
      } else if (!isInteger(numberValue)) {
        //current value is not int, convert to float type and continue checking
        fieldType = DataType.FLOAT;
        return true;
      }
      return true;
    }
    if (fieldType === DataType.FLOAT) {
      if (isNaN(numberValue)) {
        //current value is not number, field is string type
        fieldType = DataType.STRING;
        return false;
      }
      return true;
    }
    if (fieldType === DataType.STRING) {
      //no need to detect.
      return false;
    }
    return true;
  });
  const role = [DataType.STRING, DataType.DATE].includes(fieldType) ? ROLE.DIMENSION : ROLE.MEASURE;
  const domain = getFieldDomain(dataset, column, role);

  return {
    fieldName: column,
    type: fieldType,
    role,
    domain
  };
};
export const getFieldInfo = (dataset: DataItem[], columns: string[]): FieldInfo[] => {
  let sampledDataset = dataset;
  if (dataset.length > 1000) {
    //sample the dataset if too large
    sampledDataset = sampleSize(dataset, 1000);
  }
  return columns.map(column => detectFieldType(sampledDataset, column));
};

export const getFieldInfoFromDataset = (dataset: DataItem[]): FieldInfo[] => {
  if (!dataset || !dataset.length) {
    return [];
  }
  const columns = new Set();
  dataset.forEach(data => {
    const dataKeys = Object.keys(data);
    dataKeys.forEach(column => {
      if (!columns.has(column)) {
        columns.add(column);
      }
    });
  });
  return getFieldInfo(dataset, Array.from(columns) as string[]);
};

export const hasMeasureField = (fieldInfo: FieldInfo[]) => {
  return fieldInfo.some(f => f.role === ROLE.MEASURE);
};

export const getFieldIdInCell = (cellField: any): string => {
  return isArray(cellField) ? cellField[0] : cellField;
};
