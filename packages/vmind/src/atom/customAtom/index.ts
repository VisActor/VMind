import { AtomName } from '../../types/atom';
import type { CustomPromptOptions } from '../type';
import { BaseAtom } from '../base';
import type { LLMMessage } from '../../types/llm';
import type { ChartQAExtractionCtx } from '../../types';

export class CustomPrompt extends BaseAtom<any, CustomPromptOptions> {
  name = AtomName.CUSTOM_PROMPT;

  isLLMAtom = true;

  constructor(context: ChartQAExtractionCtx, option: CustomPromptOptions) {
    super(context, option);
  }

  getLLMMessages(query?: string): LLMMessage[] {
    const { text } = this.context;
    return [
      {
        role: 'system',
        content: this.options.promptTemplate
      },
      {
        role: 'user',
        content: query || text
      }
    ];
  }

  parseLLMContent(resJson: any): any {
    return {
      ...this.context,
      ...resJson
    };
  }
}
