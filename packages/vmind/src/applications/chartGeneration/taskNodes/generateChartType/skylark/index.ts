import type { LLMBasedTaskNodeMeta } from 'src/base/metaTypes';
import { TaskNodeType } from 'src/base/taskNode/types';
import { ModelType } from 'src/common/typings';

import type { GenerateChartTypeContext, GenerateChartTypeOutput } from '../types';
import { generateChartTypeRequester, parseChartTypeResponse } from './utils';
import { ChartTypeGenerationPrompt } from './prompt';
import { patchChartType } from '../../utils';

const GenerateChartTypeTaskNodeMeta: LLMBasedTaskNodeMeta<GenerateChartTypeContext, GenerateChartTypeOutput> = {
  type: TaskNodeType.LLM_BASED,
  modelType: ModelType.SKYLARK,
  parser: parseChartTypeResponse,
  patcher: [patchChartType],
  requester: generateChartTypeRequester,
  prompt: new ChartTypeGenerationPrompt()
};

export default GenerateChartTypeTaskNodeMeta;
