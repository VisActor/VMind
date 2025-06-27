import { generateChart } from '../src';

describe('genetateChart of linear progress', () => {
  it('should generate linear progress chart', () => {
    const { spec, cell } = generateChart('linear_progress', {
      dataTable: [
        {
          name: 'x',
          value: 0.68
        }
      ],
      cell: {
        x: 'name',
        y: 'value'
      },
      spec: {}
    });

    expect(JSON.parse(JSON.stringify(spec))).toEqual({
      type: 'linearProgress',
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
      xField: 'value',
      yField: 'name',
      cornerRadius: 20,
      axes: [
        {
          orient: 'left',
          type: 'band',
          domainLine: {
            visible: false
          },
          label: {},
          tick: {
            visible: false
          }
        },
        {
          orient: 'bottom',
          type: 'linear',
          visible: true,
          grid: {
            visible: false
          },
          label: {
            flush: true
          }
        }
      ]
    });
  });
});
