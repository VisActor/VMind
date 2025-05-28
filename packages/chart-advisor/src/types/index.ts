export interface RuleResult {
  passed: boolean;
  score: number;
  details?: string;
}

export interface Rule {
  name: string;
  weight: number;
  check: (data: ChartData, config: ScoringConfig) => RuleResult;
}

export type ScorerFn = (data: ChartData, config: ScoringConfig) => ScoreResult;

export interface ScoreResult {
  score: number;
  details: Record<string, any>;
  ruleResults: RuleResult[];
  chartType: string;
}

// 你可以根据实际数据结构补充 ChartData 类型
export interface ChartData {
  // 示例字段
  bars?: any[];
  [key: string]: any;
}

export interface ScoringConfig {
  thresholds: {
    maxBarNumber: number;
    minBarNumber: number;
    maxDataRange: number;
    minDataRatio: number;
  };
  weights: {
    dimensionCheck: number;
    dataRange: number;
    dataDistribution: number;
    userPurpose: number;
  };
}
