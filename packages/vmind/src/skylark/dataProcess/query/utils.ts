import { LLMResponse } from 'src/typings';
import JSON5 from 'json5';
import { replaceAll } from '../../../common/dataProcess/utils';

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
    const resJson = parseJson(content, '```');
    return resJson;
  } catch (err: any) {
    return {
      error: true,
      message: err.message
    };
  }
};

export const patchDataQueryInput = (userInput: string) =>
  userInput + ' 使用` `包裹sql中的所有列名。使用支持的聚合函数将所有的度量列聚合。';
