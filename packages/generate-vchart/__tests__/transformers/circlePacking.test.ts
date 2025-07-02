import { generateChart } from '../../src';
import { TWO_FIELD_DATA } from '../common';

describe('generateChart of circlePacking', () => {
  it('should generate circlePacking chart', () => {
    const { spec } = generateChart('circle_packing', {
      dataTable: TWO_FIELD_DATA,
      cell: {
        size: 'value',
        color: 'name'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'circlePacking',
      data: {
        id: 'data',
        values: TWO_FIELD_DATA
      },
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      categoryField: 'name',
      valueField: 'value',
      drill: true,
      layoutPadding: 5
    });
  });
});
