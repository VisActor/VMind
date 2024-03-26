import { UniqueId } from './type';
//后端传来的平坦化数据集中，和前端的设置不一致
export const FOLD_NAME: UniqueId = 10001;
export const FOLD_VALUE: UniqueId = 10002;
export const FOLD_VALUE_MAIN: UniqueId = 10011;
export const FOLD_VALUE_SUB: UniqueId = 10012;

export const COLOR_FIELD: UniqueId = 20001;
export const GROUP_FIELD: UniqueId = 30001;

// export const MAX_PIVOT_ROW: number = 0   //允许的最大透视行数
// export const MAX_PIVOT_COLUMN: number = 0 //允许的最大透视列数

// X轴刻度数
export const X_MAX_COUNT = 5000;
// 数据点数
export const MAX_POINT_COUNT = 100000;
// 图例个数
export const LEGEND_MAX_COUNT = 1000;
// 图例个数超过时数据点的限制
export const LEGEND_MAX_POINT_COUNT = 200;

export const MIN_BAR_NUMBER = 2;
export const MAX_BAR_NUMBER = 30;

export const APPLY_PIVOT = false; //透视开关
