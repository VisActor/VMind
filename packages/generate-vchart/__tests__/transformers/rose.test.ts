import { generateChart } from '../../src';
import { TWO_FIELD_DATA } from '../common';

describe('generate rose chart', () => {
  it('should generate simple rose chart', () => {
    const chart = generateChart('rose', {
      dataTable: TWO_FIELD_DATA,

      cell: {
        color: 'name',
        radius: 'value'
      },
      spec: {}
    });

    expect(chart.spec).toEqual({
      type: 'rose',
      data: {
        id: 'data',
        values: TWO_FIELD_DATA
      },
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      valueField: 'value',
      categoryField: 'name',
      seriesField: 'name',
      outerRadius: 0.8,
      innerRadius: 0.2,
      axes: [
        {
          orient: 'angle',
          domainLine: {
            visible: false
          },
          grid: {
            visible: false,
            alignWithLabel: false
          },
          label: {
            visible: true
          }
        },
        {
          orient: 'radius',
          grid: {
            visible: false,
            smooth: true
          }
        }
      ],
      legends: [
        {
          orient: 'right',
          type: 'discrete',
          item: {
            visible: true
          }
        }
      ],
      label: {
        visible: true
      }
    });
  });

  it('should generate rose chart of different color', () => {
    const chart = generateChart('rose', {
      dataTable: TWO_FIELD_DATA,

      cell: {
        category: 'name',
        radius: 'value'
      },
      spec: {}
    });

    expect(chart.spec).toEqual({
      type: 'rose',
      data: {
        id: 'data',
        values: TWO_FIELD_DATA
      },
      color: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55'],
      valueField: 'value',
      categoryField: 'name',
      seriesField: 'name',
      outerRadius: 0.8,
      innerRadius: 0.2,
      axes: [
        {
          orient: 'angle',
          domainLine: {
            visible: false
          },
          grid: {
            visible: false,
            alignWithLabel: false
          },
          label: {
            visible: true
          }
        },
        {
          orient: 'radius',
          grid: {
            visible: false,
            smooth: true
          }
        }
      ],
      legends: [
        {
          orient: 'right',
          type: 'discrete',
          item: {
            visible: true
          }
        }
      ],
      label: {
        visible: true
      }
    });
  });
});
