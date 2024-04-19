import { dataQueryRequestLLM, parseDataQueryResponse } from './utils';
import { GPTDataAggregationPrompt } from './prompt';
import { GetQuerySQLContext, GetQuerySQLOutput } from 'src/applications/dataAggregation/types';
import { LLMBasedTaskNodeMeta } from 'src/base/metaTypes';
import { TaskNodeType } from 'src/base/taskNode/types';
import { ModelType } from 'src/common/typings';

const GetSQLTaskNodeGPTMeta: LLMBasedTaskNodeMeta<GetQuerySQLContext, GetQuerySQLOutput> = {
  type: TaskNodeType.LLM_BASED,
  modelType: ModelType.GPT,
  parser: parseDataQueryResponse,
  patcher: [(input: GetQuerySQLContext) => input as unknown as GetQuerySQLOutput],
  requester: dataQueryRequestLLM,
  prompt: new GPTDataAggregationPrompt()
};

export default GetSQLTaskNodeGPTMeta;
