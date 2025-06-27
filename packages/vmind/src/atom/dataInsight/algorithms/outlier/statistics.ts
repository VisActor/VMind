/**
 * Using Z-score and IQR to detect abnormal value.
 */
import { isArray } from '@visactor/vutils';
import type { InsightAlgorithm } from '../../type';
import { InsightType, type DataInsightExtractContext, type Insight } from '../../type';
import { ChartType } from '../../../../types';
import { getIntersection, isValidData } from '../../../../utils/common';
import { getMeanAndstdDev } from '../statistics';
import { isPercenSeries } from '../../utils';
import type { DataItem } from '@visactor/generate-vchart';

export interface DataPoint {
  index: number;
  indexPair?: number[];
  value: number;
}

export function getAbnormalByZScores(data: DataPoint[], threshold = 3) {
  const { mean, stdDev } = getMeanAndstdDev(data.map(v => v.value));
  return data.filter(v => Math.abs((v.value - mean) / stdDev) >= threshold).map(v => v.index);
}

function calculateQuantile(sortedData: number[], quantile: number) {
  const pos = (sortedData.length - 1) * quantile;
  const base = Math.floor(pos);
  const rest = pos - base;

  if (sortedData[base + 1] !== undefined) {
    return sortedData[base] + rest * (sortedData[base + 1] - sortedData[base]);
  }
  return sortedData[base];
}

export function getAbnormalByIQR(data: DataPoint[]) {
  // 先对数据进行排序
  const sortedData = data.slice().sort((a, b) => a.value - b.value);
  const dataList = sortedData.map(v => v.value);

  // 计算四分位数
  const q1 = calculateQuantile(dataList, 0.25);
  const q3 = calculateQuantile(dataList, 0.75);
  const iqr = q3 - q1;

  // 识别异常值
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  const outliers = sortedData.filter(dataPoint => dataPoint.value < lowerBound || dataPoint.value > upperBound);

  return outliers.map(v => v.index);
}

export interface StatisticsOptions {
  threshold?: number;
}

const zscoreIQRAlgoFunc = (context: DataInsightExtractContext, options: StatisticsOptions) => {
  const result: Insight[] = [];
  const { threshold = 3 } = options || {};
  const { seriesDataMap, cell, spec } = context;
  const { y: celly } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];

  Object.keys(seriesDataMap).forEach(group => {
    const dataset: { index: number; dataItem: DataItem }[] = seriesDataMap[group];
    yField.forEach(field => {
      if (isPercenSeries(spec, field)) {
        return;
      }
      const dataList = dataset
        .map((d, index) => ({
          index: index,
          value: Number(d.dataItem[field])
        }))
        .filter(v => isValidData(v.value) && !isNaN(v.value));
      const zScoreResult = dataList.length >= 30 ? getAbnormalByZScores(dataList, threshold) : null;
      const iqrResult = dataList.length >= 10 ? getAbnormalByIQR(dataList) : null;
      const finalResult = zScoreResult ? (getIntersection(zScoreResult, iqrResult) as number[]) : iqrResult;
      (finalResult || []).forEach(index => {
        const insightDataItem = dataset[index];
        const lofInsight: Insight = {
          type: InsightType.Outlier,
          data: [insightDataItem],
          fieldId: field,
          value: insightDataItem.dataItem[field],
          significant: 1,
          seriesName: group
        } as unknown as Insight;
        result.push(lofInsight);
      });
    });
  });
  return result;
};

export const StatisticsAlo: InsightAlgorithm = {
  name: 'statistics',
  forceChartType: [
    ChartType.DualAxisChart,
    ChartType.LineChart,
    ChartType.BarChart,
    ChartType.AreaChart,
    ChartType.RadarChart,
    ChartType.PieChart,
    ChartType.RoseChart,
    ChartType.WaterFallChart
  ],
  insightType: InsightType.Outlier,
  algorithmFunction: zscoreIQRAlgoFunc,
  supportPercent: false
};
