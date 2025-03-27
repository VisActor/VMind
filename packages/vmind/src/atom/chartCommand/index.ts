/**
 * 根据数据等，生成图表指令
 */
import { merge } from '@visactor/vutils';
import type { ChartCommandCtx, LLMMessage } from '../../types';
import { AtomName } from '../../types';
import type { BaseOptions, ChartCommandOptions } from '../type';
import { BaseAtom } from '../base';
import { getLanguageOfText } from '../../utils/text';
import { getChartCommandPrompt } from './prompt';
import { getRoleByFieldType } from '../../utils/field';
import { isValidData } from '../../utils/common';

export class ChartCommandAtom extends BaseAtom<ChartCommandCtx, ChartCommandOptions> {
  name = AtomName.CHART_COMMAND;

  isLLMAtom = true;

  constructor(context: ChartCommandCtx, option: BaseOptions) {
    super(context, option);
  }

  buildDefaultOptions(): ChartCommandOptions {
    return {
      ...super.buildDefaultOptions(),
      useDataTable: false
    };
  }

  buildDefaultContext(context: ChartCommandCtx): ChartCommandCtx {
    return merge(
      {},
      {
        command: ''
      },
      context
    );
  }

  shouldRunByContextUpdate(context: ChartCommandCtx): boolean {
    return context.text !== this.context.text || context.fieldInfo !== this.context.fieldInfo;
  }

  protected getLLMMessages(query?: string): LLMMessage[] {
    const { fieldInfo, text, dataTable, summary } = this.context;
    const language = this.options?.language ?? getLanguageOfText(text || summary);
    const addtionContent = this.getHistoryLLMMessages(query);
    return [
      {
        role: 'system',
        content: getChartCommandPrompt(language)
      },
      {
        role: 'user',
        content: JSON.stringify({
          userInput: [
            {
              text,
              summary,
              fieldInfo: fieldInfo.map(info => ({
                fieldName: info.fieldName,
                type: info.role || getRoleByFieldType(info.type),
                dataLength: dataTable?.filter(v => isValidData(v[info.fieldName]))?.length || undefined
              })),
              dataTable: this.options?.useDataTable ? JSON.stringify(dataTable) : undefined
            }
          ]
        })
      },
      ...addtionContent
    ];
  }

  protected parseLLMContent(resJson: any): ChartCommandCtx {
    const { commands = [] } = resJson;
    const command = commands?.[0] || '';
    if (command === false || command === 'false' || !command) {
      console.error("Can't generate chart command in this case");
      return {
        ...this.context,
        command: '',
        error: `Can't generate chart command in this case`
      };
    }
    return {
      ...this.context,
      command
    };
  }
}
