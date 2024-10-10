import alasql from 'alasql';
import type { DataQueryCtx, DataTable, FieldInfo } from 'src/types';
import {
  matchColumnName,
  parseRespondField,
  replaceBlankSpace,
  replaceDataset,
  replaceInvalidWords,
  replaceString,
  sumAllMeasureFields,
  swapMap
} from './utils';
import { VMIND_DATA_SOURCE } from './const';

/**
 * patch the errors in sql according to the feature of alasql:
 * 1. replace invalid characters such as operator, non-ascii characters and alasql keywords in sql and dataset before executing.
 * 2. sum all the non-aggregation measure columns
 * @param sourceDataset
 * @param context
 * @returns valid sql string and dataset, and the replace map
 */
type PatchSQLResult = {
  finalSql: string;
  validDataset: DataTable;
  columnReplaceMap: Map<string, string>;
  sqlReplaceMap: Map<string, string>;
  llmFieldInfo: FieldInfo[];
};
export const patchSQLBeforeQuery = (context: DataQueryCtx): PatchSQLResult => {
  const { sql, dataTable, fieldInfo, llmFieldInfo: propsLLMFieldInfo } = context;
  const fieldNames = fieldInfo.map(field => field.fieldName);

  //remove invalid words in sql and get the replace map
  const { validStr, sqlReplaceMap, columnReplaceMap } = replaceInvalidWords(sql, fieldNames);

  //replace field names according to replaceMap
  const validColumnDataset = replaceDataset(dataTable, columnReplaceMap, true);

  //replace field names and data values according to replaceMap
  const validDataset = replaceDataset(validColumnDataset, sqlReplaceMap, false);

  const replacedFieldNames = fieldNames
    .map(field => replaceString(field, columnReplaceMap))
    .map(field => replaceString(field, sqlReplaceMap) as string);

  //replace blank spaces in column name
  const validSql = replaceBlankSpace(validStr, replacedFieldNames as string[]);

  //also, replace field names in fieldInfo
  const llmFieldInfo = propsLLMFieldInfo.map(field => {
    const { fieldName } = field;
    const temp = replaceString(fieldName, columnReplaceMap);
    const validFieldName = replaceString(temp, sqlReplaceMap) as string;

    const matchedFieldName = replacedFieldNames.find(f => matchColumnName(validFieldName as string, f as string));
    return {
      ...field,
      fieldName: matchedFieldName ?? validFieldName
    };
  });
  //sum all the non-aggregation measure columns
  const finalSql = sumAllMeasureFields(validSql, fieldInfo, columnReplaceMap, sqlReplaceMap);

  return {
    finalSql,
    validDataset,
    columnReplaceMap,
    sqlReplaceMap,
    llmFieldInfo
  };
};

type QueryResult = { alasqlDataset: DataTable };
/**
 * execute sql after patching using alasql
 * @param input
 * @param context
 * @returns dataset after executing sql query
 */
export const executeDataQuery = (context: PatchSQLResult) => {
  const { finalSql, validDataset } = context;
  //replace VMIND_DATA_SOURCE with placeholder "?"
  const sqlParts = (finalSql + ' ').split(VMIND_DATA_SOURCE);
  const sqlCount = sqlParts.length - 1;
  const alasqlQuery = sqlParts.join('?');
  //do the query
  const alasqlDataset = alasql(alasqlQuery, new Array(sqlCount).fill(validDataset));

  return {
    //...context,
    alasqlDataset
  };
};

type RestoreResult = {
  datasetAfterQuery: DataTable;
  llmFieldInfo: FieldInfo[];
};
/**
 * restore the dataset after query according to replace maps
 * @param input
 * @param context
 * @returns restored dataset
 */
export const restoreDatasetAfterQuery = (
  context: { llmFieldInfo: FieldInfo[] } & QueryResult & PatchSQLResult
): RestoreResult => {
  const { columnReplaceMap, sqlReplaceMap, alasqlDataset, llmFieldInfo: propsLLMFieldInfo } = context;
  //restore the dataset
  const columnReversedMap = swapMap(columnReplaceMap);
  const columnRestoredDataset = replaceDataset(alasqlDataset, columnReversedMap, true);
  const sqlReversedMap = swapMap(sqlReplaceMap);
  const sqlRestoredDataset = replaceDataset(columnRestoredDataset, sqlReversedMap, false);

  //restore fieldMap
  const llmFieldInfo = propsLLMFieldInfo.map(field => {
    const { fieldName } = field;
    const temp = replaceString(fieldName, columnReversedMap);
    const validFieldName = replaceString(temp, sqlReversedMap) as string;

    return {
      ...field,
      fieldName: validFieldName
    };
  });

  return {
    //...context,
    datasetAfterQuery: sqlRestoredDataset,
    llmFieldInfo
  };
};

export type ExecuteQueryCtx = DataQueryCtx & PatchSQLResult & QueryResult & RestoreResult;
export const getFinalQueryResult = (context: ExecuteQueryCtx) => {
  const { dataTable: sourceDataset, fieldInfo, llmFieldInfo: responseFieldInfo, datasetAfterQuery } = context;
  const fieldInfoNew = parseRespondField(responseFieldInfo, datasetAfterQuery);
  if (datasetAfterQuery.length === 0) {
    console.warn('empty dataset after query!');
  }

  return {
    dataTable: datasetAfterQuery.length === 0 ? sourceDataset : datasetAfterQuery,
    fieldInfo: datasetAfterQuery.length === 0 ? fieldInfo : fieldInfoNew
  };
};
