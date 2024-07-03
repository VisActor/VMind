import { Prompt } from '../../../../../../base/tools/prompt';
import { getInsightTextPrompt } from './template';
import type { DataAggregationContext, InsightContext } from '../../../../../../applications/types';

export class GPTInsightTextPrompt extends Prompt<InsightContext> {
  constructor() {
    super('');
  }
  getSystemPrompt(context: InsightContext) {
    const { llmOptions, language } = context;
    const InsightTextPrompt = getInsightTextPrompt(llmOptions.insightTextContext, language);
    return InsightTextPrompt;
  }
  getUserPrompt(context: DataAggregationContext): string {
    return '';
  }
}
