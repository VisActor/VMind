const data = [
  {
    name: 'Country A',
    children: [
      {
        name: 'Region1',
        children: [
          { name: 'Office Supplies', value: 824 },
          { name: 'Furniture', value: 920 },
          { name: 'Electronic equipment', value: 936 }
        ]
      },
      {
        name: 'Region2',
        children: [
          { name: 'Office Supplies', value: 1270 },
          { name: 'Furniture', value: 1399 },
          { name: 'Electronic equipment', value: 1466 }
        ]
      },
      {
        name: 'Region3',
        children: [
          { name: 'Office Supplies', value: 1408 },
          { name: 'Furniture', value: 1676 },
          { name: 'Electronic equipment', value: 1559 }
        ]
      },
      {
        name: 'Region4',
        children: [
          { name: 'Office Supplies', value: 745 },
          { name: 'Furniture', value: 919 },
          { name: 'Electronic equipment', value: 781 }
        ]
      },
      {
        name: 'Region5',
        children: [
          { name: 'Office Supplies', value: 267 },
          { name: 'Furniture', value: 316 },
          { name: 'Electronic equipment', value: 230 }
        ]
      },
      {
        name: 'Region6',
        children: [
          { name: 'Office Supplies', value: 347 },
          { name: 'Furniture', value: 501 },
          { name: 'Electronic equipment', value: 453 }
        ]
      }
    ]
  },
  {
    name: 'Country B',
    children: [
      {
        name: 'Region1',
        children: [
          { name: 'Office Supplies', value: 824 },
          { name: 'Furniture', value: 920 },
          { name: 'Electronic equipment', value: 936 }
        ]
      },
      {
        name: 'Region2',
        children: [
          { name: 'Office Supplies', value: 1270 },
          { name: 'Furniture', value: 1399 },
          { name: 'Electronic equipment', value: 1466 }
        ]
      },
      {
        name: 'Region3',
        children: [
          { name: 'Office Supplies', value: 1408 },
          { name: 'Furniture', value: 1676 },
          { name: 'Electronic equipment', value: 1559 }
        ]
      },
      {
        name: 'Region4',
        children: [
          { name: 'Office Supplies', value: 745 },
          { name: 'Furniture', value: 919 },
          { name: 'Electronic equipment', value: 781 }
        ]
      },
      {
        name: 'Region5',
        children: [
          { name: 'Office Supplies', value: 267 },
          { name: 'Furniture', value: 316 },
          { name: 'Electronic equipment', value: 230 }
        ]
      },
      {
        name: 'Region6',
        children: [
          { name: 'Office Supplies', value: 347 },
          { name: 'Furniture', value: 501 },
          { name: 'Electronic equipment', value: 453 }
        ]
      }
    ]
  },
  {
    name: 'Country C',
    children: [
      {
        name: 'Region1',
        children: [
          { name: 'Office Supplies', value: 824 },
          { name: 'Furniture', value: 920 },
          { name: 'Electronic equipment', value: 936 }
        ]
      },
      {
        name: 'Region2',
        children: [
          { name: 'Office Supplies', value: 1270 },
          { name: 'Furniture', value: 1399 },
          { name: 'Electronic equipment', value: 1466 }
        ]
      },
      {
        name: 'Region3',
        children: [
          { name: 'Office Supplies', value: 1408 },
          { name: 'Furniture', value: 1676 },
          { name: 'Electronic equipment', value: 1559 }
        ]
      },
      {
        name: 'Region4',
        children: [
          { name: 'Office Supplies', value: 745 },
          { name: 'Furniture', value: 919 },
          { name: 'Electronic equipment', value: 781 }
        ]
      },
      {
        name: 'Region5',
        children: [
          { name: 'Office Supplies', value: 267 },
          { name: 'Furniture', value: 316 },
          { name: 'Electronic equipment', value: 230 }
        ]
      },
      {
        name: 'Region6',
        children: [
          { name: 'Office Supplies', value: 347 },
          { name: 'Furniture', value: 501 },
          { name: 'Electronic equipment', value: 453 }
        ]
      }
    ]
  }
];

const spec = {
  type: 'sunburst',
  offsetX: 0,
  offsetY: 0,
  categoryField: 'name',
  valueField: 'value',
  outerRadius: 1,
  innerRadius: 0,
  gap: 5,
  drill: true,
  sunburst: {
    visible: true,
    style: {
      fillOpacity: (datum: any) => {
        return datum.isLeaf ? 0.4 : 0.8;
      }
    }
  },
  label: {
    visible: true,
    style: {
      fontSize: 12,
      fillOpacity: (datum: any) => {
        return datum.isLeaf ? 0.4 : 0.8;
      }
    }
  },
  tooltip: {
    mark: {
      title: {
        value: val => {
          return val?.datum?.map(data => data.name).join(' / ');
        }
      }
    }
  },
  data: [
    {
      id: 'data',
      values: data
    }
  ],
  animationEnter: {
    easing: 'cubicInOut',
    duration: 1000
  },
  animationExit: {
    easing: 'cubicInOut',
    duration: 1000
  },
  animationUpdate: {
    easing: 'cubicInOut',
    duration: 1000
  }
};

export { spec };
