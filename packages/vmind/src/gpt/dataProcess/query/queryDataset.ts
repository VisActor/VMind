import { DataItem, ILLMOptions, SimpleFieldInfo } from '../../../typings';
import { parseGPTQueryResponse, parseRespondField, patchQueryInput } from './utils';
import { DataQueryResponse } from './type';
import {
  parseGPTResponse as parseGPTResponseAsJSON,
  requestGPT
} from '../../../applications/dataAggregation/taskNodes/getQuerySQL/GPT/utils';
import { getQueryDatasetPrompt } from '../prompts';
import { queryDataset } from '../../../applications/dataAggregation/taskNodes/executeQuery/dataQuery';

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
  const patchedInput = patchQueryInput(userInput);
  const { sql, fieldInfo: responseFieldInfo, usage } = await getQuerySQL(patchedInput, fieldInfo, options);

  const datasetAfterQuery = queryDataset(sql, sourceDataset, fieldInfo);

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
  const { sql, fieldInfo: responseFiledInfo } = dataQueryResponse;
  if (!sql || !responseFiledInfo) {
    //try to parse the response with another format
    const choices = dataProcessRes.choices;
    const content = choices[0].message.content;
    return {
      ...parseGPTQueryResponse(content),
      usage: dataProcessRes.usage
    };
  }
  return { ...dataQueryResponse, usage: dataProcessRes.usage };
};
