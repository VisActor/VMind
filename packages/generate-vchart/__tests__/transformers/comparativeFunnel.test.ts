import { generateChart } from '../../src';

const MOCK_DATA_TABLE = [
  { group: 'A', name: 'Category1', value: 10 },
  { group: 'A', name: 'Category2', value: 15 },
  { group: 'B', name: 'Category1', value: 20 },
  { group: 'B', name: 'Category2', value: 25 }
];

const layout = {
  type: 'grid',
  col: 3,
  row: 3,
  colWidth: [
    {
      index: 1,
      size: 120
    }
  ],
  elements: [
    {
      modelId: 'title',
      col: 0,
      row: 0,
      colSpan: 3
    },
    {
      modelId: 'legend',
      col: 0,
      row: 1,
      colSpan: 3
    },
    {
      modelId: 'left',
      col: 0,
      row: 2
    },
    {
      modelId: 'right',
      col: 2,
      row: 2
    }
  ]
};

const region = [
  {
    id: 'left'
  },
  {
    id: 'right'
  }
];

describe('generate comparative funnel chart', () => {
  it('should generate comparative funnel chart with dataTable', () => {
    const { spec } = generateChart('comparativeFunnel', {
      dataTable: MOCK_DATA_TABLE,
      cell: {
        x: 'name',
        y: 'value',
        category: 'group'
      },
      spec: {}
    });
    expect(spec.type).toBe('common');
    expect(spec.layout).toEqual(layout);
    expect(spec.region).toEqual(region);
    expect(spec.data).toEqual(
      Object.entries(
        MOCK_DATA_TABLE.reduce((acc, curr) => {
          if (!acc[curr.group]) {
            acc[curr.group] = [];
          }
          acc[curr.group].push(curr);
          return acc;
        }, {} as any)
      ).map(([group, data]) => ({
        id: group,
        values: data
      }))
    );
    expect(spec.series).toEqual([
      {
        type: 'funnel',
        dataIndex: 0,
        regionIndex: 0,
        isTransform: true,
        gap: 2,
        maxSize: '60%',
        shape: 'rect',
        funnelAlign: 'right',
        categoryField: 'name',
        valueField: 'value',
        heightRatio: 1.5,
        funnel: {
          style: {
            fill: { field: 'group', scale: 'color' },
            cornerRadius: 4
          }
        },
        transform: {
          style: {
            fill: { field: 'group', scale: 'color' },
            fillOpacity: 0.1
          }
        },
        outerLabel: {
          visible: true,
          line: { visible: false },
          style: {
            fontSize: 24,
            fontWeight: 'bold',
            fill: 'black',
            limit: Infinity
          }
        },
        extensionMark: [
          {
            type: 'text',
            dataIndex: 0,
            style: {
              fontSize: 24,
              fill: 'grey',
              textAlign: 'center'
            }
          }
        ]
      },
      {
        type: 'funnel',
        dataIndex: 1,
        regionIndex: 1,
        isTransform: true,
        gap: 2,
        maxSize: '60%',
        shape: 'rect',
        funnelAlign: 'left',
        categoryField: 'name',
        valueField: 'value',
        heightRatio: 1.5,
        funnel: {
          style: {
            fill: { field: 'group', scale: 'color' },
            cornerRadius: 4
          }
        },
        transform: {
          style: {
            fill: { field: 'group', scale: 'color' },
            fillOpacity: 0.1
          }
        },
        outerLabel: {
          visible: true,
          line: { visible: false },
          style: {
            fontSize: 24,
            fontWeight: 'bold',
            fill: 'black',
            limit: Infinity
          }
        }
      }
    ]);
  });
});
