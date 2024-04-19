import type { LLMBasedTaskNodeMeta } from 'src/base/metaTypes';
import { TaskNodeType } from 'src/base/taskNode/types';
import { ModelType } from 'src/common/typings';
import type { GenerateFieldMapContext, GenerateFieldMapOutput } from '../types';
import { FieldMapGenerationPrompt } from './prompt';
import { generateFieldMapRequester, parseFieldMapResponse } from './utils';
import { patchPipelines } from './patcher';

const GenerateFieldMapTaskNodeMeta: LLMBasedTaskNodeMeta<GenerateFieldMapContext, GenerateFieldMapOutput> = {
  type: TaskNodeType.LLM_BASED,
  modelType: ModelType.SKYLARK,
  parser: parseFieldMapResponse,
  patcher: patchPipelines,
  requester: generateFieldMapRequester,
  prompt: new FieldMapGenerationPrompt()
};

export default GenerateFieldMapTaskNodeMeta;
