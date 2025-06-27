import { generateChart } from '../src';
import { DUAL_AXIS_DATA_FOUR, DUAL_AXIS_DATA_THREE, THREE_FIELD_DATA } from './common';

describe('generate dual axis chart', () => {
  it('should generate a common chart with line and bar', () => {
    const chart = generateChart('dual_axis', {
      dataTable: DUAL_AXIS_DATA_THREE,
      cell: {
        x: 'name',
        y: ['value', 'value1']
      },
      spec: {
        x: 'name'
      }
    });

    expect(chart.spec).toEqual({
      type: 'common',
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      series: [
        {
          type: 'bar',
          id: 'mainSeries',
          data: {
            id: 'data_bar',
            values: [
              {
                name: 'A',
                value: 100,
                value1: 1000,
                __VMIND_COLOR__: 'value'
              },
              {
                name: 'B',
                value: 80,
                value1: 800,
                __VMIND_COLOR__: 'value'
              }
            ]
          },
          dataIndex: 0,
          label: {
            visible: true
          },
          xField: 'name',
          yField: 'value',
          seriesField: '__VMIND_COLOR__'
        },
        {
          type: 'line',
          id: 'subSeries',
          dataIndex: 0,
          data: {
            id: 'data_line',
            values: [
              {
                name: 'A',
                value: 100,
                value1: 1000,
                __VMIND_COLOR__: 'value1'
              },
              {
                name: 'B',
                value: 80,
                value1: 800,
                __VMIND_COLOR__: 'value1'
              }
            ]
          },
          label: {
            visible: true
          },
          xField: 'name',
          yField: 'value1',
          seriesField: '__VMIND_COLOR__'
        }
      ],
      labelLayout: 'region',
      axes: [
        {
          id: 'dimensionAxis',
          type: 'band',
          orient: 'bottom'
        },
        {
          id: 'measureAxisLeft',
          seriesId: 'mainSeries',
          type: 'linear',
          orient: 'left'
        },
        {
          id: 'measureAxisRight',
          seriesId: 'subSeries',
          type: 'linear',
          orient: 'right',
          tick: {
            visible: false
          },
          grid: {
            visible: false
          }
        }
      ],
      legends: [
        {
          orient: 'right',
          type: 'discrete',
          item: {
            visible: true
          }
        }
      ]
    });
  });

  it('should generate a common chart with line and bar', () => {
    const chart = generateChart('dual_axis', {
      dataTable: DUAL_AXIS_DATA_FOUR,
      cell: {
        x: 'name',
        y: ['value', 'value1'],
        color: 'group'
      },
      spec: {
        x: 'name'
      }
    });

    expect(chart.spec).toEqual({
      type: 'common',
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      series: [
        {
          type: 'bar',
          id: 'mainSeries',
          data: {
            id: 'data_bar',
            values: [
              { name: 'A', value: 100, value1: 1000, group: 'aa' },
              { name: 'B', value: 80, value1: 800, group: 'aa' },
              { name: 'A', value: 100, value1: 1000, group: 'bb' },
              { name: 'B', value: 80, value1: 800, group: 'bb' }
            ]
          },
          dataIndex: 0,
          label: { visible: true },
          xField: 'name',
          yField: 'value',
          seriesField: 'group'
        },
        {
          type: 'line',
          id: 'subSeries',
          dataIndex: 0,
          data: {
            id: 'data_line',
            values: [
              { name: 'A', value: 100, value1: 1000, group: 'aa' },
              { name: 'B', value: 80, value1: 800, group: 'aa' },
              { name: 'A', value: 100, value1: 1000, group: 'bb' },
              { name: 'B', value: 80, value1: 800, group: 'bb' }
            ]
          },
          label: { visible: true },
          xField: 'name',
          yField: 'value1',
          seriesField: 'group'
        }
      ],
      labelLayout: 'region',
      axes: [
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
      ],
      legends: [{ orient: 'right', type: 'discrete', item: { visible: true } }]
    });
  });
});
