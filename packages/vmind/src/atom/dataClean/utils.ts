import stringSimilarity from 'string-similarity';
import { getRoleByFieldType } from '../../utils/field';
import type { ClusterDataView, DatasetFromText } from '../../types/atom';
import type { DataItem, DataTable } from '../../types';
import { DataType, ROLE, type DataCleanCtx, type FieldInfo } from '../../types';
import { isArray, isNumber, isString, pick } from '@visactor/vutils';
import { extractFirstNumberInString } from '../../utils/text';
import { isValidData, uniqBy, average, convertStringToDateValue } from '../../utils/common';
import type { RangeValueTransferType } from '../type';
import { agglomerativeHierarchicalClustering, type ClusterDataItem } from '../../utils/cluster';
import dayjs from 'dayjs';

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

export const transferFieldInfo = (context: DataCleanCtx, fieldMapping?: Record<string, FieldInfo>) => {
  (context.fieldInfo || []).forEach(info => {
    if (!info.role || !info.location) {
      info.role = getRoleByFieldType(info.type);
      info.location = info.role as any;
    }
    if (fieldMapping?.[info.fieldName]) {
      info.alias = info.alias ?? fieldMapping[info.fieldName]?.alias;
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
  if (dataTable.length && fieldInfo.length) {
    const cleanFieldKey: string[] = [];
    fieldInfo.forEach(info => {
      if (info.role === ROLE.DIMENSION && !isValidData(dataTable[0][info.fieldName])) {
        cleanFieldKey.push(info.fieldName);
      }
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

export const sortDataTableByDate = (context: DataCleanCtx) => {
  const { dataTable, fieldInfo } = context;
  const dateField = fieldInfo.find(info => info.role === ROLE.DIMENSION && info.type === DataType.DATE);
  if (dateField) {
    dataTable.sort((a, b) => {
      const dateA = dayjs(convertStringToDateValue(`${a[dateField.fieldName]}`));
      const dateB = dayjs(convertStringToDateValue(`${b[dateField.fieldName]}`));
      if (dateA.isValid() && dateB.isValid()) {
        return dateA.isBefore(dateB) ? -1 : 1;
      }
      return 0;
    });
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
  if (dataTable.length >= 1 && fieldInfo.length) {
    fieldInfo.forEach(info => {
      if (info.role === ROLE.DIMENSION) {
        return;
      }
      for (let i = 0; i < dataTable.length; i++) {
        let value = dataTable[i][info.fieldName];
        if (typeof dataTable[i][info.fieldName] === 'string' && isNaN(Number(value))) {
          const extractionValue = `${extractFirstNumberInString(value as string)}`;
          const beforeLen = (value as string).length;
          const curLen = extractionValue.length;
          dataTable[i][info.fieldName] =
            extractionValue !== 'null' && (curLen / beforeLen > 0.9 || beforeLen - curLen <= 2)
              ? Number(extractionValue)
              : null;
        } else if (typeof dataTable[i][info.fieldName] === 'string') {
          value = Number(value);
          dataTable[i][info.fieldName] = value;
        } else if (!isNumber(value)) {
          value = null;
          dataTable[i][info.fieldName] = null;
        }
        value = dataTable[i][info.fieldName];
        if (info.type === DataType.RATIO && isNumber(value)) {
          if (isStringText) {
            // revised wrong ratio value in extraction
            const ratioValue = value * 100;
            if ((text.includes(`${ratioValue}%`) || text.includes(`${value}倍`)) && !text.includes(`${value}`)) {
              dataTable[i][info.fieldName] = ratioValue;
              value = ratioValue;
            }
          }
          // transfer ratio value to absolue value without unit
          if (info.ratioGranularity === '%') {
            dataTable[i][info.fieldName] = value / 100;
          } else if (info.ratioGranularity === '‰') {
            dataTable[i][info.fieldName] = value / 1000;
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
  const { dataTable = [], fieldInfo } = context || {};
  let newDataTable = uniqBy(dataTable, item => JSON.stringify(item));
  if (fieldInfo.length === 1) {
    newDataTable = newDataTable.length > 0 ? [newDataTable[0]] : newDataTable;
  }
  return {
    ...context,
    dataTable: newDataTable
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
  const validCell = cell.filter(v => isValidData(v));
  switch (type) {
    case 'avg':
      return average(validCell);
    case 'filter':
      return null;
    case 'max':
      return Math.max(...validCell);
    case 'min':
      return Math.min(...validCell);
    case 'first':
      return validCell[0];
    case 'last':
      return validCell[validCell.length - 1];
    default:
      return validCell.join('-');
  }
};

/** convert the interval data */
export const getCtxByRangeValueTranser = (context: DataCleanCtx, type: RangeValueTransferType) => {
  const { dataTable = [], fieldInfo } = context || {};
  return {
    ...context,
    dataTable: dataTable.map(item => {
      const newItem = { ...item };
      fieldInfo.forEach(info => {
        if (info.role === ROLE.MEASURE && !isString(item[info.fieldName]) && isArray(item[info.fieldName])) {
          newItem[info.fieldName] = transferRangeData(item[info.fieldName] as any, type);
        }
      });
      return newItem;
    })
  };
};

export const revisedUnMatchedFieldInfo = (context: DataCleanCtx) => {
  const { dataTable, fieldInfo } = context;
  const dataTableFieldSet = new Set<string>();
  dataTable.forEach(item => {
    Object.keys(item).forEach(key => dataTableFieldSet.add(key));
  });
  const fieldInfoMapping: Record<string, FieldInfo> = {};
  fieldInfo.forEach(info => {
    fieldInfoMapping[info.fieldName] = info;
  });
  const fieldNameSet = new Set(Object.keys(fieldInfoMapping));
  const intersectionName = dataTableFieldSet.intersection(fieldNameSet);
  if (intersectionName.size !== dataTableFieldSet.size) {
    const dataTableUnMatch = dataTableFieldSet.difference(intersectionName);
    const fieldNameUnMatch = fieldNameSet.difference(intersectionName);
    if (dataTableUnMatch.size !== fieldNameUnMatch.size) {
      return context;
    }
    fieldNameUnMatch.forEach(name => {
      const candidateList = [...dataTableUnMatch];
      let min = -1;
      let matchedName = candidateList[0];
      candidateList.forEach(v => {
        const score = stringSimilarity.compareTwoStrings(name, v);
        if (score > min) {
          min = score;
          matchedName = v;
        }
      });
      fieldInfoMapping[name].fieldName = matchedName;
      fieldInfoMapping[name].alias = name;
      dataTableUnMatch.delete(matchedName);
    });
  }
  return context;
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

export const canMergeDataTable = (ctxA: DatasetFromText, ctxB: DatasetFromText) => {
  const { fieldInfo: fieldInfoA = [], summary: summaryA } = ctxA || {};
  const { fieldInfo: fieldInfoB = [], summary: summaryB } = ctxB || {};
  if (fieldInfoA.length !== fieldInfoB.length || !fieldInfoA.length || !summaryA || !summaryB) {
    return false;
  }
  return fieldInfoA.every(item => {
    return fieldInfoB.find(
      itemB =>
        itemB.fieldName === item.fieldName &&
        itemB.type === item.type &&
        itemB?.unit === item?.unit &&
        itemB?.ratioGranularity === item?.ratioGranularity &&
        itemB?.alias === item?.alias
    );
  });
};

/** get main data view and cluster result */
export const getSplitDataViewOfDataTable = (context: DataCleanCtx, threshold = 0.4) => {
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
    let validMeasureCellCount = 0;
    newContext.dataTable.forEach(item => {
      newContext.fieldInfo.forEach(info => {
        const isValid = isValidData(item[info.fieldName]);
        validCellCount += isValid ? 1 : -1;
        validMeasureCellCount += isValid && info.role === ROLE.MEASURE ? 1 : 0;
      });
    });
    const dataView = {
      fieldInfo: newContext.fieldInfo,
      dataTable: newContext.dataTable,
      validColumnLength: clusterIds.length,
      validRowLength: newContext.dataTable.length,
      validMeasureCellCount,
      validCellCount
    };
    validCellCount > 0 && dataViewList.push(dataView);
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
  if (dataViewList.length === 0) {
    return context;
  }
  return {
    ...context,
    originDataTable: dataTable,
    fieldInfo: dataViewList[0].fieldInfo,
    dataTable: dataViewList[0].dataTable,
    clusterResult: dataViewList
  };
};

export const canMergeClusterResult = (clusterResult: ClusterDataView[]) => {
  if (!clusterResult.length) {
    return false;
  }
  return clusterResult.every(dataView => {
    const { fieldInfo, dataTable } = dataView;
    return (
      dataTable.length === 1 && fieldInfo.findIndex(info => [DataType.DATE, DataType.TIME].includes(info.type)) === -1
    );
  });
};

export const mergeClusterDataView = (clusterResult: ClusterDataView[]) => {
  const newFieldInfo: FieldInfo[] = [];
  const newDataTable: DataTable = [{}];
  clusterResult.forEach(dataView => {
    const { fieldInfo, dataTable } = dataView;
    const measureFields = fieldInfo.filter(info => info.role === ROLE.MEASURE);
    newFieldInfo.push(...measureFields);
    measureFields.forEach(field => {
      newDataTable[0][field.fieldName] = dataTable[0][field.fieldName];
    });
  });
  return {
    fieldInfo: newFieldInfo,
    dataTable: newDataTable
  };
};

const isSameFields = (a: FieldInfo[], b: FieldInfo[]) => {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((info, index) => {
    const matchInB = b.find(item => item.fieldName === info.fieldName);
    return (
      matchInB &&
      matchInB.role === info.role &&
      matchInB.type === info.type &&
      matchInB.unit === info.unit &&
      matchInB.dateGranularity === info.dateGranularity
    );
  });
};

function longestCommonSubstringAtEdges(a: string, b: string) {
  // 检查开头
  let startLen = 0;
  while (startLen < a.length && startLen < b.length && a[startLen] === b[startLen]) {
    startLen++;
  }

  // 检查结尾
  let endLen = 0;
  while (endLen < a.length && endLen < b.length && a[a.length - 1 - endLen] === b[b.length - 1 - endLen]) {
    endLen++;
  }

  // 返回较长的公共子字符串
  if (startLen >= endLen) {
    return {
      strA: a.substring(startLen, a.length),
      strB: b.substring(startLen, b.length),
      commonStr: a.substring(0, startLen)
    };
  }
  return {
    strA: a.substring(0, a.length - endLen),
    strB: b.substring(0, b.length - endLen),
    commonStr: a.substring(endLen, a.length)
  };
}

export const mergeDataTable = (ctxA: DatasetFromText, ctxB: DatasetFromText) => {
  const { dataTable: tableA, summary: summaryA, textRange: rangeA } = ctxA;
  const { dataTable: tableB, summary: summaryB, textRange: rangeB } = ctxB;
  const { strA, strB, commonStr } = longestCommonSubstringAtEdges(summaryA, summaryB);
  const newFieldInfo: FieldInfo = {
    fieldName: commonStr,
    description: `${summaryA} and ${summaryB}`,
    role: ROLE.DIMENSION,
    type: DataType.STRING
  };
  const newDataTable = [
    ...tableA.map(v => ({ ...v, [commonStr]: strA })),
    ...tableB.map(v => ({ ...v, [commonStr]: strB }))
  ];
  const textRange = rangeA && rangeB ? [rangeA[0], rangeB[1]] : null;
  return {
    dataTable: newDataTable,
    fieldInfo: [newFieldInfo, ...ctxA.fieldInfo],
    summary: `${summaryA} and ${summaryB}`,
    textRange: textRange as any
  };
};
