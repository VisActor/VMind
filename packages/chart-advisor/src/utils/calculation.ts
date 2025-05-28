// 计算标准差
export function standardDeviation(arr: number[]): number {
  if (!arr.length) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

// 计算极差
export function range(arr: number[]): number {
  if (!arr.length) return 0;
  return Math.max(...arr) - Math.min(...arr);
}

// 计算变异系数
export function coefficientOfVariation(arr: number[]): number {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return mean === 0 ? 0 : standardDeviation(arr) / mean;
}
