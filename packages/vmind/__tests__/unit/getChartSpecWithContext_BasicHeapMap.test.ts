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

const items = [
  'Asset Liability Ratio',
  'Asset Liability Ratio (Deducting Advance Payments)',
  'Debt-to-long Capital Ratio',
  'Long Term Asset Suitability Ratio',
  'Equity Multiplier',
  'Equity Ratio of Current Liability',
  'Interest Bearing Debt / Fully Invested Capital',
  'Current Liability / Total Liabilities',
  'Capital Fixation Ratio',
  'Expected Default Frequency'
];
const rawData = [
  1.0, 0.594527, 0.492963, -0.160995, 0.723664, 0.658646, -0.857474, 0.320706, -0.284634, -0.091423, 0.594527, 1.0,
  0.724546, -0.099318, 0.540639, 0.49214, -0.554039, 0.17127, -0.265259, 0.068577, 0.492963, 0.724546, 1.0, -0.091338,
  0.450542, 0.375839, -0.524955, 0.300627, -0.198362, 0.033209, -0.160995, -0.099318, -0.091338, 1.0, -0.049872,
  -0.028452, 0.157157, 0.009742, -0.162374, 0.155095, 0.723664, 0.540639, 0.450542, -0.049872, 1.0, 0.951933, -0.651767,
  0.079052, -0.535984, 0.00798, 0.658646, 0.49214, 0.375839, -0.028452, 0.951933, 1.0, -0.543147, -0.106139, -0.52232,
  0.011466, -0.857474, -0.554039, -0.524955, 0.157157, -0.651767, -0.543147, 1.0, -0.595016, 0.310521, 0.066397,
  0.320706, 0.17127, 0.300627, 0.009742, 0.079052, -0.106139, -0.595016, 1.0, -0.105199, -0.064886, -0.284634,
  -0.265259, -0.198362, -0.162374, -0.535984, -0.52232, 0.310521, -0.105199, 1.0, -0.080153, -0.091423, 0.068577,
  0.033209, 0.155095, 0.00798, 0.011466, 0.066397, -0.064886, -0.080153, 1.0
];
interface DataPoint {
  var1: string;
  var2: string;
  value: number;
}
const data: DataPoint[] = [];
for (let i = 0; i < items.length; i++) {
  for (let j = 0; j < items.length; j++) {
    data.push({
      var1: items[i],
      var2: items[j],
      value: rawData[i * items.length + j]
    });
  }
}

describe('getChartSpecWithContext', () => {
  it('should generate full spec for heapmap chart with simpleVChartSpec', () => {
    //console.log("data",data);
    const context = {
      chartTypeList: CHART_TYPE_LIST,
      cell: { x: 'var1', y: 'var2', size: 'value' },
      dataTable: data,
      chartType: ChartType.BasicHeatMap.toUpperCase(),
      colors: ['#f57c6e', '#f2b56f', '#f2a7da', '#84c3b7', '#88d8db', '#71b7ed', '#b8aeeb', '#f2a7da', '#fae69e'],
      totalTime: 5,
      simpleVChartSpec: {
        type: 'heatmap',
        legends: [
          {
            visible: true,
            orient: 'right',
            position: 'start',
            type: 'color',
            field: 'value'
          }
        ],
        title: [{ text: 'Correlation Coefficient', orient: 'top' }],
        dataZoom: [{ orient: 'left' }, { orient: 'bottom' }],
        axes: [
          {
            type: 'band',
            orient: 'bottom',
            hasGrid: false
          },
          {
            type: 'band',
            orient: 'left',
            hasGrid: false
          }
        ],
        indicator: [
          {
            title: 'Cluster A',
            content: ['Overlap A']
          }
        ],
        background: '#ffffff'
      }
    };
    const result = getChartSpecWithContext(context);
    //console.log("basic spec", JSON.stringify(result.spec, null, 2));

    expect(result.spec).toBeDefined();
    expect(result.spec.type).toBe('heatmap');
    expect(result.spec.data[0].values).toEqual(data);
  });

  it('should generate full spec for heapmap chart without simpleVChartSpec', () => {
    const context = {
      chartTypeList: CHART_TYPE_LIST,
      cell: { x: 'var1', y: 'var2', size: 'value' },
      dataTable: data,
      chartType: ChartType.BasicHeatMap.toUpperCase(),
      colors: ['#f57c6e', '#f2b56f', '#f2a7da', '#84c3b7', '#88d8db', '#71b7ed', '#b8aeeb', '#f2a7da', '#fae69e'],
      totalTime: 5
    };
    const result = getChartSpecWithContext(context);
    //console.log("basic spec", JSON.stringify(result.spec, null, 2));

    expect(result.spec).toBeDefined();
    expect(result.spec.type).toBe('heatmap');
    expect(result.spec.data[0].values).toEqual(data);
  });

  it('should apply string theme and colors are undefined', () => {
    const context = {
      chartTypeList: CHART_TYPE_LIST,
      cell: { x: 'var1', y: 'var2', size: 'value' },
      dataTable: data,
      chartType: ChartType.BasicHeatMap.toUpperCase(),
      colors: ['#f57c6e', '#f2b56f', '#f2a7da', '#84c3b7', '#88d8db', '#71b7ed', '#b8aeeb', '#f2a7da', '#fae69e'],
      chartTheme: 'semiThemeLight',
      totalTime: 5
    };

    const result = getChartSpecWithContext(context);
    expect(result.spec.theme).toEqual(builtinThemeMap[BuiltinThemeType.SemiThemeLight]);
    expect(result.spec.color).toBeUndefined();
  });

  it('should apply custom object theme and colors are undefined', () => {
    const context = {
      chartTypeList: CHART_TYPE_LIST,
      cell: { x: 'var1', y: 'var2', size: 'value' },
      dataTable: data,
      chartType: ChartType.BasicHeatMap.toUpperCase(),
      colors: ['#f57c6e', '#f2b56f', '#f2a7da', '#84c3b7', '#88d8db', '#71b7ed', '#b8aeeb', '#f2a7da', '#fae69e'],
      chartTheme: { colorScheme: ['#1a2b3c'] },
      totalTime: 5
    };

    const result = getChartSpecWithContext(context);
    expect(result.spec.theme).toEqual({ colorScheme: ['#1a2b3c'] });
    expect(result.spec.color).toBeUndefined();
  });

  it('should handle missing dataTable fields gracefully', () => {
    const context = {
      chartTypeList: CHART_TYPE_LIST,
      cell: { x: 'var1', y: 'var2', size: 'value' },
      dataTable: [{}],
      chartType: ChartType.BasicHeatMap.toUpperCase(),
      colors: ['#f57c6e', '#f2b56f', '#f2a7da', '#84c3b7', '#88d8db', '#71b7ed', '#b8aeeb', '#f2a7da', '#fae69e'],
      chartTheme: { colorScheme: ['#1a2b3c'] },
      totalTime: 5
    };

    const result = getChartSpecWithContext(context);
    //console.log("basic spec", JSON.stringify(result.spec, null, 2));
    expect(result.spec).toBeDefined();
    expect(result.spec.type).toBe('heatmap');
  });

  it('should handle missing cell fields gracefully', () => {
    const context = {
      chartTypeList: CHART_TYPE_LIST,
      cell: {},
      dataTable: data,
      chartType: ChartType.BasicHeatMap.toUpperCase(),
      colors: ['#f57c6e', '#f2b56f', '#f2a7da', '#84c3b7', '#88d8db', '#71b7ed', '#b8aeeb', '#f2a7da', '#fae69e'],
      chartTheme: { colorScheme: ['#1a2b3c'] },
      totalTime: 5
    };

    const result = getChartSpecWithContext(context);
    //console.log("basic spec", JSON.stringify(result.spec, null, 2));
    expect(result.spec).toBeDefined();
    expect(result.spec.type).toBe('heatmap');
  });
});
