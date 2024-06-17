import type { LLMBasedTaskNodeMeta } from '../../../../../base/metaTypes';
import { TaskNodeType } from '../../../../../base/taskNode/types';
import { ModelType } from '../../../../../common/typings';
import type { InsightContext } from '../../../../types';
import type { GenerateTextOutput } from '../../../types';
import { GPTInsightTextPrompt } from './prompt';
import { parseInsightTextResponse, patchInsightText, requestInsightLLM } from './utils';

const GenerateInsightTextGPTMeta: LLMBasedTaskNodeMeta<InsightContext, GenerateTextOutput> = {
  type: TaskNodeType.LLM_BASED,
  modelType: ModelType.GPT,
  parser: parseInsightTextResponse,
  patcher: [patchInsightText],
  requester: requestInsightLLM,
  prompt: new GPTInsightTextPrompt()
};

export default GenerateInsightTextGPTMeta;
