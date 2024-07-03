import { omit } from '@visactor/chart-advisor';
import type { Requester } from '../../../../../base/tools/requester';
import { requestGPT } from '../../../../../common/utils/gpt';
import { replaceAll } from '../../../../../common/utils/utils';
import type { VMindInsight } from '../../../types';
import { InsightContext } from '../../../../types';

export const parseInsightTextResponse: any = async (promises: any) => {
  const responseList = await Promise.all(promises).then(response => {
    return response.map(res => {
      const choices = res.choices;
      const insightText = replaceAll(choices[0].message.content, '\n', ' ');
      return insightText;
    });
  });
  return { insightTextList: responseList };
};

export const patchInsightText = (context: any) => {
  const { insights, insightTextList } = context;
  const insightsNew = insights.map((insight: any, index: number) => ({ ...insight, text: insightTextList[index] }));
  return { insights: insightsNew };
};

export const requestInsightLLM: Requester<any> = async (prompt: string, message: string, context: any) => {
  const { llmOptions, insights, generateText } = context;
  if (!generateText) {
    return [];
  }
  const requestFunc = llmOptions.customRequestFunc?.IntelligentInsight ?? requestGPT;
  const insightTextPromises = insights.map((insight: VMindInsight) => {
    const userMessage = JSON.stringify(omit(insight, ['significant']), null, 4);
    return requestFunc(prompt, userMessage, { ...llmOptions, max_tokens: 50 });
  });
  return insightTextPromises;
};
