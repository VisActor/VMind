/**
 * Using Z-score and IQR to detect abnormal value.
 */
import { isArray, uniqArray } from '@visactor/vutils';
import type { InsightAlgorithm } from '../../type';
import { InsightType, type DataInsightExtractContext, type Insight } from '../../type';
import { ChartType, DataType, type DataItem } from '../../../../types';
import { getIntersection } from '../../../../utils/common';
import { getAbnormalByIQR, getAbnormalByZScores, type DataPoint } from './statistics';
import { LOF } from './lof';

function getDistanceList(dataList: DataPoint[], isTimeSeries: boolean) {
  const res = [];
  const n = dataList.length;
  let index = 0;
  if (!isTimeSeries) {
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const distance = Math.abs(dataList[i].value - dataList[j].value);
        res.push({
          index: index++,
          indexPair: [i, j],
          value: distance
        });
      }
    }
  } else {
    for (let i = 0; i < n - 1; i++) {
      res.push({
        index: index++,
        indexPair: [i, i + 1],
        value: Math.abs(dataList[i].value - dataList[i + 1].value)
      });
    }
  }
  return res;
}

export interface DifferenceOptions {
  zScore?: number;
  lofThreshold?: number;
}

const difference = (context: DataInsightExtractContext, options: DifferenceOptions) => {
  const result: Insight[] = [];
  const { zScore = 3, lofThreshold = 3 } = options || {};
  const { seriesDataMap, cell, fieldInfo } = context;
  const { y: celly, x: cellx } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];
  const xField = isArray(cellx) ? cellx[0] : cellx;
  const isTimeSeries = [DataType.TIME, DataType.DATE].includes(fieldInfo.find(info => info.fieldName === xField).type);

  Object.keys(seriesDataMap).forEach(group => {
    const dataset: { index: number; dataItem: DataItem }[] = seriesDataMap[group];
    yField.forEach(field => {
      const dataList = dataset.map((d, index) => ({
        index: index,
        value: d.dataItem[field] as number
      }));
      const distanceList = getDistanceList(dataList, isTimeSeries);
      const zScoreResult = distanceList.length >= 30 ? getAbnormalByZScores(distanceList, zScore) : null;
      const iqrResult = distanceList.length >= 10 ? getAbnormalByIQR(distanceList) : [];
      const staticResult = zScoreResult ? (getIntersection(zScoreResult, iqrResult) as number[]) : iqrResult;
      const lofResult = LOF(
        distanceList.map(v => v.value),
        lofThreshold
      ).map(v => v.index);
      const finalRes = getIntersection(staticResult, lofResult) as number[];
      (finalRes || []).forEach(index => {
        const distanceItem = distanceList[index];
        const lofInsight: Insight = {
          type: InsightType.PairOutlier,
          data: distanceItem.indexPair.map(v => dataset[dataList[v].index]),
          fieldId: field,
          value: distanceItem.value,
          significant: 1,
          seriesName: group
        } as unknown as Insight;
        result.push(lofInsight);
      });
    });
  });
  return result;
};

export const DifferenceAlg: InsightAlgorithm = {
  name: 'difference',
  forceChartType: [
    ChartType.DualAxisChart,
    ChartType.LineChart,
    ChartType.BarChart,
    ChartType.AreaChart,
    ChartType.WaterFallChart
  ],
  insightType: InsightType.PairOutlier,
  algorithmFunction: difference,
  supportPercent: false,
  supportStack: false
};
