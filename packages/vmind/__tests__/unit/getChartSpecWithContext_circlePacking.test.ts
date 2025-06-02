import { Dict } from '@visactor/vutils';
import { getChartSpecWithContext } from '../../src/atom/chartGenerator/spec';
import type { GenerateChartCellContext } from '../../src/atom/chartGenerator/type';
import { ChartType } from '../../src/types';
import { builtinThemeMap } from '../../src/atom/chartGenerator/const';
import { BuiltinThemeType } from '../../src/atom/chartGenerator/const';
import { COLOR_THEMES } from '../../src/atom/chartGenerator/spec/constants';

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

const generateRandomValue = (min = 100, max = 2000) => Math.floor(Math.random() * (max - min + 1)) + min;

function generateDataStructure() {
  const createProducts = () => [
    { name: 'Office Supplies', value: generateRandomValue() },
    { name: 'Furniture', value: generateRandomValue() },
    { name: 'Electronic equipment', value: generateRandomValue() }
  ];

  const createRegions = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      name: `Region${i + 1}`,
      children: createProducts()
    }));

  const createCountries = (names: string[]) =>
    names.map(country => ({
      name: country,
      children: createRegions(6) // 每个国家6个地区
    }));

  return [
    {
      name: 'root',
      children: createCountries(['Country A', 'Country B', 'Country C'])
    }
  ];
}
const dataItem = generateDataStructure();
//console.log("dataItem", JSON.stringify(dataItem, null, 2));

describe('getChartSpecWithContext', () => {
  it('should generate full spec for circlepacking chart with diverse inputs', () => {
    //console.log("data",data);
    const context = {
      chartTypeList: CHART_TYPE_LIST,
      cell: { x: 'name', size: 'value' },
      dataTable: dataItem,
      chartType: ChartType.BubbleCirclePacking.toUpperCase(),
      chartTheme: 'semiThemeLight',
      colors: ['#f57c6e', '#f2b56f', '#f2a7da', '#84c3b7', '#88d8db', '#71b7ed', '#b8aeeb', '#f2a7da', '#fae69e'],
      totalTime: 5,
      simpleVChartSpec: {
        type: 'circlePacking',
        title: [
          { text: 'CirclePacking Chart-1', orient: 'top' },
          { text: 'CirclePacking Chart-2', orient: 'left' }
        ],
        dataZoom: [{ orient: 'left' }, { orient: 'bottom' }],
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
    expect(result.spec.type).toBe('circlePacking');
    expect(result.spec.data.values).toEqual(dataItem);
    expect(result.spec.color).toEqual(['#123456', '#abcdef']);
    expect(result.spec.background).toEqual('#ffffff');
    expect(result.spec.title).toEqual([
      { text: 'CirclePacking Chart-1', orient: 'top' },
      { text: 'CirclePacking Chart-2', orient: 'left' }
    ]);
    expect(result.spec.label).toEqual([{ position: 'top', style: { fill: 'black' }, visible: true }]);
    expect(result.spec.indicator).toEqual([
      {
        title: { style: { text: 'Cluster A' } },
        content: [{ style: { text: 'Overlap A' } }]
      }
    ]);
    expect(result.spec.dataZoom).toEqual([{ orient: 'left' }, { orient: 'bottom' }]);
    expect(result.spec.valueField).toEqual('value');
    expect(result.spec.categoryField).toEqual('name');
    expect(result.spec.drill).toEqual(true);
    expect(result.spec.layoutPadding).toEqual(5);
    expect(result.spec.animationEnter).toEqual({ easing: 'cubicInOut' });
    expect(result.spec.animationExit).toEqual({ easing: 'cubicInOut' });
    expect(result.spec.animationUpdate).toEqual({ easing: 'cubicInOut' });
    expect(result.spec.theme).toEqual(builtinThemeMap[BuiltinThemeType.SemiThemeLight]);
  });

  it('should apply default colors if colors and palette are not given', () => {
    //console.log("data",data);
    const context = {
      chartTypeList: CHART_TYPE_LIST,
      cell: { x: 'name', size: 'value' },
      dataTable: dataItem,
      chartType: ChartType.BubbleCirclePacking.toUpperCase()
    };
    const result = getChartSpecWithContext(context);

    expect(result.spec.color).toBeDefined();
    expect(result.spec.color).toEqual(COLOR_THEMES.default);
  });

  it('should apply custom colors if colors are given', () => {
    //console.log("data",data);
    const context = {
      chartTypeList: CHART_TYPE_LIST,
      cell: { x: 'name', size: 'value' },
      dataTable: dataItem,
      chartType: ChartType.BubbleCirclePacking.toUpperCase(),
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
      chartTypeList: CHART_TYPE_LIST,
      cell: { x: 'name', size: 'value' },
      dataTable: dataItem,
      chartType: ChartType.BubbleCirclePacking.toUpperCase(),
      chartTheme: 'semiThemeLight',
      colors: ['#f57c6e', '#f2b56f', '#f2a7da', '#84c3b7', '#88d8db', '#71b7ed', '#b8aeeb', '#f2a7da', '#fae69e']
    };

    const result = getChartSpecWithContext(context);
    expect(result.spec.theme).toEqual(builtinThemeMap[BuiltinThemeType.SemiThemeLight]);
    expect(result.spec.color).toBeUndefined();
  });

  it('should apply custom object theme and colors are undefined', () => {
    const context = {
      chartTypeList: CHART_TYPE_LIST,
      cell: { x: 'name', size: 'value' },
      dataTable: dataItem,
      chartType: ChartType.BubbleCirclePacking.toUpperCase(),
      chartTheme: { colorScheme: ['#1a2b3c'] },
      colors: ['#f57c6e', '#f2b56f', '#f2a7da', '#84c3b7', '#88d8db', '#71b7ed', '#b8aeeb', '#f2a7da', '#fae69e']
    };

    const result = getChartSpecWithContext(context);
    expect(result.spec.theme).toEqual({ colorScheme: ['#1a2b3c'] });
    expect(result.spec.color).toBeUndefined();
  });

  it('should generate correct bubble circle packing spec', () => {
    const buble_data = new Array(19).fill(0).map((_, i) => {
      return {
        name: `bubble-${i + 1}`,
        value: i + 1
      };
    });
    const context = {
      chartTypeList: CHART_TYPE_LIST,
      transpose: false,
      command: 'Generate a Bubble Circle Packing chart',
      cell: { x: 'name', size: 'value' },
      dataTable: buble_data,
      chartType: ChartType.BubbleCirclePacking.toUpperCase()
    };
    const { chartType, spec } = getChartSpecWithContext(context);
    //console.log("bubble spec", JSON.stringify(spec, null, 2));
    expect(chartType).toBe(ChartType.BubbleCirclePacking);
    expect(spec.type).toBe('circlePacking');
    expect(spec.data.values).toEqual(buble_data);
  });

  it('should generate correct nulti-root circle packing spec', () => {
    const multi_root_data = dataItem[0].children;
    const context = {
      chartTypeList: CHART_TYPE_LIST,
      transpose: false,
      command: 'Generate a Multi-root Circle Packing chart',
      cell: { x: 'name', size: 'value' },
      dataTable: multi_root_data,
      chartType: ChartType.BubbleCirclePacking.toUpperCase()
    };
    const { chartType, spec } = getChartSpecWithContext(context);
    //console.log("multi-root spec", JSON.stringify(spec, null, 2));
    expect(chartType).toBe(ChartType.BubbleCirclePacking);
    expect(spec.type).toBe('circlePacking');
    expect(spec.data.values).toEqual(multi_root_data);
  });

  it('should handle missing dataTable fields gracefully', () => {
    const context = {
      chartType: ChartType.BubbleCirclePacking.toUpperCase(),
      cell: { x: 'name', size: 'value' },
      dataTable: [{}]
    };

    const result = getChartSpecWithContext(context);
    //console.log("basic spec", JSON.stringify(result.spec, null, 2));
    expect(result.spec).toBeDefined();
    expect(result.spec.type).toBe('circlePacking');
  });

  it('should handle missing cell fields gracefully', () => {
    const context = {
      chartType: ChartType.BubbleCirclePacking.toUpperCase(),
      cell: { x: 'name', size: 'value' },
      dataTable: dataItem
    };

    const result = getChartSpecWithContext(context);
    //console.log("basic spec", JSON.stringify(result.spec, null, 2));
    expect(result.spec).toBeDefined();
    expect(result.spec.type).toBe('circlePacking');
  });
});
