const spec = {
  type: 'common',
  seriesField: 'color',
  data: [
    {
      id: 'id0',
      values: [
        { x: 'Mon-Tue', type: 'a', y: 19 },
        { x: 'Tue-Web', type: 'a', y: 18 },
        { x: 'Wed-Thur', type: 'a', y: 16 },
        { x: 'Thur-Fri', type: 'a', y: 14 },
        { x: 'Fri-Sat', type: 'a', y: 12 },
        { x: 'Sat-Sun', type: 'a', y: 11 }
      ]
    },
    {
      id: 'id1',
      values: [
        { x: 'Mon-Tue', type: 'b', y: 16 },
        { x: 'Tue-Web', type: 'b', y: 17 },
        { x: 'Wed-Thur', type: 'b', y: 18 },
        { x: 'Thur-Fri', type: 'b', y: 20 },
        { x: 'Fri-Sat', type: 'b', y: 24 },
        { x: 'Sat-Sun', type: 'b', y: 26 }
      ]
    }
  ],
  series: [
    {
      type: 'bar',
      dataIndex: 0,
      seriesField: 'type',
      xField: 'x',
      yField: 'y'
    },
    {
      type: 'line',
      dataIndex: 1,
      seriesField: 'type',
      xField: 'x',
      yField: 'y',
      stack: false
    }
  ],
  axes: [
    { orient: 'left' },
    {
      orient: 'bottom',
      visible: true,
      label: { visible: true },
      type: 'band',
      bandPadding: 0,
      paddingInner: 0,
      paddingOuter: 0
    }
  ]
};

module.exports = { spec };
