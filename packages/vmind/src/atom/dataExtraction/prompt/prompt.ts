import type { LLMMessage } from '../../../types';
import { isDoubaoModel } from '../../../utils/llm';
import { getCapCutPrompt, getCapCutPromptInGpt } from './capcutPrompt';
import { getBasePrompt as doubaoBasePrompt } from './doubaoPrompt';
import { getBasePrompt as gptBasePrompt } from './gptPrompt';
export { getFieldInfoPrompt } from './gptPrompt';

export const getBasePrompt = (
  model: string,
  language: 'chinese' | 'english',
  isMultiple = false,
  showThoughs: boolean = false
) => {
  if (isMultiple) {
    return isDoubaoModel(model) ? getCapCutPrompt(language) : getCapCutPromptInGpt(language);
  }
  const func = isDoubaoModel(model) ? doubaoBasePrompt : gptBasePrompt;
  return func(language, showThoughs);
};

export const getUserQuery = (model: string, language: 'chinese' | 'english', isMultiple = false): LLMMessage[] => {
  if (isMultiple && !isDoubaoModel(model)) {
    return [
      {
        role: 'user',
        content: 'Extract all data'
      }
    ];
  }
  return [];
};
