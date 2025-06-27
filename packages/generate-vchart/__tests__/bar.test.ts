import { generateChart } from '../src';
import { COLORS, THREE_FIELD_DATA, THREE_FIELD_DATA_1, TWO_FIELD_DATA } from './common';

describe('generate bar chart of dataTable which has two field', () => {
  it('should generate bar chart', () => {
    const chart = generateChart('bar', {
      dataTable: TWO_FIELD_DATA,
      cell: {
        x: 'name',
        y: 'value'
      },
      spec: {}
    });

    expect(chart.spec).toEqual({
      type: 'bar',
      axes: [
        { orient: 'bottom', title: { visible: false }, type: 'band' },
        {
          orient: 'left',
          title: { visible: false },
          type: 'linear'
        }
      ],
      color: [
        {
          gradient: 'linear',
          stops: [
            { color: '#1DD0F3FF', offset: 0 },
            { color: '#1DD0F300', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        },
        {
          gradient: 'linear',
          stops: [
            { color: '#2693FFFF', offset: 0 },
            { color: '#2693FF00', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        },
        {
          gradient: 'linear',
          stops: [
            { color: '#3259F4FF', offset: 0 },
            { color: '#3259F400', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        },
        {
          gradient: 'linear',
          stops: [
            { color: '#1B0CA1FF', offset: 0 },
            { color: '#1B0CA100', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        },
        {
          gradient: 'linear',
          stops: [
            { color: '#CB2BC6FF', offset: 0 },
            { color: '#CB2BC600', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        },
        {
          gradient: 'linear',
          stops: [
            { color: '#FF581DFF', offset: 0 },
            { color: '#FF581D00', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        },
        {
          gradient: 'linear',
          stops: [
            { color: '#FBBB16FF', offset: 0 },
            { color: '#FBBB1600', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        },
        {
          gradient: 'linear',
          stops: [
            { color: '#F6FB17FF', offset: 0 },
            { color: '#F6FB1700', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        },
        {
          gradient: 'linear',
          stops: [
            { color: '#73EC55FF', offset: 0 },
            { color: '#73EC5500', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        }
      ],
      data: { id: 'data', values: TWO_FIELD_DATA },
      xField: ['name'],
      yField: 'value'
    });
  });

  it('should not generate gradient color when has colors', () => {
    const chart = generateChart('bar', {
      dataTable: TWO_FIELD_DATA,

      cell: {
        x: 'name',
        y: 'value'
      },
      colors: COLORS,
      spec: {}
    });

    expect(chart.spec.color).toEqual(COLORS);
  });

  it('should not add color when specify chartTheme', () => {
    const { spec } = generateChart('bar', {
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
      type: 'bar',
      axes: [
        { orient: 'bottom', title: { visible: false }, type: 'band' },
        { orient: 'left', title: { visible: false }, type: 'linear' }
      ],
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
      xField: ['name'],
      yField: 'value'
    });
  });

  it('should generate horizontal bar chart', () => {
    const { spec } = generateChart('bar', {
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
      type: 'bar',
      axes: [
        { orient: 'left', title: { visible: false }, type: 'band' },
        { orient: 'bottom', title: { visible: false }, type: 'linear' }
      ],
      color: COLORS,
      data: {
        id: 'data',
        values: TWO_FIELD_DATA
      },
      direction: 'horizontal',
      xField: 'value',
      yField: ['name']
    });
  });

  it('should not generate stacked bar chart when has not group field', () => {
    const { spec } = generateChart('bar', {
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
      type: 'bar',
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
      xField: ['name']
    });
  });

  it('should not generate stacked bar chart when has not group field', () => {
    const { spec } = generateChart('bar', {
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
      type: 'bar',
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
      xField: ['name']
    });
  });
});

describe('generate bar chart of dataTable which has three field', () => {
  it('should generate bar chart which has gradient color', () => {
    const chart = generateChart('bar', {
      dataTable: THREE_FIELD_DATA,
      cell: {
        x: 'name',
        y: 'value',
        color: 'group'
      },
      spec: {}
    });

    expect(chart.spec).toEqual({
      type: 'bar',
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
      color: [
        {
          gradient: 'linear',
          stops: [
            { color: '#1DD0F3FF', offset: 0 },
            { color: '#1DD0F300', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        },
        {
          gradient: 'linear',
          stops: [
            { color: '#2693FFFF', offset: 0 },
            { color: '#2693FF00', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        },
        {
          gradient: 'linear',
          stops: [
            { color: '#3259F4FF', offset: 0 },
            { color: '#3259F400', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        },
        {
          gradient: 'linear',
          stops: [
            { color: '#1B0CA1FF', offset: 0 },
            { color: '#1B0CA100', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        },
        {
          gradient: 'linear',
          stops: [
            { color: '#CB2BC6FF', offset: 0 },
            { color: '#CB2BC600', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        },
        {
          gradient: 'linear',
          stops: [
            { color: '#FF581DFF', offset: 0 },
            { color: '#FF581D00', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        },
        {
          gradient: 'linear',
          stops: [
            { color: '#FBBB16FF', offset: 0 },
            { color: '#FBBB1600', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        },
        {
          gradient: 'linear',
          stops: [
            { color: '#F6FB17FF', offset: 0 },
            { color: '#F6FB1700', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        },
        {
          gradient: 'linear',
          stops: [
            { color: '#73EC55FF', offset: 0 },
            { color: '#73EC5500', offset: 1 }
          ],
          x0: 0.01,
          x1: 0.01,
          y0: 0,
          y1: 1
        }
      ],
      seriesField: 'group',
      data: { id: 'data', values: THREE_FIELD_DATA },
      xField: ['name', 'group'],
      yField: 'value'
    });
  });

  it('should generate bar chart which has specified colors', () => {
    const chart = generateChart('bar', {
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
      type: 'bar',
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
      xField: ['name', 'group'],
      yField: 'value'
    });
  });

  it('should generate colorful bar when color is same to x', () => {
    const { spec } = generateChart('bar', {
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
      type: 'bar',
      data: {
        id: 'data',
        values: THREE_FIELD_DATA
      },
      color: COLORS,
      xField: ['name'],
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

  it('should generate group bar chart', () => {
    const { spec } = generateChart('bar', {
      dataTable: THREE_FIELD_DATA,
      colors: COLORS,
      cell: {
        x: 'name',
        y: 'value'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'bar',
      data: {
        id: 'data',
        values: THREE_FIELD_DATA
      },
      color: COLORS,
      xField: ['name', 'group'],
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

  it('should generate staked bar chart', () => {
    const { spec } = generateChart('bar', {
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
      type: 'bar',
      data: {
        id: 'data',
        values: THREE_FIELD_DATA
      },
      color: COLORS,
      xField: ['name'],
      yField: 'value',
      seriesField: 'group',
      percent: true,
      stack: true,
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

  it('should node generate group bar chart because no valid seriesField', () => {
    const { spec } = generateChart('bar', {
      dataTable: THREE_FIELD_DATA_1,
      colors: COLORS,
      cell: {
        x: 'name',
        y: 'value'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'bar',
      data: {
        id: 'data',
        values: THREE_FIELD_DATA_1
      },
      color: COLORS,
      xField: ['name'],
      yField: 'value',
      seriesField: undefined,
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
