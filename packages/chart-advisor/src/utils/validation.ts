import { ChartData } from '../types';

// 校验 bars 是否为有效数组且长度大于0
export function validateBars(data: ChartData): boolean {
  return Array.isArray(data.bars) && data.bars.length > 0;
}

// 校验维度和指标
export function validateDimensionsMetrics(data: ChartData): boolean {
  return (
    Array.isArray(data.dimensions) &&
    data.dimensions.length > 0 &&
    Array.isArray(data.metrics) &&
    data.metrics.length > 0
  );
}
