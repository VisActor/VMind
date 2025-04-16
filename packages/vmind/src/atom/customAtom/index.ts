import { AtomName } from '../../types/atom';
import type { CustomPromptOptions } from '../../types';
import { BaseAtom } from '../base';
import type { LLMMessage } from '../../types/llm';
import { Factory } from '../../core/factory';
import type { BaseAtomConstructor } from '../../types';

export class CustomPrompt extends BaseAtom<any, CustomPromptOptions> {
  name = AtomName.CUSTOM_PROMPT;

  isLLMAtom = true;

  constructor(context: any, option: CustomPromptOptions) {
    super(context, option);
  }

  getLLMMessages(query?: string): LLMMessage[] {
    const { text } = this.context;
    return [
      {
        role: 'system',
        content: this.options.promptTemplate
      },
      ...(this.responses || []),
      {
        role: 'user',
        content: query || text
      }
    ];
  }

  parseLLMContent(resJson: any, toolJson?: any): any {
    return {
      ...this.context,
      ...resJson,
      toolRes: toolJson
    };
  }
}

export const registerCustomPromptAtom = () => {
  Factory.registerAtom(
    AtomName.CUSTOM_PROMPT,
    CustomPrompt as unknown as BaseAtomConstructor<any, CustomPromptOptions>
  );
};
