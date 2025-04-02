import VMind, { ChartType } from '../../../src';

const spec = {
  type: 'common',
  seriesField: 'color',
  data: [
    {
      id: 'id0',
      values: [
        {
          x: '周一',
          type: '早餐',
          y: 15
        },
        {
          x: '周一',
          type: '午餐',
          y: 25
        },
        {
          x: '周二',
          type: '早餐',
          y: 12
        },
        {
          x: '周二',
          type: '午餐',
          y: 30
        },
        {
          x: '周三',
          type: '早餐',
          y: 15
        },
        {
          x: '周三',
          type: '午餐',
          y: 24
        },
        {
          x: '周四',
          type: '早餐',
          y: 10
        },
        {
          x: '周四',
          type: '午餐',
          y: 25
        },
        {
          x: '周五',
          type: '早餐',
          y: 13
        },
        {
          x: '周五',
          type: '午餐',
          y: 20
        },
        {
          x: '周六',
          type: '早餐',
          y: 10
        },
        {
          x: '周六',
          type: '午餐',
          y: 22
        },
        {
          x: '周日',
          type: '早餐',
          y: 12
        },
        {
          x: '周日',
          type: '午餐',
          y: 19
        }
      ]
    },
    {
      id: 'id1',
      values: [
        {
          x: '周一',
          type: '饮料',
          y: 22
        },
        {
          x: '周二',
          type: '饮料',
          y: 43
        },
        {
          x: '周三',
          type: '饮料',
          y: 33
        },
        {
          x: '周四',
          type: '饮料',
          y: 22
        },
        {
          x: '周五',
          type: '饮料',
          y: 10
        },
        {
          x: '周六',
          type: '饮料',
          y: 30
        },
        {
          x: '周日',
          type: '饮料',
          y: 50
        }
      ]
    }
  ],
  series: [
    {
      type: 'bar',
      id: 'bar',
      dataIndex: 0,
      label: {
        visible: true
      },
      seriesField: 'type',
      xField: ['x', 'type'],
      yField: 'y'
    },
    {
      type: 'line',
      id: 'line',
      dataIndex: 1,
      label: {
        visible: true
      },
      seriesField: 'type',
      xField: 'x',
      yField: 'y',
      stack: false
    }
  ],
  axes: [
    {
      orient: 'left',
      seriesIndex: [0]
    },
    {
      orient: 'right',
      seriesId: ['line'],
      grid: {
        visible: false
      }
    },
    {
      orient: 'bottom',
      label: {
        visible: true
      },
      type: 'band'
    }
  ],
  legends: {
    visible: true,
    orient: 'bottom'
  },
  animation: false
};

const insights: any[] = [
  {
    name: 'base',
    type: 'avg',
    fieldId: 'y',
    value: 30,
    significant: 1,
    data: [],
    info: {
      seriesId: 'line',
      seriesIndex: null,
      isAxesArea: true,
      titleName: '右轴',
      axesDirection: 'right'
    },
    textContent: {
      content: '${a}的平均值是${b}。',
      variables: {
        a: {
          value: '右轴',
          fieldName: 'y'
        },
        b: {
          value: 30,
          isMeasure: true,
          fieldName: null
        }
      },
      plainText: '右轴的平均值是30。'
    }
  },
  {
    name: 'base',
    type: 'avg',
    fieldId: 'y',
    value: 18,
    significant: 1,
    data: [],
    info: {
      seriesId: '',
      seriesIndex: 0,
      isAxesArea: true,
      titleName: '左轴',
      axesDirection: 'left'
    },
    textContent: {
      content: '${a}的平均值是${b}。',
      variables: {
        a: {
          value: '左轴',
          fieldName: 'y'
        },
        b: {
          value: 18,
          isMeasure: true,
          fieldName: null
        }
      },
      plainText: '左轴的平均值是18。'
    }
  },
  {
    name: 'base',
    type: 'max',
    fieldId: 'y',
    value: 50,
    significant: 1,
    data: [
      {
        index: 6,
        dataItem: {
          x: '周日',
          type: '饮料',
          y: 50
        }
      }
    ],
    info: {
      isAxesArea: true,
      titleName: '右轴',
      seriesId: 'line',
      seriesIndex: null,
      isGroup: false,
      dimValue: '周日'
    },
    textContent: {
      content: '${a}的最大值出现在${b}，其值为${c}。',
      variables: {
        a: {
          value: '右轴',
          fieldName: 'y'
        },
        b: {
          isDimValue: true,
          value: '周日',
          fieldName: 'x'
        },
        c: {
          value: 50,
          isMeasure: true,
          fieldName: null
        }
      },
      plainText: '右轴的最大值出现在周日，其值为50。'
    }
  },
  {
    name: 'base',
    type: 'max',
    fieldId: 'y',
    value: 30,
    significant: 1,
    data: [
      {
        index: 3,
        dataItem: {
          x: '周二',
          type: '午餐',
          y: 30
        }
      }
    ],
    info: {
      isAxesArea: true,
      titleName: '左轴',
      seriesId: '',
      seriesIndex: 0,
      isGroup: false,
      dimValue: '周二'
    },
    textContent: {
      content: '${a}的最大值出现在${b}，其值为${c}。',
      variables: {
        a: {
          value: '左轴',
          fieldName: 'y'
        },
        b: {
          isDimValue: true,
          value: '周二',
          fieldName: 'x'
        },
        c: {
          value: 30,
          isMeasure: true,
          fieldName: null
        }
      },
      plainText: '左轴的最大值出现在周二，其值为30。'
    }
  },
  {
    name: 'base',
    type: 'min',
    fieldId: 'y',
    value: 10,
    significant: 1,
    data: [
      {
        index: 4,
        dataItem: {
          x: '周五',
          type: '饮料',
          y: 10
        }
      }
    ],
    info: {
      seriesId: 'line',
      seriesIndex: null,
      isAxesArea: true,
      titleName: '右轴',
      isGroup: false,
      dimValue: '周五'
    },
    textContent: {
      content: '${a}的最小值出现在${b}，其值为${c}。',
      variables: {
        a: {
          value: '右轴',
          fieldName: 'y'
        },
        b: {
          isDimValue: true,
          value: '周五',
          fieldName: 'x'
        },
        c: {
          value: 10,
          isMeasure: true,
          fieldName: null
        }
      },
      plainText: '右轴的最小值出现在周五，其值为10。'
    }
  },
  {
    name: 'base',
    type: 'min',
    fieldId: 'y',
    value: 10,
    significant: 1,
    data: [
      {
        index: 6,
        dataItem: {
          x: '周四',
          type: '早餐',
          y: 10
        }
      }
    ],
    info: {
      seriesId: '',
      seriesIndex: 0,
      isAxesArea: true,
      titleName: '左轴',
      isGroup: false,
      dimValue: '周四'
    },
    textContent: {
      content: '${a}的最小值出现在${b}，其值为${c}。',
      variables: {
        a: {
          value: '左轴',
          fieldName: 'y'
        },
        b: {
          isDimValue: true,
          value: '周四',
          fieldName: 'x'
        },
        c: {
          value: 10,
          isMeasure: true,
          fieldName: null
        }
      },
      plainText: '左轴的最小值出现在周四，其值为10。'
    }
  }
];

describe('updateSpecByInsights of dual-axis', () => {
  const vmind = new VMind({});
  it('should add min/max/avg in dual axis', async () => {
    const { newSpec } = await vmind.updateSpecByInsights(spec, insights, { chartType: ChartType.DualAxisChart });
    // left and right axis markline
    expect(newSpec.markLine[0].relativeSeriesId).toEqual('line');
    expect(newSpec.markLine[0].y).toEqual(30);
    expect(newSpec.markLine[1].relativeSeriesIndex).toEqual(0);
    expect(newSpec.markLine[1].y).toEqual(18);

    // left and right mark point
    expect(newSpec.markPoint.length).toEqual(4);
    expect(newSpec.markPoint[0].relativeSeriesId).toEqual('line');
    expect(newSpec.markPoint[2].relativeSeriesId).toEqual('line');
    expect(newSpec.markPoint[1].relativeSeriesIndex).toEqual(0);
    expect(newSpec.markPoint[3].relativeSeriesIndex).toEqual(0);
  });
});
