import { Prompt } from 'src/base/tools/prompt';
import { getQueryDatasetPrompt } from './template';
import { GetQuerySQLContext } from 'src/applications/dataAggregation/types';
import { DataAggregationContext } from 'src/applications/types';

const patchQueryInput = (userInput: string) => {
  return userInput;
};

export class GPTDataAggregationPrompt extends Prompt<GetQuerySQLContext> {
  constructor() {
    super('');
  }
  getSystemPrompt(context: GetQuerySQLContext) {
    const { llmOptions } = context;
    const QueryDatasetPrompt = getQueryDatasetPrompt(llmOptions.showThoughts ?? true);
    return QueryDatasetPrompt;
  }
  getUserPrompt(context: DataAggregationContext): string {
    const { userInput, fieldInfo } = context;
    const patchedInput = patchQueryInput(userInput);

    const queryDatasetMessage = `User's Command: ${patchedInput}\nColumn Information: ${JSON.stringify(fieldInfo)}`;

    return queryDatasetMessage;
  }
}
