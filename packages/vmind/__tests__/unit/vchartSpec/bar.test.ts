import { merge } from '@visactor/vutils';
import { mergeAppendSpec } from '../../../src/atom/VChartSpec/utils';

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

describe('mergeAppendSpec of barchart', () => {
  it('should reduce duplicated code', () => {
    const newSpec = mergeAppendSpec(merge({}, spec), {
      spec: {
        scales: [
          {
            domain: [
              {
                fields: ['yourFieldName']
              }
            ]
          }
        ]
      }
    });

    expect(newSpec).toEqual(
      mergeAppendSpec(spec, {
        spec: {
          'scales[0]': {
            domain: [
              {
                fields: ['yourFieldName']
              }
            ]
          }
        }
      })
    );
  });

  it('should parse complicated path', () => {
    const append = {
      spec: {
        'scales[0].domain[0].fields': 'yourFieldName'
      }
    };

    const { newSpec } = mergeAppendSpec(merge({}, spec), append);

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
    const append = {
      spec: {
        axes: [
          {
            label: {
              style: {
                lineWidth: 2
              }
            }
          }
        ]
      }
    };
    const { newSpec } = mergeAppendSpec(merge({}, spec), append);

    expect(newSpec.axes).toEqual([
      {
        label: {
          style: {
            lineWidth: 2
          }
        }
      }
    ]);

    const append1 = {
      spec: {
        axes: {
          label: {
            style: {
              lineWidth: 2
            }
          }
        }
      }
    };

    const { newSpec: newSpec1 } = mergeAppendSpec(merge({}, spec), append1);

    expect(newSpec1.axes).toEqual([
      {
        label: {
          style: {
            lineWidth: 2
          }
        }
      }
    ]);

    const append2 = {
      spec: {
        yAxis: {
          label: {
            style: {
              lineWidth: 2
            }
          }
        }
      }
    };

    const { newSpec: newSpec2 } = mergeAppendSpec(merge({}, spec), append2);

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

    const append3 = {
      spec: {
        'yAxis[0]': {
          label: {
            style: {
              lineWidth: 2
            }
          }
        }
      }
    };

    const { newSpec: newSpec3 } = mergeAppendSpec(merge({}, spec), append3);

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

    const append4 = {
      spec: {
        'yAxis[0].label.style.lineWidth': 2
      }
    };

    const { newSpec: newSpec4 } = mergeAppendSpec(merge({}, spec), append4);

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
    const append = {
      spec: {
        bar: {
          style: {
            fill: "(datum, index) => index === 0 ? 'red' : null"
          }
        }
      }
    };

    const { newSpec } = mergeAppendSpec(merge({}, spec), append);

    expect(newSpec.bar.style.fill).toBeDefined();
    expect(newSpec.bar.style.fill('test', 0)).toBe('red');
    expect(newSpec.bar.style.fill('test', 1)).toBeNull();
  });

  it('should not not add series when has only one series', () => {
    const append = {
      spec: {
        'series[0].extensionMark[0].style.size': 10
      }
    };

    const { newSpec } = mergeAppendSpec(merge({}, spec), append);
    expect(newSpec.extensionMark).toEqual([
      {
        style: {
          size: 10
        }
      }
    ]);
  });

  it('should not not add series when has only one series when alias is empty', () => {
    const append = {
      spec: {
        'series[0].extensionMark[0].style.size': 10
      }
    };

    const { newSpec } = mergeAppendSpec(merge({}, spec), append);
    expect(newSpec.extensionMark).toEqual([
      {
        style: {
          size: 10
        }
      }
    ]);
  });

  it('should not not add series when has only one series in bar chart', () => {
    const append = {
      spec: {
        series: [
          {
            label: {
              overlap: true
            }
          }
        ]
      }
    };

    const { newSpec } = mergeAppendSpec(merge({}, spec), append);
    expect(newSpec.label).toEqual({
      overlap: true
    });
    expect(newSpec.series).toBeUndefined();
  });

  it('should contain all spec when spec has more than one path', () => {
    const append = {
      spec: {
        tooltip: {
          mark: {
            maxLineCount: 20
          },
          dimension: {
            maxLineCount: 20
          }
        }
      },
      parentKeyPath: 'tooltip',
      aliasKeyPath: 'tooltip'
    };

    const { newSpec } = mergeAppendSpec(merge({}, spec), append);
    expect(newSpec.tooltip).toEqual(append.spec.tooltip);
  });

  it('should not create legends array when only one legend', () => {
    const { newSpec } = mergeAppendSpec(merge({}, spec), {
      spec: {
        'legends[0]': {
          orient: 'left'
        }
      }
    });
    expect(newSpec.legends).toEqual({
      position: 'start',
      visible: true,
      orient: 'left'
    });
    const { newSpec: newSpec2 } = mergeAppendSpec(merge({}, spec), {
      spec: {
        'legends[0]': {
          orient: 'left'
        }
      }
    });
    expect(newSpec2.legends).toEqual({
      position: 'start',
      visible: true,
      orient: 'left'
    });
  });

  it('should not handle result of color', () => {
    const { newSpec } = mergeAppendSpec(merge({}, spec), {
      spec: {
        color: ['red']
      }
    });
    expect(newSpec.color).toEqual(['red']);
  });

  it('should add default axes when return `allAxis`', () => {
    const { newSpec } = mergeAppendSpec(merge({}, spec), {
      spec: {
        allAxis: {
          label: {
            autoHide: false,
            autoLimit: true
          }
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
    const { newSpec } = mergeAppendSpec(
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
        spec: {
          yAxis: {
            label: {
              autoWrap: true
            }
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
    const { newSpec } = mergeAppendSpec(merge({}, spec), {
      spec: {
        'label[0].visible': true
      }
    });

    expect(newSpec.label).toEqual({
      visible: true
    });

    const { newSpec: newSpec1 } = mergeAppendSpec(merge({}, spec), {
      spec: {
        label: {
          position: 'inside'
        }
      }
    });

    expect(newSpec1.label).toEqual({
      position: 'inside'
    });
  });
});
