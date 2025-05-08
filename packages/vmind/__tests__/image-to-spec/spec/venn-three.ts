const spec = {
  type: 'venn',
  data: {
    values: [
      { sets: ['A'], value: 8 },
      { sets: ['B'], value: 10 },
      { sets: ['C'], value: 12 },
      { sets: ['A', 'B'], value: 4 },
      { sets: ['A', 'C'], value: 4 },
      { sets: ['B', 'C'], value: 4 },
      { sets: ['A', 'B', 'C'], value: 2 }
    ]
  },
  categoryField: 'sets',
  valueField: 'value',
  seriesField: 'sets',
  legends: [{ visible: true, position: 'middle', orient: 'bottom' }]
};

export { spec };
