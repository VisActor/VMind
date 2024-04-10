import { ILLMTaskNode, LLMBasedTaskNode } from 'src/base/taskNode/llmBasedTaskNode';
import { parseDataQueryResponse, requestGPT } from './utils';
import { GPTDataAggregationPrompt } from './prompt';
import { GetQuerySQLContext, GetQuerySQLOutput } from 'src/applications/dataAggregation/types';

export class GetSQLNode
  extends LLMBasedTaskNode<GetQuerySQLContext, GetQuerySQLOutput>
  implements ILLMTaskNode<GetQuerySQLContext, GetQuerySQLOutput>
{
  constructor() {
    super();
    this.prompt = new GPTDataAggregationPrompt();
    this.parser = parseDataQueryResponse;
  }

  async requestLLM(context: GetQuerySQLContext): Promise<any> {
    const { userInput, fieldInfo, llmOptions } = context;
    const queryDatasetMessage = `User's Command: ${userInput}\nColumn Information: ${JSON.stringify(fieldInfo)}`;

    const requestFunc = llmOptions.customRequestFunc?.dataQuery ?? requestGPT;
    const QueryDatasetPrompt = this.prompt.getPrompt(context);
    const dataProcessRes = await requestFunc(QueryDatasetPrompt, queryDatasetMessage, llmOptions);
    return dataProcessRes;
  }
}
