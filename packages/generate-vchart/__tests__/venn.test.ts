import { generateChart } from '../src';

describe('generateChart of venn', () => {
  it('should generate venn chart', () => {
    const data = [
      {
        sets: 'A and B',
        name: 'A',
        value: 100
      },
      {
        sets: 'A and B',
        name: 'B',
        value: 100
      },
      {
        sets: 'only A',
        name: 'A',
        value: 600
      },
      {
        sets: 'only B',
        name: 'B',
        value: 500
      }
    ];
    const { spec } = generateChart('venn', {
      dataTable: data,
      cell: {
        color: ['sets', 'name'],
        size: 'value'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'venn',
      data: {
        values: [
          {
            sets: ['A', 'B'],
            value: 100
          },
          {
            sets: ['A'],
            value: 600
          },
          {
            sets: ['B'],
            value: 500
          }
        ]
      },
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      valueField: 'value',
      categoryField: 'sets',
      seriesField: 'sets',
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

  it('should generate venn chart', () => {
    const data = [
      {
        sets: 'A&B&C',
        value: 100
      },
      {
        sets: 'A&B',
        value: 300
      },
      {
        sets: 'B&C',
        value: 200
      },
      {
        sets: 'A',
        value: 500
      },
      {
        sets: 'B',
        value: 600
      },
      {
        sets: 'C',
        value: 700
      }
    ];
    const { spec } = generateChart('venn', {
      dataTable: data,
      cell: {
        sets: 'sets',
        size: 'value'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'venn',
      data: {
        values: [
          {
            sets: ['A', 'B', 'C'],
            value: 100
          },
          {
            sets: ['A', 'B'],
            value: 300
          },
          {
            sets: ['B', 'C'],
            value: 200
          },
          {
            sets: ['A'],
            value: 500
          },
          {
            sets: ['B'],
            value: 600
          },
          {
            sets: ['C'],
            value: 700
          }
        ]
      },
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      valueField: 'value',
      categoryField: 'sets',
      seriesField: 'sets',
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
});
