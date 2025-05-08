const spec = {
  type: 'venn',
  data: {
    values: [
      { sets: ['A'], value: 30 },
      { sets: ['B'], value: 10 },
      { sets: ['C'], value: 8 },
      { sets: ['D'], value: 6 },
      { sets: ['A', 'B'], value: 4 },
      { sets: ['A', 'C'], value: 3 },
      { sets: ['A', 'D'], value: 3 }
    ]
  },
  categoryField: 'sets',
  valueField: 'value',
  seriesField: 'sets',
  circle: {
    style: {
      strokeOpacity: 0.8,
      fill: 'transparent',
      lineWidth: 8
    },
    state: {
      hover: {
        stroke: 'black',
        lineWidth: 8
      },
      hover_reverse: {
        strokeOpacity: 0.2
      }
    }
  },
  overlap: {
    style: {
      strokeOpacity: 0.8,
      fill: 'transparent',
      lineWidth: 8
    },
    state: {
      hover: {
        stroke: 'black',
        lineWidth: 8
      },
      hover_reverse: {
        strokeOpacity: 0.2
      }
    }
  },
  label: {
    style: {
      fill: 'black'
    }
  },
  legends: [
    {
      visible: true,
      position: 'middle',
      orient: 'bottom',
      data: items => {
        items.forEach(({ shape }) => (shape.fill = shape.stroke));
        return items;
      }
    }
  ],
  tooltip: {
    mark: {
      updateContent: prev => {
        prev?.forEach(line => {
          line.shapeFill = line.shapeStroke;
        });
        return prev;
      }
    }
  }
};

export { spec };
