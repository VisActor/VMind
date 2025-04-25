const spec = {
  type: 'funnel',
  categoryField: 'name',
  valueField: 'value',
  isTransform: true,
  isCone: false,
  data: [
    {
      id: 'funnel',
      values: [
        {
          value: 5676,
          name: 'Sent'
        },
        {
          value: 3872,
          name: 'Viewed'
        },
        {
          value: 1668,
          name: 'Clicked'
        },
        {
          value: 610,
          name: 'Add to Cart'
        },
        {
          value: 565,
          name: 'Purchased'
        }
      ]
    }
  ],
  title: {
    visible: true,
    text: 'Percentage of the customers have dropped from the sales process'
  },
  label: {
    visible: true
  },
  transformLabel: {
    visible: true
  },
  outerLabel: {
    position: 'right',
    visible: true
  },
  legends: {
    visible: true,
    orient: 'top'
  }
};

export { spec };
