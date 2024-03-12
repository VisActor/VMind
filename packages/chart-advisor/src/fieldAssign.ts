import { clone, cloneDeep } from 'lodash';
import { AutoChartCell } from './type';
import * as dataUtils from './dataUtil';

import { AliasMap, UniqueId, DataItem, Dataset } from './type';
import {
  productLength,
  legendProduct,
  getDomainFromDataset,
  retainDatasetField,
  getCartesianInfo,
  getFoldInfo,
  fold,
  removeDatasetField
} from './fieldUtils';

import {
  FOLD_NAME,
  FOLD_VALUE,
  COLOR_FIELD,
  GROUP_FIELD,
  FOLD_VALUE_MAIN,
  FOLD_VALUE_SUB,
  X_MAX_COUNT,
  MAX_POINT_COUNT,
  LEGEND_MAX_COUNT,
  LEGEND_MAX_POINT_COUNT
} from './constant';

/*自动分配策略：
当维度数大于1小于3时，前面的字段先用来形成透视，余下字段中的第一个用来做x轴。
当透视达到1x1后，第三个字段用来做x轴，其余字段按规则分配到视觉通道中，
最后多余的字段用来形成笛卡尔积
这样做的目的是：
1. 从外往里进行透视更加自然
2. 改变颜色的影响远大于改变x轴的影响
这与tableau的策略是一致的
目前先限制1x1的透视，后续性能提升后透视的层数可以增加
*/

/*
为支持透视的图表分配字段(条形图、柱状图)
*/
export const assignPivotCharts = (
  originDataset,
  dimList: UniqueId[],
  measureList: UniqueId[],
  aliasMapOld: AliasMap,
  MAX_PIVOT_ROW: number,
  MAX_PIVOT_COLUMN: number
) => {
  const aliasMap = cloneDeep(aliasMapOld);
  let dataset = cloneDeep(originDataset);
  const cell: AutoChartCell = {
    x: [],
    y: [],
    row: [],
    column: [],
    color: [],
    size: [],
    angle: []
  };

  if (dimList.length === 0 || measureList.length === 0) {
    return { cell, dataset };
  }

  let nowDimIndex = 0;

  //首先分配透视字段
  while (
    (cell.row.length < MAX_PIVOT_ROW || cell.column.length < MAX_PIVOT_COLUMN) &&
    nowDimIndex + 1 < dimList.length //还有剩余字段，可以分配透视维度
  ) {
    if (cell.row.length <= cell.column.length) {
      cell.row.push(dimList[nowDimIndex]);
    } else {
      cell.column.push(dimList[nowDimIndex]);
    }
    nowDimIndex++;
  }

  //剩余第一个维度分配到x轴
  cell.x.push(dimList[nowDimIndex]);
  nowDimIndex++;

  const colorFields = [];

  //其余字段做笛卡尔积分配到颜色
  colorFields.push(...dimList.slice(nowDimIndex));

  const measuresListLength: number = measureList.length;
  // 提取 y 字段（度量值）
  let colorFieldsIncludeMeasure = false;
  if (measuresListLength > 1) {
    // 多度量
    aliasMap[FOLD_NAME] = `指标名称`;
    aliasMap[FOLD_VALUE] = `指标值`;
    colorFields.push(FOLD_NAME);
    colorFieldsIncludeMeasure = true;
    cell.y.push(FOLD_VALUE);
  } else if (measuresListLength === 1) {
    // 单度量
    cell.y.push(measureList[0]);
  }

  // 提取 color分组字段 （维度其他项 以及 度量名称）
  const colorFieldsValues: string[][] = colorFields.map((uniqueId: UniqueId) =>
    getDomainFromDataset(dataset, uniqueId)
  );

  // 计算图例项笛卡尔积之前，限制条目数量
  const dimItemsLen: number = getDomainFromDataset(dataset, cell.x[0]).length;
  const colorItemsLen: number = productLength(colorFieldsValues);
  if (
    dimItemsLen > X_MAX_COUNT ||
    dataset.length > MAX_POINT_COUNT ||
    (colorItemsLen > LEGEND_MAX_COUNT && dataset.length > LEGEND_MAX_POINT_COUNT)
  ) {
    return {
      error: true,
      errMsg: `数据量或图例项过多，请使用表格展示。`
    };
  }

  // 计算图例项
  const colorItemsList: string[][] = legendProduct(colorFieldsValues, colorFieldsIncludeMeasure);
  let colorItems: string[] = colorItemsList.map(d => d.join('-'));

  // 使用笛卡尔积后的图例项替换原数据中对应的字段
  if (colorFields.length > 0) {
    dataset = dataset.map((data: DataItem) => {
      const colorItem = colorFields.map(field => data[field]).join('-');
      return {
        ...data,
        [COLOR_FIELD]: colorItem
      };
    });
    // 将笛卡尔积后无效的 colorItem 移除
    const _colorItems: string[] = getDomainFromDataset(dataset, COLOR_FIELD);
    colorItems = colorItems.filter((d: string) => _colorItems.includes(d));

    aliasMap[COLOR_FIELD] = `图例项`;
    cell.color.push(COLOR_FIELD);
    cell.cartesianInfo = getCartesianInfo(colorFields, COLOR_FIELD);

    // 多度量时的平坦化字段
    if (measuresListLength > 1) {
      cell.foldInfo = getFoldInfo(measureList, FOLD_NAME, FOLD_VALUE, aliasMap);
    }
  }

  return { cell, dataset, colorItems, aliasMap };
};

export const processCombination = (
  originDataset,
  dimList: UniqueId[],
  measureList: UniqueId[],
  aliasMapOld: AliasMap,
  MAX_PIVOT_ROW: number,
  MAX_PIVOT_COLUMN: number
) => {
  const aliasMap = cloneDeep(aliasMapOld);
  //为组合图单独配置cell
  const dataset = cloneDeep(originDataset);
  const metaDatas = [];

  measureList.forEach(measure => {
    const _allPillsIdList: UniqueId[] = [].concat(dimList, [measure]);
    const _dataset: Dataset = retainDatasetField(dataset, _allPillsIdList);
    const metaData = assignPivotCharts(_dataset, dimList, [measure], aliasMap, MAX_PIVOT_ROW, MAX_PIVOT_COLUMN);
    metaDatas.push(metaData);
  });

  return metaDatas;
};

export const assignScatterPlot = (
  originDataset,
  dimList: UniqueId[],
  measureList: UniqueId[],
  aliasMapOld: AliasMap
) => {
  const aliasMap = cloneDeep(aliasMapOld);
  let dataset = cloneDeep(originDataset);
  const scatterCell: AutoChartCell = {
    x: [],
    y: [],
    row: [],
    column: [],
    color: [],
    size: [],
    angle: [],
    group: [GROUP_FIELD]
  };

  let remainMeasure = measureList.length; //剩余未分配的度量数量

  if (dimList.length === 0 || measureList.length < 2) {
    return { scatterCell, dataset };
  }

  //首先分配两个轴
  scatterCell.x.push(measureList[0]);
  scatterCell.y.push(measureList[1]);

  remainMeasure -= 2;

  //将第三个度量分配到尺寸
  if (measureList.length > 2) {
    scatterCell.size.push(measureList[2]);
  }

  remainMeasure -= 1;

  const groupDimensions: UniqueId[] = [];

  //将第一个维度分配到group，优先将第二个维度分配到颜色
  if (dimList.length > 1) {
    scatterCell.color.push(dimList[1]);
    groupDimensions.concat(dimList.slice(2));
  } else {
    groupDimensions.concat(dimList.slice(1));
    //将度量分配到颜色
    if (measureList.length > 3) {
      scatterCell.color.push(measureList[3]);
      remainMeasure -= 1;
    }
  }

  if (remainMeasure > 0) {
    //不支持此情况
    const voidCell: AutoChartCell = {
      x: [],
      y: [],
      row: [],
      column: [],
      color: [],
      size: [],
      angle: []
    };
    return { voidCell, dataset };
  }

  // 提取color分组字段
  const colorFieldsValues: string[][] = scatterCell.color.map((uniqueId: UniqueId) =>
    getDomainFromDataset(dataset, uniqueId)
  );

  // 计算图例项笛卡尔积之前，限制条目数量
  const colorItemsLen: number = productLength(colorFieldsValues);
  if (
    dataset.length > MAX_POINT_COUNT ||
    (colorItemsLen > LEGEND_MAX_COUNT && dataset.length > LEGEND_MAX_POINT_COUNT)
  ) {
    return {
      error: true,
      errMsg: `数据量或图例项过多，请使用表格展示。`
    };
  }
  // 计算图例项
  const colorItemsList: string[][] = legendProduct(colorFieldsValues, false);
  const colorItems: string[] = colorItemsList.map(d => d.join('-'));

  dataset = dataset.map((data: DataItem) => {
    const groupItem: string = groupDimensions.map((field: UniqueId) => data[field]).join('-');
    return {
      ...data,
      [GROUP_FIELD]: groupItem
    };
  });
  aliasMap[GROUP_FIELD] = `细分`;

  return {
    scatterCell,
    dataset: [[[dataset]]],
    colorItems,
    aliasMap
  };
};

export const sortTimeDim = (dimList, MAX_PIVOT_ROW, MAX_PIVOT_COLUMN): UniqueId[] => {
  //对于lineChart,先进行预排序，将第一个时间维度放到能分配到x轴的位置上
  const dimListLength = dimList.length;

  //第一个时间维度
  const firstTimeIndex = dimList.findIndex(dim => {
    const isDateType = dataUtils.isTemporal(dim.dataType);
    return isDateType;
  });

  let targetPosition;
  if (MAX_PIVOT_COLUMN + MAX_PIVOT_ROW > dimListLength - 1) {
    //维度数量不够形成MAX_PIVOT_COLUMN*MAX_PIVOT_ROW的透视，此时会将最后一个维度分配到x轴
    targetPosition = dimListLength - 1;
  } else {
    //维度数量可以形成MAX_PIVOT_COLUMN*MAX_PIVOT_ROW的透视，此时会将透视字段后第一个字段分配到x轴
    targetPosition = MAX_PIVOT_ROW + MAX_PIVOT_COLUMN;
  }

  const idList = dimList.map(dim => dim.uniqueID);

  //将时间维度挪到前面
  const timeItem = idList[firstTimeIndex];

  idList.splice(firstTimeIndex, 1);
  idList.splice(targetPosition, 0, timeItem);

  return idList;
};

export const assignPieChart = (originDataset, dimList: UniqueId[], measureList: UniqueId[], aliasMapOld: AliasMap) => {
  const aliasMap = cloneDeep(aliasMapOld);
  let dataset = cloneDeep(originDataset);

  const pieCell: AutoChartCell = {
    x: [],
    y: [],
    row: [],
    column: [],
    color: [],
    size: [],
    angle: []
  };

  //不满足自动图表下饼图字段要求
  if (!(dimList.length === 0 && measureList.length >= 3)) {
    return { pieCell, dataset };
  }

  // 饼图的所有维度都参与颜色计算
  const colorFields: UniqueId[] = [...dimList];
  // 图例项的字段中是否包含指标名称（包含的话需要将指标名称放到最后计算笛卡尔积）
  let colorFieldsIncludeMeasure = false;

  const measuresListLength: number = measureList.length;
  if (measuresListLength > 1) {
    // 多度量
    aliasMap[FOLD_NAME] = `指标名称`;
    aliasMap[FOLD_VALUE] = `指标值`;
    colorFields.push(FOLD_NAME);
    colorFieldsIncludeMeasure = true;
    pieCell.angle.push(FOLD_VALUE);
  } else if (measuresListLength === 1) {
    // 单度量
    pieCell.angle.push(measureList[0]);
  }

  // 提取 color分组字段 （维度 以及 度量名称）
  const colorFieldsValues: string[][] = colorFields.map((uniqueId: UniqueId) =>
    getDomainFromDataset(dataset, uniqueId)
  );

  // 计算图例项笛卡尔积之前，限制条目数量
  const colorItemsLen: number = productLength(colorFieldsValues);
  if (
    dataset.length > MAX_POINT_COUNT ||
    (colorItemsLen > LEGEND_MAX_COUNT && dataset.length > LEGEND_MAX_POINT_COUNT)
  ) {
    return {
      error: true,
      errMsg: `数据量或图例项过多，请使用表格展示。`
    };
  }

  // 计算图例项
  const colorItemsList: string[][] = legendProduct(colorFieldsValues, colorFieldsIncludeMeasure);
  let colorItems: string[] = colorItemsList.map(d => d.join('-'));

  // 使用笛卡尔积后的图例项替换原数据中对应的字段
  if (colorFields.length > 0) {
    dataset = dataset.map((data: DataItem) => {
      const colorItem = colorFields.map(field => data[field]).join('-');
      return {
        ...data,
        [COLOR_FIELD]: colorItem
      };
    });
    // 将笛卡尔积后无效的 colorItem 移除
    const _colorItems: string[] = getDomainFromDataset(dataset, COLOR_FIELD);
    colorItems = colorItems.filter((d: string) => _colorItems.includes(d));

    aliasMap[COLOR_FIELD] = `图例项`;
    pieCell.color.push(COLOR_FIELD);
    pieCell.cartesianInfo = getCartesianInfo(colorFields, COLOR_FIELD);

    // 多度量时的平坦化字段
    if (measuresListLength > 1) {
      pieCell.foldInfo = getFoldInfo(measureList, FOLD_NAME, FOLD_VALUE, aliasMap);
    }
  }

  return { pieCell, dataset, colorItems, aliasMap };
};

export const assignMeasureCard = (
  originDataset,
  dimList: UniqueId[],
  measureList: UniqueId[],
  aliasMapOld: AliasMap
) => {
  // eslint-disable-line
  const aliasMap = cloneDeep(aliasMapOld);
  const dataset = cloneDeep(originDataset);

  const cardDataset: Dataset = fold(dataset, measureList, FOLD_NAME, FOLD_VALUE, aliasMap);

  const cardCell: AutoChartCell = {
    x: [],
    y: [],
    row: [],
    column: [],
    color: [FOLD_NAME],
    size: [FOLD_VALUE],
    angle: [],
    value: [FOLD_VALUE],
    text: [FOLD_NAME]
  };

  return { cardCell, dataset: cardDataset };
};

export const assignFunnelChart = (
  originDataset,
  dimList: UniqueId[],
  measureList: UniqueId[],
  aliasMapOld: AliasMap
) => {
  const aliasMap = cloneDeep(aliasMapOld);
  const dataset = cloneDeep(originDataset);

  const funnelCell: AutoChartCell = {
    x: [],
    y: [],
    row: [],
    column: [],
    color: [],
    size: [],
    angle: []
  };

  //不符合最低要求
  if (!((dimList.length === 1 && measureList.length === 1) || (dimList.length === 0 && measureList.length >= 2))) {
    return { funnelCell, dataset };
  }

  const measuresListLength: number = measureList.length;
  if (measuresListLength > 1) {
    // 多度量
    aliasMap[FOLD_NAME] = `指标名称`;
    aliasMap[FOLD_VALUE] = `指标值`;
    funnelCell.size.push(FOLD_VALUE);
    funnelCell.foldInfo = getFoldInfo(measureList, FOLD_NAME, FOLD_VALUE, aliasMap);
  } else if (measuresListLength === 1) {
    // 单度量
    funnelCell.size.push(measureList[0]);
  }

  // 提取color分组字段
  const dimensionIdListLength: number = dimList.length;
  if (dimensionIdListLength > 0) {
    funnelCell.color.push(dimList[0]);
  } else if (dimensionIdListLength === 0 && measuresListLength > 1) {
    funnelCell.size.push(FOLD_NAME);
  }

  return { funnelCell, dataset };
};

export const assignDualAxis = (
  originDataset,
  dimList: UniqueId[],
  measureList: UniqueId[],
  subMeasureList: UniqueId[],
  aliasMapOld: AliasMap
) => {
  const aliasMap = cloneDeep(aliasMapOld);
  let dataset = cloneDeep(originDataset);
  const cell: AutoChartCell = {
    x: [],
    y: [],
    row: [],
    column: [],
    color: [],
    cartesianInfo: null,
    foldInfo: null
  };

  const singleSide = isMain => {
    let _measuresIdList: UniqueId[];
    let removeIdList: UniqueId[];
    let FOLD_VALUE_FIELD: UniqueId;
    let aliasFoldValue: string;

    if (isMain) {
      _measuresIdList = measureList;
      removeIdList = subMeasureList;
      FOLD_VALUE_FIELD = FOLD_VALUE_MAIN;
      aliasFoldValue = `指标值(主轴)`;
    } else {
      _measuresIdList = subMeasureList;
      removeIdList = measureList;
      FOLD_VALUE_FIELD = FOLD_VALUE_SUB;
      aliasFoldValue = `指标值(次轴)`;
    }

    if (_measuresIdList.length === 0) {
      return [];
    }

    //  只保留属于该轴的指标字段
    let sideDataset: Dataset = removeDatasetField(dataset, removeIdList);

    // 无论是否多度量都需要进行平坦化
    sideDataset = fold(sideDataset, _measuresIdList, FOLD_NAME, FOLD_VALUE_FIELD, aliasMap, false);
    aliasMap[FOLD_VALUE_FIELD] = aliasFoldValue;
    cell.y.push(FOLD_VALUE_FIELD);
    return sideDataset;
  };

  // 左右轴依次进行平坦化
  const datasetMain: Dataset = singleSide(true);
  const datasetSub: Dataset = singleSide(false);

  dataset = [].concat(datasetMain, datasetSub);

  const dimensionIdList: UniqueId[] = dimList;
  const measureIdList: UniqueId[] = measureList.concat(subMeasureList);

  // 维度中参与图例项笛卡尔积计算的维度
  const colorFields: UniqueId[] = [];

  if (dimensionIdList.length > 0) {
    // 提取 x 字段（维度第一项）
    cell.x.push(String(dimensionIdList[0]));
    // 其余项参与笛卡尔积计算
    colorFields.push(...dimensionIdList.slice(1));
  }

  const measuresListLength: number = measureIdList.length;
  // 提取 y 字段（度量值）
  if (measuresListLength > 0) {
    aliasMap[FOLD_NAME] = `指标名称`;
    colorFields.push(FOLD_NAME);
  }

  // 提取 color分组字段 （维度其他项 以及 度量名称）
  const colorFieldsValues: string[][] = colorFields.map((uniqueId: UniqueId) =>
    getDomainFromDataset(dataset, uniqueId)
  );

  // 计算图例项笛卡尔积之前，限制条目数量
  const dimItemsLen: number = getDomainFromDataset(dataset, cell.x[0]).length;
  const colorItemsLen: number = productLength(colorFieldsValues);
  if (
    dimItemsLen > X_MAX_COUNT ||
    dataset.length > MAX_POINT_COUNT ||
    (colorItemsLen > LEGEND_MAX_COUNT && dataset.length > LEGEND_MAX_POINT_COUNT)
  ) {
    return {
      error: true,
      errorMsg: `数据量或图例项过多，请使用表格展示。`
    };
  }

  // 计算图例项
  const colorItemsList: string[][] = legendProduct(colorFieldsValues, true);
  let colorItems: string[] = colorItemsList.map(d => d.join('-'));

  // 使用笛卡尔积后的图例项替换原数据中对应的字段
  if (colorFields.length > 0) {
    dataset = dataset.map((data: DataItem) => {
      const colorItem = colorFields.map(field => data[field]).join('-');
      return {
        ...data,
        [COLOR_FIELD]: colorItem
      };
    });
    // 将笛卡尔积后无效的 colorItem 移除
    const _colorItems: string[] = getDomainFromDataset(dataset, COLOR_FIELD);
    colorItems = colorItems.filter((d: string) => _colorItems.includes(d));

    aliasMap[COLOR_FIELD] = `图例项`;
    cell.color.push(COLOR_FIELD);
    cell.cartesianInfo = getCartesianInfo(colorFields, COLOR_FIELD);
    cell.foldInfo = getFoldInfo(measureIdList, FOLD_NAME, [FOLD_VALUE_MAIN, FOLD_VALUE_SUB], aliasMap);
  }

  return {
    dataset,
    cell,
    colorItems,
    aliasMap
  };
};
