import type { RuleBasedTaskNodeMeta } from '../../../../base/metaTypes';
import { TaskNodeType } from '../../../../base/taskNode/types';
import type { InsightContext, InsightOutput } from '../../../types';
import type { DataProcessOutput, ExtractInsightOutput, VMindInsight } from '../../types';
import type { Transformer } from '../../../../base/tools/transformer';
import defaultInsightAlgorithms from './algorithms/default';

const executeInsightAlgo: Transformer<InsightContext & DataProcessOutput, ExtractInsightOutput> = (
  context: InsightContext & DataProcessOutput
) => {
  const { insightAlgorithms = defaultInsightAlgorithms, chartType, insightNumberLimit } = context;
  const insights: VMindInsight[] = [];
  const insightAlgorithmContext = { ...context, insights };

  insightAlgorithms.forEach(algoInfo => {
    const { chartType: algoSupportedChartType, algorithmFunction } = algoInfo;
    if (algoSupportedChartType.includes(chartType)) {
      const res = algorithmFunction(insightAlgorithmContext);
      insights.push(...res);
    }
  });

  //sort the insights according to significant
  insights.sort((a, b) => {
    const significant1 = a.significant ?? -1;
    const significant2 = b.significant ?? -1;
    return significant2 - significant1;
  });
  const finalInsights = insightNumberLimit ? insights.slice(0, insightNumberLimit) : insights;

  return { insights: finalInsights };
};

const ExtractInsightTaskNodeMeta: RuleBasedTaskNodeMeta<InsightContext & DataProcessOutput, InsightOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [executeInsightAlgo]
};

export default ExtractInsightTaskNodeMeta;
