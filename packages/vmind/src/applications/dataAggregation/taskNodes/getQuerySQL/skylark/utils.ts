import { ILLMOptions, LLMResponse } from 'src/typings';
import { matchJSONStr, replaceAll } from 'src/common/utils';
import { GetQuerySQLContext } from 'src/applications/dataAggregation/types';
import { Requester } from 'src/base/tools/requester';
import axios from 'axios';
import { omit } from 'lodash';
import JSON5 from 'json5';

const patchDataQueryInput = (userInput: string) =>
  userInput + ' 使用` `包裹sql中的所有列名。使用支持的聚合函数将所有的度量列聚合。';

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

/**
 *
 * @param prompt
 * @param message
 * @param options
 */
export const requestSkyLark = async (prompt: string, message: string, options: ILLMOptions): Promise<LLMResponse> => {
  const url: string = options?.url;
  const headers: any = { ...(options.headers ?? {}), 'Content-Type': 'application/json' };

  try {
    const res = await axios(url, {
      method: options?.method ?? 'POST',
      headers, //must has Authorization: `Bearer ${openAIKey}` if use openai api
      data: {
        ...omit(options, ['headers', 'url', 'method', 'showThoughts', 'customRequestFunc']),
        model: options?.model ?? 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: prompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: options?.max_tokens ?? 500,
        temperature: options?.temperature ?? 0,
        stream: false
      }
    }).then(response => response.data);

    return res;
  } catch (err: any) {
    return err.response.data;
  }
};

export const dataQueryRequestLLM: Requester<GetQuerySQLContext> = async (
  prompt: string,
  context: GetQuerySQLContext
) => {
  const { userInput, fieldInfo, llmOptions } = context;
  const patchedInput = patchDataQueryInput(userInput);

  const queryDatasetMessage = `User's Command: ${patchedInput}\nColumn Information: ${JSON.stringify(fieldInfo)}`;

  const requestFunc = llmOptions.customRequestFunc?.dataQuery ?? requestSkyLark;
  const QueryDatasetPrompt = prompt;
  const dataProcessRes = await requestFunc(QueryDatasetPrompt, queryDatasetMessage, llmOptions);
  return dataProcessRes;
};
