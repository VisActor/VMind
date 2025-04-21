const spec = {
  type: 'gauge',
  data: [
    {
      id: 'pointer',
      values: [
        {
          type: 'A',
          value: 0.6
        }
      ]
    },
    {
      id: 'segment',
      values: [
        {
          type: 'Level 1',
          color: '#07A35A',
          value: 0.4
        },
        {
          type: 'Level 2',
          color: '#FFC528',
          value: 0.6
        },
        {
          type: 'Level 3',
          color: '#E33232',
          value: 0.8
        }
      ]
    }
  ],
  gauge: {
    type: 'gauge',
    dataIndex: 1,
    categoryField: 'type',
    valueField: 'value',
    seriesField: 'type',
    segment: {
      style: {
        cornerRadius: 10,
        fill: datum => datum.color
      }
    },
    label: {
      visible: true,
      position: 'inside-outer',
      offsetRadius: 10,
      style: {
        text: datum => datum.type
      }
    }
  },
  pointer: {
    style: {
      fill: '#666666'
    }
  },
  categoryField: 'type',
  valueField: 'value',
  outerRadius: 0.9,
  innerRadius: 0.6,
  startAngle: -180,
  endAngle: 0,
  centerY: '100%',
  layoutRadius: 'auto',
  axes: [
    {
      type: 'linear',
      orient: 'angle',
      inside: true,
      grid: { visible: false }
    }
  ]
};

module.exports = { spec };
