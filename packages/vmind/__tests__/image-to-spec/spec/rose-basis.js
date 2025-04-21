const spec = {
  type: 'rose',
  data: [
    {
      values: [
        {
          value: '159',
          type: 'Tradition Industries'
        },
        {
          value: '50',
          type: 'Business Companies'
        },
        {
          value: '13',
          type: 'Customer-facing Companies'
        }
      ]
    }
  ],
  outerRadius: 0.8,
  innerRadius: 0.2,
  categoryField: 'type',
  valueField: 'value',
  seriesField: 'type',
  label: {
    visible: true,
    layout: {
      tangentConstraint: false
    }
  }
};

module.exports = { spec };
