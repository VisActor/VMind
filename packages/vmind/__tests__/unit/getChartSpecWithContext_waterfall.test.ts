import { getChartSpecWithContext } from '../../src/atom/chartGenerator/spec';
import { ChartType } from '../../src/types';

describe('getChartSpecWithContext - Waterfall Chart', () => {
  it('should generate correct Waterfall spec', () => {
    const context = {
      chartType: ChartType.WaterFallChart.toUpperCase(),
      dataTable: [
        {
          date: 'Feb.11',
          sales: 5
        },
        {
          date: 'Feb.20',
          sales: 2
        },
        {
          date: 'Feb.25',
          sales: -2
        },
        {
          date: 'Mar.4',
          sales: 2
        },
        {
          date: 'Mar.11',
          sales: 2
        },
        {
          date: 'Mar.19',
          sales: 5
        },
        {
          date: 'Mar.26',
          sales: 1
        },
        {
          date: 'Apr.1',
          sales: 1
        },
        {
          date: 'Apr.8',
          sales: 1
        },
        {
          date: 'Apr.15',
          sales: 2
        },
        {
          date: 'Apr.22',
          sales: 1
        },
        {
          date: 'Apr.29',
          sales: -2
        },
        {
          date: 'May.6',
          sales: -1
        }
      ],
      cell: { x: 'date', y: 'sales' }
    };

    const result = getChartSpecWithContext(context);

    // 基本验证
    expect(result.spec).toBeDefined();
    expect(result.spec.type).toBe('waterfall');

    // 瀑布图特有字段验证
    expect(result.spec.xField).toBe('date');
    expect(result.spec.yField).toBe('sales');

    // 总计配置验证
    expect(result.spec.total).toBeDefined();
    expect(result.spec.total.type).toBe('end');
    expect(result.spec.total.text).toBe('总计');

    // 坐标轴验证
    expect(result.spec.axes).toBeDefined();
    expect(result.spec.axes).toHaveLength(2);
    expect(result.spec.axes[0].orient).toBe('left');
    expect(result.spec.axes[1].orient).toBe('bottom');

    // 堆叠标签验证
    expect(result.spec.stackLabel).toBeDefined();
    expect(result.spec.stackLabel.valueType).toBe('absolute');

    // 数据验证
    expect(result.spec.data.values).toEqual(context.dataTable);
  });

  it('should handle empty dataTable gracefully', () => {
    const context = {
      chartType: ChartType.WaterFallChart.toUpperCase(),
      dataTable: [] as any[],
      cell: { x: 'date', y: 'sales' }
    };

    const result = getChartSpecWithContext(context);
    expect(result.spec).toBeDefined();
    expect(result.spec.type).toBe('waterfall');
  });

  it('should handle missing cell fields gracefully', () => {
    const context = {
      chartType: ChartType.WaterFallChart.toUpperCase(),
      dataTable: [
        {
          date: 'Feb.11',
          sales: 5
        }
      ],
      cell: {}
    };

    const result = getChartSpecWithContext(context);
    expect(result.spec).toBeDefined();
    expect(result.spec.type).toBe('waterfall');
  });
});
