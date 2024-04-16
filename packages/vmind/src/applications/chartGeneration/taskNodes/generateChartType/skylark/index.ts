import { LLMBasedTaskNodeMeta } from 'src/base/metaTypes';
import { TaskNodeType } from 'src/base/taskNode/types';
import { ModelType } from 'src/typings';

import { GenerateChartTypeContext, GenerateChartTypeOutput } from '../types';
import { generateChartTypeRequester, parseChartTypeResponse } from './utils';
import { ChartTypeGenerationPrompt } from './prompt';

const GenerateChartTypeTaskNodeMeta: LLMBasedTaskNodeMeta<GenerateChartTypeContext, GenerateChartTypeOutput> = {
  type: TaskNodeType.LLM_BASED,
  modelType: ModelType.SKYLARK,
  parser: parseChartTypeResponse,
  patcher: [],
  requester: generateChartTypeRequester,
  prompt: new ChartTypeGenerationPrompt()
};

export default GenerateChartTypeTaskNodeMeta;
