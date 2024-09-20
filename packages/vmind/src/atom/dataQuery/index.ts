import type { DataQueryCtx } from '../../types/atom';
import { AtomName } from '../../types/atom';
import type { BaseOptions, DataQueryOptions } from '../type';
import { BaseAtom } from '../base';
import { merge, pick } from '@visactor/vutils';
import type { LLMMessage, LLMResponse } from '../../types/llm';
import { getQueryDatasetPrompt } from './prompt';
import { parseSQLResponse } from './utils';

export class DataQueryAtom extends BaseAtom<DataQueryCtx, DataQueryOptions> {
  name = AtomName.DATA_QUERY;

  isLLMAtom: true;

  constructor(context: DataQueryCtx, option: BaseOptions) {
    super(context, option);
  }

  buildDefaultContext(context: DataQueryCtx): DataQueryCtx {
    return merge(
      {},
      {
        dataTable: [],
        fieldInfo: [],
        llmFieldInfo: [],
        dataTableSummary: ''
      },
      context
    );
  }

  buildDefaultOptions(): DataQueryOptions {
    return {
      useSQL: true
    };
  }

  getLLMMessages(query?: string): LLMMessage[] {
    const { fieldInfo } = this.context;
    const { showThoughts } = this.options;
    const addtionContent = this.getHistoryLLMMessages(query);
    if (this.options.useSQL) {
      const fieldInfoContent = fieldInfo.map(info => pick(info, ['fieldName', 'fieldType', 'role']));
      return [
        {
          role: 'system',
          content: getQueryDatasetPrompt(showThoughts)
        },
        {
          role: 'user',
          content: `User's Command: ${query}\nColumn Information: ${JSON.stringify(fieldInfoContent)}`
        },
        ...addtionContent
      ];
    }
    /** @todo */
    return [];
  }

  parseLLMContent(data: LLMResponse) {
    const resJson = this.options.llm.parseJson(data);
    if (resJson.error) {
      return this.context;
    }
    const { sql, fieldInfo: responseFiledInfo } = resJson;
    if (!sql || !responseFiledInfo) {
      //try to parse the response with another format
      const content = data.choices[0].message.content;
      return {
        ...this.context,
        ...parseSQLResponse(content)
      };
    }
    return { ...this.context, sql, llmFieldInfo: responseFiledInfo };
  }

  protected _runWithOutLLM(): DataQueryCtx {
    return this.context;
  }
}
