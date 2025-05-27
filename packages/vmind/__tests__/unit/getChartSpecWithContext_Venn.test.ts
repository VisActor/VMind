import { Dict } from '@visactor/vutils';
import { getChartSpecWithContext } from '../../src/atom/chartGenerator/spec';
import type { GenerateChartCellContext } from '../../src/atom/chartGenerator/type';
import { ChartType } from '../../src/types';

const CHART_TYPE_LIST = [
  'Bar Chart',
  'Line Chart',
  'Area Chart',
  'Pie Chart',
  'Scatter Plot',
  'Word Cloud',
  'Rose Chart',
  'Radar Chart',
  'Sankey Chart',
  'Funnel Chart',
  'Dual Axis Chart',
  'Waterfall Chart',
  'Box Plot',
  'Linear Progress chart',
  'Circular Progress chart',
  'Liquid Chart',
  'Bubble Circle Packing',
  'Map Chart',
  'Range Column Chart',
  'Sunburst Chart',
  'Treemap Chart',
  'Gauge Chart',
  'Basic Heat Map',
  'Venn Chart',
  'Dynamic Bar Chart'
];

const dataTable = [
  // 单元素集合（A, B, C）
  { group: 'A', category: 'A', size: 8 },
  { group: 'B', category: 'B', size: 10 },
  { group: 'C', category: 'C', size: 12 },

  // 两元素交集（A∩B, A∩C, B∩C）
  { group: 'A∩B', category: 'A', size: 4 },
  { group: 'A∩B', category: 'B', size: 4 },

  { group: 'A∩C', category: 'A', size: 4 },
  { group: 'A∩C', category: 'C', size: 4 },

  { group: 'B∩C', category: 'B', size: 4 },
  { group: 'B∩C', category: 'C', size: 4 },

  // 三元素交集（A∩B∩C）
  { group: 'A∩B∩C', category: 'A', size: 2 },
  { group: 'A∩B∩C', category: 'B', size: 2 },
  { group: 'A∩B∩C', category: 'C', size: 2 }
];

const datatemplate = {
  values: [
    { sets: ['A'], value: 8 },
    { sets: ['B'], value: 10 },
    { sets: ['C'], value: 12 },
    { sets: ['A', 'B'], value: 4 },
    { sets: ['A', 'C'], value: 4 },
    { sets: ['B', 'C'], value: 4 },
    { sets: ['A', 'B', 'C'], value: 2 }
  ]
};

const color = ['#f57c6e', '#f2b56f', '#f2a7da', '#84c3b7', '#88d8db', '#71b7ed', '#b8aeeb', '#f2a7da', '#fae69e'];

describe('getChartSpecWithContext', () => {
  it('should generate correct basic Venn Chart spec', () => {
    //console.log("data",data);
    const context = {
      chartTypeList: CHART_TYPE_LIST,
      transpose: false,
      command: 'Generate a Venn chart',
      cell: { size: 'size', color: ['group', 'category'] },
      dataTable: dataTable,
      chartType: ChartType.VennChart.toUpperCase(),
      colors: color
    };
    const { chartType, spec } = getChartSpecWithContext(context);
    //console.log("basic spec", JSON.stringify(spec, null, 2));
    expect(chartType).toBe(ChartType.VennChart);
    expect(spec.type).toBe('venn');
    expect(spec.data).toEqual(datatemplate);
    expect(spec.color).toEqual(color);
  });
});
