import axios from 'axios';
import { ILLMOptions, LLMResponse } from '../../typings';
import { omit } from 'lodash';

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

export const getStrFromDict = (dict: Record<string, string>) =>
  Object.keys(dict)
    .map(key => `${key}: ${dict[key]}`)
    .join('\n');

const KNOWLEDGE_START_INDEX = 1;
export const getStrFromArray = (array: string[]) =>
  array.map((item, index) => `${index + KNOWLEDGE_START_INDEX}. ${item}`).join('\n');
