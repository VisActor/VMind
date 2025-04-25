const spec = {
  type: 'bar',
  height: 300,
  data: [
    {
      id: 'barData',
      values: [
        { type: 'A', year: '2000', value: 16727 },
        { type: 'B', year: '2000', value: 12546 },
        { type: 'C', year: '2000', value: 11085 },
        { type: 'D', year: '2000', value: 13506 },
        { type: 'E', year: '2000', value: 5765 },
        { type: 'A', year: '2010', value: 5546 },
        { type: 'B', year: '2010', value: 1505 },
        { type: 'C', year: '2010', value: 8375 },
        { type: 'D', year: '2010', value: 3375 },
        { type: 'E', year: '2010', value: 5960 }
      ]
    }
  ],
  barWidth: 20,
  yField: 'year',
  xField: 'value',
  legends: {},
  label: {
    visible: true,
    position: (datum: any) => {
      return datum.year === '2000' ? 'top-right' : 'bottom-right';
    },
    overlap: { strategy: [] as string[], clampForce: false },
    offset: 0,
    style: {
      fill: 'rgb(115,125,135)',
      fontSize: 12
    }
  },
  direction: 'horizontal',
  seriesField: 'type',
  axes: [
    {
      orient: 'bottom',
      paddingInner: 0.3
    }
  ]
};

export { spec };
