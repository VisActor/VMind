import { generateChart } from '../src';
import { BASIC_HEAT_MAP_COLOR_THEMES } from '../src/utils/constants';
import { SUNBURST_DATA } from './common';

describe('generateChart', () => {
  it('should generate heatmap chart', () => {
    const { spec } = generateChart('heatmap', {
      dataTable: SUNBURST_DATA,
      cell: {
        x: 'country',
        y: 'region',
        size: 'value'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'heatmap',
      data: [
        {
          id: 'data',
          values: SUNBURST_DATA
        }
      ],
      color: {
        type: 'linear',
        domain: [
          {
            dataId: 'data',
            fields: ['value']
          }
        ],
        range: BASIC_HEAT_MAP_COLOR_THEMES
      },
      series: [
        {
          type: 'heatmap',
          xField: 'country',
          yField: 'region',
          valueField: 'value',
          cell: {
            style: {
              fill: {
                field: 'value',
                scale: 'color'
              }
            }
          }
        }
      ],
      axes: [
        {
          orient: 'bottom',
          type: 'band',
          grid: {
            visible: false
          },
          domainLine: {
            visible: false
          }
        },
        {
          orient: 'left',
          type: 'band',
          grid: {
            visible: false
          },
          domainLine: {
            visible: false
          }
        }
      ],
      legends: {
        visible: true,
        orient: 'right',
        position: 'start',
        type: 'color',
        field: 'value'
      }
    });
  });
});
