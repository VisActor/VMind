import { SpecInsightAtom } from '../../../src/atom/specInsight';

const spec = {
  type: 'bar',
  xField: ['State'],
  yField: ['Population'],
  seriesField: 'Age',
  data: [
    {
      id: 'data',
      values: [
        {
          State: 'WY',
          Age: 'Under 5 Years',
          Population: 25635
        },
        {
          State: 'WY',
          Age: '5 to 13 Years',
          Population: 1890
        },
        {
          State: 'WY',
          Age: '14 to 17 Years',
          Population: 9314
        },
        {
          State: 'DC',
          Age: 'Under 5 Years',
          Population: 30352
        },
        {
          State: 'DC',
          Age: '5 to 13 Years',
          Population: 20439
        },
        {
          State: 'DC',
          Age: '14 to 17 Years',
          Population: 10225
        },
        {
          State: 'VT',
          Age: 'Under 5 Years',
          Population: 38253
        },
        {
          State: 'VT',
          Age: '5 to 13 Years',
          Population: 42538
        },
        {
          State: 'VT',
          Age: '14 to 17 Years',
          Population: 15757
        },
        {
          State: 'ND',
          Age: 'Under 5 Years',
          Population: 10000
        },
        {
          State: 'ND',
          Age: '5 to 13 Years',
          Population: 200000
        },
        {
          State: 'ND',
          Age: '14 to 17 Years',
          Population: 5000
        },
        {
          State: 'AK',
          Age: 'Under 5 Years',
          Population: 72083
        },
        {
          State: 'AK',
          Age: '5 to 13 Years',
          Population: 85640
        },
        {
          State: 'AK',
          Age: '14 to 17 Years',
          Population: 72153
        }
      ]
    }
  ],
  axes: [
    {
      type: 'band',
      orient: 'bottom',
      visible: true
    },
    {
      type: 'linear',
      orient: 'left',
      visible: true
    }
  ],
  legends: [
    {
      type: 'discrete',
      visible: true
    }
  ],
  animation: false
};

const insights: any[] = [
  {
    type: 'overall_trend',
    fieldId: 'Population',
    value: 'increasing',
    significant: 0.9725136638884897,
    info: {
      length: 5,
      overall: {
        coordinates: [
          {
            State: 'WY',
            Population: 36839
          },
          {
            State: 'AK',
            Population: 229876
          }
        ],
        start: 0,
        end: 4,
        change: 5.240017372892858,
        startValue: 36839,
        endValue: 229876,
        startDimValue: 'WY',
        endDimValue: 'AK'
      },
      start: 0,
      end: 4,
      maxTrend: 1,
      change: 5.240017372892858,
      startDimValue: 'WY',
      endDimValue: 'AK',
      startValue: 36839,
      endValue: 229876
    },
    data: [],
    name: 'overallTrending',
    textContent: {
      content: '数据整体呈${a}趋势，整体增长了${d}。其中在${b}至${c}间连续${a}。',
      variables: {
        a: {
          value: '上升',
          fieldName: null,
          icon: 'ascendTrend'
        },
        b: {
          isDimValue: true,
          value: 'WY',
          fieldName: 'State'
        },
        c: {
          isDimValue: true,
          value: 'AK',
          fieldName: 'State'
        },
        d: {
          formatValue: '524.0%',
          value: 5.240017372892858,
          valueType: 'ascendTrend',
          fieldName: null
        }
      },
      plainText: '数据整体呈上升趋势，整体增长了524.0%。其中在WY至AK间连续上升。'
    }
  },
  {
    name: 'base',
    type: 'max',
    fieldId: 'Population',
    value: 229876,
    significant: 1,
    data: [
      {
        index: 12,
        dataItem: {
          State: 'AK',
          Age: 'Under 5 Years',
          Population: 72083
        }
      },
      {
        index: 13,
        dataItem: {
          State: 'AK',
          Age: '5 to 13 Years',
          Population: 85640
        }
      },
      {
        index: 14,
        dataItem: {
          State: 'AK',
          Age: '14 to 17 Years',
          Population: 72153
        }
      }
    ],
    info: {
      isAxesArea: false,
      titleName: '',
      seriesId: '',
      seriesIndex: null,
      isGroup: true,
      dimValue: 'AK'
    },
    textContent: {
      content: '最大值位于${b}，值为${c}',
      variables: {
        b: {
          isDimValue: true,
          value: 'AK',
          fieldName: 'State'
        },
        c: {
          value: 229876,
          isMeasure: true,
          fieldName: null
        }
      },
      plainText: '最大值位于AK，值为229876'
    }
  },
  {
    name: 'base',
    type: 'min',
    fieldId: 'Population',
    value: 36839,
    significant: 1,
    data: [
      {
        index: 0,
        dataItem: {
          State: 'WY',
          Age: 'Under 5 Years',
          Population: 25635
        }
      },
      {
        index: 1,
        dataItem: {
          State: 'WY',
          Age: '5 to 13 Years',
          Population: 1890
        }
      },
      {
        index: 2,
        dataItem: {
          State: 'WY',
          Age: '14 to 17 Years',
          Population: 9314
        }
      }
    ],
    info: {
      seriesId: '',
      seriesIndex: null,
      isAxesArea: false,
      titleName: '',
      isGroup: true,
      dimValue: 'WY'
    },
    textContent: {
      content: '最小值位于${b}，值为${c}',
      variables: {
        b: {
          isDimValue: true,
          value: 'WY',
          fieldName: 'State'
        },
        c: {
          value: 36839,
          isMeasure: true,
          fieldName: null
        }
      },
      plainText: '最小值位于WY，值为36839'
    }
  },
  {
    type: 'majority_value',
    data: [
      {
        index: 10,
        dataItem: {
          State: 'ND',
          Age: '5 to 13 Years',
          Population: 200000
        }
      }
    ],
    fieldId: 'Population',
    value: 200000,
    significant: 0.9302325581395349,
    seriesName: '5 to 13 Years',
    info: {
      ratio: 0.9302325581395349,
      dimensionName: 'ND'
    },
    name: 'majorityValue',
    textContent: {
      content: '${a}在${b}的占比贡献度显著，占比高达${c}',
      variables: {
        a: {
          value: '5 to 13 Years',
          fieldName: 'Age'
        },
        b: {
          value: 'ND',
          isDimValue: true,
          fieldName: 'State'
        },
        c: {
          value: 0.9302325581395349,
          formatValue: '93.0%',
          fieldName: 'Population',
          icon: 'ratio'
        }
      },
      plainText: '5 to 13 Years在ND的占比贡献度显著，占比高达93.0%'
    }
  }
];

describe('updateSpecByInsights of stacked bar chart', () => {
  let newSpec: any;

  beforeAll(async () => {
    const specInishgtAtom = new SpecInsightAtom({ spec, insights }, {});
    newSpec = (await specInishgtAtom.run()).newSpec;
  });
  it('only base statistic insights', () => {
    expect(newSpec.markPoint.length).toEqual(2);
  });
  it('min/max was stack value', () => {
    expect(newSpec.markPoint[0].coordinate).toEqual({
      State: 'AK',
      Age: 'Under 5 Years',
      Population: 229876
    });
    expect(newSpec.markPoint[1].coordinate).toEqual({
      State: 'WY',
      Age: 'Under 5 Years',
      Population: 36839
    });
  });
  it('growth overall of stacked chart', () => {
    expect(newSpec.markLine[0].coordinates).toEqual([
      {
        State: 'WY',
        Population: 36839
      },
      {
        State: 'AK',
        Population: 229876
      }
    ]);
  });
});
