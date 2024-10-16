import { isArray, isNil, isNumber } from '@visactor/vutils';
import { FOLD_NAME, FOLD_VALUE, fold } from '@visactor/chart-advisor';
import { ROLE, type DataItem, type DataTable, type FieldInfo } from '../types';
import { getFieldInfo } from './field';

export const foldDataTableByYField = (
  dataTable: DataItem[],
  yFieldList: string[],
  fieldInfo: FieldInfo[],
  foldName: any = FOLD_NAME,
  foldValue: any = FOLD_VALUE
) => {
  const aliasMap = Object.fromEntries(fieldInfo.map(d => [d.fieldName, d.fieldName]));

  return fold(dataTable as any, yFieldList, foldName, foldValue, aliasMap, false);
};

export const getFieldInfoFromDataTable = (dataTable: DataItem[]): FieldInfo[] => {
  if (!dataTable || !dataTable.length) {
    return [];
  }
  const columns = new Set();
  dataTable.forEach(data => {
    const dataKeys = Object.keys(data);
    dataKeys.forEach(column => {
      if (!columns.has(column)) {
        columns.add(column);
      }
    });
  });
  return getFieldInfo(dataTable, Array.from(columns) as string[]);
};

export const isValidDataTable = (dataTable?: DataTable | undefined | null) => {
  return !isNil(dataTable) && isArray(dataTable) && dataTable.length > 0;
};

export const transferMeasureInTable = (dataTable: DataItem[], fieldInfo: FieldInfo[]) => {
  const newDataTable: DataTable = [];
  const measureFields = fieldInfo.filter(field => field.role === ROLE.MEASURE);
  if (measureFields.length) {
    dataTable.forEach(row => {
      const newRow = { ...row };
      measureFields.forEach(field => {
        const value = Number(row[field.fieldName]);
        if (isNumber(value)) {
          newRow[field.fieldName] = value;
        }
      });
      newDataTable.push(newRow);
    });
    return newDataTable;
  }
  return dataTable;
};
