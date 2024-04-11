import { GetQuerySQLContext, GetQuerySQLOutput } from 'src/applications/dataAggregation/types';
import { LLMBasedTaskNodeMeta } from 'src/base/metaTypes';
import { TaskNodeType } from 'src/base/taskNode/types';
import { ModelType } from 'src/typings';
import { dataQueryRequestLLM, parseSkylarkResponseAsJSON } from './utils';
import { SkylarkDataAggregationPrompt } from './prompt';

const GetSQLTaskNodeSkylarkMeta: LLMBasedTaskNodeMeta<GetQuerySQLContext, GetQuerySQLOutput> = {
  type: TaskNodeType.LLM_BASED,
  modelType: ModelType.SKYLARK,
  parser: parseSkylarkResponseAsJSON,
  patcher: [(input: Partial<GetQuerySQLOutput>, context: GetQuerySQLContext) => input as GetQuerySQLOutput],
  requester: dataQueryRequestLLM,
  prompt: new SkylarkDataAggregationPrompt()
};

export default GetSQLTaskNodeSkylarkMeta;
