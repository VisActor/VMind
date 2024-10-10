import { getRoleByFieldType } from '../../utils/field';
import type { ClusterDataView, DataCell, DataItem } from '../../types/atom';
import { DataType, ROLE, type DataCleanCtx, type DataTable, type FieldInfo } from '../../types/atom';
import { isArray, isNumber, pick } from '@visactor/vutils';
import { extractFirstNumberInString } from '../../utils/text';
import { isValidData, uniqBy } from '../../utils/common';
import type { RangeValueTransferType } from '../type';
import { average, sum } from '@visactor/vchart/esm/util';
import { agglomerativeHierarchicalClustering, type ClusterDataItem } from '../../utils/cluster';

const removeFieldInfoInCtx = (context: DataCleanCtx, cleanFieldKey: string[]) => {
  if (!cleanFieldKey.length) {
    return context;
  }
  const { fieldInfo = [], dataTable = [] } = context || {};
  const newFieldInfo = fieldInfo.filter(info => !cleanFieldKey.includes(info.fieldName));
  const fieldNameList = newFieldInfo.map(info => info.fieldName);
  const newDataTable = dataTable.map(dataItem => pick(dataItem, fieldNameList));

  return {
    ...context,
    fieldInfo: newFieldInfo,
    dataTable: newDataTable
  };
};

export const transferFieldInfo = (context: DataCleanCtx) => {
  (context.fieldInfo || []).forEach(info => {
    if (!info.role || !info.location) {
      info.role = getRoleByFieldType(info.type);
      info.location = info.role as any;
    }
  });
  return context;
};

/**
 * Remove the fields where all dimension values are the same
 * @param context
 * @returns
 */
export const getCtxByfilterSameValueColumn = (context: DataCleanCtx) => {
  const { fieldInfo = [], dataTable = [] } = context || {};
  const newContext = { ...context };
  if (dataTable.length > 1 && fieldInfo.length) {
    const cleanFieldKey: string[] = [];
    fieldInfo.forEach(info => {
      if (info.role === ROLE.MEASURE) {
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
    return removeFieldInfoInCtx(newContext, cleanFieldKey);
  }
  return newContext;
};

/**
 * Need at least one valid measure field
 * @param context
 * @returns
 */
export const getCtxByneedNumericalFields = (context: DataCleanCtx) => {
  if (context.fieldInfo.findIndex(info => info.role === ROLE.MEASURE) === -1) {
    return {
      ...context,
      dataTable: [],
      fieldInfo: []
    };
  }
  return context;
};

/**
 * Correct the measurement fields, extract number from string
 * @param context
 * @returns
 */
export const getCtxBymeasureAutoTransfer = (context: DataCleanCtx, text?: string) => {
  const { fieldInfo = [], dataTable = [] } = context || {};
  const isStringText = text && typeof text === 'string';
  if (dataTable.length > 1 && fieldInfo.length) {
    fieldInfo.forEach(info => {
      if (info.role === ROLE.DIMENSION) {
        return;
      }
      if (info.type === DataType.RATIO) {
      }
      for (let i = 0; i < dataTable.length; i++) {
        let value = dataTable[i][info.fieldName];
        if (typeof dataTable[i][info.fieldName] === 'string') {
          dataTable[i][info.fieldName] = extractFirstNumberInString(value as string);
        }
        value = dataTable[i][info.fieldName];
        if (info.type === DataType.RATIO && isStringText && isNumber(value)) {
          const ratioValue = value * 100;
          if (text.includes(`${ratioValue}%`) && !text.includes(`${value}`)) {
            dataTable[i][info.fieldName] = ratioValue;
          }
        }
      }
    });
  }
  return context;
};

/**
 * Filter out completely identical rows.
 * @param context
 * @returns
 */
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
  const measureFieldInfo = fieldInfo.filter(info => info.role === ROLE.MEASURE);
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

/** convert the interval data */
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

/** Remove columns with a low effective percentage of values. */
export const getCtxByValidColumnRatio = (context: DataCleanCtx, ratio = 0.2) => {
  const { dataTable = [], fieldInfo } = context || {};
  let maxCount = 0;
  const validCountOfFieldInfo = fieldInfo
    .filter(info => info.role === ROLE.MEASURE)
    .map(info => {
      const cell = dataTable.map(item => item[info.fieldName]);
      const validCount = cell.filter(item => isValidData(item)).length;
      maxCount = Math.max(validCount, maxCount);
      return {
        fieldName: info.fieldName,
        validCount
      };
    });
  const invalidFieldInfo = validCountOfFieldInfo.filter(
    info => !info.validCount || info.validCount / maxCount <= ratio
  );
  return removeFieldInfoInCtx(
    context,
    invalidFieldInfo.map(v => v.fieldName)
  );
};

/** get main data view and cluster result */
export const getSplitDataViewOfDataTable = (context: DataCleanCtx, threshold: number) => {
  const { dataTable = [], fieldInfo } = context || {};
  const measureFieldInfo = fieldInfo.filter(info => info.role === ROLE.MEASURE);
  const dimensionFieldInfo = fieldInfo.filter(info => info.role === ROLE.DIMENSION);
  const clusterDataItem: ClusterDataItem[] = [];
  measureFieldInfo.forEach((item, index) => {
    clusterDataItem.push({
      id: item.fieldName,
      value: dataTable.map(data => (isValidData(data[item.fieldName]) ? 1 : 0))
    });
  });
  const { clusters } = agglomerativeHierarchicalClustering(clusterDataItem, threshold);
  if (!clusters.length) {
    return context;
  }
  const dataViewList: ClusterDataView[] = [];
  clusters.forEach(cluster => {
    const clusterIds = cluster.children.map(v => v.id);
    const clusterFieldInfo = [
      ...dimensionFieldInfo,
      ...measureFieldInfo.filter(info => clusterIds.includes(info.fieldName))
    ];
    const clusterFieldIds = clusterFieldInfo.map(v => v.fieldName);
    const clusterDataView = dataTable.map(v => pick(v, clusterFieldIds));
    let newContext: DataCleanCtx = { dataTable: clusterDataView, fieldInfo: clusterFieldInfo };
    [getCtxByFilterRowWithNonEmptyValues, getCtxByfilterSameDataItem, getCtxByfilterSameValueColumn].forEach(func => {
      newContext = func(newContext);
    });
    let validCellCount = 0;
    newContext.dataTable.forEach(item => {
      newContext.fieldInfo.forEach(info => {
        validCellCount += isValidData(item[info.fieldName]) ? 1 : -1;
      });
    });
    const dataView = {
      fieldInfo: newContext.fieldInfo,
      dataTable: newContext.dataTable,
      validColumnLength: clusterIds.length,
      validRowLength: newContext.dataTable.length,
      validCellCount
    };
    dataViewList.push(dataView);
  });
  dataViewList.sort((a, b) =>
    a.validCellCount < b.validCellCount ||
    (a.validCellCount === b.validCellCount && a.validRowLength < b.validRowLength) ||
    (a.validCellCount === b.validCellCount &&
      a.validRowLength === b.validRowLength &&
      a.validColumnLength < b.validColumnLength)
      ? 1
      : -1
  );
  return {
    ...context,
    originDataTable: dataTable,
    fieldInfo: dataViewList[0].fieldInfo,
    dataTable: dataViewList[0].dataTable,
    clusterResult: dataViewList
  };
};
