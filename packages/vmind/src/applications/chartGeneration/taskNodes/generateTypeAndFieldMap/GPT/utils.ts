import type { Cell } from '../../../../../applications/chartGeneration/types';
import type { Parser } from '../../../../../base/tools/parser';
import type { Requester } from '../../../../../base/tools/requester';
import { parseGPTResponse, requestGPT } from '../../../../../common/utils/gpt';
import type { ChartType } from '../../../../../common/typings';
import { COMBINATION_CHART_LIST } from '../../../constants';
import type { GenerateChartAndFieldMapContext, GenerateChartAndFieldMapOutput } from '../types';
import type { BasicChartType } from '../../../../../common/typings';

type GPTChartAdvisorResult = {
  CHART_TYPE: ChartType;
  SUB_CHART_TYPE: BasicChartType[];
  DOUBLE_CHECK: string;
  FIELD_MAP: Cell[];
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

  const { CHART_TYPE, FIELD_MAP, SUB_CHART_TYPE } = advisorResJson;
  if (
    COMBINATION_CHART_LIST.every(chartType => {
      return chartType.toUpperCase() !== CHART_TYPE.toUpperCase();
    })
  ) {
    return { chartType: CHART_TYPE as ChartType, cell: FIELD_MAP[0], usage: advisorRes.usage };
  }
  return {
    chartType: CHART_TYPE as ChartType,
    cells: FIELD_MAP,
    subChartType: SUB_CHART_TYPE,
    usage: advisorRes.usage
  };
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
