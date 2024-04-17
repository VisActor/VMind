import type { Requester } from 'src/base/tools/requester';
import type { GenerateChartTypeContext, GenerateChartTypeOutput } from '../types';
import { parseSkylarkResponse, requestSkyLark } from 'src/common/utils/skylark';
import type { Parser } from 'src/base/tools/parser';

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

  const { charttype: chartType } = chartRecommendResJSON;

  return { chartType: chartType, chartTypeTokenUsage: chartRecommendResJSON.usage };
};
