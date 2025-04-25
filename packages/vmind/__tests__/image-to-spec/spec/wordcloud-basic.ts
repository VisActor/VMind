const spec = {
  type: 'wordCloud',
  nameField: 'name',
  valueField: 'value',
  wordCloudConfig: {
    zoomToFit: {
      enlarge: true,
      fontSizeLimitMax: 20
    }
  },
  data: {
    name: 'baseData',
    values: [
      {
        name: '螺蛳粉',
        value: 957
      },
      {
        name: '钵钵鸡',
        value: 942
      },
      {
        name: '板栗',
        value: 842
      },
      {
        name: '胡辣汤',
        value: 828
      },
      {
        name: '关东煮',
        value: 665
      },
      {
        name: '羊肉汤',
        value: 627
      },
      {
        name: '热干面',
        value: 574
      }
    ]
  }
};

export { spec };
