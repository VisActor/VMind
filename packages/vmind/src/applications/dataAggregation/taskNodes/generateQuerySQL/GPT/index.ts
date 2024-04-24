import { dataQueryRequestLLM, parseDataQueryResponse } from './utils';
import { GPTDataAggregationPrompt } from './prompt';
import type { GetQuerySQLContext, GetQuerySQLOutput } from '../../../../../applications/dataAggregation/types';
import type { LLMBasedTaskNodeMeta } from '../../../../../base/metaTypes';
import { TaskNodeType } from '../../../../../base/taskNode/types';
import { ModelType } from '../../../../../common/typings';

const GetSQLTaskNodeGPTMeta: LLMBasedTaskNodeMeta<GetQuerySQLContext, GetQuerySQLOutput> = {
  type: TaskNodeType.LLM_BASED,
  modelType: ModelType.GPT,
  parser: parseDataQueryResponse,
  patcher: [(input: GetQuerySQLContext) => input as unknown as GetQuerySQLOutput],
  requester: dataQueryRequestLLM,
  prompt: new GPTDataAggregationPrompt()
};

export default GetSQLTaskNodeGPTMeta;
