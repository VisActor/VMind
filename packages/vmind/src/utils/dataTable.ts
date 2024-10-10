import { isArray, isNil } from '@visactor/vutils';
import { FOLD_NAME, FOLD_VALUE, fold } from '@visactor/chart-advisor';
import type { DataItem, DataTable, FieldInfo } from '../types';
import { getFieldInfo } from '../atom/dataQuery/utils';

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
