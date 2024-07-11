import { Prompt } from '../../../../../../base/tools/prompt';
import { getInsightTextPrompt } from './template';
import type { InsightContext } from '../../../../../../applications/types';

export class SkylarkInsightTextPrompt extends Prompt<InsightContext> {
  constructor() {
    super('');
  }
  getSystemPrompt(context: InsightContext) {
    const { llmOptions, language } = context;
    const InsightTextPrompt = getInsightTextPrompt(llmOptions.insightTextContext, language);
    return InsightTextPrompt;
  }
  getUserPrompt(context: InsightContext): string {
    return '';
  }
}
