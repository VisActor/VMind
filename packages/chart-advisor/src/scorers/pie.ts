import { ChartData, ScoringConfig, ScorerFn } from '../types';
import { dataRangeRule, dimensionMetricRule, dataDistributionRule, userPurposeRule } from '../rules/common';
import { composeRules } from '../rules/compose';

// 饼图特有规则（如有，可补充）
const pieSpecificRules = (config: ScoringConfig) => [
  // 示例：可根据实际需求添加
  // {
  //   name: 'pieSegmentCount',
  //   weight: 1.0,
  //   check: (data: ChartData) => ({
  //     passed: Array.isArray(data.bars) && data.bars.length <= 10,
  //     score: 1,
  //     details: `Pie segment count: ${Array.isArray(data.bars) ? data.bars.length : 0}`
  //   })
  // }
];

// 创建饼图评分器
export const createPieScorer = (config: ScoringConfig): ScorerFn => {
  const rules = [
    dataRangeRule(config),
    dimensionMetricRule(config),
    dataDistributionRule(config),
    userPurposeRule(config),
    ...pieSpecificRules(config)
  ];
  return composeRules(rules);
};
