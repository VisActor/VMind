const radius = 0.8;

const spec = {
  type: 'circularProgress',
  data: [
    {
      id: 'id0',
      values: [
        {
          type: 'Tradition Industries',
          value: 0.795,
          text: '79.5%'
        }
      ]
    }
  ],
  valueField: 'value',
  categoryField: 'type',
  seriesField: 'type',
  radius,
  innerRadius: 0.7,
  roundCap: true,
  cornerRadius: 5,
  maxValue: 1,
  progress: {
    style: {
      innerPadding: 0,
      outerPadding: 0,
      cornerRadius: 20,
      fill: {
        gradient: 'conical',
        stops: [
          {
            offset: 0,
            color: '#4FC6B4'
          },
          {
            offset: 1,
            color: '#31679E'
          }
        ]
      }
    }
  },
  indicator: {
    visible: true,
    fixed: true,
    trigger: 'none',
    title: {
      visible: true,
      autoLimit: true,
      space: 12,
      style: {
        fontSize: 16,
        fill: 'gray',
        text: '销售额'
      }
    },
    content: [
      {
        visible: true,
        style: {
          fontSize: 16,
          fill: '#000',
          text: '16,068,954.13'
        }
      }
    ]
  },
  extensionMark: [
    {
      type: 'text',
      dataId: 'id0',
      visible: true,
      style: {
        x: (datum, ctx, elements, dataView) => {
          return ctx.getCenter().x;
        },
        y: (datum, ctx, elements, dataView) => {
          const outerRadius =
            Math.min(ctx.getRegion().getLayoutRect().width, ctx.getRegion().getLayoutRect().height) * 0.5 * radius;
          return outerRadius + ctx.getCenter().y;
        },
        maxLineWidth: (datum, ctx, elements, dataView) => {
          return ctx.getRegion().getLayoutRect().width;
        },
        fontSize: 12,
        fill: '#000',
        text: 'Current value 16,068,954.13 / Target value 25,000,000.00 / Maximum value 30,000,000.00',
        textAlign: 'center',
        textBaseline: 'top',
        dy: 12
      }
    }
  ]
};

export { spec };
