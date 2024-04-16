import { Prompt } from 'src/base/tools/prompt';
import { GenerateChartTypeContext } from '../../types';
import { chartRecommendConstraints, chartRecommendKnowledge } from './knowledge';
import { getChartRecommendPrompt } from './template';
import { getStrFromArray } from 'src/common/utils/utils';

export class ChartTypeGenerationPrompt extends Prompt<GenerateChartTypeContext> {
  constructor() {
    super('');
  }
  getPrompt(context: GenerateChartTypeContext) {
    const { llmOptions } = context;
    //@TODO: change the examples according to supported chart list.
    //call skylark to get recommended chart
    const chartRecommendKnowledgeStr = getStrFromArray(chartRecommendKnowledge);
    const chartRecommendConstraintsStr = getStrFromArray(chartRecommendConstraints);
    const chartRecommendPrompt = getChartRecommendPrompt(
      chartRecommendKnowledgeStr,
      chartRecommendConstraintsStr,
      llmOptions.showThoughts ?? true
    );
    return chartRecommendPrompt;
  }
}
