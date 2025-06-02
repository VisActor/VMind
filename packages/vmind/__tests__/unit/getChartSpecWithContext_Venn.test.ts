import { builtinThemeMap } from '../../src/atom/chartGenerator/const';
import { BuiltinThemeType } from '../../src/atom/chartGenerator/const';
import { getChartSpecWithContext } from '../../src/atom/chartGenerator/spec';
import { COLOR_THEMES } from '../../src/atom/chartGenerator/spec/constants';
import type { GenerateChartCellContext } from '../../src/atom/chartGenerator/type';
import { ChartType, DataCell } from '../../src/types';

const dataTable_1 = [
  { group: 'A', category: 'A', size: 8 },
  { group: 'B', category: 'B', size: 10 },
  { group: 'C', category: 'C', size: 12 }
];

const datatemplate_1 = {
  values: [
    { sets: ['A'], value: 8 },
    { sets: ['B'], value: 10 },
    { sets: ['C'], value: 12 }
  ]
};

const dataTable_2 = [
  { group: 'A', category: 'A', size: 8 },
  { group: 'B', category: 'B', size: 10 },
  { group: 'C', category: 'C', size: 12 },
  { group: 'A∩B', category: 'A', size: 4 },
  { group: 'A∩B', category: 'B', size: 4 }
];

const datatemplate_2 = {
  values: [
    { sets: ['A'], value: 8 },
    { sets: ['B'], value: 10 },
    { sets: ['C'], value: 12 },
    { sets: ['A', 'B'], value: 4 }
  ]
};

const dataTable_3 = [
  { group: 'A', category: 'A', size: 8 },
  { group: 'B', category: 'B', size: 10 },
  { group: 'C', category: 'C', size: 12 },
  { group: 'A∩B', category: 'A', size: 4 },
  { group: 'A∩B', category: 'B', size: 4 },
  { group: 'A∩C', category: 'A', size: 4 },
  { group: 'A∩C', category: 'C', size: 4 },
  { group: 'B∩C', category: 'B', size: 4 },
  { group: 'B∩C', category: 'C', size: 4 }
];

const datatemplate_3 = {
  values: [
    { sets: ['A'], value: 8 },
    { sets: ['B'], value: 10 },
    { sets: ['C'], value: 12 },
    { sets: ['A', 'B'], value: 4 },
    { sets: ['A', 'C'], value: 4 },
    { sets: ['B', 'C'], value: 4 }
  ]
};

const dataTable_4 = [
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

const datatemplate_4 = {
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

describe('getChartSpecWithContext - Venn Chart', () => {
  it('should generate full spec for venn chart with diverse inputs', () => {
    const context = {
      chartType: ChartType.VennChart.toUpperCase(),
      dataTable: dataTable_4,
      chartTheme: 'semiThemeLight',
      cell: {
        color: ['group', 'category'],
        size: 'size'
      },
      colors: ['#f57c6e', '#f2b56f', '#f2a7da', '#84c3b7', '#88d8db', '#71b7ed', '#b8aeeb', '#f2a7da', '#fae69e'],
      totalTime: 5,
      simpleVChartSpec: {
        type: 'venn',
        legends: [
          { type: 'discrete', orient: 'top' },
          { type: 'discrete', orient: 'bottom' }
        ],
        title: [
          { text: 'Venn Chart-1', orient: 'top' },
          { text: 'Venn Chart-2', orient: 'left' }
        ],
        label: [{ position: 'top', style: { fill: 'black' } }],
        indicator: [
          {
            title: 'Cluster A',
            content: ['Overlap A']
          }
        ],
        palette: ['#123456', '#abcdef'],
        background: '#ffffff'
      }
    };

    const result = getChartSpecWithContext(context);
    //console.log("basic spec", JSON.stringify(result.spec, null, 2));

    expect(result.spec).toBeDefined();
    expect(result.spec.type).toBe('venn');
    expect(result.spec.data).toEqual(datatemplate_4);
    expect(result.spec.color).toEqual(['#123456', '#abcdef']);
    expect(result.spec.background).toEqual('#ffffff');
    expect(result.spec.legends).toEqual([
      { type: 'discrete', orient: 'top' },
      { type: 'discrete', orient: 'bottom' }
    ]);
    expect(result.spec.title).toEqual([
      { text: 'Venn Chart-1', orient: 'top' },
      { text: 'Venn Chart-2', orient: 'left' }
    ]);
    expect(result.spec.label).toEqual([{ position: 'top', style: { fill: 'black' }, visible: true }]);
    expect(result.spec.indicator).toEqual([
      {
        title: { style: { text: 'Cluster A' } },
        content: [{ style: { text: 'Overlap A' } }]
      }
    ]);
    expect(result.spec.valueField).toEqual('value');
    expect(result.spec.categoryField).toEqual('sets');
    expect(result.spec.seriesField).toEqual('sets');
    expect(result.spec.theme).toEqual(builtinThemeMap[BuiltinThemeType.SemiThemeLight]);
  });

  it('should apply default colors if colors and palette are not given', () => {
    const context = {
      chartType: ChartType.VennChart.toUpperCase(),
      dataTable: dataTable_1,
      cell: {
        color: ['group', 'category'],
        size: 'size'
      }
    };

    const result = getChartSpecWithContext(context);

    expect(result.spec.color).toBeDefined();
    expect(result.spec.color).toEqual(COLOR_THEMES.default);
  });

  it('test different dataTable - dataTable2', () => {
    const context = {
      chartType: ChartType.VennChart.toUpperCase(),
      dataTable: dataTable_2,
      cell: {
        color: ['group', 'category'],
        size: 'size'
      }
    };

    const result = getChartSpecWithContext(context);
    expect(result.spec).toBeDefined();
    expect(result.spec.type).toBe('venn');
    expect(result.spec.data).toEqual(datatemplate_2);
  });

  it('test different dataTable - dataTable3', () => {
    const context = {
      chartType: ChartType.VennChart.toUpperCase(),
      dataTable: dataTable_3,
      cell: {
        color: ['group', 'category'],
        size: 'size'
      }
    };

    const result = getChartSpecWithContext(context);
    expect(result.spec).toBeDefined();
    expect(result.spec.type).toBe('venn');
    expect(result.spec.data).toEqual(datatemplate_3);
  });

  it('should apply custom colors if colors are given', () => {
    const context = {
      chartType: ChartType.VennChart.toUpperCase(),
      dataTable: dataTable_1,
      cell: {
        color: ['group', 'category'],
        size: 'size'
      },
      colors: ['#f57c6e', '#f2b56f', '#f2a7da', '#84c3b7', '#88d8db', '#71b7ed', '#b8aeeb', '#f2a7da', '#fae69e']
    };

    const result = getChartSpecWithContext(context);

    expect(result.spec.color).toBeDefined();
    expect(result.spec.color).toEqual([
      '#f57c6e',
      '#f2b56f',
      '#f2a7da',
      '#84c3b7',
      '#88d8db',
      '#71b7ed',
      '#b8aeeb',
      '#f2a7da',
      '#fae69e'
    ]);
  });

  it('should apply string theme and colors are undefined', () => {
    const context = {
      chartType: ChartType.VennChart.toUpperCase(),
      dataTable: dataTable_1,
      cell: {
        color: ['group', 'category'],
        size: 'size'
      },
      chartTheme: 'semiThemeLight',
      colors: ['#f57c6e', '#f2b56f', '#f2a7da', '#84c3b7', '#88d8db', '#71b7ed', '#b8aeeb', '#f2a7da', '#fae69e']
    };

    const result = getChartSpecWithContext(context);
    expect(result.spec.theme).toEqual(builtinThemeMap[BuiltinThemeType.SemiThemeLight]);
    expect(result.spec.color).toBeUndefined();
  });

  it('should apply custom object theme and colors are undefined', () => {
    const context = {
      chartType: ChartType.VennChart.toUpperCase(),
      dataTable: dataTable_1,
      cell: {
        color: ['group', 'category'],
        size: 'size'
      },
      chartTheme: { colorScheme: ['#1a2b3c'] },
      colors: ['#f57c6e', '#f2b56f', '#f2a7da', '#84c3b7', '#88d8db', '#71b7ed', '#b8aeeb', '#f2a7da', '#fae69e']
    };

    const result = getChartSpecWithContext(context);
    expect(result.spec.theme).toEqual({ colorScheme: ['#1a2b3c'] });
    expect(result.spec.color).toBeUndefined();
  });

  it('should handle missing dataTable fields gracefully', () => {
    const context = {
      chartType: ChartType.VennChart.toUpperCase(),
      cell: {
        color: ['group', 'category'],
        size: 'size'
      },
      dataTable: [{}]
    };

    const result = getChartSpecWithContext(context);
    //console.log("basic spec", JSON.stringify(result.spec, null, 2));
    expect(result.spec).toBeDefined();
    expect(result.spec.type).toBe('venn');
  });

  // it('should handle missing cell fields gracefully', () => {
  //   const context= {
  //     chartType: ChartType.VennChart.toUpperCase(),
  //     dataTable: dataTable_1,
  //     cell: {}
  //   };

  //   const result = getChartSpecWithContext(context);
  //   console.log("basic spec", JSON.stringify(result.spec, null, 2));
  //   expect(result.spec).toBeDefined();
  //   expect(result.spec.type).toBe('venn');
  // });
});
