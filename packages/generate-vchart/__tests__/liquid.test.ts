import { generateChart } from '../src';

describe('generateChart', () => {
  it('should generate liquid chart', () => {
    const { spec } = generateChart('liquid', {
      dataTable: [
        {
          x: 'x',
          y: 0.68
        }
      ],
      cell: {
        value: 'y'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'liquid',
      valueField: 'y',
      data: {
        id: 'data',
        values: [
          {
            x: 'x',
            y: 0.68
          }
        ]
      },
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      indicatorSmartInvert: true,
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
            text: 'y'
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
