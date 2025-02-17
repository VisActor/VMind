import { merge } from '@visactor/vutils';
import axios from 'axios';
import type { BaseContext } from '../types/atom';
import type { AtomName } from '../types/atom';
import type { LLMResponse } from '../types/llm';
import { Model, type ILLMOptions, type LLMMessage } from '../types/llm';
import { matchJSONStr, parseLLMJson, revisedJSONStr } from '../utils/json';

/** LLM Manager Class */
export class LLMManage {
  options: ILLMOptions;

  /** history chatId to support multi-turn conversation */
  historys: Record<string, BaseContext[]>;

  constructor(options: ILLMOptions) {
    this.options = merge({}, this.getDefaultOptions(), options);
    this.historys = {};
  }

  getDefaultOptions(): ILLMOptions {
    return {
      url: 'https://api.openai.com/v1/chat/completions',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      model: Model.GPT_4o,
      maxTokens: 1024,
      temperature: 0,
      frequencyPenalty: 0
    };
  }

  updateOptions(options: ILLMOptions) {
    this.options = merge({}, this.options, options);
  }

  async run(name: AtomName, messages: LLMMessage[]) {
    const {
      url,
      headers,
      method,
      maxTokens,
      temperature,
      model,
      frequencyPenalty: frequency_penalty,
      topP: top_p
    } = this.options;
    if (!this.historys[name]) {
      this.historys[name] = [];
    }
    try {
      const res: LLMResponse = await axios(url, {
        method,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        headers: headers as any,
        data: {
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
          stream: false,
          frequency_penalty,
          top_p
        }
      }).then(response => response.data);

      const { logId, id } = res;
      this.historys[name].push({
        logId,
        id
      });
      if (res.error) {
        return {
          error: res.error
        };
      }
      return res;
    } catch (err: any) {
      return {
        error: err
      };
    }
  }

  parseJson(res: LLMResponse) {
    const { choices, error } = res;
    if (error) {
      return {
        error
      };
    }
    try {
      const content = choices[0].message.content;
      const jsonStr = revisedJSONStr(matchJSONStr(content));

      const resJson = parseLLMJson(jsonStr, '```');
      return resJson;
    } catch (err: any) {
      return {
        error: err
      };
    }
  }
}
