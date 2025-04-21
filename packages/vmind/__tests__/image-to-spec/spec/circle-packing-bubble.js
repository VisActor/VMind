const data = new Array(19).fill(0).map((_, i) => {
  return {
    name: `bubble-${i + 1}`,
    value: i + 1
  };
});

const spec = {
  data: [
    {
      id: 'data',
      values: data
    }
  ],
  type: 'circlePacking',
  categoryField: 'name',
  valueField: 'value',
  drill: true,
  // padding for each bubble
  // layoutPadding: 0,
  layoutPadding: 5,
  label: {
    style: {
      fontSize: 10,
      visible: d => {
        return d.depth === 0;
      }
    }
  },
  animationEnter: {
    easing: 'cubicInOut'
  },
  animationExit: {
    easing: 'cubicInOut'
  },
  animationUpdate: {
    easing: 'cubicInOut'
  }
};

module.exports = { spec };
