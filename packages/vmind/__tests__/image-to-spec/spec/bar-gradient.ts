const spec = {
  type: 'bar',
  data: [
    {
      id: 'data',
      values: [
        {
          x: 'Mon',
          y: 100,
          type: 'sales'
        },
        {
          x: 'Tues',
          y: 66,
          type: 'sales'
        },
        {
          x: 'Wed',
          y: 95,
          type: 'sales'
        },
        {
          x: 'Thus',
          y: 52,
          type: 'sales'
        },
        {
          x: 'Fri',
          y: 68,
          type: 'sales'
        },
        {
          x: 'Sat',
          y: 52,
          type: 'sales'
        },
        {
          x: 'sun',
          y: 48,
          type: 'sales'
        },
        {
          x: 'Mon',
          y: 43,
          type: 'profit'
        },
        {
          x: 'Tues',
          y: 80,
          type: 'profit'
        },
        {
          x: 'Wed',
          y: 68,
          type: 'profit'
        },
        {
          x: 'Thus',
          y: 40,
          type: 'profit'
        },
        {
          x: 'Fri',
          y: 53,
          type: 'profit'
        },
        {
          x: 'Sat',
          y: 72,
          type: 'profit'
        },
        {
          x: 'sun',
          y: 71,
          type: 'profit'
        }
      ]
    }
  ],
  xField: ['x', 'type'],
  yField: 'y',
  seriesField: 'type',
  bar: {
    style: {
      cornerRadius: 10,
      fill: {
        gradient: 'linear',
        x0: 0.5,
        y0: 0,
        x1: 0.5,
        y1: 1,
        stops: [
          {
            offset: 0,
            color: '#86DF6C'
          },
          {
            offset: 1,
            color: '#468DFF'
          }
        ]
      }
    },
    state: {
      selected: {
        stroke: '#000',
        lineWidth: 1
      }
    }
  },
  axes: [
    {
      orient: 'bottom',
      domainLine: {
        visible: false
      },
      bandPadding: 0,
      paddingInner: 0.1
    },
    {
      orient: 'left',
      grid: {
        visible: false
      },
      tick: {
        visible: true,
        tickCount: 3
      },
      domainLine: {
        visible: false
      }
    }
  ]
};

export { spec };
