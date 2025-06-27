import { getChartSpecWithContext } from '../../src/atom/chartGenerator/spec';
import { ChartType, DataType, ROLE } from '../../src/types';

const dataTable = [
  {
    category: 'Sub-Saharan Africa',
    min: 8.72,
    q1: 9.73,
    median: 10.17,
    q3: 10.51,
    max: 11.64
  },
  {
    category: 'South Asia',
    min: 9.4,
    q1: 10.06,
    median: 10.75,
    q3: 11.56,
    max: 12.5
  },
  {
    category: 'Middle East & North Africa',
    min: 9.54,
    q1: 10.6,
    median: 11.05,
    q3: 11.5,
    max: 11.92
  },
  {
    category: 'Latin America & Caribbean',
    min: 8.74,
    q1: 9.46,
    median: 10.35,
    q3: 10.94,
    max: 12.21
  },
  {
    category: 'East Asia & Pacific',
    min: 7.8,
    q1: 8.95,
    median: 10.18,
    q3: 11.57,
    max: 13.25
  },
  {
    category: 'Europe & Central Asia',
    min: 9.52,
    q1: 10.39,
    median: 10.93,
    q3: 11.69,
    max: 12.63
  }
];

describe('getChartSpecWithContext', () => {
  it('should generate correct Box Plot spec', () => {
    const context = {
      chartTypeList: Object.values(ChartType),
      dataTable: dataTable,
      transpose: false,
      command: 'Generate a Box Plot',
      fieldInfo: [
        {
          fieldName: 'category',
          type: DataType.STRING,
          role: ROLE.DIMENSION
        },
        {
          fieldName: 'min',
          type: DataType.FLOAT,
          role: ROLE.MEASURE
        },
        {
          fieldName: 'q1',
          type: DataType.FLOAT,
          role: ROLE.MEASURE
        },
        {
          fieldName: 'median',
          type: DataType.FLOAT,
          role: ROLE.MEASURE
        },
        {
          fieldName: 'q3',
          type: DataType.FLOAT,
          role: ROLE.MEASURE
        },
        {
          fieldName: 'max',
          type: DataType.FLOAT,
          role: ROLE.MEASURE
        }
      ],
      cell: {
        x: 'category',
        y: ['min', 'q1', 'median', 'q3', 'max']
      },
      chartType: ChartType.BoxPlot.toUpperCase(),
      spec: {
        type: 'boxPlot'
      }
    };
    const { chartType, spec } = getChartSpecWithContext(context);

    // 基本验证
    expect(chartType).toBe(ChartType.BoxPlot);
    expect(spec.type).toBe('boxPlot');

    // 箱形图特有字段验证
    expect(spec.xField).toBe('category');
    expect(spec.minField).toBe('min');
    expect(spec.q1Field).toBe('q1');
    expect(spec.medianField).toBe('median');
    expect(spec.q3Field).toBe('q3');
    expect(spec.maxField).toBe('max');

    // 数据验证
    expect(spec.data.values).toEqual(dataTable);
  });
});
