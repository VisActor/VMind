import type { Requester } from '../../../../../base/tools/requester';
import type { GenerateFieldMapContext, GenerateFieldMapOutput } from '../types';
import { parseSkylarkResponse, requestSkyLark } from '../../../../../common/utils/skylark';
import type { Parser } from '../../../../../base/tools/parser';
import { omit } from '@visactor/chart-advisor';

export const generateFieldMapRequester: Requester<GenerateFieldMapContext> = async (
  prompt: string,
  userMessage: string,
  context: GenerateFieldMapContext
) => {
  const { llmOptions } = context;
  const requestFunc = llmOptions.customRequestFunc?.chartAdvisor ?? requestSkyLark;
  const chartRecommendPrompt = prompt;
  const chartRecommendRes = await requestFunc(chartRecommendPrompt, userMessage, llmOptions);
  return chartRecommendRes;
};

export const parseFieldMapResponse: Parser<GenerateFieldMapContext, Partial<GenerateFieldMapOutput>> = (
  fieldMapRes: any
) => {
  const fieldMapResJson = parseSkylarkResponse(fieldMapRes);
  if (fieldMapResJson.error) {
    throw Error(fieldMapResJson.message);
  }

  return {
    cell: omit(fieldMapResJson, ['thoughts', 'usage']),
    fieldMapTokenUsage: fieldMapRes.usage
  };
};
