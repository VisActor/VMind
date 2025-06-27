import { generateChart } from '../src';
import { SUNBURST_DATA } from './common';

describe('generateChart of sunburst', () => {
  it('should generate sunburst chart', () => {
    const { spec } = generateChart('sunburst', {
      dataTable: SUNBURST_DATA,
      cell: {
        color: ['country', 'region'],
        size: 'value'
      },
      spec: {}
    });

    expect(JSON.parse(JSON.stringify(spec))).toEqual({
      type: 'sunburst',
      data: {
        id: 'data',
        values: [
          {
            name: 'a',
            children: [
              {
                name: 'top',
                value: 10
              },
              {
                name: 'bottom',
                value: 7
              }
            ]
          },
          {
            name: 'b',
            children: [
              {
                name: 'top',
                value: 9
              },
              {
                name: 'bottom',
                value: 6
              }
            ]
          },
          {
            name: 'c',
            children: [
              {
                name: 'top',
                value: 8
              },
              {
                name: 'bottom',
                value: 5
              }
            ]
          }
        ]
      },
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      categoryField: 'name',
      valueField: 'value',
      offsetX: 0,
      offsetY: 0,
      outerRadius: 1,
      innerRadius: 0,
      gap: 5,
      drill: true,
      sunburst: {
        visible: true,
        style: {}
      },
      label: {
        visible: true,
        style: {}
      },
      tooltip: {
        mark: {
          title: {}
        }
      }
    });
  });
});
