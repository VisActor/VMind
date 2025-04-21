const mockData = [];
const types = ['A', 'B', 'C'];

types.forEach(type => {
  for (let i = 1; i <= 12; i++) {
    mockData.push({ month: i + 'th', value: Math.random() * 100 + 10, type });
  }
});

const spec = {
  type: 'radar',
  data: [
    {
      values: mockData
    }
  ],
  categoryField: 'month',
  valueField: 'value',
  seriesField: 'type',
  axes: [
    {
      orient: 'radius',
      grid: {
        smooth: true, // smooth grid lines
        style: {
          lineDash: [0]
        },
        alternateColor: '#f5f5f5' // Configure the background color between grid lines
      }
    },
    {
      orient: 'angle',
      tick: {
        visible: false
      },
      domainLine: {
        visible: true,
        style: {
          stroke: '#333'
        }
      },
      grid: {
        style: {
          lineDash: [0]
        }
      }
    }
  ],
  legends: {
    visible: true,
    orient: 'top'
  }
};

module.exports = { spec };
