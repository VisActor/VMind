import { Prompt } from 'src/base/tools/prompt';
import { ChartAdvisorPromptEnglish } from './template';
import { GenerateChartAndFieldMapContext } from '../../types';

export class GPTChartGenerationPrompt extends Prompt<GenerateChartAndFieldMapContext> {
  constructor() {
    super('');
  }
  getPrompt(context: GenerateChartAndFieldMapContext) {
    const { llmOptions } = context;
    //@TODO: change the examples according to supported chart list.
    const QueryDatasetPrompt = ChartAdvisorPromptEnglish(llmOptions.showThoughts ?? true);
    return QueryDatasetPrompt;
  }
}
