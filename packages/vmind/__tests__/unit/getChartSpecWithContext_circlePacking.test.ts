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
  it('should generate correct basic circle packing spec', () => {
    //console.log("data",data);
    const context = {
      chartTypeList: CHART_TYPE_LIST,
      transpose: false,
      command: 'Generate a BasicCircle Packing chart',
      cell: { x: 'name', size: 'value' },
      dataTable: dataItem,
      chartType: ChartType.BubbleCirclePacking.toUpperCase()
    };
    const { chartType, spec } = getChartSpecWithContext(context);
    //console.log("basic spec", JSON.stringify(spec, null, 2));
    expect(chartType).toBe(ChartType.BubbleCirclePacking);
    expect(spec.type).toBe('circlePacking');
    expect(spec.data.values).toEqual(dataItem);
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
});
