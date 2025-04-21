const spec = {
  type: 'waterfall',
  data: {
    id: 'id0',
    values: [
      { x: 'First Quarter', y: 10954, type: 'Primary Industry' },
      { x: 'First Quarter', y: 106187, type: 'Secondary Industry' },
      { x: 'First Quarter', y: 153037, type: 'Tertiary Industry' },
      { x: 'Second Quarter', y: 18183, type: 'Primary Industry' },
      { x: 'Second Quarter', y: 122450, type: 'Secondary Industry' },
      { x: 'Second Quarter', y: 151831, type: 'Tertiary Industry' },
      { x: 'Third Quarter', y: 25642, type: 'Primary Industry' },
      { x: 'Third Quarter', y: 121553, type: 'Secondary Industry' },
      { x: 'Third Quarter', y: 160432, type: 'Tertiary Industry' },
      { x: 'Fourth Quarter', y: 33497, type: 'Primary Industry' },
      { x: 'Fourth Quarter', y: 132601, type: 'Secondary Industry' },
      { x: 'Fourth Quarter', y: 169411, type: 'Tertiary Industry' },
      { x: 'Full year', total: true }
    ]
  },
  legends: { visible: true, orient: 'bottom' },
  xField: 'x',
  yField: 'y',
  seriesField: 'type',
  total: {
    type: 'field',
    tagField: 'total'
  },
  stackLabel: {
    valueType: 'change'
  },
  title: {
    visible: true,
    text: 'Chinese quarterly GDP in 2022'
  },
  axes: [
    {
      orient: 'left',
      title: { visible: true, text: 'Unit: 100 million yuan' }
    },
    {
      orient: 'bottom',
      label: { visible: true },
      type: 'band',
      paddingInner: 0.4,
      title: { visible: false }
    }
  ]
};

module.exports = { spec };
