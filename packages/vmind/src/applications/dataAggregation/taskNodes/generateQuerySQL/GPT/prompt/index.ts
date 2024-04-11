import { Prompt } from 'src/base/tools/prompt';
import { getQueryDatasetPrompt } from './template';
import { GetQuerySQLContext } from 'src/applications/dataAggregation/types';

export class GPTDataAggregationPrompt extends Prompt<GetQuerySQLContext> {
  constructor() {
    super('');
  }
  getPrompt(context: GetQuerySQLContext) {
    const { llmOptions } = context;
    const QueryDatasetPrompt = getQueryDatasetPrompt(llmOptions.showThoughts ?? true);
    return QueryDatasetPrompt;
  }
}
