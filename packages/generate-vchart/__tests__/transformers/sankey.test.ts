import { generateChart } from '../../src';
import { SANKEY_DATA } from '../common';

describe('sankey', () => {
  it('should generate a sankey chart spec', () => {
    const { spec } = generateChart('sankey', {
      dataTable: SANKEY_DATA,
      cell: { source: 'source', target: 'target', value: 'value' },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'sankey',
      data: {
        id: 'data',
        values: [
          {
            nodes: [
              {
                name: 'a'
              },
              {
                name: 'b'
              },
              {
                name: 'c'
              }
            ],
            links: [
              {
                source: 0,
                target: 1,
                value: 10
              },
              {
                source: 1,
                target: 2,
                value: 5
              },
              {
                source: 0,
                target: 2,
                value: 8
              }
            ]
          }
        ]
      },
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      sourceField: 'source',
      targetField: 'target',
      valueField: 'value',
      categoryField: 'name',
      label: {
        visible: true
      }
    });
  });
});
