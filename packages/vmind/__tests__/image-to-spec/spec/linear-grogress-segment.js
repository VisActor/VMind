const spec = {
  type: 'linearProgress',
  data: [
    {
      id: 'id0',
      values: [
        {
          type: 'Tradition Industries',
          value: 0.85,
          goal: 0.7,
          text: '79.5%'
        }
      ]
    }
  ],
  direction: 'horizontal',
  xField: 'value',
  yField: 'type',
  seriesField: 'type',
  height: 80,
  cornerRadius: 20,
  progress: {
    style: {
      cornerRadius: 0
    }
  },
  bandWidth: 30,
  axes: [
    {
      orient: 'right',
      type: 'band',
      domainLine: { visible: false },
      tick: { visible: false },
      label: {
        formatMethod: val => '随便写点啥',
        style: {
          fontSize: 16
        }
      }
    },
    {
      orient: 'bottom',
      type: 'linear',
      visible: true,
      grid: {
        visible: false
      },
      label: {
        formatMethod: val => `${val * 100}%`,
        flush: true
      }
    }
  ],
  extensionMark: [
    {
      type: 'rule',
      dataId: 'id0',
      visible: true,
      style: {
        x: (datum, ctx, elements, dataView) => {
          return ctx.valueToX([1 / 3]);
        },
        y: (datum, ctx, elements, dataView) => {
          return ctx.valueToY([datum.type]) - 15;
        },
        x1: (datum, ctx, elements, dataView) => {
          return ctx.valueToX([1 / 3]);
        },
        y1: (datum, ctx, elements, dataView) => {
          return ctx.valueToY([datum.type]) + 15;
        },
        stroke: '#fff',
        lineWidth: 4,
        zIndex: 1
      }
    },
    {
      type: 'rule',
      dataId: 'id0',
      visible: true,
      style: {
        x: (datum, ctx, elements, dataView) => {
          return ctx.valueToX([2 / 3]);
        },
        y: (datum, ctx, elements, dataView) => {
          return ctx.valueToY([datum.type]) - 15;
        },
        x1: (datum, ctx, elements, dataView) => {
          return ctx.valueToX([2 / 3]);
        },
        y1: (datum, ctx, elements, dataView) => {
          return ctx.valueToY([datum.type]) + 15;
        },
        stroke: '#fff',
        lineWidth: 4,
        zIndex: 1
      }
    }
  ]
};

module.exports = { spec };
