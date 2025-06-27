import { generateChart } from '../src';
import { TWO_FIELD_DATA } from './common';

describe('generate funnel chart', () => {
  it('should generate simple funnel chart', () => {
    const { spec } = generateChart('funnel', {
      dataTable: TWO_FIELD_DATA,
      cell: {
        x: 'name',
        y: 'value'
      },
      spec: {}
    });

    expect(spec).toEqual({
      data: {
        id: 'data',
        values: TWO_FIELD_DATA
      },
      label: { visible: true },
      type: 'funnel',
      valueField: 'value',
      categoryField: 'name',
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55']
    });
  });

  it('should generate simple funnel chart', () => {
    const { spec } = generateChart('funnel', {
      dataTable: TWO_FIELD_DATA,
      cell: {
        color: 'name',
        value: 'value'
      },
      spec: {}
    });

    expect(spec).toEqual({
      data: {
        id: 'data',
        values: TWO_FIELD_DATA
      },
      label: { visible: true },
      type: 'funnel',
      valueField: 'value',
      categoryField: 'name',
      legends: [
        {
          item: {
            visible: true
          },
          orient: 'right',
          type: 'discrete'
        }
      ],
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55']
    });
  });
});
