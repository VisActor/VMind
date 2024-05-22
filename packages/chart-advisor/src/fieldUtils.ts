import { uniqArray, pick, isNumber, isNil } from '@visactor/vutils';
import { FoldInfo } from './type';
import { Dataset, UniqueId, DataItem, AliasMap } from './type';

export function omit(obj: any, arr: string[]) {
  if (isNil(obj) || isNil(arr)) {
    return obj;
  }
  return Object.keys(obj)
    .filter(k => !arr.includes(k))
    .reduce((res, key) => ((res[key] = obj[key]), res), {});
}

/**
 * 输入二维数组，输出笛卡尔积长度
 * @param list
 */
export const productLength = (list: any[][]) =>
  list.length === 0 ? 0 : list.map(d => d.length).reduce((pre, cur) => pre * cur, 1);

/**
 * 输入二维数组，输出笛卡尔积
 * 新增了计算笛卡尔积时将指标名称放在最后计算的特殊处理
 * @param list
 */
export const legendProduct = (list: any[][], hasMeasureName = false) => {
  if (hasMeasureName && list.length > 1) {
    const _list = [...list];
    const measureNames = _list.pop();
    const productResult = product(_list);
    return measureNames
      .map((measureName: any[]) => productResult.map((d: any[]) => d.concat(measureName)))
      .reduce((pre, cur) => pre.concat(cur), []);
  }
  return product(list);
};

// 计算笛卡尔积
const product = (list: any[][]) =>
  list.length === 0
    ? []
    : list.reduce(
        function (a, b) {
          return a
            .map(function (x) {
              return b.map(function (y) {
                return x.concat(y);
              });
            })
            .reduce(function (a, b) {
              return a.concat(b);
            }, []);
        },
        [[]]
      );

// 从数据集中获取 domain map
export const getDomainFromDataset = (dataset: Dataset, dim: UniqueId): string[] => {
  const values: string[] = dataset.map((d: DataItem) => String(d[dim]));
  return uniqArray(values) as string[];
};

// 保留dataset中的某些字段
export const retainDatasetField = (dataset: Dataset, fields: UniqueId[]): Dataset =>
  dataset.map((data: DataItem) => pick(data, fields as any)) as Dataset;

// 移除dataset中的某些字段
export const removeDatasetField = (dataset: Dataset, fields: UniqueId[]): Dataset =>
  dataset.map((data: DataItem) => omit(data, fields)) as Dataset;

/**
 * 维度笛卡尔积的原始信息，因此可以通过cartesianInfo匹配原始的维度字段
 */
export const getCartesianInfo = (fieldList: UniqueId[], key: UniqueId) => ({
  key,
  fieldList
});

/**
 * 由于多度量的情况下数据会被平坦化，会导致原本的字段信息丢失，因此可以通过foldInfo匹配原始的指标字段
 */
export const getFoldInfo = (
  measuresId: UniqueId[],
  foldName: UniqueId,
  foldValue: UniqueId | UniqueId[],
  aliasMap: AliasMap
) =>
  ({
    key: foldName,
    value: foldValue,
    // foldMap: Object.fromEntries(new Map(
    foldMap: strMap2Obj(new Map(measuresId.map(id => [id, aliasMap[id]])))
  } as FoldInfo);
/**
 * 临时替代fromEntries 以兼容73以前的chrome
 */
const strMap2Obj = strMap => {
  const obj = Object.create(null);
  for (const [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
};

/**
 * Transform fold 字段展开
 * @param dataset 原始数据集
 * @param fields 待展开的字段集
 * @param foldName foldName字段
 * @param foldValue foldValue字段
 * @param aliasMap 别名表
 * @param retains 是否保留被展开的字段
 * @return dataset
 */
export const fold = (
  dataset: Dataset,
  fields: UniqueId[],
  foldName: UniqueId,
  foldValue: UniqueId,
  aliasMap?: AliasMap,
  retains = true
) => {
  const _dataset = [];
  dataset.forEach((data: DataItem) => {
    fields.forEach((field: UniqueId) => {
      // 是否保留被展开的字段
      const _data = retains ? data : omit(data, fields);
      _dataset.push({
        ..._data,
        [foldName]: aliasMap ? aliasMap[field] : field,
        [foldValue]: data[field]
      });
    });
  });
  return _dataset;
};
