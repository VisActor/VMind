import jStat from 'jstat';
import quantile from '@stdlib/stats-base-dists-t-quantile';

export enum TrendType {
  NO_TREND = 'no trend',
  INCREASING = 'increasing',
  DECREASING = 'decreasing'
}

function mkScore(x: number[], n: number) {
  let s = 0;

  for (let k = 0; k < n - 1; k++) {
    // 对于每个元素，我们比较后面的元素是否大于或小于它
    for (let j = k + 1; j < n; j++) {
      if (x[j] > x[k]) {
        s += 1;
      } else if (x[j] < x[k]) {
        s -= 1;
      }
    }
  }

  return s;
}

function varianceS(x: number[], n: number) {
  // 计算唯一数据
  const uniqueX: number[] = Array.from(new Set(x));
  const g = uniqueX.length;

  let varS;

  // 计算var(s)
  if (n === g) {
    // 没有重复值
    varS = (n * (n - 1) * (2 * n + 5)) / 18;
  } else {
    // 存在重复值
    const tp = new Array(g).fill(0);

    for (let i = 0; i < g; i++) {
      tp[i] = x.filter(item => item === uniqueX[i]).length;
    }

    varS = (n * (n - 1) * (2 * n + 5) - tp.reduce((acc, curr) => acc + curr * (curr - 1) * (2 * curr + 5), 0)) / 18;
  }

  return varS;
}

function zScore(s: number, varS: number) {
  let z;
  if (s > 0) {
    z = (s - 1) / Math.sqrt(varS);
  } else if (s === 0) {
    z = 0;
  } else if (s < 0) {
    z = (s + 1) / Math.sqrt(varS);
  }

  return z;
}

function sensEstimator(x: number[]) {
  let idx = 0;
  const n = x.length;
  const d = new Array((n * (n - 1)) / 2).fill(1);

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      // 计算斜率并存储到d中
      d[idx] = (x[j] - x[i]) / (j - i);
      idx++;
    }
  }

  return d;
}

function median(array: number[]) {
  const sortedArray = array.filter(item => !isNaN(item)).sort((a, b) => a - b);
  const midIndex = Math.floor(sortedArray.length / 2);

  if (sortedArray.length % 2 === 0) {
    return (sortedArray[midIndex - 1] + sortedArray[midIndex]) / 2;
  }
  return sortedArray[midIndex];
}

function sensSlope(x: number[]) {
  const n = x.length;
  //估计斜率
  const slopes = sensEstimator(x);
  const slope = median(slopes);

  // 计算截距
  const intercept = median(x) - median(Array.from(Array(n).keys())) * slope;

  return { slope, intercept };
}

function pValue(z: number, alpha: number) {
  // 使用jStat双尾检验
  const p = 2 * (1 - jStat.normal.cdf(Math.abs(z), 0, 1));
  const h = Math.abs(z) > jStat.normal.inv(1 - alpha / 2, 0, 1);

  let trend;
  if (z < 0 && h) {
    trend = TrendType.DECREASING;
  } else if (z > 0 && h) {
    trend = TrendType.INCREASING;
  } else {
    trend = TrendType.NO_TREND;
  }

  return { p, h, trend };
}

export function originalMKTest(xOld: number[], alpha = 0.05, calcScope = false) {
  const x = xOld;
  const n = x.length;
  const s = mkScore(x, n);
  const varS = varianceS(x, n);
  const Tau = s / (0.5 * n * (n - 1));

  const z = zScore(s, varS);
  const { p, h, trend } = pValue(z, alpha);
  let finalSlope;
  let finalIntercept;
  if (h && calcScope) {
    const { slope, intercept } = sensSlope(xOld);
    finalSlope = slope;
    finalIntercept = intercept;
  }
  return {
    trend,
    pValue: p,
    zScore: z,
    slope: finalSlope,
    intercept: finalIntercept
  };
}

export function spearmanCoefficient(array1: number[], array2: number[]) {
  return jStat.spearmancoeff(array1, array2);
}

export function pearsonCorrelationCoeff(array1: number[], array2: number[]) {
  return jStat.corrcoeff(array1, array2);
}

export function studentTQuantile(x: number, degree: number) {
  return quantile(x, degree);
}

export function coefficientVariation(data: number[]) {
  return jStat.coeffvar(data);
}

export function longestTrendInterval(data: number[]) {
  if (data.length === 0) {
    return { length: 0, start: -1, end: -1 };
  }

  let maxLength = 1;
  let currentLength = 1;
  let start = 0;
  let end = 0;
  let maxStart = 0;
  let maxEnd = 0;
  let trend = 0; // 0: no trend, 1: increasing, -1: decreasing

  for (let i = 1; i <= data.length; i++) {
    const currentTrend = i === data.length ? null : Math.sign(data[i] - data[i - 1]);

    if (currentTrend === trend) {
      currentLength++;
      end = i;
    } else {
      if (currentLength > maxLength) {
        maxLength = currentLength;
        maxStart = start;
        maxEnd = end;
      }
      trend = currentTrend;
      currentLength = currentTrend !== 0 ? 2 : 1;
      start = i - 1;
      end = i;
    }
  }
  return { length: maxLength, start: maxStart, end: maxEnd };
}
