const spec = {
  type: 'waterfall',
  direction: 'horizontal',
  data: {
    id: 'id0',
    values: [
      { x: 'Feb.4', total: true, value: 45 },
      { x: 'Feb.11', y: -5 },
      { x: 'Feb.20', y: 2 },
      { x: 'Feb.25', y: -2 },
      { x: 'Mar.4', y: 2 },
      { x: 'Mar.11', y: 2 },
      { x: 'Mar.19', y: -2 },
      { x: 'Mar.26', y: 1 },
      { x: 'Apr.1', y: 1 },
      { x: 'Apr.8', y: 1 },
      { x: 'Apr.15', y: 2 },
      { x: 'Apr.22', y: 1 },
      { x: 'Apr.29', y: -2 },
      { x: 'May.6', y: -1 },
      { x: 'total', total: true }
    ]
  },
  legends: { visible: true, orient: 'bottom' },
  xField: 'y',
  yField: 'x',
  stackLabel: {
    valueType: 'absolute',
    formatMethod: text => {
      return text + '%';
    }
  },
  seriesFieldName: {
    total: 'total',
    increase: 'increase',
    decrease: 'reduce'
  },
  total: {
    type: 'field',
    tagField: 'total',
    valueField: 'value'
  },
  axes: [
    {
      orient: 'bottom',
      range: { min: 30, max: 50 },
      title: { visible: true, text: 'favorability' },
      label: {
        formatMethod: v => {
          return v + '%';
        }
      }
    },
    {
      orient: 'left',
      label: { visible: true },
      type: 'band',
      paddingInner: 0.4,
      title: { visible: true, text: 'date' }
    }
  ]
};

module.exports = { spec };
