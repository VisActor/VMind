import { ChartData, ScoringConfig, ScorerFn } from '../types';
import { dataRangeRule, dimensionMetricRule, dataDistributionRule, userPurposeRule } from '../rules/common';
import { composeRules } from '../rules/compose';

// 折线图特有规则（如有，可补充）
const lineSpecificRules = (config: ScoringConfig) => [
  // 示例：可根据实际需求添加
  // {
  //   name: 'lineContinuity',
  //   weight: 1.0,
  //   check: (data: ChartData) => ({
  //     passed: true,
  //     score: 1,
  //     details: 'Line continuity check passed'
  //   })
  // }
];

// 创建折线图评分器
export const createLineScorer = (config: ScoringConfig): ScorerFn => {
  const rules = [
    dataRangeRule(config),
    dimensionMetricRule(config),
    dataDistributionRule(config),
    userPurposeRule(config),
    ...lineSpecificRules(config)
  ];
  return composeRules(rules);
};
