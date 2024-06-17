import type { LLMBasedTaskNodeMeta } from '../../../../../base/metaTypes';
import { TaskNodeType } from '../../../../../base/taskNode/types';
import { ModelType } from '../../../../../common/typings';
import type { InsightContext } from '../../../../types';
import type { GenerateTextOutput } from '../../../types';
import { SkylarkInsightTextPrompt } from './prompt';
import { parseInsightTextResponse, patchInsightText, requestInsightLLM } from './utils';

const GenerateInsightTextSkylarkMeta: LLMBasedTaskNodeMeta<InsightContext, GenerateTextOutput> = {
  type: TaskNodeType.LLM_BASED,
  modelType: ModelType.SKYLARK,
  parser: parseInsightTextResponse,
  patcher: [patchInsightText],
  requester: requestInsightLLM,
  prompt: new SkylarkInsightTextPrompt()
};

export default GenerateInsightTextSkylarkMeta;
