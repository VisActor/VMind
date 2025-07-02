import { generateChart } from '../../src';

describe('generateChart', () => {
  it('should generate gauge chart', () => {
    const { spec } = generateChart('gauge', {
      dataTable: [
        {
          x: 'x',
          y: 0.68
        }
      ],
      cell: {
        size: 'y',
        color: 'x'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'gauge',
      data: [
        {
          id: 'data',
          values: [
            {
              x: 'x',
              y: 0.68
            }
          ]
        }
      ],
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      valueField: 'y',
      categoryField: 'x',
      outerRadius: 0.8,
      innerRadius: 0.5,
      startAngle: -180,
      endAngle: 0
    });
  });
});
