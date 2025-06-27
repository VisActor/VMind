import { generateChart } from '../src';
import { DUAL_AXIS_DATA_THREE } from './common';

describe('generateChart of rangeColumn', () => {
  it('should generate rangeColumn chart', () => {
    const { spec } = generateChart('range_column', {
      dataTable: DUAL_AXIS_DATA_THREE,
      cell: {
        x: 'name',
        y: ['value', 'value1']
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'rangeColumn',
      data: {
        id: 'data',
        values: DUAL_AXIS_DATA_THREE
      },
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      yField: 'name',
      xField: ['value', 'value1'],
      direction: 'horizontal',
      label: { visible: true }
    });
  });
});
