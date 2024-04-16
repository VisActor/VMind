import { Requester } from 'src/base/tools/requester';
import { GenerateChartTypeContext, GenerateChartTypeOutput } from '../types';
import { parseSkylarkResponse, requestSkyLark } from 'src/common/utils/skylark';
import { Parser } from 'src/base/tools/parser';
import { SUPPORTED_CHART_LIST } from 'src/applications/chartGeneration/constants';

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
  if (!SUPPORTED_CHART_LIST.includes(chartRecommendResJSON['charttype'])) {
    throw Error('Unsupported Chart Type. Please Change User Input');
  }
  const { charttype: chartType } = chartRecommendResJSON;

  return { chartType: chartType.toUpperCase(), chartTypeTokenUsage: chartRecommendResJSON.usage };
};
