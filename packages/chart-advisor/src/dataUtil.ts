import { cloneDeep, isNil, uniq, isNaN } from 'lodash-es';
import { DataTypeName } from './type';
//将vizData中的dataset数组展开 后端版本可直接获取到dataSource，不用执行此方法
const restoreDataItem = item => {
  if (!Array.isArray(item)) {
    return item;
  }

  return item.reduce((prev, cur) => prev.concat(restoreDataItem(cur)), []);
};
export const restoreDatasets = dataset => restoreDataItem(dataset);

//

//计算平均数
export const calMean = dataset => {
  const { data } = dataset;
  const dataNotNull = data.filter(each => !isNil(each) && !isNaN(each));

  const sum = dataNotNull.reduce((prev, cur) => prev + cur, 0);
  const { length } = data;
  return sum / length;
};
//计算数据集的标准差
export const calStandardDeviation = dataset => {
  const { data } = dataset;
  if (data.length === 1) return 0;

  const dataNotNull = data.filter(each => !isNil(each) && !isNaN(each));

  const mean = dataset.mean ? dataset.mean : calMean(dataset);
  const sumpow = dataNotNull.reduce((prev, cur) => prev + (cur - mean) ** 2, 0);
  const { length } = data;
  return Math.sqrt(sumpow / (length - 1));
};

//计算变异系数
export const calCoefficient = dataset => {
  const mean = dataset.mean ? dataset.mean : calMean(dataset);
  //平均数=0时，变异系数无意义
  const standardDev = dataset.standardDev ? dataset.standardDev : calStandardDeviation(dataset);
  if (mean !== 0) {
    return standardDev / mean;
  } else {
    return undefined;
  }
};

// 升序排序
const asc = arr => arr.sort((a, b) => a - b);

export const calQuantile = (dataset, q) => {
  const { data = [] } = dataset;

  // 取绝对值且过滤掉 0 的
  const sorted = asc(cloneDeep(data.map(Math.abs))).filter(each => each && each > 0);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
};

//数组去重
export const unique = arr => uniq(arr);

export const isTemporal = (type: DataTypeName) => type === 'date';
