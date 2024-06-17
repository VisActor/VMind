import type { GetQuerySQLContext, GetQuerySQLOutput } from '../../../../../applications/dataAggregation/types';
import type { LLMBasedTaskNodeMeta } from '../../../../../base/metaTypes';
import { TaskNodeType } from '../../../../../base/taskNode/types';
import { ModelType } from '../../../../../common/typings';
import { dataQueryRequestLLM, parseSkylarkResponseAsJSON } from './utils';
import { SkylarkDataAggregationPrompt } from './prompt';

const GetSQLTaskNodeSkylarkMeta: LLMBasedTaskNodeMeta<GetQuerySQLContext, GetQuerySQLOutput> = {
  type: TaskNodeType.LLM_BASED,
  modelType: ModelType.SKYLARK,
  parser: parseSkylarkResponseAsJSON,
  patcher: [(input: GetQuerySQLContext) => input as unknown as GetQuerySQLOutput],
  requester: dataQueryRequestLLM,
  prompt: new SkylarkDataAggregationPrompt()
};

export default GetSQLTaskNodeSkylarkMeta;
