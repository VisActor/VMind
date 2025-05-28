import { Rule, ScorerFn, ChartData, ScoringConfig, ScoreResult } from '../types';

// 组合多个评分规则
export const composeRules =
  (rules: Rule[]): ScorerFn =>
  (data: ChartData, config: ScoringConfig): ScoreResult => {
    const results = rules.map(rule => ({
      ...rule.check(data, config),
      weight: rule.weight,
      name: rule.name
    }));

    const totalWeight = results.reduce((sum, r) => sum + r.weight, 0);
    const totalScore = results.reduce((sum, r) => sum + (r.passed ? r.score * r.weight : 0), 0);

    return {
      score: totalWeight > 0 ? totalScore / totalWeight : 0,
      details: results.reduce(
        (details, r) => ({
          ...details,
          [r.name]: r.passed
        }),
        {}
      ),
      ruleResults: results,
      chartType: data.chartType || 'unknown'
    };
  };
