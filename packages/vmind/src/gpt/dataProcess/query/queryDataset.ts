import { DataItem, ILLMOptions, SimpleFieldInfo } from '../../../typings';
import NodeSQLParser from 'node-sql-parser';
import {
  mergeMap,
  parseGPTQueryResponse,
  parseRespondField,
  patchQueryInput,
  preprocessSQL,
  replaceOperator
} from './utils';
import { parseSqlAST } from './parseSqlAST';
import { isArray } from 'lodash';
import { DataQueryResponse, SQLAst } from './type';
import { Query, query } from '@visactor/calculator';
import { parseGPTResponse as parseGPTResponseAsJSON, requestGPT } from '../../utils';
import { getQueryDatasetPrompt } from '../prompts';

/**
 * query the source dataset according to user's input and fieldInfo to get aggregated dataset
 *
 * @param userInput
 * @param fieldInfo
 * @param sourceDataset
 */
export const queryDatasetWithGPT = async (
  userInput: string,
  fieldInfo: SimpleFieldInfo[],
  sourceDataset: DataItem[],
  options: ILLMOptions
) => {
  const { validFieldInfo, replaceMap: operatorReplaceMap } = replaceOperator(fieldInfo);
  const patchedInput = patchQueryInput(userInput);
  const { SimQuery, fieldInfo: responseFieldInfo } = await getQuerySQL(patchedInput, validFieldInfo, options);
  const { validStr, replaceMap: preprocessReplaceMap } = preprocessSQL(SimQuery, fieldInfo);
  const replaceMap = mergeMap(preprocessReplaceMap, operatorReplaceMap);
  const parser = new NodeSQLParser.Parser();

  const ast = parser.astify(validStr);
  const queryObject = parseSqlAST((isArray(ast) ? ast[0] : ast) as SQLAst, sourceDataset, fieldInfo, replaceMap);

  const dataset = query(queryObject as Query);

  const fieldInfoNew = parseRespondField(responseFieldInfo, dataset, replaceMap);
  if (dataset.length === 0) {
    console.warn('empty dataset after query!');
  }
  return {
    dataset: dataset.length === 0 ? sourceDataset : dataset,
    fieldInfo: dataset.length === 0 ? fieldInfo : fieldInfoNew
  };
};

/**
 * call gpt to get the query sql according to user's input and data field.
 * @param userInput
 * @param fieldInfo
 */
const getQuerySQL = async (userInput: string, fieldInfo: SimpleFieldInfo[], options: ILLMOptions) => {
  const queryDatasetMessage = `User's Command: ${userInput}\nColumn Information: ${JSON.stringify(fieldInfo)}`;

  const requestFunc = options.customRequestFunc?.dataQuery ?? requestGPT;
  const QueryDatasetPrompt = getQueryDatasetPrompt(options.showThoughts ?? true);
  const dataProcessRes = await requestFunc(QueryDatasetPrompt, queryDatasetMessage, options);
  const dataQueryResponse: DataQueryResponse = parseGPTResponseAsJSON(dataProcessRes);
  const { SimQuery, fieldInfo: responseFiledInfo } = dataQueryResponse;
  if (!SimQuery || !responseFiledInfo) {
    //try to parse the response with another format
    const choices = dataProcessRes.choices;
    const content = choices[0].message.content;
    return parseGPTQueryResponse(content);
  }
  return dataQueryResponse;
};
