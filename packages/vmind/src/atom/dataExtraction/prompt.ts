import { isDoubaoModel } from '../../utils/llm';
import { getBasePrompt as doubaoBasePrompt } from './doubaoPrompt';
import { getBasePrompt as gptBasePrompt } from './gptPrompt';
export { getFieldInfoPrompt } from './gptPrompt';

export const getBasePrompt = (model: string, language: 'chinese' | 'english', showThoughs: boolean = true) => {
  const func = isDoubaoModel(model) ? doubaoBasePrompt : gptBasePrompt;
  return func(language, showThoughs);
};
