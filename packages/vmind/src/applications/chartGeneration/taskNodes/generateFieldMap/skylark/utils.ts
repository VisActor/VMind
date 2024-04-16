import { Requester } from 'src/base/tools/requester';
import { GenerateFieldMapContext, GenerateFieldMapOutput } from '../types';
import { parseSkylarkResponse, requestSkyLark } from 'src/common/utils/skylark';
import { Parser } from 'src/base/tools/parser';
import { SUPPORTED_CHART_LIST } from 'src/applications/chartGeneration/constants';
import { omit } from 'lodash';

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
