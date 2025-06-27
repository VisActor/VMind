import { generateChart } from '../src';
import { SCATTER_DATA_FOUR, SCATTER_DATA_TWO } from './common';

describe('generate scatter chart', () => {
  it('should generate scatter chart', () => {
    const chart = generateChart('scatter', {
      dataTable: SCATTER_DATA_TWO,
      cell: {
        x: 'x',
        y: 'y'
      },
      spec: {}
    });

    expect(chart.spec).toEqual({
      type: 'scatter',
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      axes: [
        { orient: 'bottom', title: { visible: false }, type: 'linear' },
        {
          orient: 'left',
          title: { visible: false },
          type: 'linear'
        }
      ],
      data: { id: 'data', values: SCATTER_DATA_TWO },
      xField: 'x',
      yField: 'y'
    });
  });

  it('should generate scatter chart when has color and size field', () => {
    const chart = generateChart('scatter', {
      dataTable: SCATTER_DATA_FOUR,
      cell: {
        x: 'x',
        y: 'y',
        color: 'group',
        size: 'size'
      },
      spec: {}
    });

    expect(chart.spec).toEqual({
      type: 'scatter',
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      axes: [
        { orient: 'bottom', title: { visible: false }, type: 'linear' },
        {
          orient: 'left',
          title: { visible: false },
          type: 'linear'
        }
      ],
      data: { id: 'data', values: SCATTER_DATA_FOUR },
      xField: 'x',
      yField: 'y',
      seriesField: 'group',
      sizeField: 'size',
      size: {
        type: 'linear'
      },
      legends: [
        {
          item: { visible: true },
          orient: 'right',
          type: 'discrete'
        }
      ]
    });
  });
});
