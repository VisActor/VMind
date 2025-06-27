import { FieldInfoItem } from '../src/types/transform';

export const TWO_FIELD_DATA = [
  { name: 'A', value: 100 },
  { name: 'B', value: 80 }
];

export const TWO_FIELD_INFO: FieldInfoItem[] = [
  {
    fieldName: 'name',
    type: 'string',
    role: 'dimension'
  },
  {
    fieldName: 'value',
    type: 'numerical',
    role: 'measure'
  }
];

export const THREE_FIELD_DATA = [
  { name: 'A', value: 100, group: 'aa' },
  { name: 'B', value: 80, group: 'aa' },
  { name: 'A', value: 80, group: 'bb' },
  { name: 'B', value: 90, group: 'bb' }
];

export const DUAL_AXIS_DATA_THREE = [
  { name: 'A', value: 100, value1: 1000 },
  { name: 'B', value: 80, value1: 800 }
];

export const DUAL_AXIS_DATA_FOUR = [
  { name: 'A', value: 100, value1: 1000, group: 'aa' },
  { name: 'B', value: 80, value1: 800, group: 'aa' },
  { name: 'A', value: 100, value1: 1000, group: 'bb' },
  { name: 'B', value: 80, value1: 800, group: 'bb' }
];

export const THREE_FIELD_DATA_1 = [
  { name: 'A', value: 100, group: 'aa' },
  { name: 'B', value: 80, group: 'bb' }
];

export const THREE_FIELD_INFO: FieldInfoItem[] = [
  {
    fieldName: 'name',
    type: 'string',
    role: 'dimension'
  },
  {
    fieldName: 'group',
    type: 'string',
    role: 'dimension'
  },
  {
    fieldName: 'value',
    type: 'numerical',
    role: 'measure'
  }
];

// 生成一个长度为8的颜色数组用于测试
export const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'];

export const SCATTER_DATA_TWO = [
  { x: 100, y: 100 },
  { x: 200, y: 80 }
];

export const SCATTER_FIELD_INFO: FieldInfoItem[] = [
  {
    fieldName: 'x',
    type: 'numerical',
    role: 'measure'
  },
  {
    fieldName: 'y',
    type: 'numerical',
    role: 'measure'
  }
];

export const SCATTER_DATA_THREE = [
  { x: 100, y: 100, group: 'aa' },
  { x: 200, y: 80, group: 'aa' },
  { x: 100, y: 80, group: 'bb' },
  { x: 200, y: 90, group: 'bb' }
];

export const SCATTER_FIELD_INFO_THREE: FieldInfoItem[] = [
  {
    fieldName: 'x',
    type: 'numerical',
    role: 'measure'
  },
  {
    fieldName: 'y',
    type: 'numerical',
    role: 'measure'
  },
  {
    fieldName: 'group',
    type: 'string',
    role: 'dimension'
  },
  {
    fieldName: 'size',
    type: 'numerical',
    role: 'measure'
  }
];

export const SCATTER_FIELD_INFO_FOUR: FieldInfoItem[] = [
  {
    fieldName: 'x',
    type: 'numerical',
    role: 'measure'
  },
  {
    fieldName: 'y',
    type: 'numerical',
    role: 'measure'
  },
  {
    fieldName: 'group',
    type: 'string',
    role: 'dimension'
  },
  {
    fieldName: 'size',
    type: 'numerical',
    role: 'measure'
  }
];

export const SCATTER_DATA_FOUR = [
  { x: 100, y: 100, size: 10, group: 'aa' },
  { x: 200, y: 80, size: 20, group: 'aa' },
  { x: 100, y: 80, size: 30, group: 'bb' },
  { x: 200, y: 90, size: 40, group: 'bb' }
];

export const RANKING_BAR_DATA = [
  {
    name: 'A',
    value: 100,
    year: '2001'
  },
  {
    name: 'B',
    value: 80,
    year: '2001'
  },
  {
    name: 'A',
    value: 80,
    year: '2002'
  },
  {
    name: 'B',
    value: 90,
    year: '2002'
  }
];

export const SANKEY_DATA = [
  { source: 'a', target: 'b', value: 10 },
  { source: 'b', target: 'c', value: 5 },
  { source: 'a', target: 'c', value: 8 }
];

export const SUNBURST_DATA = [
  { country: 'a', region: 'top', value: 10 },
  { country: 'b', region: 'top', value: 9 },
  { country: 'c', region: 'top', value: 8 },

  { country: 'a', region: 'bottom', value: 7 },
  { country: 'b', region: 'bottom', value: 6 },
  { country: 'c', region: 'bottom', value: 5 }
];

export const TREEMAP_DATA = [
  { country: 'a', region: 'top_a', value: 10 },
  { country: 'b', region: 'top_b', value: 5 },
  { country: 'c', region: 'top_c', value: 8 },

  { country: 'a', region: 'bottom_a', value: 10 },
  { country: 'b', region: 'bottom_b', value: 5 },
  { country: 'c', region: 'bottom_c', value: 8 }
];

export const MAP_DATA = [
  {
    name: 'Russia',
    value: 17234034
  },
  {
    name: 'Canada',
    value: 9984670
  },
  {
    name: 'China',
    value: 9596960
  },
  {
    name: 'United States of America',
    value: 9525067
  },
  {
    name: 'Brazil',
    value: 8515167
  }
];
