import { Prompt } from '../../../../../../base/tools/prompt';
import type { GetQuerySQLContext } from '../../../../../../applications/dataAggregation/types';
import { getQueryDatasetPrompt } from './template';
import type { DataAggregationContext } from '../../../../../../applications/types';

const patchDataQueryInput = (userInput: string) =>
  userInput + ' 使用` `包裹sql中的所有列名。使用支持的聚合函数将所有的度量列聚合。';

export class SkylarkDataAggregationPrompt extends Prompt<GetQuerySQLContext> {
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
    const patchedInput = patchDataQueryInput(userInput);

    const queryDatasetMessage = `User's Command: ${patchedInput}\nColumn Information: ${JSON.stringify(fieldInfo)}`;
    return queryDatasetMessage;
  }
}
