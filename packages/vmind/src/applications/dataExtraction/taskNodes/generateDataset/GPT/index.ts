import { dataExtractionRequestLLM, parseDataExtractionResponse } from './utils';
import { GPTDataExtractionPrompt } from './prompt';
import type { DataExtractionContext, DataExtractionOutput } from '../../../../types';
import type { LLMBasedTaskNodeMeta } from '../../../../../base/metaTypes';
import { TaskNodeType } from '../../../../../base/taskNode/types';
import { ModelType } from '../../../../../common/typings';

const GetDatasetTaskNodeGPTMeta: LLMBasedTaskNodeMeta<DataExtractionContext, DataExtractionOutput> = {
  type: TaskNodeType.LLM_BASED,
  modelType: ModelType.GPT,
  parser: parseDataExtractionResponse,
  patcher: [(input: DataExtractionContext) => input as unknown as DataExtractionOutput],
  requester: dataExtractionRequestLLM,
  prompt: new GPTDataExtractionPrompt()
};

export default GetDatasetTaskNodeGPTMeta;
