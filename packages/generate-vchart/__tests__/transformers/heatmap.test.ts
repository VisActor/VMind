import { generateChart } from '../../src';
import { BASIC_HEAT_MAP_COLOR_THEMES } from '../../src/utils/constants';
import { SUNBURST_DATA } from '../common';

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
      data: {
        id: 'data',
        values: SUNBURST_DATA
      },
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

  it('should generate right chart', () => {
    const data = [
      {
        Day: 'Monday',
        Time: '12a',
        Value: 10
      },
      {
        Day: 'Tuesday',
        Time: '12a',
        Value: 20
      },
      {
        Day: 'Wednesday',
        Time: '12a',
        Value: 30
      },
      {
        Day: 'Thursday',
        Time: '12a',
        Value: 40
      },
      {
        Day: 'Friday',
        Time: '12a',
        Value: 50
      },
      {
        Day: 'Saturday',
        Time: '12a',
        Value: 60
      },
      {
        Day: 'Sunday',
        Time: '12a',
        Value: 70
      },
      {
        Day: 'Monday',
        Time: '1a',
        Value: 15
      },
      {
        Day: 'Tuesday',
        Time: '1a',
        Value: 25
      },
      {
        Day: 'Wednesday',
        Time: '1a',
        Value: 35
      },
      {
        Day: 'Thursday',
        Time: '1a',
        Value: 45
      },
      {
        Day: 'Friday',
        Time: '1a',
        Value: 55
      },
      {
        Day: 'Saturday',
        Time: '1a',
        Value: 65
      },
      {
        Day: 'Sunday',
        Time: '1a',
        Value: 75
      }
    ];

    const { spec } = generateChart('heatmap', {
      dataTable: data,
      cell: {
        x: 'Time',
        y: 'Day',
        size: 'Value'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'heatmap',
      data: {
        id: 'data',
        values: [
          {
            Day: 'Monday',
            Time: '12a',
            Value: 10
          },
          {
            Day: 'Tuesday',
            Time: '12a',
            Value: 20
          },
          {
            Day: 'Wednesday',
            Time: '12a',
            Value: 30
          },
          {
            Day: 'Thursday',
            Time: '12a',
            Value: 40
          },
          {
            Day: 'Friday',
            Time: '12a',
            Value: 50
          },
          {
            Day: 'Saturday',
            Time: '12a',
            Value: 60
          },
          {
            Day: 'Sunday',
            Time: '12a',
            Value: 70
          },
          {
            Day: 'Monday',
            Time: '1a',
            Value: 15
          },
          {
            Day: 'Tuesday',
            Time: '1a',
            Value: 25
          },
          {
            Day: 'Wednesday',
            Time: '1a',
            Value: 35
          },
          {
            Day: 'Thursday',
            Time: '1a',
            Value: 45
          },
          {
            Day: 'Friday',
            Time: '1a',
            Value: 55
          },
          {
            Day: 'Saturday',
            Time: '1a',
            Value: 65
          },
          {
            Day: 'Sunday',
            Time: '1a',
            Value: 75
          }
        ]
      },
      color: {
        type: 'linear',
        domain: [
          {
            dataId: 'data',
            fields: ['Value']
          }
        ],
        range: ['#feedde', '#fdbe85', '#fd8d3c', '#e6550d', '#a63603']
      },
      series: [
        {
          type: 'heatmap',
          xField: 'Time',
          yField: 'Day',
          valueField: 'Value',
          cell: {
            style: {
              fill: {
                field: 'Value',
                scale: 'color'
              }
            }
          }
        }
      ],
      axes: [
        {
          orient: 'bottom',
          grid: {
            visible: false
          },
          domainLine: {
            visible: false
          },
          type: 'band'
        },
        {
          orient: 'left',
          grid: {
            visible: false
          },
          domainLine: {
            visible: false
          },
          type: 'band'
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
