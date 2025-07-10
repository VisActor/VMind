import { generateChart } from '../../src';
import { TWO_FIELD_DATA } from '../common';

describe('generateChart of waterfall', () => {
  it('should generate chart of simple data', () => {
    const { spec } = generateChart('waterfall', {
      dataTable: TWO_FIELD_DATA,
      cell: { x: 'name', y: 'value' },
      spec: {}
    });

    // expect(JSON.stringify(spec)).toEqual('');

    expect(spec).toEqual({
      type: 'waterfall',
      data: {
        id: 'data',
        values: TWO_FIELD_DATA
      },
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      xField: 'name',
      yField: 'value',
      total: {
        type: 'end',
        text: 'total'
      },
      axes: [
        { orient: 'bottom', title: { visible: false }, type: 'band' },
        {
          orient: 'left',
          title: { visible: false },
          type: 'linear'
        }
      ],
      stackLabel: {
        valueType: 'absolute'
      }
    });
  });

  it('should hide total when waterfallTotal.visible is false', () => {
    const { spec } = generateChart('waterfall', {
      dataTable: TWO_FIELD_DATA,
      cell: { x: 'name', y: 'value' },
      spec: {},
      waterfallTotal: { visible: false }
    });

    // expect(JSON.stringify(spec)).toEqual('');

    expect(spec).toEqual({
      type: 'waterfall',
      data: {
        id: 'data',
        values: TWO_FIELD_DATA
      },
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      xField: 'name',
      yField: 'value',
      axes: [
        { orient: 'bottom', title: { visible: false }, type: 'band' },
        {
          orient: 'left',
          title: { visible: false },
          type: 'linear'
        }
      ],
      stackLabel: {
        valueType: 'absolute'
      }
    });
  });
});
