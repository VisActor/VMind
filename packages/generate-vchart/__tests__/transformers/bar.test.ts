import { generateChart } from '../../src';
import { COLORS, THREE_FIELD_DATA, THREE_FIELD_DATA_1, TWO_FIELD_DATA } from '../common';

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
        { orient: 'bottom', title: { visible: false }, type: 'band', visible: true },
        {
          orient: 'left',
          title: { visible: false },
          type: 'linear',
          visible: true
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
      theme: 'dark',
      axes: [
        { orient: 'bottom', title: { visible: false }, type: 'band', visible: true },
        { orient: 'left', title: { visible: false }, type: 'linear', visible: true }
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
        { orient: 'left', title: { visible: false }, type: 'band', visible: true },
        { orient: 'bottom', title: { visible: false }, type: 'linear', visible: true }
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
        { orient: 'bottom', title: { visible: false }, type: 'band', visible: true },
        { orient: 'left', title: { visible: false }, type: 'linear', visible: true }
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
        { orient: 'bottom', title: { visible: false }, type: 'band', visible: true },
        { orient: 'left', title: { visible: false }, type: 'linear', visible: true }
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
        { orient: 'bottom', title: { visible: false }, type: 'band', visible: true },
        {
          orient: 'left',
          title: { visible: false },
          type: 'linear',
          visible: true
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
        { orient: 'bottom', title: { visible: false }, type: 'band', visible: true },
        {
          orient: 'left',
          title: { visible: false },
          type: 'linear',
          visible: true
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
          },
          visible: true
        },
        {
          orient: 'left',
          type: 'linear',
          title: {
            visible: false
          },
          visible: true
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
          },
          visible: true
        },
        {
          orient: 'left',
          type: 'linear',
          title: {
            visible: false
          },
          visible: true
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
          },
          visible: true
        },
        {
          orient: 'left',
          type: 'linear',
          title: {
            visible: false
          },
          visible: true
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

  it('should not generate group bar chart because no valid seriesField', () => {
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
      axes: [
        {
          orient: 'bottom',
          type: 'band',
          title: {
            visible: false
          },
          visible: true
        },
        {
          orient: 'left',
          type: 'linear',
          title: {
            visible: false
          },
          visible: true
        }
      ]
    });
  });
});

describe('formatFieldsOfBar function', () => {
  const fieldInfo = [
    { fieldName: 'name', role: 'dimension' as any },
    { fieldName: 'value', role: 'measure' as any },
    { fieldName: 'category', role: 'dimension' as any },
    { fieldName: 'amount', role: 'measure' as any }
  ];

  it('should transpose fields when transpose is true and fields match role requirements', () => {
    const { formatFieldsOfBar } = require('../../src/transformers/bar');
    const context = {
      cell: { x: 'value', y: 'name' },
      transpose: true,
      fieldInfo
    };

    const result = formatFieldsOfBar(context);
    expect(result.cell.x).toBe('name');
    expect(result.cell.y).toBe('value');
  });

  it('should not transpose fields when transpose is false', () => {
    const { formatFieldsOfBar } = require('../../src/transformers/bar');
    const context = {
      cell: { x: 'name', y: 'value' },
      transpose: false,
      fieldInfo
    };

    const result = formatFieldsOfBar(context);
    expect(result.cell.x).toBe('name');
    expect(result.cell.y).toBe('value');
  });

  it('should not transpose when x fields are not all measures', () => {
    const { formatFieldsOfBar } = require('../../src/transformers/bar');
    const context = {
      cell: { x: ['name', 'value'], y: 'category' },
      transpose: true,
      fieldInfo
    };

    const result = formatFieldsOfBar(context);
    expect(result.cell.x).toEqual(['name', 'value']);
    expect(result.cell.y).toBe('category');
  });

  it('should handle empty fieldInfo', () => {
    const { formatFieldsOfBar } = require('../../src/transformers/bar');
    const context = {
      cell: { x: 'name', y: 'value' },
      transpose: true,
      fieldInfo: [] as any[]
    };

    const result = formatFieldsOfBar(context);
    expect(result.cell.x).toBe('name');
    expect(result.cell.y).toBe('value');
  });
});

describe('colorBar function', () => {
  it('should return spec when chartTheme is provided', () => {
    const { colorBar } = require('../../src/transformers/bar');
    const context = {
      chartTheme: 'dark',
      spec: { type: 'bar' }
    };

    const result = colorBar(context);
    expect(result.spec).toEqual({ type: 'bar' });
  });

  it('should apply custom colors when provided', () => {
    const { colorBar } = require('../../src/transformers/bar');
    const customColors = ['#ff0000', '#00ff00', '#0000ff'];
    const context = {
      colors: customColors,
      spec: { type: 'bar' }
    };

    const result = colorBar(context);
    expect(result.spec.color).toEqual(customColors);
  });

  it('should apply default gradient colors when no colors or chartTheme provided', () => {
    const { colorBar } = require('../../src/transformers/bar');
    const context = {
      spec: { type: 'bar' }
    };

    const result = colorBar(context);
    expect(result.spec.color).toBeDefined();
    expect(Array.isArray(result.spec.color)).toBe(true);
    expect(result.spec.color[0]).toHaveProperty('gradient', 'linear');
    expect(result.spec.color[0]).toHaveProperty('stops');
  });

  it('should not apply colors when colors array is empty', () => {
    const { colorBar } = require('../../src/transformers/bar');
    const context = {
      colors: [] as any[],
      spec: { type: 'bar' }
    };

    const result = colorBar(context);
    expect(result.spec.color).toBeDefined();
    expect(Array.isArray(result.spec.color)).toBe(true);
    expect(result.spec.color[0]).toHaveProperty('gradient', 'linear');
  });
});

describe('cartesianBar function', () => {
  const fieldInfo = [
    { fieldName: 'name', role: 'dimension' as any },
    { fieldName: 'value', role: 'measure' as any },
    { fieldName: 'category', role: 'dimension' as any },
    { fieldName: 'amount', role: 'measure' as any }
  ];

  it('should assign basic fields correctly', () => {
    const { cartesianBar } = require('../../src/transformers/bar');
    const context = {
      cell: { x: 'name', y: 'value' },
      fieldInfo,
      spec: {}
    };

    const result = cartesianBar(context);
    expect(result.spec.xField).toContain('name');
    expect(result.spec.yField).toBe('value');
    // Should auto-assign a dimension field as color/series field
    expect(result.spec.seriesField).toBeDefined();
  });

  it('should handle array x field', () => {
    const { cartesianBar } = require('../../src/transformers/bar');
    const context = {
      cell: { x: ['name', 'category'], y: 'value' },
      fieldInfo,
      spec: {}
    };

    const result = cartesianBar(context);
    expect(result.spec.xField).toEqual(['name', 'category']);
    expect(result.spec.yField).toBe('value');
  });

  it('should add color field to xField when color is different from x', () => {
    const { cartesianBar } = require('../../src/transformers/bar');
    const context = {
      cell: { x: 'name', y: 'value', color: 'category' },
      fieldInfo,
      spec: {}
    };

    const result = cartesianBar(context);
    expect(result.spec.xField).toEqual(['name', 'category']);
    expect(result.spec.seriesField).toBe('category');
  });

  it('should not duplicate color field in xField when color equals x', () => {
    const { cartesianBar } = require('../../src/transformers/bar');
    const context = {
      cell: { x: 'name', y: 'value', color: 'name' },
      fieldInfo,
      spec: {}
    };

    const result = cartesianBar(context);
    expect(result.spec.xField).toEqual(['name']);
    expect(result.spec.seriesField).toBe('name');
  });

  it('should auto-assign color field from remaining dimension fields', () => {
    const { cartesianBar } = require('../../src/transformers/bar');
    const context = {
      cell: { x: 'name', y: 'value' },
      fieldInfo,
      spec: {}
    };

    const result = cartesianBar(context);
    expect(result.spec.xField).toContain('category');
    expect(result.spec.seriesField).toBe('category');
    expect(result.cell.color).toBe('category');
  });

  it('should handle stack configuration', () => {
    const { cartesianBar } = require('../../src/transformers/bar');
    const context = {
      cell: { x: ['name', 'category'], y: 'value' },
      fieldInfo,
      stackOrPercent: true,
      spec: {}
    };

    const result = cartesianBar(context);
    expect(result.spec.xField).toEqual(['name']);
    expect(result.spec.stack).toBe(true);
    expect(result.spec.percent).toBe(false);
  });

  it('should handle percent stack configuration', () => {
    const { cartesianBar } = require('../../src/transformers/bar');
    const context = {
      cell: { x: ['name', 'category'], y: 'value' },
      fieldInfo,
      stackOrPercent: 'percent',
      spec: {}
    };

    const result = cartesianBar(context);
    expect(result.spec.xField).toEqual(['name']);
    expect(result.spec.stack).toBe(true);
    expect(result.spec.percent).toBe(true);
  });

  it('should handle empty fieldInfo', () => {
    const { cartesianBar } = require('../../src/transformers/bar');
    const context = {
      cell: { x: 'name', y: 'value' },
      fieldInfo: [] as any[],
      spec: {}
    };

    const result = cartesianBar(context);
    expect(result.spec.xField).toEqual(['name']);
    expect(result.spec.yField).toBe('value');
  });
});

describe('transposeField function', () => {
  it('should transpose fields and direction when transpose is true', () => {
    const { transposeField } = require('../../src/transformers/bar');
    const context = {
      transpose: true,
      spec: {
        xField: 'name',
        yField: 'value',
        axes: [
          { orient: 'bottom', type: 'band' },
          { orient: 'left', type: 'linear' }
        ]
      }
    };

    const result = transposeField(context);
    expect(result.spec.xField).toBe('value');
    expect(result.spec.yField).toBe('name');
    expect(result.spec.direction).toBe('horizontal');
  });

  it('should not transpose when transpose is false', () => {
    const { transposeField } = require('../../src/transformers/bar');
    const context = {
      transpose: false,
      spec: {
        xField: 'name',
        yField: 'value'
      }
    };

    const result = transposeField(context);
    expect(result.spec.xField).toBe('name');
    expect(result.spec.yField).toBe('value');
    expect(result.spec.direction).toBeUndefined();
  });

  it('should handle spec without axes', () => {
    const { transposeField } = require('../../src/transformers/bar');
    const context = {
      transpose: true,
      spec: {
        xField: 'name',
        yField: 'value'
      }
    };

    const result = transposeField(context);
    expect(result.spec.xField).toBe('value');
    expect(result.spec.yField).toBe('name');
    expect(result.spec.direction).toBe('horizontal');
  });

  it('should not handle partial axes configuration', () => {
    const { transposeField } = require('../../src/transformers/bar');
    const context = {
      transpose: true,
      spec: {
        xField: 'name',
        yField: 'value',
        axes: [{ orient: 'bottom', type: 'band' }]
      }
    };

    const result = transposeField(context);
    expect(result.spec.axes).toEqual([{ orient: 'bottom', type: 'band' }]);
  });
});

describe('animationCartesianBar function', () => {
  const mockData = [
    { name: 'A', value: 10 },
    { name: 'B', value: 20 },
    { name: 'A', value: 15 },
    { name: 'C', value: 30 }
  ];

  it('should configure animation with default total time', () => {
    const { animationCartesianBar } = require('../../src/transformers/bar');
    const context = {
      spec: {
        xField: 'name',
        data: { values: mockData }
      },
      animationOptions: undefined as any
    };

    const result = animationCartesianBar(context);
    expect(result.spec.animationAppear).toBeDefined();
    expect(result.spec.animationAppear.oneByOne).toBe(Number.MIN_VALUE);
    expect(result.spec.animationAppear.duration).toBeGreaterThan(0);
  });

  it('should configure animation with custom total time', () => {
    const { animationCartesianBar } = require('../../src/transformers/bar');
    const context = {
      spec: {
        xField: 'name',
        data: { values: mockData }
      },
      animationOptions: { totalTime: 5000 }
    };

    const result = animationCartesianBar(context);
    expect(result.spec.animationAppear.duration).toBe(5000 / 3); // 3 unique groups: A, B, C
  });

  it('should handle array xField', () => {
    const { animationCartesianBar } = require('../../src/transformers/bar');
    const context = {
      spec: {
        xField: ['name', 'category'],
        data: { values: mockData }
      },
      animationOptions: { totalTime: 3000 }
    };

    const result = animationCartesianBar(context);
    expect(result.spec.animationAppear.duration).toBe(3000 / 3); // Based on first field 'name'
  });

  it('should handle empty data', () => {
    const { animationCartesianBar } = require('../../src/transformers/bar');
    const context = {
      spec: {
        xField: 'name',
        data: { values: [] as any[] }
      },
      animationOptions: { totalTime: 2000 }
    };

    const result = animationCartesianBar(context);
    expect(result.spec.animationAppear.duration).toBe(Infinity); // 2000 / 0
  });

  it('should handle single group', () => {
    const { animationCartesianBar } = require('../../src/transformers/bar');
    const singleGroupData = [
      { name: 'A', value: 10 },
      { name: 'A', value: 20 }
    ];
    const context = {
      spec: {
        xField: 'name',
        data: { values: singleGroupData }
      },
      animationOptions: { totalTime: 1000 }
    };

    const result = animationCartesianBar(context);
    expect(result.spec.animationAppear.duration).toBe(1000); // 1000 / 1
  });
});
