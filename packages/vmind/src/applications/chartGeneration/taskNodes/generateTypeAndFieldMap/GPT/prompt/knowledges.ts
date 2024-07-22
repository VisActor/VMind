/* eslint-disable max-len */
import { ChartType } from '../../../../../../common/typings';
import { barChartExample1, dynamicBarChart1, lineChartExample1, lineChartExample2, pieChartExample1 } from './examples';
import type { ChartKnowledge } from './types';
import { NEED_SIZE_FIELD_CHART_LIST, NEED_COLOR_FIELD_CHART_LIST } from '../../../../constants';

const getColorKnowledge = (chartTypeList: ChartType[]) => {
  const validSet = new Set(chartTypeList);
  if (NEED_COLOR_FIELD_CHART_LIST.some(chartType => validSet.has(chartType))) {
    const includedCharts = chartTypeList.filter(chart => NEED_COLOR_FIELD_CHART_LIST.includes(chart));
    return ", can't be empty in " + includedCharts.join(', ') + '.';
  }
  return '.';
};

const getSizeKnowledge = (chartTypeList: ChartType[]) => {
  const validSet = new Set(chartTypeList);
  if (NEED_SIZE_FIELD_CHART_LIST.some(chartType => validSet.has(chartType))) {
    const includedCharts = chartTypeList.filter(chart => NEED_SIZE_FIELD_CHART_LIST.includes(chart));
    return ' Only used in ' + includedCharts.join(' , ') + '.';
  }
  return '.';
};

export const visualChannelInfoMap = {
  x: (chartTypeList: ChartType[]) => 'the field mapped to the x-axis, can be empty. Can Only has one field.',
  y: (chartTypeList: ChartType[]) =>
    'the field mapped to the y-axis. Only number fields, can be empty. Use array if there are more than one fields.',
  color: (chartTypeList: ChartType[]) =>
    `the field mapped to the color channel. Must use a string field${getColorKnowledge(chartTypeList)}`,
  size: (chartTypeList: ChartType[]) =>
    `the field mapped to the size channel. Must use a number field${getSizeKnowledge(chartTypeList)}`,
  angle: (chartTypeList: ChartType[]) =>
    "the field mapped to the angle channel of the pie chart. Can't be empty in Pie Chart.",
  radius: (chartTypeList: ChartType[]) =>
    "the field mapped to the radius channel of the rose chart. Only used in Rose Chart. Can't be empty in Rose Chart.",
  time: (chartTypeList: ChartType[]) =>
    "This is usually a date field and can be used only in Dynamic Bar Chart. Can't be empty in Dynamic Bar Chart.",
  source: (chartTypeList: ChartType[]) =>
    "the field mapped to the source channel. Only used in Sankey Chart. Can't be empty in Sankey Chart.",
  target: (chartTypeList: ChartType[]) =>
    "the field mapped to the target channel. Only used in Sankey Chart. Can't be empty in Sankey Chart.",
  value: (chartTypeList: ChartType[]) =>
    "the field mapped to the value channel. Only used in Sankey Chart. Can't be empty in Sankey Chart.",
  group: (chartTypeList: ChartType[]) =>
    "the field mapped to the value channel. Only used in Venn Chart. Can't be empty in Venn Chart. Digital IDs are often used to distinguish whether data is in the same group."
};
export const chartKnowledgeDict: ChartKnowledge = {
  [ChartType.BarChart]: {
    index: 4,
    visualChannels: ['x', 'y', 'color'],
    examples: [barChartExample1]
  },
  [ChartType.LineChart]: {
    index: 3,
    visualChannels: ['x', 'y', 'color'],
    examples: [lineChartExample1, lineChartExample2]
  },
  [ChartType.PieChart]: {
    index: 2,
    visualChannels: ['color', 'angle'],
    examples: [pieChartExample1]
  },
  [ChartType.ScatterPlot]: {
    index: 5,
    visualChannels: ['x', 'y', 'color', 'size'],
    examples: []
  },
  [ChartType.WordCloud]: {
    index: 6,
    visualChannels: ['color', 'size'],
    examples: []
  },
  [ChartType.RoseChart]: {
    index: 7,
    visualChannels: ['color', 'radius', 'angle'],
    examples: []
  },
  [ChartType.RadarChart]: {
    index: 8,
    visualChannels: ['x', 'y', 'color', 'angle', 'value'],
    examples: []
  },
  [ChartType.SankeyChart]: {
    index: 9,
    visualChannels: ['source', 'target', 'value'],
    examples: []
  },
  [ChartType.FunnelChart]: {
    index: 10,
    visualChannels: ['x', 'y', 'color', 'value'],
    examples: []
  },
  [ChartType.DualAxisChart]: {
    index: 11,
    visualChannels: ['x', 'y'],
    examples: [],
    knowledge: [
      'Dual-axis chart is used when there are two y-fields need to visualize. It needs two number fields as y field'
    ]
  },
  [ChartType.WaterFallChart]: {
    index: 12,
    visualChannels: ['x', 'y'],
    examples: []
  },
  [ChartType.BoxPlot]: {
    index: 13,
    visualChannels: ['x', 'y'],
    examples: []
  },
  [ChartType.DynamicBarChart]: {
    index: 1,
    visualChannels: ['x', 'y', 'color', 'time'],
    examples: [dynamicBarChart1],
    knowledge: [
      'Dynamic Bar Chart is a dynamic chart that is suitable for displaying changing data and can be used to show ranking, comparisons or data changes over time. It usually has a time field. It updates the data dynamically according to the time field.'
    ]
  },
  [ChartType.LiquidChart]: {
    index: 14,
    visualChannels: ['x', 'y'],
    examples: [],
    knowledge: [
      'Liquid chart is used to display a single value, with the value range typically from 0 to 1. The value usually represents progress, completion, or percentage, and is associated with only one field'
    ]
  },
  [ChartType.LinearProgress]: {
    index: 15,
    visualChannels: ['x', 'y'],
    examples: [],
    knowledge: [
      'Linear Progress chart is typically used to display progress data, which is usually a value between 0 and 1. Linear progress bars can show single progress values as well as multiple progress values. By default, the left Y-axis of the linear progress bar is the categorical field, and the bottom X-axis is the numerical field.'
    ]
  },
  [ChartType.CircularProgress]: {
    index: 16,
    visualChannels: ['x', 'y'],
    examples: [],
    knowledge: [
      'Circular progress chart is also used to display progress data, presented in a circular form, with the values on the numerical axis typically ranging from 0 to 1.'
    ]
  },
  [ChartType.BubbleCirclePacking]: {
    index: 17,
    visualChannels: ['color', 'size'],
    examples: [],
    knowledge: []
  },
  [ChartType.MapChart]: {
    index: 18,
    visualChannels: ['color', 'size'],
    examples: [],
    knowledge: []
  },
  [ChartType.RangeColumnChart]: {
    index: 19,
    visualChannels: ['y', 'x'],
    examples: [],
    knowledge: []
  },
  [ChartType.SunburstChart]: {
    index: 20,
    visualChannels: ['x', 'y'],
    examples: [],
    knowledge: [
      'The x field of a sunburst chart can be an array. The order of the elements in the array needs to be sorted from large to small according to the coverage described by the data field.'
    ]
  },
  [ChartType.TreemapChart]: {
    index: 21,
    visualChannels: ['x', 'y'],
    examples: [],
    knowledge: [
      'The x field of a treemap chart can be an array. The order of the elements in the array needs to be sorted from large to small according to the coverage described by the data field.'
    ]
  },
  [ChartType.Gauge]: {
    index: 22,
    visualChannels: ['color', 'size'],
    examples: [],
    knowledge: ['The gauge chart must contain two fields: size and color.']
  },
  // [ChartType.LinearProgressChart]: {
  //   index: 23,
  //   visualChannels: ['y', 'x'],
  //   examples: [],
  //   knowledge: []
  // },
  [ChartType.BasicHeatMap]: {
    index: 24,
    visualChannels: ['y', 'x', 'size'],
    examples: [],
    knowledge: []
  },
  [ChartType.VennChart]: {
    index: 25,
    visualChannels: ['size', 'color', 'group'],
    examples: [],
    knowledge: ['The venn chart must contain three fields: group, size and color.']
  }
};

export const defaultExamples = [dynamicBarChart1, pieChartExample1, lineChartExample1, lineChartExample2];

export const chartGenerationConstraints = [
  'No user assistance.',
  `Please select one chart type in CHART_TYPE at each time.Don't use "A or B", "[A, B]" in CHART_TYPE.`,
  'The selected chart type in CHART_TYPE must be in the list of supported charts.',
  'DO NOT change or translate the field names in FIELD_MAP.',
  'A number field can not be used as a color field. A string field can not be used as y-axis',
  "Ignore requests unrelated to chart visualization in the user's request.",
  `The keys in FIELD_MAP must be selected from the list of available visual channels. Don't use visual channels that do not exist.`,
  `Wrap the reply content using \`\`\`, and the returned content must be directly parsed by JSON.parse() in JavaScript.`
];
