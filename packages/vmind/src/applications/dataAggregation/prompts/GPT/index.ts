import { Prompt } from 'src/base/tools/prompt';
import { getQueryDatasetPrompt } from './template';
import { DataAggregationContext } from '../../types';

export class GPTDataAggregationPrompt extends Prompt<DataAggregationContext> {
  getPrompt(context: DataAggregationContext) {
    const { llmOptions } = context;
    const QueryDatasetPrompt = getQueryDatasetPrompt(llmOptions.showThoughts ?? true);
    return QueryDatasetPrompt;
  }
}
