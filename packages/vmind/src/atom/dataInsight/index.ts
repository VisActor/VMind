import type { DataInsightCtx } from '../../types/atom';
import { AtomName } from '../../types/atom';
import type { DataInsightOptions } from '../type';
import { BaseAtom } from '../base';
import { merge } from '@visactor/vutils';
import { extractDataFromContext } from './dataProcess';
import { AlgorithmType } from './type';
import { getInsights } from './algorithms';
import type { LLMMessage } from '../../types/llm';
import { getPolishPrompt } from './prompt';
import { addPlainText } from './algorithms/template';

export class DataInsightAtom extends BaseAtom<DataInsightCtx, DataInsightOptions> {
  name = AtomName.DATA_INSIGHT;

  isLLMAtom: boolean = true;

  constructor(context: DataInsightCtx, option: DataInsightOptions) {
    super(context, option);
  }

  buildDefaultContext(context: DataInsightCtx): DataInsightCtx {
    return merge(
      {},
      {
        spec: {},
        insights: []
      },
      context
    );
  }

  buildDefaultOptions(): DataInsightOptions {
    return {
      algorithms: [
        AlgorithmType.OverallTrending,
        AlgorithmType.AbnormalTrend,
        AlgorithmType.PearsonCorrelation,
        AlgorithmType.SpearmanCorrelation,
        AlgorithmType.StatisticsAbnormal,
        AlgorithmType.LOFOutlier,
        AlgorithmType.DbscanOutlier,
        AlgorithmType.MajorityValue,
        AlgorithmType.PageHinkley,
        // AlgorithmType.DifferenceOutlier,
        AlgorithmType.TurningPoint,
        AlgorithmType.StatisticsBase,
        AlgorithmType.Volatility
      ],
      isLimitedbyChartType: true,
      language: 'chinese',
      usePolish: true
    };
  }

  shouldRunByContextUpdate(context: DataInsightCtx): boolean {
    return true;
  }

  protected getLLMMessages(query?: string): LLMMessage[] {
    const { insights } = this.context;
    const language = this.options?.language;
    const addtionContent = this.getHistoryLLMMessages(query);
    return [
      {
        role: 'system',
        content: getPolishPrompt(language)
      },
      {
        role: 'user',
        content: JSON.stringify({
          insights: insights.map(insight => ({
            type: insight.type,
            content: insight.textContent?.content,
            variables: insight.textContent?.variables
              ? Object.keys(insight.textContent.variables).reduce<Record<string, any>>((acc, key) => {
                  return {
                    ...acc,
                    [key]: {
                      ...insight.textContent?.variables[key],
                      value: null,
                      formatValue: null
                    }
                  };
                }, {})
              : {}
          }))
        })
      },
      ...addtionContent
    ];
  }

  protected parseLLMContent(resJson: any): DataInsightCtx {
    const { results } = resJson;
    if (!results) {
      console.error('Insights polish error in LLM');
      return {
        ...this.context,
        error: 'Insights polish error in LLM'
      };
    }
    const newInsights = this.context.insights.map((insight, index) => ({
      ...insight,
      textContent: addPlainText({
        content: results[index] || insight.textContent?.content,
        variables: insight.textContent?.variables
      })
    }));
    return {
      ...this.context,
      insights: newInsights
    };
  }

  protected runBeforeLLM(): DataInsightCtx {
    this.isLLMAtom = this.options?.usePolish !== false;
    const dataInfo = extractDataFromContext(this.context);
    const insights = getInsights(
      {
        ...dataInfo,
        spec: this.context.spec
      },
      this.options
    );
    const newContext = {
      ...this.context,
      chartType: dataInfo.chartType,
      fieldInfo: dataInfo.fieldInfo,
      insights
    };
    this.updateContext(newContext);
    if (insights.length === 0) {
      this.isLLMAtom = false;
    }
    return this.context;
  }
}
