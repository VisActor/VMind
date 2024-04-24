import type { LLMResponse } from '../../../../../common/typings';
import { matchJSONStr, replaceAll } from '../../../../../common/utils/utils';
import type { GetQuerySQLContext } from '../../../../../applications/dataAggregation/types';
import type { Requester } from '../../../../../base/tools/requester';
import JSON5 from 'json5';
import { requestSkyLark } from '../../../../../common/utils/skylark';

export const parseJson = (JsonStr: string, prefix?: string) => {
  const parseNoPrefixStr = (str: string) => {
    //尝试不带前缀的解析
    try {
      return JSON5.parse(str);
    } catch (err) {
      return {
        error: true
      };
    }
  };
  //解析GPT返回的JSON格式
  if (prefix) {
    //被某些字符包裹
    const splitArr = JsonStr.split(prefix);
    const splittedStr = splitArr[splitArr.length - 2];
    const res = parseNoPrefixStr(splittedStr);
    if (!res.error) {
      return res;
    }
  }
  //没有被前缀包裹，或者解析被前缀包裹的json失败，尝试直接解析返回结果
  const res2 = parseNoPrefixStr(JsonStr);
  return res2;
};

export const parseSkylarkResponseAsJSON = (skylarkRes: LLMResponse) => {
  try {
    if (skylarkRes.error) {
      return {
        error: true,
        ...skylarkRes.error
      };
    }
    const choices = skylarkRes.choices;
    const content = replaceAll(choices[0].message.content, '\n', ' ');
    const jsonStr = matchJSONStr(content);
    const resJson = parseJson(jsonStr, '```');
    const { sql, fieldInfo: responseFiledInfo } = resJson;
    return { sql, llmFieldInfo: responseFiledInfo, usage: skylarkRes.usage };
  } catch (err: any) {
    return {
      error: true,
      message: err.message
    };
  }
};

export const dataQueryRequestLLM: Requester<GetQuerySQLContext> = async (
  prompt: string,
  queryDatasetMessage: string,
  context: GetQuerySQLContext
) => {
  const { llmOptions } = context;
  const requestFunc = llmOptions.customRequestFunc?.dataQuery ?? requestSkyLark;
  const QueryDatasetPrompt = prompt;
  const dataProcessRes = await requestFunc(QueryDatasetPrompt, queryDatasetMessage, llmOptions);
  return dataProcessRes;
};
