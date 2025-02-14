import axios from 'axios';
import yaml from 'js-yaml';

import { omit } from '@visactor/chart-advisor';
import type { ILLMOptions, LLMResponse } from '../../common/typings';

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
        model: options?.model ?? 'skylark2-pro',
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

const startsWithTextAndColon = (str: string) => {
  const regex = /^(.+:| +\-)/;
  return regex.test(str);
};

const isStringArray = (str: string) => {
  const regex = /^(.*)\: ".+"(, ".+")+$/;
  return regex.test(str);
};

export const parseSkylarkResponse = (larkResponse: LLMResponse): Record<string, any> => {
  try {
    if (larkResponse.error) {
      console.error(larkResponse.error);
      return { error: true, ...larkResponse.error };
    }
    const responseStr = larkResponse.choices[0].message.content;
    const usage = larkResponse.usage;
    //replace all the {key} into key:
    const replacedStr = responseStr.replace(
      /{(.*?)}/g,
      (matchedStr: string, matchedGroup: string) => matchedGroup + ':'
    );
    const patchedStr = replacedStr
      .split('\n')
      //remove lines that is not start with text and colon
      .filter((str: string) => startsWithTextAndColon(str))
      //remove blank space at the start of each line
      // .map((str: string) => str.replace(/^\s+/, ''))
      //wrap string list with []
      .map((str: string) => {
        if (isStringArray(str)) {
          return str.replace(/(.*): (.*)/, '$1: [$2]');
        }
        return str;
      })
      //check if there are other : after the first : in YAML; If so, wrap the str with ""
      .map((str: string) => {
        const parts = str.split(':');
        return parts.length > 2 ? `${parts[0]}: "${parts.slice(1).join(':').trim()}"` : str;
      })
      //replace ": -" with ": null"
      .map((str: string) => {
        return str.replace(/: -/g, ': null');
      })
      .join('\n');

    const resJson = yaml.load(patchedStr) as Record<string, any>;
    resJson.usage = usage;
    //replace all the keys to lower case.
    return Object.keys(resJson).reduce((prev, cur) => ({ ...prev, [cur.toLocaleLowerCase()]: resJson[cur] }), {});
  } catch (err: any) {
    console.error(err);
    return { error: true, message: err.message };
  }
};
