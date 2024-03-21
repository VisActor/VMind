import { DataItem, SimpleFieldInfo } from 'src/typings';
import {
  getValueByAttributeName,
  mergeMap,
  replaceAll,
  replaceDataset,
  replaceInvalidContent,
  replaceNonASCIICharacters,
  replaceInvalidWords,
  swapMap,
  replaceBlankSpace,
  replaceString,
  sumAllMeasureFields,
  convertGroupByToString
} from './utils';
import alasql from 'alasql';

export const VMIND_DATA_SOURCE = 'VMind_data_source';

/**
 * SQL query for SourceDatset
 * It has nothing to do with the model type model
 * @param sql
 * @param sourceDataset
 * @param fieldInfo
 * @returns dataset after query
 */
export const queryDataset = (sql: string, sourceDataset: DataItem[], fieldInfo: SimpleFieldInfo[]) => {
  const fieldNames = fieldInfo.map(field => field.fieldName);
  const { validStr, sqlReplaceMap, columnReplaceMap } = replaceInvalidWords(sql, fieldNames);

  //replace field names according to replaceMap
  const validColumnDataset = replaceDataset(sourceDataset, columnReplaceMap, true);

  //replace field names and data values according to replaceMap
  const validDataset = replaceDataset(validColumnDataset, sqlReplaceMap, false);

  //replace blank spaces in column name
  const replacedFieldNames = fieldNames
    .map(field => replaceString(field, columnReplaceMap))
    .map(field => replaceString(field, sqlReplaceMap));
  const validSql = replaceBlankSpace(validStr, replacedFieldNames as string[]);

  const finalSql = sumAllMeasureFields(validSql, fieldInfo, columnReplaceMap, sqlReplaceMap);
  //convertGroupByToString(finalSql, validDataset)

  //replace VMIND_DATA_SOURCE with placeholder "?"
  const sqlParts = (finalSql + ' ').split(VMIND_DATA_SOURCE);
  const sqlCount = sqlParts.length - 1;
  const alasqlQuery = sqlParts.join('?');
  //do the query
  const alasqlDataset = alasql(alasqlQuery, new Array(sqlCount).fill(validDataset));

  //restore the dataset
  const columnReversedMap = swapMap(columnReplaceMap);
  const columnRestoredDataset = replaceDataset(alasqlDataset, columnReversedMap, true);
  const sqlReversedMap = swapMap(sqlReplaceMap);
  const sqlRestoredDataset = replaceDataset(columnRestoredDataset, sqlReversedMap, false);

  return sqlRestoredDataset;
};
