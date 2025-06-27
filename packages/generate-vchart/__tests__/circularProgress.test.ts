import { generateChart } from '../src';

describe('genetateChart of linear progress', () => {
  it('should generate linear progress chart', () => {
    const { spec } = generateChart('circular_progress', {
      dataTable: [
        {
          name: 'x',
          value: 0.68
        }
      ],
      cell: {
        color: 'name',
        value: 'value'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'circularProgress',
      data: {
        id: 'data',
        values: [
          {
            name: 'x',
            value: 0.68
          }
        ]
      },
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      categoryField: 'name',
      valueField: 'value',
      seriesField: 'name',
      radius: 0.8,
      innerRadius: 0.7,
      roundCap: true,
      cornerRadius: 20,
      indicator: {
        visible: true,
        fixed: true,
        trigger: 'none',
        title: {
          visible: true,
          autoLimit: true,
          space: 12,
          style: {
            fontSize: 16,
            fill: 'gray',
            text: 'value'
          }
        },
        content: [
          {
            visible: true,
            style: {
              fontSize: 20,
              fill: '#000',
              text: '68.0%'
            }
          }
        ]
      }
    });
  });
});
