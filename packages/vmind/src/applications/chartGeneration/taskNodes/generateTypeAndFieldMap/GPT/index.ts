import type { GenerateChartAndFieldMapContext, GenerateChartAndFieldMapOutput } from '../types';
import type { LLMBasedTaskNodeMeta } from '../../../../../base/metaTypes';
import { TaskNodeType } from '../../../../../base/taskNode/types';
import { ModelType } from '../../../../../common/typings';
import { chartGenerationRequestLLM, parseChartGenerationResponse } from './utils';
import { GPTChartGenerationPrompt } from './prompt';
import {
  patchAxisField,
  patchBoxPlot,
  patchCartesianXField,
  patchColorField,
  patchDualAxis,
  patchDynamicBarChart,
  patchLabelField,
  patchPieChart,
  patchWordCloud,
  patchYField
} from './patcher';
import { addChartSource, patchChartType } from '../../utils';

const ChartGenerationTaskNodeGPTMeta: LLMBasedTaskNodeMeta<
  GenerateChartAndFieldMapContext,
  GenerateChartAndFieldMapOutput
> = {
  type: TaskNodeType.LLM_BASED,
  modelType: ModelType.GPT,
  parser: parseChartGenerationResponse,
  // At some point, due to the unclear intention of the user's input, fields may lack fields in Cell returned by GPT.
  // At this time, you need to make up according to the rules
  patcher: [
    patchChartType,
    addChartSource,
    patchAxisField,
    patchColorField,
    patchLabelField,
    patchYField,
    patchBoxPlot,
    patchDualAxis,
    patchPieChart,
    patchWordCloud,
    patchDynamicBarChart,
    patchCartesianXField
  ],
  requester: chartGenerationRequestLLM,
  prompt: new GPTChartGenerationPrompt()
};

export default ChartGenerationTaskNodeGPTMeta;
