import euclideanDistance from 'euclidean-distance';

import { isArray, isString } from '@visactor/vutils';
import { ChartType, type DataItem } from '../../../../../../common/typings';
import { InsightType, type InsightAlgorithm, type VMindInsight } from '../../../../types';
import { DEFAULT_SERIES_NAME } from '../../../dataProcess/constants';

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

const autoK = (dataset: DataItem[]) => {
  const dataLength = dataset.length;
  if (dataLength > 10) {
    return 8;
  } else if (dataLength > 4) {
    return 4;
  }
  return 2;
};

const LOF = (
  propsDataset: { index: number; dataItem: DataItem }[],
  measureId: string,
  propsThreshold?: number,
  propsK?: number
) => {
  const dataset = propsDataset.map(d => d.dataItem);
  const k = propsK ?? 8;
  const threshold = propsThreshold ?? 2;
  const distanceMap = new Array(dataset.length).fill(0).map(d => []);

  for (let i = 0; i < dataset.length; i++) {
    const dataItem = dataset[i];
    for (let j = i + 1; j < dataset.length; j++) {
      const targetItem = dataset[j];
      const distance = euclideanDistance([dataItem[measureId] as number], [targetItem[measureId] as number]);
      distanceMap[i][j] = distance;
      distanceMap[j][i] = distance;
    }
  }
  const knnMap = dataset.map((dataItem, index) => {
    const knnArr = knn(k, index, distanceMap);
    return knnArr;
  });
  const lrdArr = dataset.map((dataItem, index) => lrd(index, knnMap, distanceMap));
  const lofArr = dataset.map((dataItem, index) => {
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

const lofAlgoFunc = (context: any) => {
  const result: VMindInsight[] = [];
  const { seriesDataMap, cell } = context;
  const { y: celly } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];

  Object.keys(seriesDataMap).forEach(group => {
    const dataset: { index: number; dataItem: DataItem }[] = seriesDataMap[group];
    yField.forEach(field => {
      const lofArray = LOF(dataset, field);
      lofArray.forEach(insight => {
        const { score, index } = insight;
        const insightDataItem = dataset[index];
        const lofInsight: VMindInsight = {
          type: InsightType.Outlier,
          data: [insightDataItem],
          fieldId: field,
          value: insightDataItem.dataItem[field],
          significant: score - 1,
          seriesName: group === DEFAULT_SERIES_NAME ? undefined : group
        } as unknown as VMindInsight;
        result.push(lofInsight);
      });
    });
  });
  return result;
};

const LOFOutlier: InsightAlgorithm = {
  name: 'lof',
  chartType: [ChartType.BarChart, ChartType.LineChart, ChartType.RadarChart, ChartType.DualAxisChart],
  insightType: InsightType.Outlier,
  algorithmFunction: lofAlgoFunc
};

export default LOFOutlier;
