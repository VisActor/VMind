import { getChartSpecWithContext } from '../../src/atom/chartGenerator/spec';
import { ChartType } from '../../src/types';

const dataTable = [
  { name: 'A', value: 100, value1: 1000 },
  { name: 'B', value: 80, value1: 800 }
];

describe('getChartSpecWithContext - Dual Axis Chart', () => {
  it('should generate correct dual axis spec', () => {
    const context = {
      chartTypeList: Object.values(ChartType),
      dataTable,
      cell: {
        x: 'name',
        y: ['value', 'value1']
      },
      chartType: ChartType.DualAxisChart.toUpperCase(),
      spec: {}
    };

    const { chartType, spec } = getChartSpecWithContext(context);

    expect(chartType).toBe(ChartType.DualAxisChart);
    expect(spec.type).toBe('common');
    expect(spec.series).toHaveLength(2);
    expect(spec.series[0]).toMatchObject({
      type: 'bar',
      id: 'mainSeries',
      xField: 'name',
      yField: 'value'
    });
    expect(spec.series[1]).toMatchObject({
      type: 'line',
      id: 'subSeries',
      xField: 'name',
      yField: 'value1'
    });
    expect(spec.series[0].data.values).toEqual([
      { name: 'A', value: 100, value1: 1000, __VMIND_COLOR__: 'value' },
      { name: 'B', value: 80, value1: 800, __VMIND_COLOR__: 'value' }
    ]);
    expect(spec.series[1].data.values).toEqual([
      { name: 'A', value: 100, value1: 1000, __VMIND_COLOR__: 'value1' },
      { name: 'B', value: 80, value1: 800, __VMIND_COLOR__: 'value1' }
    ]);
    expect(spec.axes).toEqual([
      { id: 'dimensionAxis', type: 'band', orient: 'bottom' },
      { id: 'measureAxisLeft', seriesId: 'mainSeries', type: 'linear', orient: 'left' },
      {
        id: 'measureAxisRight',
        seriesId: 'subSeries',
        type: 'linear',
        orient: 'right',
        tick: { visible: false },
        grid: { visible: false }
      }
    ]);
  });
});
