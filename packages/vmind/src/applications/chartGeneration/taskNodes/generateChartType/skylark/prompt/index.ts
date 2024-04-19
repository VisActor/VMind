import { Prompt } from 'src/base/tools/prompt';
import type { GenerateChartTypeContext } from '../../types';
import { getChartRecommendPrompt } from './template';
import { getStrFromArray } from 'src/common/utils/utils';
import { chartKnowledgeBase } from './knowledge';

export class ChartTypeGenerationPrompt extends Prompt<GenerateChartTypeContext> {
  constructor() {
    super('');
  }
  getSystemPrompt(context: GenerateChartTypeContext): string {
    const { llmOptions, chartTypeList } = context;

    const chartKnowledge = chartTypeList.reduce((res, chartType) => {
      const { knowledge } = chartKnowledgeBase[chartType];
      return [...res, ...(knowledge ?? [])];
    }, []);
    const chartRecommendKnowledgeStr = getStrFromArray(chartKnowledge);

    const chartConstraints = chartTypeList.reduce((res, chartType) => {
      const { constraints } = chartKnowledgeBase[chartType];
      return [...res, ...(constraints ?? [])];
    }, []);
    const chartRecommendConstraintsStr = getStrFromArray(chartConstraints);

    const chartRecommendPrompt = getChartRecommendPrompt(
      chartTypeList,
      chartRecommendKnowledgeStr,
      chartRecommendConstraintsStr,
      llmOptions.showThoughts ?? true
    );
    return chartRecommendPrompt;
  }

  getUserPrompt(context: GenerateChartTypeContext): string {
    const { userInput, fieldInfo } = context;
    const userMessage = `User's Command: ${userInput}\nData field description: ${JSON.stringify(fieldInfo)}`;
    return userMessage;
  }
}
