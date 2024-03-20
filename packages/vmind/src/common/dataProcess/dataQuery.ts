import { DataItem, SimpleFieldInfo } from 'src/typings';
import {
  getValueByAttributeName,
  mergeMap,
  replaceAll,
  replaceDataset,
  replaceInvalidContent,
  replaceNonASCIICharacters,
  replaceOperator,
  swapMap
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
export const queryDataset = (sql: string, sourceDataset: DataItem[]) => {
  /**
   * operators such as +, -, *, / in column names in sql will cause ambiguity and parsing error
   * so we need to replace them
   */
  const { validStr: sqlWithNoOperator, operatorMap: operatorReplaceMap } = replaceOperator(sql);
  console.log(sqlWithNoOperator);
  /**
   * sometimes skylark2 pro will return a sql statement in which non-ascii characters are not wrapped with ``
   * this will cause error in alasql
   * so we need to replace them with random string
   */
  const { validStr: sqlWithNoASCII, replaceMap: ASCIIReplaceMap } = replaceNonASCIICharacters(sqlWithNoOperator);
  console.log(sqlWithNoASCII);

  const replaceMap = mergeMap(operatorReplaceMap, ASCIIReplaceMap);
  console.log(replaceMap);
  //replace field names according to replaceMap
  const validDataset = replaceDataset(sourceDataset, replaceMap);
  console.log(validDataset);

  /**
   * sometimes skylark2 pro will return a sql statement with some blank spaces in column names
   * this will make the alasql can't find the correct column in dataset
   * so we need to remove these blank spaces
   */
  //extract all the columns in sql str
  const ast = alasql.parse(sqlWithNoASCII) as any;
  const columnsInSql = getValueByAttributeName(ast.statements[0], 'columnid');
  console.log(ast);

  console.log(columnsInSql);
  //replace all the spaces and reserved words in column names in sql
  const validColumnNames = columnsInSql.map(column => replaceInvalidContent(column));
  const finalSql = columnsInSql.reduce((prev, _cur, index) => {
    const originColumnName = columnsInSql[index];
    const validColumnName = validColumnNames[index];
    return replaceAll(prev, originColumnName, validColumnName);
  }, sqlWithNoASCII);

  console.log(finalSql);

  const sqlParts = (finalSql + ' ').split(VMIND_DATA_SOURCE);

  const sqlCount = sqlParts.length - 1;
  const alasqlQuery = sqlParts.join('?');
  const alasqlDataset = alasql(alasqlQuery, new Array(sqlCount).fill(validDataset));
  console.log(alasqlDataset);

  //restore the dataset
  const reversedMap = swapMap(replaceMap);
  const restoredDataset = replaceDataset(alasqlDataset, reversedMap);
  console.log(restoredDataset);

  return restoredDataset;
};
