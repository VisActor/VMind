import { generateChart } from '../src';
import { TREEMAP_DATA } from './common';

describe('generateChart of treemap', () => {
  it('should generate treemap', () => {
    const { spec } = generateChart('treemap', {
      dataTable: TREEMAP_DATA,
      cell: {
        color: ['country', 'region'],
        size: 'value'
      },
      spec: {}
    });
    expect(spec).toEqual({
      type: 'treemap',
      data: {
        id: 'data',
        values: [
          {
            name: 'a',
            children: [
              {
                name: 'top_a',
                value: 10
              },
              {
                name: 'bottom_a',
                value: 10
              }
            ]
          },
          {
            name: 'b',
            children: [
              {
                name: 'top_b',
                value: 5
              },
              {
                name: 'bottom_b',
                value: 5
              }
            ]
          },
          {
            name: 'c',
            children: [
              {
                name: 'top_c',
                value: 8
              },
              {
                name: 'bottom_c',
                value: 8
              }
            ]
          }
        ]
      },
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      categoryField: 'name',
      valueField: 'value',
      label: {
        visible: true
      }
    });
  });
});
