import { Prompt } from '../../../../../../base/tools/prompt';
import { getInsightTextPrompt } from './template';
import type { GetQuerySQLContext } from '../../../../../../applications/dataAggregation/types';
import type { DataAggregationContext } from '../../../../../../applications/types';

export class GPTInsightTextPrompt extends Prompt<GetQuerySQLContext> {
  constructor() {
    super('');
  }
  getSystemPrompt(context: GetQuerySQLContext) {
    const { llmOptions } = context;
    const InsightTextPrompt = getInsightTextPrompt(llmOptions.insightTextContext);
    return InsightTextPrompt;
  }
  getUserPrompt(context: DataAggregationContext): string {
    return '';
  }
}
