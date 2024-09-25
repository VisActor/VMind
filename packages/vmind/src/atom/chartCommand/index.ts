import { merge } from '@visactor/vutils';
import type { ChartCommandCtx, LLMMessage } from '../../types';
import { AtomName } from '../../types';
import type { BaseOptions } from '../type';
import { BaseAtom } from '../base';
import { getLanguageOfText } from '../../utils/text';
import { getChartCommandPrompt } from './prompt';
import { getRoleByFieldType } from '../../utils/field';
import { isValidData } from '../../utils/common';

export class ChartCommandAtom extends BaseAtom<ChartCommandCtx, BaseOptions> {
  name = AtomName.CHART_COMMAND;

  isLLMAtom = true;

  constructor(context: ChartCommandCtx, option: BaseOptions) {
    super(context, option);
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
    const { fieldInfo, text, dataTable } = this.context;
    const language = getLanguageOfText(text);
    return [
      {
        role: 'system',
        content: getChartCommandPrompt(language)
      },
      {
        role: 'user',
        content: JSON.stringify({
          text,
          fieldInfo: fieldInfo.map(info => ({
            fieldName: info.fieldName,
            fieldType: info.role || getRoleByFieldType(info.fieldType),
            dataLength: dataTable?.filter(v => isValidData(v[info.fieldName]))?.length || undefined
          }))
        })
      }
    ];
  }

  protected parseLLMContent(resJson: any): ChartCommandCtx {
    const { command } = resJson;

    return {
      ...this.context,
      command
    };
  }
}
