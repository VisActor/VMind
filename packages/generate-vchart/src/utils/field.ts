import { isArray } from '@visactor/vutils';
import { DataItem, FieldDataRole, FieldDataType, FieldInfoItem } from '../types/transform';
import { DataRole, DataType } from './enum';
import { isInteger, validateDate } from './type';

export const getFieldsByDataType = (fields: FieldInfoItem[], dataTypeList: string[]) => {
  return (fields || []).find(f => dataTypeList.includes(f.type));
};

export const getAllFieldsByDataType = (fields: FieldInfoItem[], dataTypeList: string[]) => {
  return (fields || []).filter(f => dataTypeList.includes(f.type));
};

export const getFieldsByRoleType = (fields: FieldInfoItem[], roleType: FieldDataRole) => {
  return (fields || []).find(f => f.role === roleType);
};

export const getFieldIdInCell = (cellField: any): string => {
  return isArray(cellField) ? cellField[0] : cellField;
};

export const sampleSize = (array: any, n: number) => {
  const length = array === null ? 0 : array.length;
  if (!length || n < 1) {
    return [];
  }
  n = n > length ? length : n;
  const randIndexs = [];
  while (randIndexs.length < n) {
    const rand = Math.floor(Math.random() * length);
    if (randIndexs.indexOf(rand) === -1) {
      randIndexs.push(rand);
    }
  }
  return randIndexs.map(i => array[i]);
};

export const detectFieldType = (dataset: DataItem[], column: string): FieldInfoItem => {
  let fieldType: FieldDataType | undefined = ['年份', 'date'].includes(column) ? DataType.DATE : undefined;
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
  const role = ([DataType.STRING, DataType.DATE] as string[]).includes(fieldType)
    ? DataRole.DIMENSION
    : DataRole.MEASURE;

  return {
    fieldName: column,
    type: fieldType,
    role
  };
};
export const getFieldInfo = (dataset: DataItem[], columns: string[]): FieldInfoItem[] => {
  let sampledDataset = dataset;
  if (dataset.length > 1000) {
    //sample the dataset if too large
    sampledDataset = sampleSize(dataset, 1000);
  }
  return columns.map(column => detectFieldType(sampledDataset, column));
};

export const getFieldInfoFromDataset = (dataset: DataItem[]): FieldInfoItem[] => {
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

export const getRemainedFields = (cell: Record<string, string | string[]>, fieldInfo: FieldInfoItem[]) => {
  const usedFields = Object.values(cell).flat();
  const remainedFields = fieldInfo.filter(f => !usedFields.includes(f.fieldName));
  return remainedFields;
};
