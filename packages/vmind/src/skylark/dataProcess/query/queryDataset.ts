import { DataItem, ILLMOptions, SimpleFieldInfo } from '../../../typings';
import { DataQueryResponse } from './type';
import { VMIND_DATA_SOURCE, getQueryDatasetPrompt } from './prompts';
import alasql from 'alasql';
import { requestSkyLark } from '../../chart-generation/utils';
import { parseRespondField } from '../../../gpt/dataProcess/query/utils';
import { parseSkylarkResponseAsJSON } from './utils';

/**
 * query the source dataset according to user's input and fieldInfo to get aggregated dataset
 *
 * @param userInput
 * @param fieldInfo
 * @param sourceDataset
 */
export const queryDatasetWithSkylark = async (
  userInput: string,
  fieldInfo: SimpleFieldInfo[],
  sourceDataset: DataItem[],
  options: ILLMOptions
) => {
  const patchedInput = userInput;
  const { sql, fieldInfo: responseFieldInfo, usage } = await getQuerySQL(patchedInput, fieldInfo, options);
  const sqlParts = (sql + ' ').split(VMIND_DATA_SOURCE);

  const sqlCount = sqlParts.length - 1;
  const alasqlQuery = sqlParts.join('?');

  console.log();
  const alasqlDataset = alasql(alasqlQuery, new Array(sqlCount).fill(sourceDataset));

  const fieldInfoNew = parseRespondField(responseFieldInfo, alasqlDataset);
  if (alasqlDataset.length === 0) {
    console.warn('empty dataset after query!');
  }
  return {
    dataset: alasqlDataset.length === 0 ? sourceDataset : alasqlDataset,
    fieldInfo: alasqlDataset.length === 0 ? fieldInfo : fieldInfoNew,
    usage
  };
};

/**
 * call gpt to get the query sql according to user's input and data field.
 * @param userInput
 * @param fieldInfo
 */
const getQuerySQL = async (userInput: string, fieldInfo: SimpleFieldInfo[], options: ILLMOptions) => {
  const queryDatasetMessage = `User's Command: ${userInput}\nColumn Information: ${JSON.stringify(fieldInfo)}`;

  const requestFunc = options.customRequestFunc?.dataQuery ?? requestSkyLark;
  const QueryDatasetPrompt = getQueryDatasetPrompt(options.showThoughts ?? true);
  const dataProcessRes = await requestFunc(QueryDatasetPrompt, queryDatasetMessage, options);
  const dataQueryResponse: DataQueryResponse = parseSkylarkResponseAsJSON(dataProcessRes);
  //const { sql, fieldInfo: responseFiledInfo } = dataQueryResponse;
  //if (!sql || !responseFiledInfo) {
  //  //try to parse the response with another format
  //  const choices = dataProcessRes.choices;
  //  const content = choices[0].message.content;
  //  return {
  //    ...parseGPTQueryResponse(content),
  //    usage: dataProcessRes.usage
  //  };
  //}
  return { ...dataQueryResponse, usage: dataProcessRes.usage };
};
