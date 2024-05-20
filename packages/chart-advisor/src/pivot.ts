import { isNil, range, uniq } from 'lodash-es';

import { getDomainFromDataset } from './fieldUtils';
import { UniqueId, Dataset, Datasets, DataItem, PivotTree } from './type';

// 透视分析
export const pivot = (
  dataset: Dataset,
  colList: UniqueId[],
  rowList: UniqueId[],
  measureList: UniqueId[],
  paginationInfo?: any
): {
  datasets: Datasets;
  colPivotTree: PivotTree;
  rowPivotTree: PivotTree;
  length: number;
} => {
  // 行列的透视的 pathList
  const rowPathList = getPathList(rowList, dataset);
  const colPathList = getPathList(colList, dataset);

  // 按行分页
  const rowPathListPage = paginationDataset(rowPathList, paginationInfo);

  // 按行维度透视
  const rowGroups = groupByDims(dataset, rowList, rowPathListPage);

  // 按列维度透视
  const colGroups = rowGroups.map((row: Dataset) => groupByDims(row, colList, colPathList));

  // 按多指标透视 (透视表中实际不存在此场景，因为多指标已经被平坦化)
  const groups: Datasets = colGroups.map((pane: Dataset[]) =>
    pane.map((cell: Dataset) => groupByMeas(cell, measureList))
  );

  // 根据分页后的 pathList 生成 header tree
  const rowPivotTree = pivotTree(rowList, rowPathListPage);
  const colPivotTree = pivotTree(colList, colPathList);

  return {
    datasets: groups,
    colPivotTree,
    rowPivotTree,
    length: rowGroups.length
  };
};

// 组合图透视分析
export const pivotCombination = (
  dataset: Dataset[],
  colList: UniqueId[],
  rowList: UniqueId[]
): {
  datasets: Datasets;
  colPivotTree: PivotTree;
  rowPivotTree: PivotTree;
  length: number;
} => {
  // 组合图 meta 数量
  const metaLength: number = dataset.length;

  // 先为数据打上 组合图 mate index tag， 然后将数据平坦为一个集合
  const datasetWithTag: Dataset[] = dataset.map((dataList: Dataset, index: number) =>
    dataList.map((data: DataItem) => addTag(data, index))
  );
  const flatDataset = datasetWithTag.flat();

  // 行列的透视的 path_list
  const rowPathList = getPathList(rowList, flatDataset);
  const colPathList = getPathList(colList, flatDataset);

  // 按行维度透视
  const rowGroups = groupByDims(flatDataset, rowList, rowPathList);

  // 按列维度透视
  const colGroups = rowGroups.map((row: Dataset) => groupByDims(row, colList, colPathList));

  // 按多指标透视
  const groups: Datasets = colGroups.map((pane: Dataset[]) =>
    pane.map((cell: Dataset) => groupByMeta(cell, metaLength))
  );
  // console.log(groups)

  // 根据分页后的 pathList 生成 header tree
  const rowPivotTree = pivotTree(rowList, rowPathList);
  const colPivotTree = pivotTree(colList, colPathList);

  return {
    datasets: groups,
    colPivotTree,
    rowPivotTree,
    length: rowGroups.length
  };
};

// 通过 domain_map 和 sort_service 生成透视路径集合
type Path = string[];
const getPathList = (keys: UniqueId[], dataset: Dataset, filterList: Path = []) => {
  const pathList: Path[] = [];
  if (keys.length > 0) {
    const key: UniqueId = keys[0];
    const valueList: string[] = getDomainFromDataset(dataset, key);

    valueList.forEach((value: string) => {
      if (keys.length > 1) {
        const _dataset: Dataset = filterDataItem(dataset, [key], [value]);
        const _filterList: Path = [...filterList, value];
        pathList.push(...getPathList(keys.slice(1), _dataset, _filterList));
      } else {
        pathList.push([...filterList, value]);
      }
    });
  }
  return pathList;
};

// 分组 dimension
const groupByDims = (source: Dataset, keys: UniqueId[], pathList: Path[]): Dataset[] => {
  if (pathList.length === 0) {
    return [source];
  }
  const groups: Dataset[] = pathList.map((path: Path) => filterDataItem(source, keys, path));
  return groups;
};

// 分组 measure
const groupByMeas = (source: Dataset, measures: UniqueId[]): Dataset[] => {
  if (measures.length <= 1) {
    return [source];
  }
  return measures.map((measure: UniqueId) => source.filter((dataItem: DataItem) => !isNil(dataItem[measure])));
};

// 分组 meta
const groupByMeta = (source: Dataset, length: number): Dataset[] => {
  const group: Dataset[] = range(length).map((index: number) =>
    source.filter((data: DataItem) => data[COMBINATION_INDEX] === index).map((data: DataItem) => removeTag(data))
  );
  return group;
};

// 分页逻辑
const paginationDataset = (pathList: Path[], paginationInfo?: any) => {
  if (isNil(paginationInfo)) {
    return pathList;
  }
  const pageOffset: number = paginationInfo.offset;
  const pageSize: number = paginationInfo.size;
  return pathList.slice(pageOffset, pageOffset + pageSize);
};

// 生成 pivot header tree  递归创建 header node
const pivotTree = (keys: UniqueId[], pathList: Path[], deep = 0): PivotTree => {
  if (keys.length < deep + 1) {
    return null;
  }
  const getDomainFromPath = () => {
    const nodes: string[] = pathList.map((path: Path) => path[deep]);
    return uniq(nodes);
  };
  const field: UniqueId = keys[deep];
  const domain: string[] = getDomainFromPath();
  return {
    field,
    values: domain.map((value: string) => ({
      value,
      child: pivotTree(
        keys,
        pathList.filter((path: Path) => path[deep] === value),
        deep + 1
      )
    }))
  };
};

// 工具函数

// 通过分组好的 kv 数据 在数据集中过滤出满足条件的数据项
const filterDataItem = (sourceList: Dataset, keyList: UniqueId[], valueList: string[]): Dataset =>
  sourceList.filter(dataItem => checkKeysValues(dataItem, keyList, valueList));

// 通过指定的 kv 信息判断当前的数据项是否匹配
const checkKeysValues = (dataItem: any, keyList: UniqueId[], valueList: string[]): boolean =>
  range(keyList.length)
    .map((idx: number) => String(dataItem[keyList[idx]]) === valueList[idx])
    .reduce((pre: boolean, cur: boolean) => pre && cur, true);

// 组合图透视分析所依赖的tag
const COMBINATION_INDEX = '__combination_index__';

// 增加tag
const addTag = (dataItem: DataItem, i: number) => ({
  ...dataItem,
  [COMBINATION_INDEX]: i
});

// 移除tag
const removeTag = (dataItem: DataItem) => {
  const _dataItem = { ...dataItem };
  delete _dataItem[COMBINATION_INDEX];
  return _dataItem;
};
