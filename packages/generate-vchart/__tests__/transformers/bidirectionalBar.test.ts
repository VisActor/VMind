import { generateChart } from '../../src';

const MOCK_DATA_TABLE = [
  { group: 'A', name: 'Category1', value: 10 },
  { group: 'A', name: 'Category2', value: 15 },
  { group: 'B', name: 'Category1', value: 20 },
  { group: 'B', name: 'Category2', value: 25 }
];
const MOCK_SERIES = [
  {
    type: 'bar',
    data: [
      { group: 'A', name: 'Category1', value: 10 },
      { group: 'A', name: 'Category2', value: 15 }
    ]
  },
  {
    type: 'bar',
    data: [
      { group: 'B', name: 'Category1', value: 20 },
      { group: 'B', name: 'Category2', value: 25 }
    ]
  }
];

const layout = {
  type: 'grid',
  col: 4,
  row: 4,
  elements: [
    {
      modelId: 'title',
      col: 0,
      row: 0,
      colSpan: 4
    },
    {
      modelId: 'legend',
      col: 0,
      row: 3,
      colSpan: 4
    },
    {
      modelId: 'leftYAxis',
      col: 0,
      row: 1
    },
    {
      modelId: 'leftRegion',
      col: 1,
      row: 1
    },
    {
      modelId: 'leftXAxis',
      col: 1,
      row: 2
    },
    {
      modelId: 'rightRegion',
      col: 2,
      row: 1
    },
    {
      modelId: 'rightYAxis',
      col: 3,
      row: 1
    },
    {
      modelId: 'rightXAxis',
      col: 2,
      row: 2
    }
  ]
};
const region = [
  {
    id: 'leftRegion'
  },
  {
    id: 'rightRegion'
  }
];
const axes = [
  {
    id: 'leftYAxis',
    seriesId: ['bar0'],
    orient: 'left',
    type: 'band'
  },
  {
    id: 'rightYAxis',
    seriesId: ['bar1'],
    orient: 'right',
    type: 'band'
  },
  {
    id: 'leftXAxis',
    seriesId: ['bar0'],
    orient: 'bottom',
    type: 'linear',
    inverse: true
  },
  {
    id: 'rightXAxis',
    seriesId: ['bar1'],
    orient: 'bottom',
    type: 'linear'
  }
];

describe('generate bidirectional bar chart', () => {
  it('should generate bidirectional bar chart with dataTable', () => {
    const { spec } = generateChart('bidirectionalBar', {
      dataTable: MOCK_DATA_TABLE,
      cell: {
        x: 'name',
        y: 'value',
        color: 'group'
      },
      spec: {}
    });
    expect(spec.type).toBe('common');
    expect(spec.layout).toEqual(layout);
    expect(spec.region).toEqual(region);
    expect(spec.axes).toEqual(axes);
    expect(spec.series).toEqual([
      {
        type: 'bar',
        data: {
          id: 'data_bar0',
          values: MOCK_DATA_TABLE.filter(item => item.group === 'A')
        },
        regionId: 'leftRegion',
        direction: 'horizontal',
        bar: {
          style: {
            fill: '#5b9bd5'
          }
        },
        id: 'bar0',
        xField: 'value',
        yField: 'name'
      },
      {
        type: 'bar',
        data: {
          id: 'data_bar1',
          values: MOCK_DATA_TABLE.filter(item => item.group === 'B')
        },
        regionId: 'rightRegion',
        direction: 'horizontal',
        bar: {
          style: {
            fill: '#ec7c82'
          }
        },
        id: 'bar1',
        xField: 'value',
        yField: 'name'
      }
    ]);
  });

  it('should generate bidirectional bar chart with series', () => {
    const { spec } = generateChart('bidirectionalBar', {
      // 需要传入dataTable，否则类型错误
      dataTable: undefined,
      series: MOCK_SERIES,
      cell: {
        x: 'name',
        y: 'value',
        color: 'group'
      },
      spec: {}
    });
    expect(spec.type).toBe('common');
    expect(spec.layout).toEqual(layout);
    expect(spec.region).toEqual(region);
    expect(spec.axes).toEqual(axes);
    expect(spec.series).toEqual([
      {
        type: 'bar',
        data: {
          id: 'data_bar0',
          values: MOCK_SERIES[0].data
        },
        regionId: 'leftRegion',
        direction: 'horizontal',
        bar: {
          style: {
            fill: '#5b9bd5'
          }
        },
        id: 'bar0',
        xField: 'value',
        yField: 'name'
      },
      {
        type: 'bar',
        data: {
          id: 'data_bar1',
          values: MOCK_SERIES[1].data
        },
        regionId: 'rightRegion',
        direction: 'horizontal',
        bar: {
          style: {
            fill: '#ec7c82'
          }
        },
        id: 'bar1',
        xField: 'value',
        yField: 'name'
      }
    ]);
  });
});
