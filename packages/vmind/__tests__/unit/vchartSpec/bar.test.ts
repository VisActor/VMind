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
      leafSpec: {
        scales: [
          {
            domain: [
              {
                fields: ['yourFieldName']
              }
            ]
          }
        ]
      },
      parentKeyPath: 'scales'
    });

    expect(newSpec).toEqual(
      mergeAppendSpec(spec, {
        parentKeyPath: 'scales[0]',
        leafSpec: {
          domain: [
            {
              fields: ['yourFieldName']
            }
          ]
        }
      })
    );
  });

  it('should parse complicated path', () => {
    const append = {
      leafSpec: {
        'scales[0].domain[0].fields': 'yourFieldName'
      },
      parentKeyPath: 'scales[0].domain[0].fields'
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

  it('should parse complicated path of `axes[0].label.style.lineWidth`', () => {
    const append = {
      leafSpec: {
        axes: [
          {
            label: {
              style: {
                lineWidth: 2
              }
            }
          }
        ]
      },
      parentKeyPath: 'axes[0].label.style.lineWidth'
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
  });

  it('should parse complicated path when `parentKeyPath` > spec ', () => {
    const append = {
      leafSpec: {
        grid: {
          style: {
            strokeOpacity: 1
          }
        }
      },
      parentKeyPath: 'axes[0].grid.style'
    };

    const { newSpec } = mergeAppendSpec(merge({}, spec), append);

    expect(newSpec.axes).toEqual([
      {
        grid: {
          style: {
            strokeOpacity: 1
          }
        }
      }
    ]);

    const { newSpec: newSpec2 } = mergeAppendSpec(merge({}, newSpec), {
      aliasKeyPath: 'xAxis',
      parentKeyPath: 'axes',
      leafSpec: {
        axes: [
          {
            title: {
              text: '城市'
            }
          }
        ]
      }
    });

    expect(newSpec2.axes).toEqual([
      {
        grid: {
          style: {
            strokeOpacity: 1
          }
        }
      },
      {
        title: {
          text: '城市'
        },
        _alias_name: 'xAxis',
        orient: 'bottom'
      }
    ]);
  });

  it('should handle function', () => {
    const append = {
      aliasKeyPath: 'xAxis.label.style.fill',
      leafSpec: {
        bar: {
          style: {
            fill: "(datum, index) => index === 0 ? 'red' : null"
          }
        }
      },
      parentKeyPath: 'bar'
    };

    const { newSpec } = mergeAppendSpec(merge({}, spec), append);

    expect(newSpec.bar.style.fill).toBeDefined();
    expect(newSpec.bar.style.fill('test', 0)).toBe('red');
    expect(newSpec.bar.style.fill('test', 1)).toBeNull();
  });

  it('should not not add series when has only one series', () => {
    const append = {
      leafSpec: {
        'series[0].extensionMark[0].style.size': 10
      },
      parentKeyPath: 'series[0].extensionMark[0].style.size',
      aliasKeyPath: 'bar.extensionMark[0].style.size'
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
});
