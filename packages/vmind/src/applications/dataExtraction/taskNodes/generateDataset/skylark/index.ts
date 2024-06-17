import type { DataExtractionContext, DataExtractionOutput } from '../../../../types';
import type { LLMBasedTaskNodeMeta } from '../../../../../base/metaTypes';
import { TaskNodeType } from '../../../../../base/taskNode/types';
import { ModelType } from '../../../../../common/typings';
import { dataExtractionRequestLLM, parseSkylarkResponseAsJSON } from './utils';
import { SkylarkDataExtractionPrompt } from './prompt';

const GetSQLTaskNodeSkylarkMeta: LLMBasedTaskNodeMeta<DataExtractionContext, DataExtractionOutput> = {
  type: TaskNodeType.LLM_BASED,
  modelType: ModelType.SKYLARK,
  parser: parseSkylarkResponseAsJSON,
  patcher: [(input: DataExtractionContext) => input as unknown as DataExtractionOutput],
  requester: dataExtractionRequestLLM,
  prompt: new SkylarkDataExtractionPrompt()
};

export default GetSQLTaskNodeSkylarkMeta;
