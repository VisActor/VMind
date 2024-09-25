import { getRoleByFieldType } from '../../utils/field';
import type { DataCell, DataItem } from '../../types/atom';
import { ROLE, type DataCleanCtx, type DataTable, type FieldInfo } from '../../types/atom';
import { isArray, pick } from '@visactor/vutils';
import { extractFirstNumberInString } from '../../utils/text';
import { isValidData, uniqBy } from '../../utils/common';
import type { RangeValueTransferType } from '../type';
import { average } from '@visactor/vchart/esm/util';

export const getCtxByfilterSameValueColumn = (context: DataCleanCtx) => {
  const { fieldInfo = [], dataTable = [] } = context || {};
  const newContext = { ...context };
  if (dataTable.length > 1 && fieldInfo.length) {
    const cleanFieldKey: string[] = [];
    fieldInfo.forEach(info => {
      if ((info.role ?? getRoleByFieldType(info.fieldType)) === ROLE.MEASURE) {
        return;
      }
      let shouldFilter = true;
      const prev = dataTable[0][info.fieldName];
      for (let i = 1; i < dataTable.length; i++) {
        if (isValidData(dataTable[i][info.fieldName]) && dataTable[i][info.fieldName] !== prev) {
          shouldFilter = false;
          break;
        }
      }
      shouldFilter && cleanFieldKey.push(info.fieldName);
    });
    if (cleanFieldKey.length) {
      newContext.fieldInfo = fieldInfo.filter(info => !cleanFieldKey.includes(info.fieldName));
      const fieldNameList = newContext.fieldInfo.map(info => info.fieldName);
      newContext.dataTable = dataTable.map(dataItem => pick(dataItem, fieldNameList));
    }
  }
  return newContext;
};

export const getCtxByneedNumericalFields = (context: DataCleanCtx) => {
  if (context.fieldInfo.findIndex(info => (info.role ?? getRoleByFieldType(info.fieldType)) === ROLE.MEASURE) === -1) {
    return {
      ...context,
      dataTable: [],
      fieldInfo: []
    };
  }
  return context;
};

export const getCtxBymeasureAutoTransfer = (context: DataCleanCtx) => {
  const { fieldInfo = [], dataTable = [] } = context || {};
  if (dataTable.length > 1 && fieldInfo.length) {
    fieldInfo.forEach(info => {
      if ((info.role ?? getRoleByFieldType(info.fieldType)) === ROLE.DIMENSION) {
        return;
      }
      for (let i = 0; i < dataTable.length; i++) {
        if (typeof dataTable[i][info.fieldName] === 'string') {
          dataTable[i][info.fieldName] = extractFirstNumberInString(dataTable[i][info.fieldName] as string);
        }
      }
    });
  }
  return context;
};

export const getCtxByfilterSameDataItem = (context: DataCleanCtx) => {
  const { dataTable = [] } = context || {};
  return {
    ...context,
    dataTable: uniqBy(dataTable, item => JSON.stringify(item))
  };
};

const isDataItemWithNonEmptyValues = (dataItem: DataItem, fieldInfo: FieldInfo[]) => {
  return fieldInfo.some(info => isValidData(dataItem[info.fieldName]));
};

/**
 * DataItem should has at least one measure value
 * @param context
 * @returns
 */
export const getCtxByFilterRowWithNonEmptyValues = (context: DataCleanCtx) => {
  const { dataTable = [], fieldInfo } = context || {};
  const measureFieldInfo = fieldInfo.filter(info => (info.role ?? getRoleByFieldType(info.fieldType)) === ROLE.MEASURE);
  return {
    ...context,
    dataTable: dataTable.filter(item => isDataItemWithNonEmptyValues(item, measureFieldInfo))
  };
};

const transferRangeData = (cell: number[], type: RangeValueTransferType) => {
  switch (type) {
    case 'avg':
      return average(cell);
    case 'filter':
      return null;
    case 'max':
      return Math.max(...cell);
    case 'min':
      return Math.min(...cell);
    default:
      return cell.join('-');
  }
};

export const getCtxByRangeValueTranser = (context: DataCleanCtx, type: RangeValueTransferType) => {
  const { dataTable = [], fieldInfo } = context || {};
  return {
    ...context,
    dataTable: dataTable.map(item => {
      fieldInfo.forEach(info => {
        if (isArray(item[info.fieldName])) {
          item[info.fieldName] = transferRangeData(item[info.fieldName] as any, type);
        }
      });
      return item;
    })
  };
};
