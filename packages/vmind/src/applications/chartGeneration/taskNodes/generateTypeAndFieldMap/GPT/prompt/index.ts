import { Prompt } from 'src/base/tools/prompt';
import { GenerateChartAndFieldMapContext } from 'src/applications/chartGeneration/types';
import { ChartAdvisorPromptEnglish } from './template';

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
