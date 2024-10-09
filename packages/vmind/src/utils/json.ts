import JSON5 from 'json5';
import { jsonrepair } from 'jsonrepair';
import { replaceAll } from './text';

export const matchJSONStr = (str: string) => {
  const first = str.indexOf('{');
  const last = str.lastIndexOf('}');
  const result = str.substring(first, last + 1);
  return result && result.length > 0 ? replaceAll(result, '\n', ' ') : str;
};

export const parseLLMJson = (JsonStr: string, prefix?: string) => {
  const parseNoPrefixStr = (str: string) => {
    try {
      return JSON5.parse(str);
    } catch (err) {
      try {
        return JSON5.parse(jsonrepair(str));
      } catch (err) {
        return {
          error: true
        };
      }
    }
  };
  if (prefix) {
    const splitArr = JsonStr.split(prefix);
    const splittedStr = splitArr[splitArr.length - 2];
    const res = parseNoPrefixStr(splittedStr);
    if (!res.error) {
      return res;
    }
  }
  const res2 = parseNoPrefixStr(JsonStr);
  return res2;
};
