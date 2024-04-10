import { Transformer } from 'src/base/tools/transformer';
import { SimpleFieldInfo, VMindDataset } from 'src/typings';
import { ExecuteQueryContext, ExecuteQueryOutput, SQL } from '../../types';
import {
  parseRespondField,
  replaceBlankSpace,
  replaceDataset,
  replaceInvalidWords,
  replaceString,
  sumAllMeasureFields,
  swapMap
} from './utils';
import alasql from 'alasql';
import { VMIND_DATA_SOURCE } from '../getQuerySQL/GPT/prompt/template';

/**
 * patch the errors in sql according to the feature of alasql:
 * 1. replace invalid characters such as operator, non-ascii characters and alasql keywords in sql and dataset before executing.
 * 2. sum all the non-aggregation measure columns
 * @param sourceDataset
 * @param context
 * @returns valid sql string and dataset, and the replace map
 */
type PatchSQLResult = {
  finalSql: SQL;
  validDataset: VMindDataset;
  columnReplaceMap: Map<string, string>;
  sqlReplaceMap: Map<string, string>;
};
export const patchSQLBeforeQuery: Transformer<ExecuteQueryContext, ExecuteQueryContext, PatchSQLResult> = (
  input,
  context: ExecuteQueryContext
) => {
  const { sql } = input;
  const { sourceDataset } = context;
  const { fieldInfo } = context;
  const fieldNames = fieldInfo.map((field: SimpleFieldInfo) => field.fieldName);
  const { validStr, sqlReplaceMap, columnReplaceMap } = replaceInvalidWords(sql, fieldNames);

  //replace field names according to replaceMap
  const validColumnDataset = replaceDataset(sourceDataset, columnReplaceMap, true);

  //replace field names and data values according to replaceMap
  const validDataset = replaceDataset(validColumnDataset, sqlReplaceMap, false);

  //replace blank spaces in column name
  const replacedFieldNames = fieldNames
    .map((field: string | number) => replaceString(field, columnReplaceMap))
    .map((field: string | number) => replaceString(field, sqlReplaceMap));
  const validSql = replaceBlankSpace(validStr, replacedFieldNames as string[]);

  //sum all the non-aggregation measure columns
  const finalSql = sumAllMeasureFields(validSql, fieldInfo, columnReplaceMap, sqlReplaceMap);

  return {
    finalSql,
    validDataset,
    columnReplaceMap,
    sqlReplaceMap
  };
};

type QueryResult = PatchSQLResult & { alasqlDataset: VMindDataset };
/**
 * execute sql after patching using alasql
 * @param input
 * @param context
 * @returns dataset after executing sql query
 */
export const executeDataQuery: Transformer<PatchSQLResult, ExecuteQueryContext, QueryResult> = (
  input: PatchSQLResult,
  context: ExecuteQueryContext
) => {
  const { finalSql, validDataset } = input;
  //replace VMIND_DATA_SOURCE with placeholder "?"
  const sqlParts = (finalSql + ' ').split(VMIND_DATA_SOURCE);
  const sqlCount = sqlParts.length - 1;
  const alasqlQuery = sqlParts.join('?');
  //do the query
  const alasqlDataset = alasql(alasqlQuery, new Array(sqlCount).fill(validDataset));

  return {
    ...input,
    alasqlDataset
  };
};

type RestoreResult = QueryResult & {
  datasetAfterQuery: VMindDataset;
};
/**
 * restore the dataset after query according to replace maps
 * @param input
 * @param context
 * @returns restored dataset
 */
export const restoreDatasetAfterQuery: Transformer<QueryResult, ExecuteQueryContext, RestoreResult> = (
  input: QueryResult,
  context: ExecuteQueryContext
) => {
  const { columnReplaceMap, sqlReplaceMap, alasqlDataset } = input;
  //restore the dataset
  const columnReversedMap = swapMap(columnReplaceMap);
  const columnRestoredDataset = replaceDataset(alasqlDataset, columnReversedMap, true);
  const sqlReversedMap = swapMap(sqlReplaceMap);
  const sqlRestoredDataset = replaceDataset(columnRestoredDataset, sqlReversedMap, false);

  return {
    ...input,
    datasetAfterQuery: sqlRestoredDataset
  };
};

export const getFinalQueryResult: Transformer<QueryResult & RestoreResult, ExecuteQueryContext, ExecuteQueryOutput> = (
  input: RestoreResult,
  context: ExecuteQueryContext
) => {
  const { sourceDataset, fieldInfo, usage, llmFieldInfo: responseFieldInfo } = context;
  const { datasetAfterQuery } = input;
  const fieldInfoNew = parseRespondField(responseFieldInfo, datasetAfterQuery);
  if (datasetAfterQuery.length === 0) {
    console.warn('empty dataset after query!');
  }

  return {
    dataset: datasetAfterQuery.length === 0 ? sourceDataset : datasetAfterQuery,
    fieldInfo: datasetAfterQuery.length === 0 ? fieldInfo : fieldInfoNew,
    usage
  };
};
