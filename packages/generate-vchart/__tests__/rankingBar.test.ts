import { generateChart } from '../src';
import { COLORS, RANKING_BAR_DATA, THREE_FIELD_DATA, THREE_FIELD_DATA_1, TWO_FIELD_DATA } from './common';

describe('generate rankingBar', () => {
  it('should generate linear gradient rectangles', () => {
    const { spec } = generateChart('ranking_bar', {
      dataTable: RANKING_BAR_DATA,
      cell: {
        time: 'year',
        x: 'name',
        y: 'value'
      },
      spec: {}
    });

    // expect(JSON.stringify(spec)).toEqual('');
    expect(spec).toMatchObject({
      type: 'bar',
      timeField: 'year',
      data: [
        {
          id: 'id',
          values: [
            {
              name: 'A',
              value: 100,
              year: '2001'
            },
            {
              name: 'B',
              value: 80,
              year: '2001'
            }
          ]
        },
        {
          id: 'year',
          values: [
            {
              year: '2001'
            }
          ]
        }
      ],
      player: {
        type: 'continuous',
        orient: 'bottom',
        auto: true,
        loop: true,
        dx: 0,
        position: 'middle',
        interval: 2500,
        specs: [
          {
            data: [
              {
                id: 'id',
                values: [
                  {
                    name: 'A',
                    value: 100,
                    year: '2001'
                  },
                  {
                    name: 'B',
                    value: 80,
                    year: '2001'
                  }
                ]
              },
              {
                id: 'year',
                values: [
                  {
                    year: '2001'
                  }
                ]
              }
            ]
          },
          {
            data: [
              {
                id: 'id',
                values: [
                  {
                    name: 'B',
                    value: 90,
                    year: '2002'
                  },
                  {
                    name: 'A',
                    value: 80,
                    year: '2002'
                  }
                ]
              },
              {
                id: 'year',
                values: [
                  {
                    year: '2002'
                  }
                ]
              }
            ]
          }
        ],
        slider: {
          railStyle: {
            visible: false,
            height: 6
          },
          trackStyle: {
            visible: false
          },
          handlerStyle: {
            visible: false
          }
        },
        controller: {
          backward: {
            style: {
              visible: false,
              size: 12
            }
          },
          forward: {
            style: {
              visible: false,
              size: 12
            }
          },
          start: {
            style: {
              visible: false
            },
            order: 1,
            position: 'end'
          },
          pause: {
            style: {
              visible: false
            }
          }
        }
      },
      animationUpdate: {
        bar: [
          {
            type: 'update',
            options: {
              excludeChannels: ['x', 'y']
            },
            duration: 1250,
            easing: 'linear'
          },
          {
            channel: ['x', 'y'],
            options: {
              excludeChannels: ['width']
            },
            duration: 1250,
            easing: 'linear'
          }
        ],
        axis: {
          duration: 1250,
          easing: 'linear'
        }
      },
      color: [
        {
          gradient: 'linear',
          x0: 1,
          y0: 0.01,
          x1: 0.01,
          y1: 0.01,
          stops: [
            {
              offset: 0,
              color: '#1DD0F3FF'
            },
            {
              offset: 1,
              color: '#1DD0F300'
            }
          ]
        },
        {
          gradient: 'linear',
          x0: 1,
          y0: 0.01,
          x1: 0.01,
          y1: 0.01,
          stops: [
            {
              offset: 0,
              color: '#2693FFFF'
            },
            {
              offset: 1,
              color: '#2693FF00'
            }
          ]
        },
        {
          gradient: 'linear',
          x0: 1,
          y0: 0.01,
          x1: 0.01,
          y1: 0.01,
          stops: [
            {
              offset: 0,
              color: '#3259F4FF'
            },
            {
              offset: 1,
              color: '#3259F400'
            }
          ]
        },
        {
          gradient: 'linear',
          x0: 1,
          y0: 0.01,
          x1: 0.01,
          y1: 0.01,
          stops: [
            {
              offset: 0,
              color: '#1B0CA1FF'
            },
            {
              offset: 1,
              color: '#1B0CA100'
            }
          ]
        },
        {
          gradient: 'linear',
          x0: 1,
          y0: 0.01,
          x1: 0.01,
          y1: 0.01,
          stops: [
            {
              offset: 0,
              color: '#CB2BC6FF'
            },
            {
              offset: 1,
              color: '#CB2BC600'
            }
          ]
        },
        {
          gradient: 'linear',
          x0: 1,
          y0: 0.01,
          x1: 0.01,
          y1: 0.01,
          stops: [
            {
              offset: 0,
              color: '#FF581DFF'
            },
            {
              offset: 1,
              color: '#FF581D00'
            }
          ]
        },
        {
          gradient: 'linear',
          x0: 1,
          y0: 0.01,
          x1: 0.01,
          y1: 0.01,
          stops: [
            {
              offset: 0,
              color: '#FBBB16FF'
            },
            {
              offset: 1,
              color: '#FBBB1600'
            }
          ]
        },
        {
          gradient: 'linear',
          x0: 1,
          y0: 0.01,
          x1: 0.01,
          y1: 0.01,
          stops: [
            {
              offset: 0,
              color: '#F6FB17FF'
            },
            {
              offset: 1,
              color: '#F6FB1700'
            }
          ]
        },
        {
          gradient: 'linear',
          x0: 1,
          y0: 0.01,
          x1: 0.01,
          y1: 0.01,
          stops: [
            {
              offset: 0,
              color: '#73EC55FF'
            },
            {
              offset: 1,
              color: '#73EC5500'
            }
          ]
        }
      ],
      xField: 'value',
      yField: 'name',
      seriesField: 'name',
      direction: 'horizontal',
      axes: [
        {
          animation: true,
          orient: 'bottom',
          type: 'linear',
          visible: true,
          title: {
            visible: false
          },
          grid: {
            visible: true
          }
        },
        {
          animation: true,
          id: 'axis-left',
          orient: 'left',
          tick: {
            visible: false
          },
          title: {
            visible: false
          },
          type: 'band'
        }
      ],
      customMark: [
        {
          type: 'text',
          dataId: 'year',
          style: {
            textBaseline: 'bottom',
            fontSize: 130,
            textAlign: 'right',
            fontFamily: 'PingFang SC',
            fontWeight: 600,
            fill: 'grey',
            fillOpacity: 0.5
            // text: (datum: { year: any }) => datum.year,
            // x: () => 700,
            // y: () => 480 - 50
          }
        }
      ],
      label: {
        visible: true,
        style: {
          fill: '#FFFFFF',
          stroke: null
        },
        animation: {
          duration: 1250,
          easing: 'linear'
        }
      }
    });
  });

  it('should generate simple ranking bar chart', () => {
    const { spec } = generateChart('ranking_bar', {
      dataTable: RANKING_BAR_DATA,
      cell: {
        time: 'year',
        x: 'name',
        y: 'value'
      },
      colors: COLORS,
      spec: {}
    });

    // expect(JSON.stringify(spec)).toEqual('');
    expect(spec).toMatchObject({
      type: 'bar',
      timeField: 'year',
      data: [
        {
          id: 'id',
          values: [
            {
              name: 'A',
              value: 100,
              year: '2001'
            },
            {
              name: 'B',
              value: 80,
              year: '2001'
            }
          ]
        },
        {
          id: 'year',
          values: [
            {
              year: '2001'
            }
          ]
        }
      ],
      player: {
        type: 'continuous',
        orient: 'bottom',
        auto: true,
        loop: true,
        dx: 0,
        position: 'middle',
        interval: 2500,
        specs: [
          {
            data: [
              {
                id: 'id',
                values: [
                  {
                    name: 'A',
                    value: 100,
                    year: '2001'
                  },
                  {
                    name: 'B',
                    value: 80,
                    year: '2001'
                  }
                ]
              },
              {
                id: 'year',
                values: [
                  {
                    year: '2001'
                  }
                ]
              }
            ]
          },
          {
            data: [
              {
                id: 'id',
                values: [
                  {
                    name: 'B',
                    value: 90,
                    year: '2002'
                  },
                  {
                    name: 'A',
                    value: 80,
                    year: '2002'
                  }
                ]
              },
              {
                id: 'year',
                values: [
                  {
                    year: '2002'
                  }
                ]
              }
            ]
          }
        ],
        slider: {
          railStyle: {
            visible: false,
            height: 6
          },
          trackStyle: {
            visible: false
          },
          handlerStyle: {
            visible: false
          }
        },
        controller: {
          backward: {
            style: {
              visible: false,
              size: 12
            }
          },
          forward: {
            style: {
              visible: false,
              size: 12
            }
          },
          start: {
            style: {
              visible: false
            },
            order: 1,
            position: 'end'
          },
          pause: {
            style: {
              visible: false
            }
          }
        }
      },
      animationUpdate: {
        bar: [
          {
            type: 'update',
            options: {
              excludeChannels: ['x', 'y']
            },
            duration: 1250,
            easing: 'linear'
          },
          {
            channel: ['x', 'y'],
            options: {
              excludeChannels: ['width']
            },
            duration: 1250,
            easing: 'linear'
          }
        ],
        axis: {
          duration: 1250,
          easing: 'linear'
        }
      },
      color: COLORS,
      xField: 'value',
      yField: 'name',
      seriesField: 'name',
      direction: 'horizontal',
      axes: [
        {
          animation: true,
          orient: 'bottom',
          type: 'linear',
          visible: true,
          title: {
            visible: false
          },
          grid: {
            visible: true
          }
        },
        {
          animation: true,
          id: 'axis-left',
          orient: 'left',
          tick: {
            visible: false
          },
          title: {
            visible: false
          },
          type: 'band'
        }
      ],
      customMark: [
        {
          type: 'text',
          dataId: 'year',
          style: {
            textBaseline: 'bottom',
            fontSize: 130,
            textAlign: 'right',
            fontFamily: 'PingFang SC',
            fontWeight: 600,
            fill: 'grey',
            fillOpacity: 0.5
            // text: (datum: { year: any }) => datum.year,
            // x: () => 700,
            // y: () => 480 - 50
          }
        }
      ],
      label: {
        visible: true,
        style: {
          fill: '#FFFFFF',
          stroke: null
        },
        animation: {
          duration: 1250,
          easing: 'linear'
        }
      }
    });
  });
});
