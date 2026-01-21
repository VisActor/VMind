import { ChartData, ScoringConfig, ScorerFn } from '../types';
import { dataRangeRule, dimensionMetricRule, dataDistributionRule, userPurposeRule } from '../rules/common';
import { composeRules } from '../rules/compose';

// 柱状图特有规则（如有，可补充）
const barSpecificRules = (config: ScoringConfig) => [
  // 示例：可根据实际需求添加
  // {
  //   name: 'barSpacing',
  //   weight: 1.0,
  //   check: (data: ChartData) => ({
  //     passed: true,
  //     score: 1,
  //     details: 'Bar spacing check passed'
  //   })
  // }
];

// 创建柱状图评分器
export const createBarScorer = (config: ScoringConfig): ScorerFn => {
  const rules = [
    dataRangeRule(config),
    dimensionMetricRule(config),
    dataDistributionRule(config),
    userPurposeRule(config),
    ...barSpecificRules(config)
  ];
  return composeRules(rules);
};
