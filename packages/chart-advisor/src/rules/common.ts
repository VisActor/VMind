import { Rule, ScoringConfig, ChartData } from '../types';
import { coefficientOfVariation } from '../utils/calculation';

// 数据量范围检查
export const dataRangeRule = (config: ScoringConfig): Rule => ({
  name: 'dataRange',
  weight: config.weights.dataRange,
  check: (data: ChartData) => ({
    passed: Array.isArray(data.bars)
      ? data.bars.length >= config.thresholds.minBarNumber && data.bars.length <= config.thresholds.maxBarNumber
      : false,
    score: 1,
    details: `Bar count: ${Array.isArray(data.bars) ? data.bars.length : 0}`
  })
});

// 维度指标检查
export const dimensionMetricRule = (config: ScoringConfig): Rule => ({
  name: 'dimensionMetric',
  weight: config.weights.dimensionCheck,
  check: (data: ChartData) => ({
    passed: (data.dimensions?.length ?? 0) >= 1 && (data.metrics?.length ?? 0) >= 1,
    score: 1,
    details: `Dimensions: ${data.dimensions?.length ?? 0}, Metrics: ${data.metrics?.length ?? 0}`
  })
});

// 数据分布检查（使用变异系数）
export const dataDistributionRule = (config: ScoringConfig): Rule => ({
  name: 'dataDistribution',
  weight: config.weights.dataDistribution,
  check: (data: ChartData) => {
    // 假设 bars 中有 value 字段
    const values = Array.isArray(data.bars)
      ? data.bars.map((d: any) => d.value).filter((v: any) => typeof v === 'number')
      : [];
    const coef = coefficientOfVariation(values);
    // 以 0.2 作为分布合理的阈值（可根据实际需求调整）
    const passed = coef >= 0.2;
    return {
      passed,
      score: passed ? 1 : 0,
      details: `Coefficient of variation: ${coef}`
    };
  }
});

// 用户目的匹配规则（示例，具体实现可后续补充）
export const userPurposeRule = (config: ScoringConfig): Rule => ({
  name: 'userPurpose',
  weight: config.weights.userPurpose,
  check: (data: ChartData) => ({
    passed: true, // 先占位
    score: 1,
    details: 'User purpose check passed'
  })
});
