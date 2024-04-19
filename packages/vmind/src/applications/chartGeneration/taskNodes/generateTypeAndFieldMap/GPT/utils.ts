import { SUPPORTED_CHART_LIST } from 'src/applications/chartGeneration/constants';
import type { Cell } from 'src/applications/chartGeneration/types';
import type { Parser } from 'src/base/tools/parser';
import type { Requester } from 'src/base/tools/requester';
import { parseGPTResponse, requestGPT } from 'src/common/utils/gpt';
import type { ChartType } from 'src/common/typings';
import type { GenerateChartAndFieldMapContext, GenerateChartAndFieldMapOutput } from '../types';

type GPTChartAdvisorResult = {
  CHART_TYPE: ChartType;
  DOUBLE_CHECK: string;
  FIELD_MAP: Cell;
  THOUGHT: string;
  VIDEO_DURATION?: number;
  COLOR_PALETTE?: string[];
  error?: boolean;
};

export const parseChartGenerationResponse: Parser<
  GenerateChartAndFieldMapContext,
  Partial<GenerateChartAndFieldMapOutput>
> = (advisorRes: any) => {
  const advisorResJson: GPTChartAdvisorResult = parseGPTResponse(advisorRes) as unknown as GPTChartAdvisorResult;

  if (advisorResJson.error) {
    throw Error((advisorResJson as any).message);
  }

  const { CHART_TYPE, FIELD_MAP } = advisorResJson;

  return { chartType: CHART_TYPE as ChartType, cell: FIELD_MAP, usage: advisorRes.usage };
};

export const chartGenerationRequestLLM: Requester<GenerateChartAndFieldMapContext> = async (
  prompt: string,
  chartAdvisorMessage: string,
  context: GenerateChartAndFieldMapContext
) => {
  const { llmOptions } = context;
  //call GPT
  const requestFunc = llmOptions.customRequestFunc?.chartAdvisor ?? requestGPT;

  const advisorRes = await requestFunc(prompt, chartAdvisorMessage, llmOptions);

  return advisorRes;
};
