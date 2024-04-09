import { ILLMTaskNode, LLMBasedTaskNode } from 'src/base/taskNode/llmBasedTaskNode';
import { Parser } from 'src/base/tools/parser';
import { Patcher } from 'src/base/tools/patcher';
import { Transformer } from 'src/base/tools/transformer';
import { GetQuerySQLResult } from '../types';
import { parseDataQueryResponse, requestGPT } from './utils';
import { GPTDataAggregationPrompt } from './prompt';
import { DataAggregationContext } from 'src/applications/dataAggregation/types';

export class GetSQLGPTNode
  extends LLMBasedTaskNode<undefined, DataAggregationContext, GetQuerySQLResult>
  implements ILLMTaskNode<DataAggregationContext, GetQuerySQLResult>
{
  constructor() {
    super();
    this.parser = parseDataQueryResponse;
    this.patcher = new Patcher<GetQuerySQLResult, DataAggregationContext>([
      (input: Partial<GetQuerySQLResult>, context: DataAggregationContext) => input as GetQuerySQLResult
    ]);
    this.prompt = new GPTDataAggregationPrompt();
  }

  async requestLLM(context: DataAggregationContext): Promise<any> {
    const { userInput, fieldInfo, llmOptions } = context;
    const queryDatasetMessage = `User's Command: ${userInput}\nColumn Information: ${JSON.stringify(fieldInfo)}`;

    const requestFunc = llmOptions.customRequestFunc?.dataQuery ?? requestGPT;
    const QueryDatasetPrompt = this.prompt.getPrompt(context);
    const dataProcessRes = await requestFunc(QueryDatasetPrompt, queryDatasetMessage, llmOptions);
    return dataProcessRes;
  }
}
