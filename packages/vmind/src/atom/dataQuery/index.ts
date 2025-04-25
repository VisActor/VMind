import type { DataQueryCtx, DataQueryOptions, BaseOptions } from '../../types';
import { AtomName } from '../../types/atom';
import { BaseAtom } from '../base';
import { merge, pick } from '@visactor/vutils';
import type { LLMMessage, LLMResponse } from '../../types/llm';
import { getQueryDatasetPrompt } from './prompt';
import { parseSQLResponse } from './utils';
import type { ExecuteQueryCtx } from './executeQuery';
import { executeDataQuery, getFinalQueryResult, patchSQLBeforeQuery, restoreDatasetAfterQuery } from './executeQuery';
import { getFieldInfoFromDataset } from '../../utils/field';
import { Factory } from '../../core/factory';
import type { BaseAtomConstructor } from '../../types';

export class DataQueryAtom extends BaseAtom<DataQueryCtx, DataQueryOptions> {
  name = AtomName.DATA_QUERY;

  isLLMAtom = true;

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
        command: '',
        dataTableSummary: ''
      },
      context
    );
  }

  buildDefaultOptions(): DataQueryOptions {
    return {
      ...super.buildDefaultOptions(),
      useSQL: true
    };
  }

  getLLMMessages(query?: string): LLMMessage[] {
    const { fieldInfo, command } = this.context;
    const { showThoughts } = this.options;
    const addtionContent = this.getHistoryLLMMessages(query);
    if (this.options.useSQL) {
      const fieldInfoContent = fieldInfo.map(info => pick(info, ['fieldName', 'type', 'role']));
      return [
        {
          role: 'system',
          content: getQueryDatasetPrompt(showThoughts)
        },
        {
          role: 'user',
          content: `User's Command: ${command}\nColumn Information: ${JSON.stringify(fieldInfoContent)}`
        },
        ...addtionContent
      ];
    }
    /** @todo */
    return [];
  }

  parseLLMContent(resJson: any, toolJson: any, llmRes: LLMResponse) {
    const { sql, fieldInfo: responseFiledInfo, thoughts = '' } = resJson;
    if ((!sql || !responseFiledInfo) && llmRes?.choices?.[0]) {
      //try to parse the response with another format
      const content = llmRes.choices[0].message.content;
      return {
        ...this.context,
        ...parseSQLResponse(content)
      };
    }
    return { ...this.context, sql, llmFieldInfo: responseFiledInfo, thoughts };
  }

  protected runBeforeLLM(): DataQueryCtx {
    const { fieldInfo = [], dataTable } = this.context;
    if (!fieldInfo.length && dataTable.length) {
      this.context.fieldInfo = getFieldInfoFromDataset(dataTable);
    }
    return this.context;
  }

  protected _runWithOutLLM(): DataQueryCtx {
    // get dataset and fieldInfo after query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let newContext: ExecuteQueryCtx = { ...this.context } as any;
    [patchSQLBeforeQuery, executeDataQuery, restoreDatasetAfterQuery, getFinalQueryResult].forEach(func => {
      newContext = {
        ...newContext,
        ...func(newContext)
      };
    });
    this.setNewContext({ ...this.context, dataTable: newContext.dataTable, fieldInfo: newContext.fieldInfo });
    return this.context;
  }
}

export const registerDataQueryAtom = () => {
  Factory.registerAtom(
    AtomName.DATA_QUERY,
    DataQueryAtom as unknown as BaseAtomConstructor<DataQueryCtx, DataQueryOptions>
  );
};
