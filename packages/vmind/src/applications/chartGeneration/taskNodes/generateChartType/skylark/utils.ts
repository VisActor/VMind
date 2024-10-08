import type { Requester } from '../../../../../base/tools/requester';
import type { GenerateChartTypeContext, GenerateChartTypeOutput } from '../types';
import { parseSkylarkResponse, requestSkyLark } from '../../../../../common/utils/skylark';
import type { Parser } from '../../../../../base/tools/parser';

export const generateChartTypeRequester: Requester<GenerateChartTypeContext> = async (
  prompt: string,
  userMessage: string,
  context: GenerateChartTypeContext
) => {
  const { llmOptions } = context;
  const requestFunc = llmOptions.customRequestFunc?.chartAdvisor ?? requestSkyLark;
  const chartRecommendPrompt = prompt;
  const chartRecommendRes = await requestFunc(chartRecommendPrompt, userMessage, llmOptions);
  return chartRecommendRes;
};

export const parseChartTypeResponse: Parser<GenerateChartTypeContext, Partial<GenerateChartTypeOutput>> = (
  chartRecommendRes: any
) => {
  const chartRecommendResJSON = parseSkylarkResponse(chartRecommendRes);
  if (chartRecommendResJSON.error) {
    throw Error(chartRecommendResJSON.message);
  }

  const { charttype: chartType, subcharttype: subChartType } = chartRecommendResJSON;

  return { chartType: chartType, subChartType: subChartType, chartTypeTokenUsage: chartRecommendResJSON.usage };
};
