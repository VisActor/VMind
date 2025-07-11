import { generateChart } from '../../src';
import { COLORS, THREE_FIELD_DATA, THREE_FIELD_DATA_1, TWO_FIELD_DATA } from '../common';

describe('generate line chart of dataTable which has two field', () => {
  it('should generate line chart', () => {
    const { spec } = generateChart('line', {
      dataTable: TWO_FIELD_DATA,
      cell: {
        x: 'name',
        y: 'value'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'line',
      data: {
        id: 'data',
        values: TWO_FIELD_DATA
      },

      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      xField: 'name',
      yField: 'value',
      axes: [
        {
          orient: 'bottom',
          type: 'band',
          title: {
            visible: false
          }
        },
        {
          orient: 'left',
          type: 'linear',
          title: {
            visible: false
          }
        }
      ]
    });
  });

  it('should not generate gradient color when has colors', () => {
    const { spec } = generateChart('line', {
      dataTable: TWO_FIELD_DATA,

      cell: {
        x: 'name',
        y: 'value'
      },
      colors: COLORS,
      spec: {}
    });

    expect(spec).toEqual({
      type: 'line',
      axes: [
        { orient: 'bottom', title: { visible: false }, type: 'band' },
        { orient: 'left', title: { visible: false }, type: 'linear' }
      ],
      data: {
        id: 'data',
        values: TWO_FIELD_DATA
      },
      color: COLORS,
      xField: 'name',
      yField: 'value'
    });
  });

  it('should not add color when specify chartTheme', () => {
    const { spec } = generateChart('line', {
      dataTable: TWO_FIELD_DATA,

      cell: {
        x: 'name',
        y: 'value',
        color: 'name'
      },
      chartTheme: 'dark',
      spec: {}
    });

    expect(spec).toEqual({
      type: 'line',
      axes: [
        { orient: 'bottom', title: { visible: false }, type: 'band' },
        { orient: 'left', title: { visible: false }, type: 'linear' }
      ],
      theme: 'dark',
      data: {
        id: 'data',
        values: TWO_FIELD_DATA
      },
      legends: [
        {
          item: { visible: true },
          orient: 'right',
          type: 'discrete'
        }
      ],
      seriesField: 'name',
      xField: 'name',
      yField: 'value'
    });
  });

  // expect(JSON.stringify(spec)).toEqual('');

  it('should not generate horizontal chart', () => {
    const { spec } = generateChart('line', {
      dataTable: TWO_FIELD_DATA,

      cell: {
        x: 'name',
        y: 'value'
      },
      transpose: true,
      colors: COLORS,
      spec: {}
    });

    expect(spec).toEqual({
      type: 'line',
      axes: [
        { orient: 'bottom', title: { visible: false }, type: 'band' },
        { orient: 'left', title: { visible: false }, type: 'linear' }
      ],
      color: COLORS,
      data: {
        id: 'data',
        values: TWO_FIELD_DATA
      },
      xField: 'name',
      yField: 'value'
    });
  });

  it('should not generate stacked line chart when has not group field', () => {
    const { spec } = generateChart('line', {
      dataTable: TWO_FIELD_DATA,

      cell: {
        x: 'name',
        y: 'value'
      },
      stackOrPercent: 'stack',
      colors: COLORS,
      spec: {}
    });

    expect(spec).toEqual({
      type: 'line',
      axes: [
        { orient: 'bottom', title: { visible: false }, type: 'band' },
        { orient: 'left', title: { visible: false }, type: 'linear' }
      ],
      color: COLORS,
      data: {
        id: 'data',
        values: TWO_FIELD_DATA
      },
      yField: 'value',
      xField: 'name'
    });
  });

  it('should not generate percent line chart when has not group field', () => {
    const { spec } = generateChart('line', {
      dataTable: TWO_FIELD_DATA,

      cell: {
        x: 'name',
        y: 'value'
      },
      stackOrPercent: 'percent',
      colors: COLORS,
      spec: {}
    });

    expect(spec).toEqual({
      type: 'line',
      axes: [
        { orient: 'bottom', title: { visible: false }, type: 'band' },
        { orient: 'left', title: { visible: false }, type: 'linear' }
      ],
      color: COLORS,
      data: {
        id: 'data',
        values: TWO_FIELD_DATA
      },
      yField: 'value',
      xField: 'name'
    });
  });
});

describe('generate line chart of dataTable which has three field', () => {
  it('should generate line chart has linear gradient', () => {
    const { spec } = generateChart('line', {
      dataTable: THREE_FIELD_DATA,

      cell: {
        x: 'name',
        y: 'value',
        color: 'group'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'line',
      axes: [
        { orient: 'bottom', title: { visible: false }, type: 'band' },
        { orient: 'left', title: { visible: false }, type: 'linear' }
      ],
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      data: {
        id: 'data',
        values: THREE_FIELD_DATA
      },
      xField: 'name',
      yField: 'value',
      seriesField: 'group',
      legends: [
        {
          type: 'discrete',
          orient: 'right',
          item: {
            visible: true
          }
        }
      ]
    });
  });

  it('should generate line chart which has specified colors', () => {
    const chart = generateChart('line', {
      dataTable: THREE_FIELD_DATA,

      colors: COLORS,
      cell: {
        x: 'name',
        y: 'value',
        color: 'group'
      },
      spec: {}
    });

    expect(chart.spec).toEqual({
      type: 'line',
      axes: [
        { orient: 'bottom', title: { visible: false }, type: 'band' },
        {
          orient: 'left',
          title: { visible: false },
          type: 'linear'
        }
      ],
      legends: [
        {
          item: {
            visible: true
          },
          orient: 'right',
          type: 'discrete'
        }
      ],
      color: COLORS,
      seriesField: 'group',
      data: { id: 'data', values: THREE_FIELD_DATA },
      xField: 'name',
      yField: 'value'
    });
  });

  it('should generate colorful bar when color is same to x', () => {
    const { spec } = generateChart('line', {
      dataTable: THREE_FIELD_DATA,

      colors: COLORS,
      cell: {
        x: 'name',
        y: 'value',
        color: 'name'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'line',
      data: {
        id: 'data',
        values: THREE_FIELD_DATA
      },
      color: COLORS,
      xField: 'name',
      yField: 'value',
      seriesField: 'name',
      axes: [
        {
          orient: 'bottom',
          type: 'band',
          title: {
            visible: false
          }
        },
        {
          orient: 'left',
          type: 'linear',
          title: {
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

  it('should generate group line chart', () => {
    const { spec } = generateChart('line', {
      dataTable: THREE_FIELD_DATA,

      colors: COLORS,
      cell: {
        x: 'name',
        y: 'value'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'line',
      data: {
        id: 'data',
        values: THREE_FIELD_DATA
      },
      color: COLORS,
      xField: 'name',
      yField: 'value',
      seriesField: 'group',
      axes: [
        {
          orient: 'bottom',
          type: 'band',
          title: {
            visible: false
          }
        },
        {
          orient: 'left',
          type: 'linear',
          title: {
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

  it('should generate staked line chart', () => {
    const { spec } = generateChart('line', {
      dataTable: THREE_FIELD_DATA,

      colors: COLORS,
      stackOrPercent: 'percent',
      cell: {
        x: 'name',
        y: 'value'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'line',
      data: {
        id: 'data',
        values: THREE_FIELD_DATA
      },
      color: COLORS,
      xField: 'name',
      yField: 'value',
      seriesField: 'group',
      stack: true,
      percent: true,
      axes: [
        {
          orient: 'bottom',
          type: 'band',
          title: {
            visible: false
          }
        },
        {
          orient: 'left',
          type: 'linear',
          title: {
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

  it('should node generate group line chart because no valid seriesField', () => {
    // 线图，面积图没有限制
    const { spec } = generateChart('line', {
      dataTable: THREE_FIELD_DATA_1,

      colors: COLORS,
      cell: {
        x: 'name',
        y: 'value'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'line',
      data: {
        id: 'data',
        values: THREE_FIELD_DATA_1
      },
      color: COLORS,
      xField: 'name',
      yField: 'value',
      seriesField: 'group',
      legends: [
        {
          type: 'discrete',
          orient: 'right',
          item: {
            visible: true
          }
        }
      ],
      axes: [
        {
          orient: 'bottom',
          type: 'band',
          title: {
            visible: false
          }
        },
        {
          orient: 'left',
          type: 'linear',
          title: {
            visible: false
          }
        }
      ]
    });
  });
});
