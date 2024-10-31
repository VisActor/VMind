import euclideanDistance from 'euclidean-distance';

import { isArray } from '@visactor/vutils';
import type { InsightAlgorithm } from '../../type';
import { InsightType, type DataInsightExtractContext, type Insight } from '../../type';
import { ChartType, type DataItem } from '../../../../types';
import { isValidData } from '../../../../utils/common';
import { isPercentChart } from '../../utils';

type knnItem = number[];
type KnnMap = knnItem[][];
type DistanceMap = number[][];
type LrdArray = number[];

// k-Nearest Neighbors (naive)
const knn = (k: number, pIndex: number, distanceMap: number[][]) => {
  const distanceArr = distanceMap[pIndex];
  return (
    distanceMap
      // calculate the distance from selected index to the others
      .map((data, index) => [index, distanceArr[index]])
      // filter the self point
      .filter(([index, distance]) => index !== pIndex)
      // sort by nearest
      .sort(([index1, distance1], [index2, distance2]) => distance1 - distance2)
      // get the K-neighbor
      .slice(0, k)
  );
};

// distanceToKthNearestNeighbor
const kd = (knnMap: KnnMap, pIndex: number) => {
  const kNeighbors = knnMap[pIndex];
  const [index, distance] = kNeighbors.reduce((acc, dis) => (acc[1] > dis[1] ? acc : dis));
  // returning the bigger distance in the neighbors
  return distance;
};

// Reachability Distance of point p and point o (used by lrd only)
const rd = (knnMap: KnnMap, distanceMap: DistanceMap, pIndex: number, oIndex: number) => {
  // getting the bigger between neighbors of current index and  distance between selected index and current index
  return Math.max(kd(knnMap, oIndex), distanceMap[pIndex][oIndex]);
};

const sigmaRdCalc = (nearestArray: knnItem[], knnMap: KnnMap, distanceMap: DistanceMap, pIndex: number) =>
  nearestArray
    // reachDistance: getting the max value between the Kth distance and the distance between selected index and current index for each item
    .map(([oIndex, distance]) => rd(knnMap, distanceMap, pIndex, oIndex))
    // getting the sum of reachDistances
    .reduce((d1: number, d2: number) => d1 + d2);

// Local Reachability Density of point p
const lrd = (pIndex: number, knnMap: KnnMap, distanceMap: DistanceMap) => {
  // getting distances
  const nearestArray = knnMap[pIndex];
  const sigmaRd = sigmaRdCalc(nearestArray, knnMap, distanceMap, pIndex);
  // was using the bigger distance in neighbors, instead I used length of pIndex neighbors (kNearestSetCount)
  return sigmaRd - 0 <= Number.EPSILON ? 1 : nearestArray.length / sigmaRd;
};

const onePointLOF = (dataIndex: number, knnMap: KnnMap, lrdArray: LrdArray) => {
  //calculate the lof value of one point
  const nearestArray = knnMap[dataIndex];
  const sigmaLrdFraction = nearestArray
    .map(([oIndex]) => lrdArray[oIndex] / lrdArray[dataIndex])
    .reduce((d1, d2) => d1 + d2);
  return sigmaLrdFraction / nearestArray.length;
};

const autoK = (dataLength: number) => {
  if (dataLength > 10) {
    return 8;
  } else if (dataLength > 4) {
    return 4;
  }
  return 2;
};

export const LOF = (dataList: number[], threshold = 3, propsK?: number) => {
  const k = propsK || autoK(dataList.length);
  if (k >= dataList.length) {
    return [];
  }
  const distanceMap: number[][] = new Array(dataList.length).fill(0).map(d => [] as number[]);

  for (let i = 0; i < dataList.length; i++) {
    for (let j = i + 1; j < dataList.length; j++) {
      const distance = euclideanDistance([dataList[i]], [dataList[j]]);
      distanceMap[i][j] = distance;
      distanceMap[j][i] = distance;
    }
  }
  const knnMap = dataList.map((v, index) => {
    const knnArr = knn(k, index, distanceMap);
    return knnArr;
  });
  const lrdArr = dataList.map((v, index) => lrd(index, knnMap, distanceMap));
  const lofArr = dataList.map((v, index) => {
    const lof = onePointLOF(index, knnMap, lrdArr);
    return lof;
  });
  return lofArr
    .map((score, index) =>
      score >= threshold
        ? {
            index,
            score
          }
        : undefined
    )
    .filter(Boolean);
};

export interface LOFOptions {
  threshold?: number;
  k?: number;
}

const lofAlgoFunc = (context: DataInsightExtractContext, options: LOFOptions) => {
  const result: Insight[] = [];
  const { k, threshold = 3 } = options || {};
  const { seriesDataMap, cell } = context;
  const { y: celly } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];

  Object.keys(seriesDataMap).forEach(group => {
    const dataset: { index: number; dataItem: DataItem }[] = seriesDataMap[group];
    yField.forEach(field => {
      const dataList = dataset.map(d => Number(d.dataItem[field]));
      const lofArray = LOF(dataList, threshold, k);
      lofArray.forEach(insight => {
        const { score, index } = insight;
        const insightDataItem = dataset[index];
        const lofInsight: Insight = {
          type: InsightType.Outlier,
          data: [insightDataItem],
          fieldId: field,
          value: insightDataItem.dataItem[field],
          significant: score / threshold,
          seriesName: group
        } as unknown as Insight;
        result.push(lofInsight);
      });
    });
  });
  return result;
};

export const LOFOutlier: InsightAlgorithm = {
  name: 'lof',
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
  algorithmFunction: lofAlgoFunc,
  supportPercent: false
};
