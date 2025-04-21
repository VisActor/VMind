const spec = {
  type: 'bar',
  data: [
    {
      id: 'barData',
      values: [
        {
          x: '2:00',
          y: 82,
          type: 'sales'
        },
        {
          x: '4:00',
          y: 50,
          type: 'sales'
        },
        {
          x: '6:00',
          y: 64,
          type: 'sales'
        },
        {
          x: '8:00',
          y: 30,
          type: 'sales'
        },
        {
          x: '10:00',
          y: 40,
          type: 'sales'
        },
        {
          x: '12:00',
          y: 40,
          type: 'sales'
        },
        {
          x: '14:00',
          y: 56,
          type: 'sales'
        },
        {
          x: '16:00',
          y: 40,
          type: 'sales'
        },
        {
          x: '18:00',
          y: 64,
          type: 'sales'
        },
        {
          x: '20:00',
          y: 74,
          type: 'sales'
        },
        {
          x: '22:00',
          y: 98,
          type: 'sales'
        },
        {
          x: '2:00',
          y: 62,
          type: 'profit'
        },
        {
          x: '4:00',
          y: 30,
          type: 'profit'
        },
        {
          x: '6:00',
          y: 32,
          type: 'profit'
        },
        {
          x: '8:00',
          y: 10,
          type: 'profit'
        },
        {
          x: '10:00',
          y: 20,
          type: 'profit'
        },
        {
          x: '12:00',
          y: 20,
          type: 'profit'
        },
        {
          x: '14:00',
          y: 36,
          type: 'profit'
        },
        {
          x: '16:00',
          y: 20,
          type: 'profit'
        },
        {
          x: '18:00',
          y: 44,
          type: 'profit'
        },
        {
          x: '20:00',
          y: 74,
          type: 'profit'
        },
        {
          x: '22:00',
          y: 78,
          type: 'profit'
        }
      ]
    }
  ],
  direction: 'horizontal',
  xField: 'y',
  yField: ['x', 'type'],
  seriesField: 'type',
  legends: {
    visible: true,
    orient: 'bottom'
  },
  axes: [
    {
      orient: 'left',
      paddingInner: 0
    }
  ]
};

module.exports = {
  spec
};
