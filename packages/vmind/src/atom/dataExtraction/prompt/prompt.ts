import type { LLMMessage } from '../../../types';
import { isDoubaoModel } from '../../../utils/llm';
import { getCapCutPrompt, getCapCutPromptInGpt } from './capcutPrompt';
import { getBasePrompt as doubaoBasePrompt } from './doubaoPrompt';
import { getBasePrompt as gptBasePrompt } from './gptPrompt';
export { getFieldInfoPrompt } from './gptPrompt';

export const getBasePrompt = (
  model: string,
  language: 'chinese' | 'english',
  isCapcut = false,
  showThoughs: boolean = false
) => {
  if (isCapcut) {
    return isDoubaoModel(model) ? getCapCutPrompt(language) : getCapCutPromptInGpt(language);
  }
  const func = isDoubaoModel(model) ? doubaoBasePrompt : gptBasePrompt;
  return func(language, showThoughs);
};

export const getUserQuery = (model: string, language: 'chinese' | 'english', isCapcut = false): LLMMessage[] => {
  if (isCapcut && !isDoubaoModel(model)) {
    return [
      {
        role: 'user',
        content: language === 'chinese' ? '提取所有数据' : 'Extract all data'
      }
    ];
  }
  return [];
};
