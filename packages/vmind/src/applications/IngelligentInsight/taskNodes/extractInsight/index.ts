import type { RuleBasedTaskNodeMeta } from '../../../../base/metaTypes';
import { TaskNodeType } from '../../../../base/taskNode/types';
import type { InsightContext, InsightOutput } from '../../../types';
import type { DataProcessOutput, ExtractInsightOutput, VMindInsight } from '../../types';
import type { Transformer } from '../../../../base/tools/transformer';
import { pick } from '@visactor/vutils';
import defaultInsightAlgorithms from './algorithms/default';

const executeInsightAlgo: Transformer<InsightContext & DataProcessOutput, ExtractInsightOutput> = (
  context: InsightContext & DataProcessOutput
) => {
  const { insightAlgorithms = defaultInsightAlgorithms, chartType } = context;
  const insights: VMindInsight[] = [];
  const insightAlgorithmContext = { ...pick(context, ['chartType', 'dataset', 'fieldInfo', 'cell']), insights };

  insightAlgorithms.forEach(algoInfo => {
    const { chartType: algoSupportedChartType, algorithmFunction } = algoInfo;
    if (algoSupportedChartType.includes(chartType)) {
      const res = algorithmFunction(insightAlgorithmContext);
      insights.push(...res);
    }
  });

  return { insights };
};

const ExtractInsightTaskNodeMeta: RuleBasedTaskNodeMeta<InsightContext & DataProcessOutput, InsightOutput> = {
  type: TaskNodeType.RULE_BASED,
  pipelines: [executeInsightAlgo]
};

export default ExtractInsightTaskNodeMeta;
