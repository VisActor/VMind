const mockData = [];
for (let i = 0; i < 24; i++) {
  mockData.push({
    key: `key${i}`,
    value: parseInt(Math.random() * 10, 10)
  });
}
const spec = {
  type: 'radar',
  data: [
    {
      values: mockData
    }
  ],
  categoryField: 'key',
  valueField: 'value',
  innerRadius: 0.4,
  outerRadius: 0.9,
  label: {
    visible: true
  },
  axes: [
    {
      orient: 'radius',
      zIndex: 100,
      grid: {
        style: (data, index) => {
          if (index === 0) {
            return {
              lineDash: [0]
            };
          }
          return {
            visible: false
          };
        }
      }
    },
    {
      orient: 'angle',
      tick: {
        visible: false
      },
      domainLine: {
        visible: true
      },
      grid: {
        alignWithLabel: false,
        style: {
          lineDash: [0]
        },
        alternateColor: 'rgba(0, 0, 0, 0.04)'
      }
    }
  ],
  indicator: {
    visible: true,
    trigger: 'hover',
    limitRatio: 0.4,
    title: {
      visible: true,
      autoFit: true,
      style: {
        fontWeight: 'bolder',
        fontFamily: 'Times New Roman',
        fill: '#888',
        text: 'Radar'
      }
    }
  }
};

module.exports = { spec };
