import { merge } from '@visactor/vutils';
import { updateSpecByOperation } from '../../../src/atom/VChartSpec/utils';

const spec = {
  type: 'bar',
  data: [
    {
      id: 'barData',
      values: [
        {
          type: 'Autocracies',
          year: '1930',
          value: 129
        },
        {
          type: 'Autocracies',
          year: '1940',
          value: 133
        },
        {
          type: 'Autocracies',
          year: '1950',
          value: 130
        },
        {
          type: 'Autocracies',
          year: '1960',
          value: 126
        },
        {
          type: 'Autocracies',
          year: '1970',
          value: 117
        },
        {
          type: 'Autocracies',
          year: '1980',
          value: 114
        },
        {
          type: 'Autocracies',
          year: '1990',
          value: 111
        },
        {
          type: 'Autocracies',
          year: '2000',
          value: 89
        },
        {
          type: 'Autocracies',
          year: '2010',
          value: 80
        },
        {
          type: 'Autocracies',
          year: '2018',
          value: 80
        },
        {
          type: 'Democracies',
          year: '1930',
          value: 22
        },
        {
          type: 'Democracies',
          year: '1940',
          value: 13
        },
        {
          type: 'Democracies',
          year: '1950',
          value: 25
        },
        {
          type: 'Democracies',
          year: '1960',
          value: 29
        },
        {
          type: 'Democracies',
          year: '1970',
          value: 38
        },
        {
          type: 'Democracies',
          year: '1980',
          value: 41
        },
        {
          type: 'Democracies',
          year: '1990',
          value: 57
        },
        {
          type: 'Democracies',
          year: '2000',
          value: 87
        },
        {
          type: 'Democracies',
          year: '2010',
          value: 98
        },
        {
          type: 'Democracies',
          year: '2018',
          value: 99
        }
      ]
    }
  ],
  xField: ['year', 'type'],
  yField: 'value',
  seriesField: 'type',
  legends: {
    visible: true,
    orient: 'top',
    position: 'start'
  }
};

describe('updateSpecByOperation of barchart', () => {
  it('should reduce duplicated code', () => {
    const newSpec = updateSpecByOperation(merge({}, spec), {
      op: 'add',
      target: 'scales',
      value: [
        {
          domain: [
            {
              fields: ['yourFieldName']
            }
          ]
        }
      ]
    });
    const newSpec2 = updateSpecByOperation(merge({}, spec), {
      op: 'add',
      target: 'scales[0]',
      value: {
        domain: [
          {
            fields: ['yourFieldName']
          }
        ]
      }
    });

    expect(newSpec).toEqual(newSpec2);
  });

  it('should parse complicated path', () => {
    const { newSpec } = updateSpecByOperation(merge({}, spec), {
      op: 'add',
      target: 'scales[0].domain[0].fields',
      value: 'yourFieldName'
    });

    expect(newSpec.scales).toEqual([
      {
        domain: [
          {
            fields: 'yourFieldName'
          }
        ]
      }
    ]);
  });

  it('should parse complicated path of axes', () => {
    const { newSpec } = updateSpecByOperation(merge({}, spec), {
      op: 'add',
      target: 'axes',
      value: {
        label: {
          style: {
            lineWidth: 2
          }
        }
      }
    });

    expect(newSpec.axes).toEqual([
      {
        label: {
          style: {
            lineWidth: 2
          }
        }
      }
    ]);

    const { newSpec: newSpec1 } = updateSpecByOperation(merge({}, spec), {
      op: 'add',
      target: 'axes[0]',
      value: {
        label: {
          style: {
            lineWidth: 2
          }
        }
      }
    });

    expect(newSpec1.axes).toEqual([
      {
        label: {
          style: {
            lineWidth: 2
          }
        }
      }
    ]);

    const { newSpec: newSpec2 } = updateSpecByOperation(merge({}, spec), {
      op: 'add',
      target: 'yAxis',
      value: {
        label: {
          style: {
            lineWidth: 2
          }
        }
      }
    });

    expect(newSpec2.axes).toEqual([
      {
        _alias_name: 'yAxis',
        orient: 'left',
        label: {
          style: {
            lineWidth: 2
          }
        }
      }
    ]);

    const { newSpec: newSpec3 } = updateSpecByOperation(merge({}, spec), {
      op: 'add',
      target: 'yAxis[0]',
      value: {
        label: {
          style: {
            lineWidth: 2
          }
        }
      }
    });

    expect(newSpec3.axes).toEqual([
      {
        _alias_name: 'yAxis',
        orient: 'left',
        label: {
          style: {
            lineWidth: 2
          }
        }
      }
    ]);

    const { newSpec: newSpec4 } = updateSpecByOperation(merge({}, spec), {
      op: 'add',
      target: 'yAxis[0].label.style.lineWidth',
      value: 2
    });

    expect(newSpec4.axes).toEqual([
      {
        _alias_name: 'yAxis',
        orient: 'left',
        label: {
          style: {
            lineWidth: 2
          }
        }
      }
    ]);
  });

  it('should handle function', () => {
    const { newSpec } = updateSpecByOperation(merge({}, spec), {
      op: 'update',
      target: 'bar',
      value: {
        style: {
          fill: "(datum, index) => index === 0 ? 'red' : null"
        }
      }
    });

    expect(newSpec.bar.style.fill).toBeDefined();
    expect(newSpec.bar.style.fill('test', 0)).toBe('red');
    expect(newSpec.bar.style.fill('test', 1)).toBeNull();
  });

  it('should not not add series when has only one series', () => {
    const { newSpec } = updateSpecByOperation(merge({}, spec), {
      op: 'update',
      target: 'series[0].extensionMark[0].style.size',
      value: 10
    });
    expect(newSpec.extensionMark).toEqual([
      {
        style: {
          size: 10
        }
      }
    ]);
  });

  it('should not not add series when has only one series when alias is empty', () => {
    const { newSpec } = updateSpecByOperation(merge({}, spec), {
      op: 'update',
      target: 'series[0].extensionMark[0].style.size',
      value: 10
    });
    expect(newSpec.extensionMark).toEqual([
      {
        style: {
          size: 10
        }
      }
    ]);
  });

  it('should not not add series when has only one series in bar chart', () => {
    const { newSpec } = updateSpecByOperation(merge({}, spec), {
      op: 'update',
      target: 'series[0]',
      value: {
        label: {
          overlap: true
        }
      }
    });
    expect(newSpec.label).toEqual({
      overlap: true
    });
    expect(newSpec.series).toBeUndefined();
  });

  it('should contain all spec when spec has more than one path', () => {
    const append = {
      tooltip: {
        mark: {
          maxLineCount: 20
        },
        dimension: {
          maxLineCount: 20
        }
      }
    };

    const { newSpec } = updateSpecByOperation(merge({}, spec), {
      op: 'add',
      target: 'tooltip',
      value: append
    });
    expect(newSpec.tooltip).toEqual(append);
  });

  it('should not create legends array when only one legend', () => {
    const { newSpec } = updateSpecByOperation(merge({}, spec), {
      op: 'update',
      target: 'legends[0]',
      value: {
        orient: 'left'
      }
    });
    expect(newSpec.legends).toEqual({
      position: 'start',
      visible: true,
      orient: 'left'
    });
    const { newSpec: newSpec2 } = updateSpecByOperation(merge({}, spec), {
      op: 'update',
      target: 'legends',
      value: {
        orient: 'left'
      }
    });
    expect(newSpec2.legends).toEqual({
      position: 'start',
      visible: true,
      orient: 'left'
    });
  });

  it('should not handle result of color', () => {
    const { newSpec } = updateSpecByOperation(merge({}, spec), {
      op: 'update',
      target: 'color',
      value: ['red']
    });
    expect(newSpec.color).toEqual(['red']);
  });

  it('should add default axes when return `allAxis`', () => {
    const { newSpec } = updateSpecByOperation(merge({}, spec), {
      op: 'add',
      target: 'allAxis',
      value: {
        label: {
          autoHide: false,
          autoLimit: true
        }
      }
    });
    expect(newSpec.axes).toEqual([
      {
        label: {
          autoHide: false,
          autoLimit: true
        },
        orient: 'bottom'
      },
      {
        label: {
          autoHide: false,
          autoLimit: true
        },
        orient: 'left'
      }
    ]);
  });

  it('should filter yaxis when axes is not empty', () => {
    const { newSpec } = updateSpecByOperation(
      merge({}, spec, {
        axes: [
          {
            orient: 'bottom',
            label: {
              style: {
                fill: 'red'
              }
            }
          },
          {
            orient: 'left',
            label: {
              style: {
                fill: 'red'
              }
            }
          }
        ]
      }),
      {
        op: 'update',
        target: 'yAxis',
        value: {
          label: {
            autoWrap: true
          }
        }
      }
    );
    expect(newSpec.axes[1]).toEqual({
      _alias_name: 'yAxis',
      orient: 'left',
      label: {
        autoWrap: true,
        style: {
          fill: 'red'
        }
      }
    });
  });

  it('should not create array for label', () => {
    const { newSpec } = updateSpecByOperation(merge({}, spec), {
      op: 'update',
      target: 'label[0].visible',
      value: true
    });

    expect(newSpec.label).toEqual({
      visible: true
    });

    const { newSpec: newSpec1 } = updateSpecByOperation(merge({}, spec), {
      op: 'update',
      target: 'label',
      value: {
        position: 'inside'
      }
    });

    expect(newSpec1.label).toEqual({
      position: 'inside'
    });
  });
});
