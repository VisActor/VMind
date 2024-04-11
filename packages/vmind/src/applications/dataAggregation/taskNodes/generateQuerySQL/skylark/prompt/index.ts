import { Prompt } from 'src/base/tools/prompt';
import { GetQuerySQLContext } from 'src/applications/dataAggregation/types';
import { getQueryDatasetPrompt } from './template';

export class SkylarkDataAggregationPrompt extends Prompt<GetQuerySQLContext> {
  constructor() {
    super('');
  }
  getPrompt(context: GetQuerySQLContext) {
    const { llmOptions } = context;
    const QueryDatasetPrompt = getQueryDatasetPrompt(llmOptions.showThoughts ?? true);
    return QueryDatasetPrompt;
  }
}
