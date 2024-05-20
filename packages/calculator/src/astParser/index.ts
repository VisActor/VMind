import NodeSQLParser from 'node-sql-parser';
import { query } from '../query';
import { SQLAst, SimpleFieldInfo } from './type';
import { Query, TableData } from '../types';
import { parseRespondField, preprocessSQL } from './utils';
import { parseSqlAST } from './parseSqlAST';
import { isArray } from 'lodash-es';

/**
 * query the source dataset according to user's input and fieldInfo to get aggregated dataset
 *
 * @param userInput
 * @param fieldInfo
 * @param sourceDataset
 */
export const queryDataset = async (sql: string, fieldInfo: SimpleFieldInfo[], sourceDataset: TableData) => {
  const { validStr, replaceMap } = preprocessSQL(sql, fieldInfo);
  const parser = new NodeSQLParser.Parser();

  const ast = parser.astify(validStr);
  const queryObject = parseSqlAST((isArray(ast) ? ast[0] : ast) as SQLAst, sourceDataset, fieldInfo, replaceMap);

  const dataset = query(queryObject as Query);

  const fieldInfoNew = parseRespondField(fieldInfo, dataset, replaceMap);
  return {
    dataset: dataset.length === 0 ? sourceDataset : dataset,
    fieldInfo: dataset.length === 0 ? fieldInfo : fieldInfoNew
  };
};
