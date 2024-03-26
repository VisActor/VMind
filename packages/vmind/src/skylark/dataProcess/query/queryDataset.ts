import { DataItem, ILLMOptions, SimpleFieldInfo } from '../../../typings';
import { DataQueryResponse } from './type';
import { getQueryDatasetPrompt } from './prompts';
import { requestSkyLark } from '../../chart-generation/utils';
import { parseRespondField } from '../../../gpt/dataProcess/query/utils';
import { parseSkylarkResponseAsJSON, patchDataQueryInput } from './utils';
import { queryDataset } from '../../../common/dataProcess/dataQuery';

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
  const patchedInput = patchDataQueryInput(userInput);
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
