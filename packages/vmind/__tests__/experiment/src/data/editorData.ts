export const baseLine = {
  type: 'line',
  data: {
    values: [
      {
        time: '2:00',
        value: 8
      },
      {
        time: '4:00',
        value: 9
      },
      {
        time: '6:00',
        value: 11
      },
      {
        time: '8:00',
        value: 14
      },
      {
        time: '10:00',
        value: 16
      },
      {
        time: '12:00',
        value: 17
      },
      {
        time: '14:00',
        value: 17
      },
      {
        time: '16:00',
        value: 16
      },
      {
        time: '18:00',
        value: 15
      }
    ]
  },
  xField: 'time',
  yField: 'value'
};

export const multipleLine = {
  type: 'line',
  data: {
    values: [
      {
        medalType: 'Gold Medals',
        count: 40,
        year: '1952'
      },
      {
        medalType: 'Gold Medals',
        count: 32,
        year: '1956'
      },
      {
        medalType: 'Gold Medals',
        count: 34,
        year: '1960'
      },
      {
        medalType: 'Gold Medals',
        count: 36,
        year: '1964'
      },
      {
        medalType: 'Gold Medals',
        count: 45,
        year: '1968'
      },
      {
        medalType: 'Gold Medals',
        count: 33,
        year: '1972'
      },
      {
        medalType: 'Gold Medals',
        count: 34,
        year: '1976'
      },
      {
        medalType: 'Gold Medals',
        count: null,
        year: '1980'
      },
      {
        medalType: 'Gold Medals',
        count: 83,
        year: '1984'
      },
      {
        medalType: 'Gold Medals',
        count: 36,
        year: '1988'
      },
      {
        medalType: 'Gold Medals',
        count: 37,
        year: '1992'
      },
      {
        medalType: 'Gold Medals',
        count: 44,
        year: '1996'
      },
      {
        medalType: 'Gold Medals',
        count: 37,
        year: '2000'
      },
      {
        medalType: 'Gold Medals',
        count: 35,
        year: '2004'
      },
      {
        medalType: 'Gold Medals',
        count: 36,
        year: '2008'
      },
      {
        medalType: 'Gold Medals',
        count: 46,
        year: '2012'
      },
      {
        medalType: 'Silver Medals',
        count: 19,
        year: '1952'
      },
      {
        medalType: 'Silver Medals',
        count: 25,
        year: '1956'
      },
      {
        medalType: 'Silver Medals',
        count: 21,
        year: '1960'
      },
      {
        medalType: 'Silver Medals',
        count: 26,
        year: '1964'
      },
      {
        medalType: 'Silver Medals',
        count: 28,
        year: '1968'
      },
      {
        medalType: 'Silver Medals',
        count: 31,
        year: '1972'
      },
      {
        medalType: 'Silver Medals',
        count: 35,
        year: '1976'
      },
      {
        medalType: 'Silver Medals',
        count: null,
        year: '1980'
      },
      {
        medalType: 'Silver Medals',
        count: 60,
        year: '1984'
      },
      {
        medalType: 'Silver Medals',
        count: 31,
        year: '1988'
      },
      {
        medalType: 'Silver Medals',
        count: 34,
        year: '1992'
      },
      {
        medalType: 'Silver Medals',
        count: 32,
        year: '1996'
      },
      {
        medalType: 'Silver Medals',
        count: 24,
        year: '2000'
      },
      {
        medalType: 'Silver Medals',
        count: 40,
        year: '2004'
      },
      {
        medalType: 'Silver Medals',
        count: 38,
        year: '2008'
      },
      {
        medalType: 'Silver Medals',
        count: 29,
        year: '2012'
      },
      {
        medalType: 'Bronze Medals',
        count: 17,
        year: '1952'
      },
      {
        medalType: 'Bronze Medals',
        count: 17,
        year: '1956'
      },
      {
        medalType: 'Bronze Medals',
        count: 16,
        year: '1960'
      },
      {
        medalType: 'Bronze Medals',
        count: 28,
        year: '1964'
      },
      {
        medalType: 'Bronze Medals',
        count: 34,
        year: '1968'
      },
      {
        medalType: 'Bronze Medals',
        count: 30,
        year: '1972'
      },
      {
        medalType: 'Bronze Medals',
        count: 25,
        year: '1976'
      },
      {
        medalType: 'Bronze Medals',
        count: null,
        year: '1980'
      },
      {
        medalType: 'Bronze Medals',
        count: 30,
        year: '1984'
      },
      {
        medalType: 'Bronze Medals',
        count: 27,
        year: '1988'
      },
      {
        medalType: 'Bronze Medals',
        count: 37,
        year: '1992'
      },
      {
        medalType: 'Bronze Medals',
        count: 25,
        year: '1996'
      },
      {
        medalType: 'Bronze Medals',
        count: 33,
        year: '2000'
      },
      {
        medalType: 'Bronze Medals',
        count: 26,
        year: '2004'
      },
      {
        medalType: 'Bronze Medals',
        count: 36,
        year: '2008'
      },
      {
        medalType: 'Bronze Medals',
        count: 29,
        year: '2012'
      }
    ]
  },
  xField: 'year',
  yField: 'count',
  seriesField: 'medalType',
  invalidType: 'link'
};

export const baseStackArea = {
  type: 'area',
  data: {
    fields: {
      country: {
        domain: ['China', 'USA', 'EU', 'Africa'],
        sortIndex: 0
      }
    },
    values: [
      { type: 'Nail polish', country: 'Africa', value: 4229 },
      { type: 'Nail polish', country: 'EU', value: 4376 },
      { type: 'Nail polish', country: 'China', value: 3054 },
      { type: 'Nail polish', country: 'USA', value: 12814 },
      { type: 'Eyebrow pencil', country: 'Africa', value: 3932 },
      { type: 'Eyebrow pencil', country: 'EU', value: 3987 },
      { type: 'Eyebrow pencil', country: 'China', value: 5067 },
      { type: 'Eyebrow pencil', country: 'USA', value: 13012 },
      { type: 'Rouge', country: 'Africa', value: 5221 },
      { type: 'Rouge', country: 'EU', value: 3574 },
      { type: 'Rouge', country: 'China', value: 7004 },
      { type: 'Rouge', country: 'USA', value: 11624 },
      { type: 'Lipstick', country: 'Africa', value: 9256 },
      { type: 'Lipstick', country: 'EU', value: 4376 },
      { type: 'Lipstick', country: 'China', value: 9054 },
      { type: 'Lipstick', country: 'USA', value: 8814 },
      { type: 'Eyeshadows', country: 'Africa', value: 3308 },
      { type: 'Eyeshadows', country: 'EU', value: 4572 },
      { type: 'Eyeshadows', country: 'China', value: 12043 },
      { type: 'Eyeshadows', country: 'USA', value: 12998 },
      { type: 'Eyeliner', country: 'Africa', value: 5432 },
      { type: 'Eyeliner', country: 'EU', value: 3417 },
      { type: 'Eyeliner', country: 'China', value: 15067 },
      { type: 'Eyeliner', country: 'USA', value: 12321 },
      { type: 'Foundation', country: 'Africa', value: 13701 },
      { type: 'Foundation', country: 'EU', value: 5231 },
      { type: 'Foundation', country: 'China', value: 10119 },
      { type: 'Foundation', country: 'USA', value: 10342 },
      { type: 'Lip gloss', country: 'Africa', value: 4008 },
      { type: 'Lip gloss', country: 'EU', value: 4572 },
      { type: 'Lip gloss', country: 'China', value: 12043 },
      { type: 'Lip gloss', country: 'USA', value: 22998 },
      { type: 'Mascara', country: 'Africa', value: 18712 },
      { type: 'Mascara', country: 'EU', value: 6134 },
      { type: 'Mascara', country: 'China', value: 10419 },
      { type: 'Mascara', country: 'USA', value: 11261 }
    ]
  },
  title: {
    visible: true,
    text: 'Stacked area chart of cosmetic products sales'
  },
  stack: true,
  xField: 'type',
  yField: 'value',
  seriesField: 'country',
  legends: [{ visible: true, position: 'middle', orient: 'bottom' }]
};

export const baseGroupBar = {
  type: 'bar',
  data: [
    {
      id: 'barData',
      values: [
        { type: 'Autocracies', year: '1930', value: 129 },
        { type: 'Autocracies', year: '1940', value: 133 },
        { type: 'Autocracies', year: '1950', value: 130 },
        { type: 'Autocracies', year: '1960', value: 126 },
        { type: 'Autocracies', year: '1970', value: 117 },
        { type: 'Autocracies', year: '1980', value: 114 },
        { type: 'Autocracies', year: '1990', value: 111 },
        { type: 'Autocracies', year: '2000', value: 89 },
        { type: 'Autocracies', year: '2010', value: 80 },
        { type: 'Autocracies', year: '2018', value: 80 },
        { type: 'Democracies', year: '1930', value: 22 },
        { type: 'Democracies', year: '1940', value: 13 },
        { type: 'Democracies', year: '1950', value: 25 },
        { type: 'Democracies', year: '1960', value: 29 },
        { type: 'Democracies', year: '1970', value: 38 },
        { type: 'Democracies', year: '1980', value: 41 },
        { type: 'Democracies', year: '1990', value: 57 },
        { type: 'Democracies', year: '2000', value: 87 },
        { type: 'Democracies', year: '2010', value: 98 },
        { type: 'Democracies', year: '2018', value: 99 }
      ]
    }
  ],
  xField: ['year', 'type'],
  yField: 'value',
  seriesField: 'type',
  legends: {
    visible: true,
    orient: 'top',
    position: 'start'
  }
};

export const duelAxisChart = {
  type: 'common',
  seriesField: 'color',
  data: [
    {
      id: 'id0',
      values: [
        { x: '周一', type: '早餐', y: 15 },
        { x: '周一', type: '午餐', y: 25 },
        { x: '周二', type: '早餐', y: 12 },
        { x: '周二', type: '午餐', y: 30 },
        { x: '周三', type: '早餐', y: 15 },
        { x: '周三', type: '午餐', y: 24 },
        { x: '周四', type: '早餐', y: 10 },
        { x: '周四', type: '午餐', y: 25 },
        { x: '周五', type: '早餐', y: 13 },
        { x: '周五', type: '午餐', y: 20 },
        { x: '周六', type: '早餐', y: 10 },
        { x: '周六', type: '午餐', y: 22 },
        { x: '周日', type: '早餐', y: 12 },
        { x: '周日', type: '午餐', y: 19 }
      ]
    },
    {
      id: 'id1',
      values: [
        { x: '周一', type: '饮料', y: 22 },
        { x: '周二', type: '饮料', y: 43 },
        { x: '周三', type: '饮料', y: 33 },
        { x: '周四', type: '饮料', y: 22 },
        { x: '周五', type: '饮料', y: 10 },
        { x: '周六', type: '饮料', y: 30 },
        { x: '周日', type: '饮料', y: 50 }
      ]
    }
  ],
  series: [
    {
      type: 'bar',
      id: 'bar',
      dataIndex: 0,
      label: { visible: true },
      seriesField: 'type',
      xField: ['x', 'type'],
      yField: 'y'
    },
    {
      type: 'line',
      id: 'line',
      dataIndex: 1,
      label: { visible: true },
      seriesField: 'type',
      xField: 'x',
      yField: 'y',
      stack: false
    }
  ],
  axes: [
    { orient: 'left', seriesIndex: [0] },
    { orient: 'right', seriesId: ['line'], grid: { visible: false } },
    { orient: 'bottom', label: { visible: true }, type: 'band' }
  ],
  legends: {
    visible: true,
    orient: 'bottom'
  }
};

export const stackBar = {
  type: 'bar',
  data: [
    {
      id: 'barData',
      values: [
        {
          State: 'WY',
          Age: 'Under 5 Years',
          Population: 25635
        },
        {
          State: 'WY',
          Age: '5 to 13 Years',
          Population: 1890
        },
        {
          State: 'WY',
          Age: '14 to 17 Years',
          Population: 9314
        },
        {
          State: 'DC',
          Age: 'Under 5 Years',
          Population: 30352
        },
        {
          State: 'DC',
          Age: '5 to 13 Years',
          Population: 20439
        },
        {
          State: 'DC',
          Age: '14 to 17 Years',
          Population: 10225
        },
        {
          State: 'VT',
          Age: 'Under 5 Years',
          Population: 38253
        },
        {
          State: 'VT',
          Age: '5 to 13 Years',
          Population: 42538
        },
        {
          State: 'VT',
          Age: '14 to 17 Years',
          Population: 15757
        },
        {
          State: 'ND',
          Age: 'Under 5 Years',
          Population: 51896
        },
        {
          State: 'ND',
          Age: '5 to 13 Years',
          Population: 67358
        },
        {
          State: 'ND',
          Age: '14 to 17 Years',
          Population: 18794
        },
        {
          State: 'AK',
          Age: 'Under 5 Years',
          Population: 72083
        },
        {
          State: 'AK',
          Age: '5 to 13 Years',
          Population: 85640
        },
        {
          State: 'AK',
          Age: '14 to 17 Years',
          Population: 22153
        }
      ]
    }
  ],
  xField: 'State',
  yField: 'Population',
  seriesField: 'Age',
  stack: true,
  legends: {
    visible: true
  },
  bar: {
    // The state style of bar
    state: {
      hover: {
        stroke: '#000',
        lineWidth: 1
      }
    }
  }
};

export const pieChart = {
  type: 'pie',
  data: [
    {
      id: 'id0',
      values: [
        { type: 'oxygen', value: '46.60' },
        { type: 'silicon', value: '27.72' },
        { type: 'aluminum', value: '8.13' },
        { type: 'iron', value: '5' },
        { type: 'calcium', value: '3.63' },
        { type: 'sodium', value: '2.83' },
        { type: 'potassium', value: '2.59' },
        { type: 'others', value: '3.5' }
      ]
    }
  ],
  outerRadius: 0.8,
  valueField: 'value',
  categoryField: 'type',
  title: {
    visible: true,
    text: 'Statistics of Surface Element Content'
  },
  legends: {
    visible: true,
    orient: 'left'
  },
  label: {
    visible: true
  }
};

export const roseChart = {
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

export const baseFunnel = {
  type: 'funnel',
  categoryField: 'name',
  valueField: 'value',
  data: [
    {
      id: 'funnel',
      values: [
        {
          value: 100,
          name: 'Step1'
        },
        {
          value: 80,
          name: 'Step2'
        },
        {
          value: 60,
          name: 'Step3'
        },
        {
          value: 40,
          name: 'Step4'
        },
        {
          value: 20,
          name: 'Step5'
        }
      ]
    }
  ],
  label: {
    visible: true
  },
  legends: {
    visible: true,
    orient: 'bottom'
  }
};

const data = [
  { name: 'chevrolet chevelle malibu', milesPerGallon: 18, cylinders: 8, horsepower: 130 },
  { name: 'buick skylark 320', milesPerGallon: 15, cylinders: 8, horsepower: 165 },
  { name: 'plymouth satellite', milesPerGallon: 18, cylinders: 8, horsepower: 150 },
  { name: 'amc rebel sst', milesPerGallon: 16, cylinders: 8, horsepower: 150 },
  { name: 'ford torino', milesPerGallon: 17, cylinders: 8, horsepower: 140 },
  { name: 'ford galaxie 500', milesPerGallon: 15, cylinders: 8, horsepower: 198 },
  { name: 'chevrolet impala', milesPerGallon: 14, cylinders: 8, horsepower: 220 },
  { name: 'plymouth fury iii', milesPerGallon: 14, cylinders: 8, horsepower: 215 },
  { name: 'pontiac catalina', milesPerGallon: 14, cylinders: 8, horsepower: 225 },
  { name: 'amc ambassador dpl', milesPerGallon: 15, cylinders: 8, horsepower: 190 },
  { name: 'citroen ds-21 pallas', milesPerGallon: 0, cylinders: 4, horsepower: 115 },
  { name: 'chevrolet chevelle concours (sw)', milesPerGallon: 0, cylinders: 8, horsepower: 165 },
  { name: 'ford torino (sw)', milesPerGallon: 0, cylinders: 8, horsepower: 153 },
  { name: 'plymouth satellite (sw)', milesPerGallon: 0, cylinders: 8, horsepower: 175 },
  { name: 'amc rebel sst (sw)', milesPerGallon: 0, cylinders: 8, horsepower: 175 },
  { name: 'dodge challenger se', milesPerGallon: 15, cylinders: 8, horsepower: 170 },
  { name: "plymouth 'cuda 340", milesPerGallon: 14, cylinders: 8, horsepower: 160 },
  { name: 'ford mustang boss 302', milesPerGallon: 0, cylinders: 8, horsepower: 140 },
  { name: 'chevrolet monte carlo', milesPerGallon: 15, cylinders: 8, horsepower: 150 },
  { name: 'buick estate wagon (sw)', milesPerGallon: 14, cylinders: 8, horsepower: 225 },
  { name: 'toyota corona mark ii', milesPerGallon: 24, cylinders: 4, horsepower: 95 },
  { name: 'plymouth duster', milesPerGallon: 22, cylinders: 6, horsepower: 95 },
  { name: 'amc hornet', milesPerGallon: 18, cylinders: 6, horsepower: 97 },
  { name: 'ford maverick', milesPerGallon: 21, cylinders: 6, horsepower: 85 },
  { name: 'datsun pl510', milesPerGallon: 27, cylinders: 4, horsepower: 88 },
  { name: 'volkswagen 1131 deluxe sedan', milesPerGallon: 26, cylinders: 4, horsepower: 46 },
  { name: 'peugeot 504', milesPerGallon: 25, cylinders: 4, horsepower: 87 },
  { name: 'audi 100 ls', milesPerGallon: 24, cylinders: 4, horsepower: 90 },
  { name: 'saab 99e', milesPerGallon: 25, cylinders: 4, horsepower: 95 },
  { name: 'bmw 2002', milesPerGallon: 26, cylinders: 4, horsepower: 113 },
  { name: 'amc gremlin', milesPerGallon: 21, cylinders: 6, horsepower: 90 },
  { name: 'ford f250', milesPerGallon: 10, cylinders: 8, horsepower: 215 },
  { name: 'chevy c20', milesPerGallon: 10, cylinders: 8, horsepower: 200 },
  { name: 'dodge d200', milesPerGallon: 11, cylinders: 8, horsepower: 210 },
  { name: 'hi 1200d', milesPerGallon: 9, cylinders: 8, horsepower: 193 },
  { name: 'datsun pl510', milesPerGallon: 27, cylinders: 4, horsepower: 88 },
  { name: 'chevrolet vega 2300', milesPerGallon: 28, cylinders: 4, horsepower: 90 },
  { name: 'toyota corona', milesPerGallon: 25, cylinders: 4, horsepower: 95 },
  { name: 'ford pinto', milesPerGallon: 25, cylinders: 4, horsepower: 0 },
  { name: 'volkswagen super beetle 117', milesPerGallon: 0, cylinders: 4, horsepower: 48 },
  { name: 'amc gremlin', milesPerGallon: 19, cylinders: 6, horsepower: 100 },
  { name: 'plymouth satellite custom', milesPerGallon: 16, cylinders: 6, horsepower: 105 },
  { name: 'chevrolet chevelle malibu', milesPerGallon: 17, cylinders: 6, horsepower: 100 },
  { name: 'ford torino 500', milesPerGallon: 19, cylinders: 6, horsepower: 88 },
  { name: 'amc matador', milesPerGallon: 18, cylinders: 6, horsepower: 100 },
  { name: 'chevrolet impala', milesPerGallon: 14, cylinders: 8, horsepower: 165 },
  { name: 'pontiac catalina brougham', milesPerGallon: 14, cylinders: 8, horsepower: 175 },
  { name: 'ford galaxie 500', milesPerGallon: 14, cylinders: 8, horsepower: 153 },
  { name: 'plymouth fury iii', milesPerGallon: 14, cylinders: 8, horsepower: 150 },
  { name: 'dodge monaco (sw)', milesPerGallon: 12, cylinders: 8, horsepower: 180 },
  { name: 'ford country squire (sw)', milesPerGallon: 13, cylinders: 8, horsepower: 170 },
  { name: 'pontiac safari (sw)', milesPerGallon: 13, cylinders: 8, horsepower: 175 },
  { name: 'amc hornet sportabout (sw)', milesPerGallon: 18, cylinders: 6, horsepower: 110 },
  { name: 'chevrolet vega (sw)', milesPerGallon: 22, cylinders: 4, horsepower: 72 },
  { name: 'pontiac firebird', milesPerGallon: 19, cylinders: 6, horsepower: 100 },
  { name: 'ford mustang', milesPerGallon: 18, cylinders: 6, horsepower: 88 },
  { name: 'mercury capri 2000', milesPerGallon: 23, cylinders: 4, horsepower: 86 },
  { name: 'opel 1900', milesPerGallon: 28, cylinders: 4, horsepower: 90 },
  { name: 'peugeot 304', milesPerGallon: 30, cylinders: 4, horsepower: 70 },
  { name: 'fiat 124b', milesPerGallon: 30, cylinders: 4, horsepower: 76 },
  { name: 'toyota corolla 1200', milesPerGallon: 31, cylinders: 4, horsepower: 65 },
  { name: 'datsun 1200', milesPerGallon: 35, cylinders: 4, horsepower: 69 },
  { name: 'volkswagen model 111', milesPerGallon: 27, cylinders: 4, horsepower: 60 },
  { name: 'plymouth cricket', milesPerGallon: 26, cylinders: 4, horsepower: 70 },
  { name: 'toyota corona hardtop', milesPerGallon: 24, cylinders: 4, horsepower: 95 },
  { name: 'dodge colt hardtop', milesPerGallon: 25, cylinders: 4, horsepower: 80 },
  { name: 'volkswagen type 3', milesPerGallon: 23, cylinders: 4, horsepower: 54 },
  { name: 'chevrolet vega', milesPerGallon: 20, cylinders: 4, horsepower: 90 },
  { name: 'ford pinto runabout', milesPerGallon: 21, cylinders: 4, horsepower: 86 },
  { name: 'chevrolet impala', milesPerGallon: 13, cylinders: 8, horsepower: 165 },
  { name: 'pontiac catalina', milesPerGallon: 14, cylinders: 8, horsepower: 175 },
  { name: 'plymouth fury iii', milesPerGallon: 15, cylinders: 8, horsepower: 150 },
  { name: 'ford galaxie 500', milesPerGallon: 14, cylinders: 8, horsepower: 153 },
  { name: 'amc ambassador sst', milesPerGallon: 17, cylinders: 8, horsepower: 150 },
  { name: 'mercury marquis', milesPerGallon: 11, cylinders: 8, horsepower: 208 },
  { name: 'buick lesabre custom', milesPerGallon: 13, cylinders: 8, horsepower: 155 },
  { name: 'oldsmobile delta 88 royale', milesPerGallon: 12, cylinders: 8, horsepower: 160 },
  { name: 'chrysler newport royal', milesPerGallon: 13, cylinders: 8, horsepower: 190 },
  { name: 'mazda rx2 coupe', milesPerGallon: 19, cylinders: 3, horsepower: 97 },
  { name: 'amc matador (sw)', milesPerGallon: 15, cylinders: 8, horsepower: 150 },
  { name: 'chevrolet chevelle concours (sw)', milesPerGallon: 13, cylinders: 8, horsepower: 130 },
  { name: 'ford gran torino (sw)', milesPerGallon: 13, cylinders: 8, horsepower: 140 },
  { name: 'plymouth satellite custom (sw)', milesPerGallon: 14, cylinders: 8, horsepower: 150 },
  { name: 'volvo 145e (sw)', milesPerGallon: 18, cylinders: 4, horsepower: 112 },
  { name: 'volkswagen 411 (sw)', milesPerGallon: 22, cylinders: 4, horsepower: 76 },
  { name: 'peugeot 504 (sw)', milesPerGallon: 21, cylinders: 4, horsepower: 87 },
  { name: 'renault 12 (sw)', milesPerGallon: 26, cylinders: 4, horsepower: 69 },
  { name: 'ford pinto (sw)', milesPerGallon: 22, cylinders: 4, horsepower: 86 },
  { name: 'datsun 510 (sw)', milesPerGallon: 28, cylinders: 4, horsepower: 92 },
  { name: 'toyouta corona mark ii (sw)', milesPerGallon: 23, cylinders: 4, horsepower: 97 },
  { name: 'dodge colt (sw)', milesPerGallon: 28, cylinders: 4, horsepower: 80 },
  { name: 'toyota corolla 1600 (sw)', milesPerGallon: 27, cylinders: 4, horsepower: 88 },
  { name: 'buick century 350', milesPerGallon: 13, cylinders: 8, horsepower: 175 },
  { name: 'amc matador', milesPerGallon: 14, cylinders: 8, horsepower: 150 },
  { name: 'chevrolet malibu', milesPerGallon: 13, cylinders: 8, horsepower: 145 },
  { name: 'ford gran torino', milesPerGallon: 14, cylinders: 8, horsepower: 137 },
  { name: 'dodge coronet custom', milesPerGallon: 15, cylinders: 8, horsepower: 150 },
  { name: 'mercury marquis brougham', milesPerGallon: 12, cylinders: 8, horsepower: 198 },
  { name: 'chevrolet caprice classic', milesPerGallon: 13, cylinders: 8, horsepower: 150 },
  { name: 'ford ltd', milesPerGallon: 13, cylinders: 8, horsepower: 158 },
  { name: 'plymouth fury gran sedan', milesPerGallon: 14, cylinders: 8, horsepower: 150 },
  { name: 'chrysler new yorker brougham', milesPerGallon: 13, cylinders: 8, horsepower: 215 },
  { name: 'buick electra 225 custom', milesPerGallon: 12, cylinders: 8, horsepower: 225 },
  { name: 'amc ambassador brougham', milesPerGallon: 13, cylinders: 8, horsepower: 175 },
  { name: 'plymouth valiant', milesPerGallon: 18, cylinders: 6, horsepower: 105 },
  { name: 'chevrolet nova custom', milesPerGallon: 16, cylinders: 6, horsepower: 100 },
  { name: 'amc hornet', milesPerGallon: 18, cylinders: 6, horsepower: 100 },
  { name: 'ford maverick', milesPerGallon: 18, cylinders: 6, horsepower: 88 },
  { name: 'plymouth duster', milesPerGallon: 23, cylinders: 6, horsepower: 95 },
  { name: 'volkswagen super beetle', milesPerGallon: 26, cylinders: 4, horsepower: 46 },
  { name: 'chevrolet impala', milesPerGallon: 11, cylinders: 8, horsepower: 150 },
  { name: 'ford country', milesPerGallon: 12, cylinders: 8, horsepower: 167 },
  { name: 'plymouth custom suburb', milesPerGallon: 13, cylinders: 8, horsepower: 170 },
  { name: 'oldsmobile vista cruiser', milesPerGallon: 12, cylinders: 8, horsepower: 180 },
  { name: 'amc gremlin', milesPerGallon: 18, cylinders: 6, horsepower: 100 },
  { name: 'toyota carina', milesPerGallon: 20, cylinders: 4, horsepower: 88 },
  { name: 'chevrolet vega', milesPerGallon: 21, cylinders: 4, horsepower: 72 },
  { name: 'datsun 610', milesPerGallon: 22, cylinders: 4, horsepower: 94 },
  { name: 'maxda rx3', milesPerGallon: 18, cylinders: 3, horsepower: 90 },
  { name: 'ford pinto', milesPerGallon: 19, cylinders: 4, horsepower: 85 },
  { name: 'mercury capri v6', milesPerGallon: 21, cylinders: 6, horsepower: 107 },
  { name: 'fiat 124 sport coupe', milesPerGallon: 26, cylinders: 4, horsepower: 90 },
  { name: 'chevrolet monte carlo s', milesPerGallon: 15, cylinders: 8, horsepower: 145 },
  { name: 'pontiac grand prix', milesPerGallon: 16, cylinders: 8, horsepower: 230 },
  { name: 'fiat 128', milesPerGallon: 29, cylinders: 4, horsepower: 49 },
  { name: 'opel manta', milesPerGallon: 24, cylinders: 4, horsepower: 75 },
  { name: 'audi 100ls', milesPerGallon: 20, cylinders: 4, horsepower: 91 },
  { name: 'volvo 144ea', milesPerGallon: 19, cylinders: 4, horsepower: 112 },
  { name: 'dodge dart custom', milesPerGallon: 15, cylinders: 8, horsepower: 150 },
  { name: 'saab 99le', milesPerGallon: 24, cylinders: 4, horsepower: 110 },
  { name: 'toyota mark ii', milesPerGallon: 20, cylinders: 6, horsepower: 122 },
  { name: 'oldsmobile omega', milesPerGallon: 11, cylinders: 8, horsepower: 180 },
  { name: 'plymouth duster', milesPerGallon: 20, cylinders: 6, horsepower: 95 },
  { name: 'ford maverick', milesPerGallon: 21, cylinders: 6, horsepower: 0 },
  { name: 'amc hornet', milesPerGallon: 19, cylinders: 6, horsepower: 100 },
  { name: 'chevrolet nova', milesPerGallon: 15, cylinders: 6, horsepower: 100 },
  { name: 'datsun b210', milesPerGallon: 31, cylinders: 4, horsepower: 67 },
  { name: 'ford pinto', milesPerGallon: 26, cylinders: 4, horsepower: 80 },
  { name: 'toyota corolla 1200', milesPerGallon: 32, cylinders: 4, horsepower: 65 },
  { name: 'chevrolet vega', milesPerGallon: 25, cylinders: 4, horsepower: 75 },
  { name: 'chevrolet chevelle malibu classic', milesPerGallon: 16, cylinders: 6, horsepower: 100 },
  { name: 'amc matador', milesPerGallon: 16, cylinders: 6, horsepower: 110 },
  { name: 'plymouth satellite sebring', milesPerGallon: 18, cylinders: 6, horsepower: 105 },
  { name: 'ford gran torino', milesPerGallon: 16, cylinders: 8, horsepower: 140 },
  { name: 'buick century luxus (sw)', milesPerGallon: 13, cylinders: 8, horsepower: 150 },
  { name: 'dodge coronet custom (sw)', milesPerGallon: 14, cylinders: 8, horsepower: 150 },
  { name: 'ford gran torino (sw)', milesPerGallon: 14, cylinders: 8, horsepower: 140 },
  { name: 'amc matador (sw)', milesPerGallon: 14, cylinders: 8, horsepower: 150 },
  { name: 'audi fox', milesPerGallon: 29, cylinders: 4, horsepower: 83 },
  { name: 'volkswagen dasher', milesPerGallon: 26, cylinders: 4, horsepower: 67 },
  { name: 'opel manta', milesPerGallon: 26, cylinders: 4, horsepower: 78 },
  { name: 'toyota corona', milesPerGallon: 31, cylinders: 4, horsepower: 52 },
  { name: 'datsun 710', milesPerGallon: 32, cylinders: 4, horsepower: 61 },
  { name: 'dodge colt', milesPerGallon: 28, cylinders: 4, horsepower: 75 },
  { name: 'fiat 128', milesPerGallon: 24, cylinders: 4, horsepower: 75 },
  { name: 'fiat 124 tc', milesPerGallon: 26, cylinders: 4, horsepower: 75 },
  { name: 'honda civic', milesPerGallon: 24, cylinders: 4, horsepower: 97 },
  { name: 'subaru', milesPerGallon: 26, cylinders: 4, horsepower: 93 },
  { name: 'fiat x1.9', milesPerGallon: 31, cylinders: 4, horsepower: 67 },
  { name: 'plymouth valiant custom', milesPerGallon: 19, cylinders: 6, horsepower: 95 },
  { name: 'chevrolet nova', milesPerGallon: 18, cylinders: 6, horsepower: 105 },
  { name: 'mercury monarch', milesPerGallon: 15, cylinders: 6, horsepower: 72 },
  { name: 'ford maverick', milesPerGallon: 15, cylinders: 6, horsepower: 72 },
  { name: 'pontiac catalina', milesPerGallon: 16, cylinders: 8, horsepower: 170 },
  { name: 'chevrolet bel air', milesPerGallon: 15, cylinders: 8, horsepower: 145 },
  { name: 'plymouth grand fury', milesPerGallon: 16, cylinders: 8, horsepower: 150 },
  { name: 'ford ltd', milesPerGallon: 14, cylinders: 8, horsepower: 148 },
  { name: 'buick century', milesPerGallon: 17, cylinders: 6, horsepower: 110 },
  { name: 'chevroelt chevelle malibu', milesPerGallon: 16, cylinders: 6, horsepower: 105 },
  { name: 'amc matador', milesPerGallon: 15, cylinders: 6, horsepower: 110 },
  { name: 'plymouth fury', milesPerGallon: 18, cylinders: 6, horsepower: 95 },
  { name: 'buick skyhawk', milesPerGallon: 21, cylinders: 6, horsepower: 110 },
  { name: 'chevrolet monza 2+2', milesPerGallon: 20, cylinders: 8, horsepower: 110 },
  { name: 'ford mustang ii', milesPerGallon: 13, cylinders: 8, horsepower: 129 },
  { name: 'toyota corolla', milesPerGallon: 29, cylinders: 4, horsepower: 75 },
  { name: 'ford pinto', milesPerGallon: 23, cylinders: 4, horsepower: 83 },
  { name: 'amc gremlin', milesPerGallon: 20, cylinders: 6, horsepower: 100 },
  { name: 'pontiac astro', milesPerGallon: 23, cylinders: 4, horsepower: 78 },
  { name: 'toyota corona', milesPerGallon: 24, cylinders: 4, horsepower: 96 },
  { name: 'volkswagen dasher', milesPerGallon: 25, cylinders: 4, horsepower: 71 },
  { name: 'datsun 710', milesPerGallon: 24, cylinders: 4, horsepower: 97 },
  { name: 'ford pinto', milesPerGallon: 18, cylinders: 6, horsepower: 97 },
  { name: 'volkswagen rabbit', milesPerGallon: 29, cylinders: 4, horsepower: 70 },
  { name: 'amc pacer', milesPerGallon: 19, cylinders: 6, horsepower: 90 },
  { name: 'audi 100ls', milesPerGallon: 23, cylinders: 4, horsepower: 95 },
  { name: 'peugeot 504', milesPerGallon: 23, cylinders: 4, horsepower: 88 },
  { name: 'volvo 244dl', milesPerGallon: 22, cylinders: 4, horsepower: 98 },
  { name: 'saab 99le', milesPerGallon: 25, cylinders: 4, horsepower: 115 },
  { name: 'honda civic cvcc', milesPerGallon: 33, cylinders: 4, horsepower: 53 },
  { name: 'fiat 131', milesPerGallon: 28, cylinders: 4, horsepower: 86 },
  { name: 'opel 1900', milesPerGallon: 25, cylinders: 4, horsepower: 81 },
  { name: 'capri ii', milesPerGallon: 25, cylinders: 4, horsepower: 92 },
  { name: 'dodge colt', milesPerGallon: 26, cylinders: 4, horsepower: 79 },
  { name: 'renault 12tl', milesPerGallon: 27, cylinders: 4, horsepower: 83 },
  { name: 'chevrolet chevelle malibu classic', milesPerGallon: 17.5, cylinders: 8, horsepower: 140 },
  { name: 'dodge coronet brougham', milesPerGallon: 16, cylinders: 8, horsepower: 150 },
  { name: 'amc matador', milesPerGallon: 15.5, cylinders: 8, horsepower: 120 },
  { name: 'ford gran torino', milesPerGallon: 14.5, cylinders: 8, horsepower: 152 },
  { name: 'plymouth valiant', milesPerGallon: 22, cylinders: 6, horsepower: 100 },
  { name: 'chevrolet nova', milesPerGallon: 22, cylinders: 6, horsepower: 105 },
  { name: 'ford maverick', milesPerGallon: 24, cylinders: 6, horsepower: 81 },
  { name: 'amc hornet', milesPerGallon: 22.5, cylinders: 6, horsepower: 90 },
  { name: 'chevrolet chevette', milesPerGallon: 29, cylinders: 4, horsepower: 52 },
  { name: 'chevrolet woody', milesPerGallon: 24.5, cylinders: 4, horsepower: 60 },
  { name: 'vw rabbit', milesPerGallon: 29, cylinders: 4, horsepower: 70 },
  { name: 'honda civic', milesPerGallon: 33, cylinders: 4, horsepower: 53 },
  { name: 'dodge aspen se', milesPerGallon: 20, cylinders: 6, horsepower: 100 },
  { name: 'ford granada ghia', milesPerGallon: 18, cylinders: 6, horsepower: 78 },
  { name: 'pontiac ventura sj', milesPerGallon: 18.5, cylinders: 6, horsepower: 110 },
  { name: 'amc pacer d/l', milesPerGallon: 17.5, cylinders: 6, horsepower: 95 },
  { name: 'volkswagen rabbit', milesPerGallon: 29.5, cylinders: 4, horsepower: 71 },
  { name: 'datsun b-210', milesPerGallon: 32, cylinders: 4, horsepower: 70 },
  { name: 'toyota corolla', milesPerGallon: 28, cylinders: 4, horsepower: 75 },
  { name: 'ford pinto', milesPerGallon: 26.5, cylinders: 4, horsepower: 72 },
  { name: 'volvo 245', milesPerGallon: 20, cylinders: 4, horsepower: 102 },
  { name: 'plymouth volare premier v8', milesPerGallon: 13, cylinders: 8, horsepower: 150 },
  { name: 'peugeot 504', milesPerGallon: 19, cylinders: 4, horsepower: 88 },
  { name: 'toyota mark ii', milesPerGallon: 19, cylinders: 6, horsepower: 108 },
  { name: 'mercedes-benz 280s', milesPerGallon: 16.5, cylinders: 6, horsepower: 120 },
  { name: 'cadillac seville', milesPerGallon: 16.5, cylinders: 8, horsepower: 180 },
  { name: 'chevy c10', milesPerGallon: 13, cylinders: 8, horsepower: 145 },
  { name: 'ford f108', milesPerGallon: 13, cylinders: 8, horsepower: 130 },
  { name: 'dodge d100', milesPerGallon: 13, cylinders: 8, horsepower: 150 },
  { name: 'honda Accelerationord cvcc', milesPerGallon: 31.5, cylinders: 4, horsepower: 68 },
  { name: 'buick opel isuzu deluxe', milesPerGallon: 30, cylinders: 4, horsepower: 80 },
  { name: 'renault 5 gtl', milesPerGallon: 36, cylinders: 4, horsepower: 58 },
  { name: 'plymouth arrow gs', milesPerGallon: 25.5, cylinders: 4, horsepower: 96 },
  { name: 'datsun f-10 hatchback', milesPerGallon: 33.5, cylinders: 4, horsepower: 70 },
  { name: 'chevrolet caprice classic', milesPerGallon: 17.5, cylinders: 8, horsepower: 145 },
  { name: 'oldsmobile cutlass supreme', milesPerGallon: 17, cylinders: 8, horsepower: 110 },
  { name: 'dodge monaco brougham', milesPerGallon: 15.5, cylinders: 8, horsepower: 145 },
  { name: 'mercury cougar brougham', milesPerGallon: 15, cylinders: 8, horsepower: 130 },
  { name: 'chevrolet concours', milesPerGallon: 17.5, cylinders: 6, horsepower: 110 },
  { name: 'buick skylark', milesPerGallon: 20.5, cylinders: 6, horsepower: 105 },
  { name: 'plymouth volare custom', milesPerGallon: 19, cylinders: 6, horsepower: 100 },
  { name: 'ford granada', milesPerGallon: 18.5, cylinders: 6, horsepower: 98 },
  { name: 'pontiac grand prix lj', milesPerGallon: 16, cylinders: 8, horsepower: 180 },
  { name: 'chevrolet monte carlo landau', milesPerGallon: 15.5, cylinders: 8, horsepower: 170 },
  { name: 'chrysler cordoba', milesPerGallon: 15.5, cylinders: 8, horsepower: 190 },
  { name: 'ford thunderbird', milesPerGallon: 16, cylinders: 8, horsepower: 149 },
  { name: 'volkswagen rabbit custom', milesPerGallon: 29, cylinders: 4, horsepower: 78 },
  { name: 'pontiac sunbird coupe', milesPerGallon: 24.5, cylinders: 4, horsepower: 88 },
  { name: 'toyota corolla liftback', milesPerGallon: 26, cylinders: 4, horsepower: 75 },
  { name: 'ford mustang ii 2+2', milesPerGallon: 25.5, cylinders: 4, horsepower: 89 },
  { name: 'chevrolet chevette', milesPerGallon: 30.5, cylinders: 4, horsepower: 63 },
  { name: 'dodge colt m/m', milesPerGallon: 33.5, cylinders: 4, horsepower: 83 },
  { name: 'subaru dl', milesPerGallon: 30, cylinders: 4, horsepower: 67 },
  { name: 'volkswagen dasher', milesPerGallon: 30.5, cylinders: 4, horsepower: 78 },
  { name: 'datsun 810', milesPerGallon: 22, cylinders: 6, horsepower: 97 },
  { name: 'bmw 320i', milesPerGallon: 21.5, cylinders: 4, horsepower: 110 },
  { name: 'mazda rx-4', milesPerGallon: 21.5, cylinders: 3, horsepower: 110 },
  { name: 'volkswagen rabbit custom diesel', milesPerGallon: 43.1, cylinders: 4, horsepower: 48 },
  { name: 'ford fiesta', milesPerGallon: 36.1, cylinders: 4, horsepower: 66 },
  { name: 'mazda glc deluxe', milesPerGallon: 32.8, cylinders: 4, horsepower: 52 },
  { name: 'datsun b210 gx', milesPerGallon: 39.4, cylinders: 4, horsepower: 70 },
  { name: 'honda civic cvcc', milesPerGallon: 36.1, cylinders: 4, horsepower: 60 },
  { name: 'oldsmobile cutlass salon brougham', milesPerGallon: 19.9, cylinders: 8, horsepower: 110 },
  { name: 'dodge diplomat', milesPerGallon: 19.4, cylinders: 8, horsepower: 140 },
  { name: 'mercury monarch ghia', milesPerGallon: 20.2, cylinders: 8, horsepower: 139 },
  { name: 'pontiac phoenix lj', milesPerGallon: 19.2, cylinders: 6, horsepower: 105 },
  { name: 'chevrolet malibu', milesPerGallon: 20.5, cylinders: 6, horsepower: 95 },
  { name: 'ford fairmont (auto)', milesPerGallon: 20.2, cylinders: 6, horsepower: 85 },
  { name: 'ford fairmont (man)', milesPerGallon: 25.1, cylinders: 4, horsepower: 88 },
  { name: 'plymouth volare', milesPerGallon: 20.5, cylinders: 6, horsepower: 100 },
  { name: 'amc concord', milesPerGallon: 19.4, cylinders: 6, horsepower: 90 },
  { name: 'buick century special', milesPerGallon: 20.6, cylinders: 6, horsepower: 105 },
  { name: 'mercury zephyr', milesPerGallon: 20.8, cylinders: 6, horsepower: 85 },
  { name: 'dodge aspen', milesPerGallon: 18.6, cylinders: 6, horsepower: 110 },
  { name: 'amc concord d/l', milesPerGallon: 18.1, cylinders: 6, horsepower: 120 },
  { name: 'chevrolet monte carlo landau', milesPerGallon: 19.2, cylinders: 8, horsepower: 145 },
  { name: 'buick regal sport coupe (turbo)', milesPerGallon: 17.7, cylinders: 6, horsepower: 165 },
  { name: 'ford futura', milesPerGallon: 18.1, cylinders: 8, horsepower: 139 },
  { name: 'dodge magnum xe', milesPerGallon: 17.5, cylinders: 8, horsepower: 140 },
  { name: 'chevrolet chevette', milesPerGallon: 30, cylinders: 4, horsepower: 68 },
  { name: 'toyota corona', milesPerGallon: 27.5, cylinders: 4, horsepower: 95 },
  { name: 'datsun 510', milesPerGallon: 27.2, cylinders: 4, horsepower: 97 },
  { name: 'dodge omni', milesPerGallon: 30.9, cylinders: 4, horsepower: 75 },
  { name: 'toyota celica gt liftback', milesPerGallon: 21.1, cylinders: 4, horsepower: 95 },
  { name: 'plymouth sapporo', milesPerGallon: 23.2, cylinders: 4, horsepower: 105 },
  { name: 'oldsmobile starfire sx', milesPerGallon: 23.8, cylinders: 4, horsepower: 85 },
  { name: 'datsun 200-sx', milesPerGallon: 23.9, cylinders: 4, horsepower: 97 },
  { name: 'audi 5000', milesPerGallon: 20.3, cylinders: 5, horsepower: 103 },
  { name: 'volvo 264gl', milesPerGallon: 17, cylinders: 6, horsepower: 125 },
  { name: 'saab 99gle', milesPerGallon: 21.6, cylinders: 4, horsepower: 115 },
  { name: 'peugeot 604sl', milesPerGallon: 16.2, cylinders: 6, horsepower: 133 },
  { name: 'volkswagen scirocco', milesPerGallon: 31.5, cylinders: 4, horsepower: 71 },
  { name: 'honda Accelerationord lx', milesPerGallon: 29.5, cylinders: 4, horsepower: 68 },
  { name: 'pontiac lemans v6', milesPerGallon: 21.5, cylinders: 6, horsepower: 115 },
  { name: 'mercury zephyr 6', milesPerGallon: 19.8, cylinders: 6, horsepower: 85 },
  { name: 'ford fairmont 4', milesPerGallon: 22.3, cylinders: 4, horsepower: 88 },
  { name: 'amc concord dl 6', milesPerGallon: 20.2, cylinders: 6, horsepower: 90 },
  { name: 'dodge aspen 6', milesPerGallon: 20.6, cylinders: 6, horsepower: 110 },
  { name: 'chevrolet caprice classic', milesPerGallon: 17, cylinders: 8, horsepower: 130 },
  { name: 'ford ltd landau', milesPerGallon: 17.6, cylinders: 8, horsepower: 129 },
  { name: 'mercury grand marquis', milesPerGallon: 16.5, cylinders: 8, horsepower: 138 },
  { name: 'dodge st. regis', milesPerGallon: 18.2, cylinders: 8, horsepower: 135 },
  { name: 'buick estate wagon (sw)', milesPerGallon: 16.9, cylinders: 8, horsepower: 155 },
  { name: 'ford country squire (sw)', milesPerGallon: 15.5, cylinders: 8, horsepower: 142 },
  { name: 'chevrolet malibu classic (sw)', milesPerGallon: 19.2, cylinders: 8, horsepower: 125 },
  { name: 'chrysler lebaron town @ country (sw)', milesPerGallon: 18.5, cylinders: 8, horsepower: 150 },
  { name: 'vw rabbit custom', milesPerGallon: 31.9, cylinders: 4, horsepower: 71 },
  { name: 'maxda glc deluxe', milesPerGallon: 34.1, cylinders: 4, horsepower: 65 },
  { name: 'dodge colt hatchback custom', milesPerGallon: 35.7, cylinders: 4, horsepower: 80 },
  { name: 'amc spirit dl', milesPerGallon: 27.4, cylinders: 4, horsepower: 80 },
  { name: 'mercedes benz 300d', milesPerGallon: 25.4, cylinders: 5, horsepower: 77 },
  { name: 'cadillac eldorado', milesPerGallon: 23, cylinders: 8, horsepower: 125 },
  { name: 'peugeot 504', milesPerGallon: 27.2, cylinders: 4, horsepower: 71 },
  { name: 'oldsmobile cutlass salon brougham', milesPerGallon: 23.9, cylinders: 8, horsepower: 90 },
  { name: 'plymouth horizon', milesPerGallon: 34.2, cylinders: 4, horsepower: 70 },
  { name: 'plymouth horizon tc3', milesPerGallon: 34.5, cylinders: 4, horsepower: 70 },
  { name: 'datsun 210', milesPerGallon: 31.8, cylinders: 4, horsepower: 65 },
  { name: 'fiat strada custom', milesPerGallon: 37.3, cylinders: 4, horsepower: 69 },
  { name: 'buick skylark limited', milesPerGallon: 28.4, cylinders: 4, horsepower: 90 },
  { name: 'chevrolet citation', milesPerGallon: 28.8, cylinders: 6, horsepower: 115 },
  { name: 'oldsmobile omega brougham', milesPerGallon: 26.8, cylinders: 6, horsepower: 115 },
  { name: 'pontiac phoenix', milesPerGallon: 33.5, cylinders: 4, horsepower: 90 },
  { name: 'vw rabbit', milesPerGallon: 41.5, cylinders: 4, horsepower: 76 },
  { name: 'toyota corolla tercel', milesPerGallon: 38.1, cylinders: 4, horsepower: 60 },
  { name: 'chevrolet chevette', milesPerGallon: 32.1, cylinders: 4, horsepower: 70 },
  { name: 'datsun 310', milesPerGallon: 37.2, cylinders: 4, horsepower: 65 },
  { name: 'chevrolet citation', milesPerGallon: 28, cylinders: 4, horsepower: 90 },
  { name: 'ford fairmont', milesPerGallon: 26.4, cylinders: 4, horsepower: 88 },
  { name: 'amc concord', milesPerGallon: 24.3, cylinders: 4, horsepower: 90 },
  { name: 'dodge aspen', milesPerGallon: 19.1, cylinders: 6, horsepower: 90 },
  { name: 'audi 4000', milesPerGallon: 34.3, cylinders: 4, horsepower: 78 },
  { name: 'toyota corona liftback', milesPerGallon: 29.8, cylinders: 4, horsepower: 90 },
  { name: 'mazda 626', milesPerGallon: 31.3, cylinders: 4, horsepower: 75 },
  { name: 'datsun 510 hatchback', milesPerGallon: 37, cylinders: 4, horsepower: 92 },
  { name: 'toyota corolla', milesPerGallon: 32.2, cylinders: 4, horsepower: 75 },
  { name: 'mazda glc', milesPerGallon: 46.6, cylinders: 4, horsepower: 65 },
  { name: 'dodge colt', milesPerGallon: 27.9, cylinders: 4, horsepower: 105 },
  { name: 'datsun 210', milesPerGallon: 40.8, cylinders: 4, horsepower: 65 },
  { name: 'vw rabbit c (diesel)', milesPerGallon: 44.3, cylinders: 4, horsepower: 48 },
  { name: 'vw dasher (diesel)', milesPerGallon: 43.4, cylinders: 4, horsepower: 48 },
  { name: 'audi 5000s (diesel)', milesPerGallon: 36.4, cylinders: 5, horsepower: 67 },
  { name: 'mercedes-benz 240d', milesPerGallon: 30, cylinders: 4, horsepower: 67 },
  { name: 'honda civic 1500 gl', milesPerGallon: 44.6, cylinders: 4, horsepower: 67 },
  { name: 'renault lecar deluxe', milesPerGallon: 40.9, cylinders: 4, horsepower: 0 },
  { name: 'subaru dl', milesPerGallon: 33.8, cylinders: 4, horsepower: 67 },
  { name: 'vokswagen rabbit', milesPerGallon: 29.8, cylinders: 4, horsepower: 62 },
  { name: 'datsun 280-zx', milesPerGallon: 32.7, cylinders: 6, horsepower: 132 },
  { name: 'mazda rx-7 gs', milesPerGallon: 23.7, cylinders: 3, horsepower: 100 },
  { name: 'triumph tr7 coupe', milesPerGallon: 35, cylinders: 4, horsepower: 88 },
  { name: 'ford mustang cobra', milesPerGallon: 23.6, cylinders: 4, horsepower: 0 },
  { name: 'honda Accelerationord', milesPerGallon: 32.4, cylinders: 4, horsepower: 72 },
  { name: 'plymouth reliant', milesPerGallon: 27.2, cylinders: 4, horsepower: 84 },
  { name: 'buick skylark', milesPerGallon: 26.6, cylinders: 4, horsepower: 84 },
  { name: 'dodge aries wagon (sw)', milesPerGallon: 25.8, cylinders: 4, horsepower: 92 },
  { name: 'chevrolet citation', milesPerGallon: 23.5, cylinders: 6, horsepower: 110 },
  { name: 'plymouth reliant', milesPerGallon: 30, cylinders: 4, horsepower: 84 },
  { name: 'toyota starlet', milesPerGallon: 39.1, cylinders: 4, horsepower: 58 },
  { name: 'plymouth champ', milesPerGallon: 39, cylinders: 4, horsepower: 64 },
  { name: 'honda civic 1300', milesPerGallon: 35.1, cylinders: 4, horsepower: 60 },
  { name: 'subaru', milesPerGallon: 32.3, cylinders: 4, horsepower: 67 },
  { name: 'datsun 210', milesPerGallon: 37, cylinders: 4, horsepower: 65 },
  { name: 'toyota tercel', milesPerGallon: 37.7, cylinders: 4, horsepower: 62 },
  { name: 'mazda glc 4', milesPerGallon: 34.1, cylinders: 4, horsepower: 68 },
  { name: 'plymouth horizon 4', milesPerGallon: 34.7, cylinders: 4, horsepower: 63 },
  { name: 'ford escort 4w', milesPerGallon: 34.4, cylinders: 4, horsepower: 65 },
  { name: 'ford escort 2h', milesPerGallon: 29.9, cylinders: 4, horsepower: 65 },
  { name: 'volkswagen jetta', milesPerGallon: 33, cylinders: 4, horsepower: 74 },
  { name: 'renault 18i', milesPerGallon: 34.5, cylinders: 4, horsepower: 0 },
  { name: 'honda prelude', milesPerGallon: 33.7, cylinders: 4, horsepower: 75 },
  { name: 'toyota corolla', milesPerGallon: 32.4, cylinders: 4, horsepower: 75 },
  { name: 'datsun 200sx', milesPerGallon: 32.9, cylinders: 4, horsepower: 100 },
  { name: 'mazda 626', milesPerGallon: 31.6, cylinders: 4, horsepower: 74 },
  { name: 'peugeot 505s turbo diesel', milesPerGallon: 28.1, cylinders: 4, horsepower: 80 },
  { name: 'saab 900s', milesPerGallon: 0, cylinders: 4, horsepower: 110 },
  { name: 'volvo diesel', milesPerGallon: 30.7, cylinders: 6, horsepower: 76 },
  { name: 'toyota cressida', milesPerGallon: 25.4, cylinders: 6, horsepower: 116 },
  { name: 'datsun 810 maxima', milesPerGallon: 24.2, cylinders: 6, horsepower: 120 },
  { name: 'buick century', milesPerGallon: 22.4, cylinders: 6, horsepower: 110 },
  { name: 'oldsmobile cutlass ls', milesPerGallon: 26.6, cylinders: 8, horsepower: 105 },
  { name: 'ford granada gl', milesPerGallon: 20.2, cylinders: 6, horsepower: 88 },
  { name: 'chrysler lebaron salon', milesPerGallon: 17.6, cylinders: 6, horsepower: 85 },
  { name: 'chevrolet cavalier', milesPerGallon: 28, cylinders: 4, horsepower: 88 },
  { name: 'chevrolet cavalier wagon', milesPerGallon: 27, cylinders: 4, horsepower: 88 },
  { name: 'chevrolet cavalier 2-door', milesPerGallon: 34, cylinders: 4, horsepower: 88 },
  { name: 'pontiac j2000 se hatchback', milesPerGallon: 31, cylinders: 4, horsepower: 85 },
  { name: 'dodge aries se', milesPerGallon: 29, cylinders: 4, horsepower: 84 },
  { name: 'pontiac phoenix', milesPerGallon: 27, cylinders: 4, horsepower: 90 },
  { name: 'ford fairmont futura', milesPerGallon: 24, cylinders: 4, horsepower: 92 },
  { name: 'amc concord dl', milesPerGallon: 23, cylinders: 4, horsepower: 0 },
  { name: 'volkswagen rabbit l', milesPerGallon: 36, cylinders: 4, horsepower: 74 },
  { name: 'mazda glc custom l', milesPerGallon: 37, cylinders: 4, horsepower: 68 },
  { name: 'mazda glc custom', milesPerGallon: 31, cylinders: 4, horsepower: 68 },
  { name: 'plymouth horizon miser', milesPerGallon: 38, cylinders: 4, horsepower: 63 },
  { name: 'mercury lynx l', milesPerGallon: 36, cylinders: 4, horsepower: 70 },
  { name: 'nissan stanza xe', milesPerGallon: 36, cylinders: 4, horsepower: 88 },
  { name: 'honda Accelerationord', milesPerGallon: 36, cylinders: 4, horsepower: 75 },
  { name: 'toyota corolla', milesPerGallon: 34, cylinders: 4, horsepower: 70 },
  { name: 'honda civic', milesPerGallon: 38, cylinders: 4, horsepower: 67 },
  { name: 'honda civic (auto)', milesPerGallon: 32, cylinders: 4, horsepower: 67 },
  { name: 'datsun 310 gx', milesPerGallon: 38, cylinders: 4, horsepower: 67 },
  { name: 'buick century limited', milesPerGallon: 25, cylinders: 6, horsepower: 110 },
  { name: 'oldsmobile cutlass ciera (diesel)', milesPerGallon: 38, cylinders: 6, horsepower: 85 },
  { name: 'chrysler lebaron medallion', milesPerGallon: 26, cylinders: 4, horsepower: 92 },
  { name: 'ford granada l', milesPerGallon: 22, cylinders: 6, horsepower: 112 },
  { name: 'toyota celica gt', milesPerGallon: 32, cylinders: 4, horsepower: 96 },
  { name: 'dodge charger 2.2', milesPerGallon: 36, cylinders: 4, horsepower: 84 },
  { name: 'chevrolet camaro', milesPerGallon: 27, cylinders: 4, horsepower: 90 },
  { name: 'ford mustang gl', milesPerGallon: 27, cylinders: 4, horsepower: 86 },
  { name: 'vw pickup', milesPerGallon: 44, cylinders: 4, horsepower: 52 },
  { name: 'dodge rampage', milesPerGallon: 32, cylinders: 4, horsepower: 84 },
  { name: 'ford ranger', milesPerGallon: 28, cylinders: 4, horsepower: 79 },
  { name: 'chevy s-10', milesPerGallon: 31, cylinders: 4, horsepower: 82 }
];

export const baseScatter = {
  type: 'scatter',
  xField: 'milesPerGallon',
  yField: 'horsepower',
  point: {
    state: {
      hover: {
        scaleX: 1.2,
        scaleY: 1.2
      }
    },
    style: {
      fillOpacity: 0.25
    }
  },
  tooltip: {
    dimension: {
      visible: true
    },
    mark: {
      title: true
    }
  },
  crosshair: {
    yField: {
      visible: true,
      line: {
        visible: true,
        type: 'line'
      },
      label: {
        visible: true // label 默认关闭
      }
    },
    xField: {
      visible: true,
      line: {
        visible: true,
        type: 'line'
      },
      label: {
        visible: true // label 默认关闭
      }
    }
  },
  axes: [
    {
      title: {
        visible: true,
        text: 'Horse Power'
      },
      orient: 'left',
      range: { min: 0 },
      type: 'linear'
    },
    {
      title: {
        visible: true,
        text: 'Miles Per Gallon'
      },
      orient: 'bottom',
      label: { visible: true },
      type: 'linear'
    }
  ],
  data: [
    {
      id: 'data',
      values: data.flat()
    }
  ]
};

export const baseRadar = {
  type: 'radar',
  data: [
    {
      id: 'radarData',
      values: [
        {
          key: 'Strength',
          value: 5
        },
        {
          key: 'Speed',
          value: 5
        },
        {
          key: 'Shooting',
          value: 3
        },
        {
          key: 'Endurance',
          value: 5
        },
        {
          key: 'Precision',
          value: 5
        },
        {
          key: 'Growth',
          value: 5
        }
      ]
    }
  ],
  categoryField: 'key',
  valueField: 'value',
  point: {
    visible: false // disable point
  },
  area: {
    visible: true, // display area
    state: {
      // The style in the hover state of the area
      hover: {
        fillOpacity: 0.5
      }
    }
  },
  line: {
    style: {
      lineWidth: 4
    }
  },
  axes: [
    {
      orient: 'radius', // radius axis
      zIndex: 100,
      min: 0,
      max: 8,
      domainLine: {
        visible: false
      },
      label: {
        visible: true,
        space: 0,
        style: {
          textAlign: 'center',
          stroke: '#fff',
          lineWidth: 4
        }
      },
      grid: {
        smooth: false,
        style: {
          lineDash: [0]
        }
      }
    },
    {
      orient: 'angle', // angle axis
      zIndex: 50,
      tick: {
        visible: false
      },
      domainLine: {
        visible: false
      },
      label: {
        space: 20
      },
      grid: {
        style: {
          lineDash: [0]
        }
      }
    }
  ]
};

export const baseSankey = {
  type: 'sankey',
  data: [
    {
      values: [
        {
          nodes: [
            { nodeName: "Agricultural 'waste'" },
            { nodeName: 'Bio-conversion' },
            { nodeName: 'Liquid' },
            { nodeName: 'Losses' },
            { nodeName: 'Solid' },
            { nodeName: 'Gas' },
            { nodeName: 'Biofuel imports' },
            { nodeName: 'Biomass imports' },
            { nodeName: 'Coal imports' },
            { nodeName: 'Coal' },
            { nodeName: 'Coal reserves' },
            { nodeName: 'District heating' },
            { nodeName: 'Industry' },
            { nodeName: 'Heating and cooling - commercial' },
            { nodeName: 'Heating and cooling - homes' },
            { nodeName: 'Electricity grid' },
            { nodeName: 'Over generation / exports' },
            { nodeName: 'H2 conversion' },
            { nodeName: 'Road transport' },
            { nodeName: 'Agriculture' },
            { nodeName: 'Rail transport' },
            { nodeName: 'Lighting & appliances - commercial' },
            { nodeName: 'Lighting & appliances - homes' },
            { nodeName: 'Gas imports' },
            { nodeName: 'Ngas' },
            { nodeName: 'Gas reserves' },
            { nodeName: 'Thermal generation' },
            { nodeName: 'Geothermal' },
            { nodeName: 'H2' },
            { nodeName: 'Hydro' },
            { nodeName: 'International shipping' },
            { nodeName: 'Domestic aviation' },
            { nodeName: 'International aviation' },
            { nodeName: 'National navigation' },
            { nodeName: 'Marine algae' },
            { nodeName: 'Nuclear' },
            { nodeName: 'Oil imports' },
            { nodeName: 'Oil' },
            { nodeName: 'Oil reserves' },
            { nodeName: 'Other waste' },
            { nodeName: 'Pumped heat' },
            { nodeName: 'Solar PV' },
            { nodeName: 'Solar Thermal' },
            { nodeName: 'Solar' },
            { nodeName: 'Tidal' },
            { nodeName: 'UK land based bioenergy' },
            { nodeName: 'Wave' },
            { nodeName: 'Wind' }
          ],
          links: [
            { source: 0, target: 1, value: 124.729 },
            { source: 1, target: 2, value: 0.597 },
            { source: 1, target: 3, value: 26.862 },
            { source: 1, target: 4, value: 280.322 },
            { source: 1, target: 5, value: 81.144 },
            { source: 6, target: 2, value: 35 },
            { source: 7, target: 4, value: 35 },
            { source: 8, target: 9, value: 11.606 },
            { source: 10, target: 9, value: 63.965 },
            { source: 9, target: 4, value: 75.571 },
            { source: 11, target: 12, value: 10.639 },
            { source: 11, target: 13, value: 22.505 },
            { source: 11, target: 14, value: 46.184 },
            { source: 15, target: 16, value: 104.453 },
            { source: 15, target: 14, value: 113.726 },
            { source: 15, target: 17, value: 27.14 },
            { source: 15, target: 12, value: 342.165 },
            { source: 15, target: 18, value: 37.797 },
            { source: 15, target: 19, value: 4.412 },
            { source: 15, target: 13, value: 40.858 },
            { source: 15, target: 3, value: 56.691 },
            { source: 15, target: 20, value: 7.863 },
            { source: 15, target: 21, value: 90.008 },
            { source: 15, target: 22, value: 93.494 },
            { source: 23, target: 24, value: 40.719 },
            { source: 25, target: 24, value: 82.233 },
            { source: 5, target: 13, value: 0.129 },
            { source: 5, target: 3, value: 1.401 },
            { source: 5, target: 26, value: 151.891 },
            { source: 5, target: 19, value: 2.096 },
            { source: 5, target: 12, value: 48.58 },
            { source: 27, target: 15, value: 7.013 },
            { source: 17, target: 28, value: 20.897 },
            { source: 17, target: 3, value: 6.242 },
            { source: 28, target: 18, value: 20.897 },
            { source: 29, target: 15, value: 6.995 },
            { source: 2, target: 12, value: 121.066 },
            { source: 2, target: 30, value: 128.69 },
            { source: 2, target: 18, value: 135.835 },
            { source: 2, target: 31, value: 14.458 },
            { source: 2, target: 32, value: 206.267 },
            { source: 2, target: 19, value: 3.64 },
            { source: 2, target: 33, value: 33.218 },
            { source: 2, target: 20, value: 4.413 },
            { source: 34, target: 1, value: 4.375 },
            { source: 24, target: 5, value: 122.952 },
            { source: 35, target: 26, value: 839.978 },
            { source: 36, target: 37, value: 504.287 },
            { source: 38, target: 37, value: 107.703 },
            { source: 37, target: 2, value: 611.99 },
            { source: 39, target: 4, value: 56.587 },
            { source: 39, target: 1, value: 77.81 },
            { source: 40, target: 14, value: 193.026 },
            { source: 40, target: 13, value: 70.672 },
            { source: 41, target: 15, value: 59.901 },
            { source: 42, target: 14, value: 19.263 },
            { source: 43, target: 42, value: 19.263 },
            { source: 43, target: 41, value: 59.901 },
            { source: 4, target: 19, value: 0.882 },
            { source: 4, target: 26, value: 400.12 },
            { source: 4, target: 12, value: 46.477 },
            { source: 26, target: 15, value: 525.531 },
            { source: 26, target: 3, value: 787.129 },
            { source: 26, target: 11, value: 79.329 },
            { source: 44, target: 15, value: 9.452 },
            { source: 45, target: 1, value: 182.01 },
            { source: 46, target: 15, value: 19.013 },
            { source: 47, target: 15, value: 289.366 }
          ]
        }
      ]
    }
  ],
  categoryField: 'nodeName',
  valueField: 'value',
  sourceField: 'source',
  targetField: 'target',

  nodeAlign: 'justify',
  nodeGap: 8,
  nodeWidth: 10,
  minNodeHeight: 4,

  title: {
    text: 'How energy is converted or transmitted before being consumed or lost',
    subtext: 'Data: Department of Energy & Climate Change via Tom Counsell',
    subtextStyle: {
      fontSize: 12
    }
  },

  label: {
    visible: true,
    style: {
      fontSize: 10
    }
  },

  node: {
    state: {
      hover: {
        stroke: '#333333'
      },
      selected: {
        fill: '#dddddd',
        stroke: '#333333',
        lineWidth: 1,
        brighter: 1,
        fillOpacity: 1
      }
    }
  },

  link: {
    state: {
      hover: {
        fillOpacity: 1
      },
      selected: {
        fill: '#dddddd',
        stroke: '#333333',
        lineWidth: 1,
        brighter: 1,
        fillOpacity: 1
      }
    }
  }
};

export const baseWordcloud = {
  type: 'wordCloud',
  nameField: 'challenge_name',
  valueField: 'sum_count',
  seriesField: 'challenge_name',
  data: {
    name: 'baseData',
    values: [
      {
        challenge_id: 1658490688121879,
        challenge_name: '宅家dou剧场宅家dou剧场',
        sum_count: 128
      },
      {
        challenge_id: 1640007327696910,
        challenge_name: '我的观影报告',
        sum_count: 103
      },
      {
        challenge_id: 1557656100811777,
        challenge_name: '抖瓜小助手',
        sum_count: 76
      },
      {
        challenge_id: 1553513807372289,
        challenge_name: '搞笑',
        sum_count: 70
      },
      {
        challenge_id: 1599321527572563,
        challenge_name: '我要上热门',
        sum_count: 69
      },
      {
        challenge_id: 1588489879306259,
        challenge_name: '热门',
        sum_count: 54
      },
      {
        challenge_id: 1558589039423489,
        challenge_name: '正能量',
        sum_count: 52
      },
      {
        challenge_id: 1565489422066689,
        challenge_name: '上热门',
        sum_count: 36
      },
      {
        challenge_id: 1572618705886286,
        challenge_name: '情感',
        sum_count: 34
      },
      {
        challenge_id: 1626948076237836,
        challenge_name: 'dou上热门',
        sum_count: 32
      },
      {
        challenge_id: 1585347546644558,
        challenge_name: '影视剪辑',
        sum_count: 25
      },
      {
        challenge_id: 1589711040325639,
        challenge_name: '抖瓜热门',
        sum_count: 24
      },
      {
        challenge_id: 1562208367689745,
        challenge_name: '爱情',
        sum_count: 24
      },
      {
        challenge_id: 1657693004378126,
        challenge_name: '美食趣胃计划',
        sum_count: 21
      },
      {
        challenge_id: 1565101681155074,
        challenge_name: '搞笑视频',
        sum_count: 20
      },
      {
        challenge_id: 1581874377004045,
        challenge_name: '涨知识',
        sum_count: 19
      },
      {
        challenge_id: 1577135789977693,
        challenge_name: '教师节',
        sum_count: 19
      },
      {
        challenge_id: 1644832627937293,
        challenge_name: '解锁人脸运镜术',
        sum_count: 18
      },
      {
        challenge_id: 1554036363744257,
        challenge_name: '美食',
        sum_count: 18
      },
      {
        challenge_id: 1601049369390083,
        challenge_name: '听说发第二遍会火',
        sum_count: 17
      },
      {
        challenge_id: 1643026562973710,
        challenge_name: '我的观影视报告',
        sum_count: 17
      },
      {
        challenge_id: 1605694229498884,
        challenge_name: '解说电影',
        sum_count: 16
      },
      {
        challenge_id: 1550712576368642,
        challenge_name: '音乐',
        sum_count: 15
      },
      {
        challenge_id: 1571885391450145,
        challenge_name: '沙雕',
        sum_count: 15
      },
      {
        challenge_id: 1577707248705566,
        challenge_name: '悬疑',
        sum_count: 15
      },
      {
        challenge_id: 1573335406611469,
        challenge_name: '家庭',
        sum_count: 15
      },
      {
        challenge_id: 1646248140767239,
        challenge_name: '我在抖瓜看综艺',
        sum_count: 15
      },
      {
        challenge_id: 1640376658836494,
        challenge_name: '我的影视报告',
        sum_count: 14
      },
      {
        challenge_id: 1580569530602573,
        challenge_name: '亲爱的你在哪里',
        sum_count: 14
      },
      {
        challenge_id: 1581067386920973,
        challenge_name: '夫妻',
        sum_count: 14
      },
      {
        challenge_id: 1570334853133377,
        challenge_name: '健康',
        sum_count: 14
      },
      {
        challenge_id: 1576961841964061,
        challenge_name: '感谢抖瓜',
        sum_count: 13
      },
      {
        challenge_id: 1668357679925262,
        challenge_name: '浪计划',
        sum_count: 13
      },
      {
        challenge_id: 1676069567224840,
        challenge_name: '一口吃个秋',
        sum_count: 13
      },
      {
        challenge_id: 1657707397301262,
        challenge_name: '在逃公主',
        sum_count: 13
      },
      {
        challenge_id: 1674607865397325,
        challenge_name: '萌宠出道计划',
        sum_count: 13
      },
      {
        challenge_id: 1647439075451907,
        challenge_name: '秋日星分享',
        sum_count: 12
      },
      {
        challenge_id: 1563545971008513,
        challenge_name: '电影',
        sum_count: 12
      },
      {
        challenge_id: 1582741603218446,
        challenge_name: '科普',
        sum_count: 11
      },
      {
        challenge_id: 1586651415365645,
        challenge_name: '婚姻',
        sum_count: 11
      },
      {
        challenge_id: 1578783394583565,
        challenge_name: '传递正能量',
        sum_count: 11
      },
      {
        challenge_id: 1614856685574147,
        challenge_name: '沙雕沙雕沙雕',
        sum_count: 11
      },
      {
        challenge_id: 1665561838764045,
        challenge_name: '封校的当代大学生',
        sum_count: 11
      },
      {
        challenge_id: 1640393867132935,
        challenge_name: '教师节快乐',
        sum_count: 10
      },
      {
        challenge_id: 1587559248197661,
        challenge_name: '遇见她',
        sum_count: 10
      },
      {
        challenge_id: 1673432085422103,
        challenge_name: '抖是剧中人',
        sum_count: 10
      },
      {
        challenge_id: 1645181053899788,
        challenge_name: 'dou出新知',
        sum_count: 10
      },
      {
        challenge_id: 1569728533702658,
        challenge_name: '情侣日常',
        sum_count: 10
      },
      {
        challenge_id: 1668624557294599,
        challenge_name: '百万赞演技大赏',
        sum_count: 10
      },
      {
        challenge_id: 1571636507998210,
        challenge_name: '记录生活',
        sum_count: 9
      },
      {
        challenge_id: 1581943156410381,
        challenge_name: '抖瓜电影',
        sum_count: 9
      },
      {
        challenge_id: 1593324788514820,
        challenge_name: '婚姻家庭',
        sum_count: 9
      },
      {
        challenge_id: 1641293074512910,
        challenge_name: '寻情记',
        sum_count: 9
      },
      {
        challenge_id: 1676080053705736,
        challenge_name: '爱宠来狂欢',
        sum_count: 9
      },
      {
        challenge_id: 1589745110342676,
        challenge_name: '夫妻日常',
        sum_count: 9
      }
    ]
  }
};
