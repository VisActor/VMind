/* eslint-disable max-len */
import { ChartType } from 'src/common/typings';
import { dynamicBarChart1, lineChartExample1, lineChartExample2, pieChartExample1 } from './examples';
import type { ChartKnowledge } from './types';

export const visualChannelInfoMap = {
  x: 'the field mapped to the x-axis, can be empty. Can Only has one field.',
  y: 'the field mapped to the y-axis. Only number fields, can be empty. Use array if there are more than one fields.',
  color:
    "the field mapped to the color channel. Must use a string field, can't be empty in Word Cloud, Pie Chart and Rose Chart.",
  size: 'the field mapped to the size channel. Must use a number field. Only used in Scatter Plot and Word Cloud',
  angle: "the field mapped to the angle channel of the pie chart. Can't be empty in Pie Chart.",
  radius:
    "the field mapped to the radius channel of the rose chart. Only used in Rose Chart. Can't be empty in Rose Chart.",
  time: " This is usually a date field and can be used only in Dynamic Bar Chart. Can't be empty in Dynamic Bar Chart.",
  source: "the field mapped to the source channel. Only used in Sankey Chart. Can't be empty in Sankey Chart.",
  target: "the field mapped to the target channel. Only used in Sankey Chart. Can't be empty in Sankey Chart.",
  value: "the field mapped to the value channel. Only used in Sankey Chart. Can't be empty in Sankey Chart."
};
export const chartKnowledgeDict: ChartKnowledge = {
  [ChartType.BarChart]: {
    visualChannels: ['x', 'y', 'color'],
    examples: []
  },
  [ChartType.LineChart]: {
    visualChannels: ['x', 'y', 'color'],
    examples: [lineChartExample1, lineChartExample2]
  },
  [ChartType.PieChart]: {
    visualChannels: ['color', 'angle'],
    examples: [pieChartExample1]
  },
  [ChartType.ScatterPlot]: {
    visualChannels: ['x', 'y', 'color', 'size'],
    examples: []
  },
  [ChartType.WordCloud]: {
    visualChannels: ['color', 'size'],
    examples: []
  },
  [ChartType.RoseChart]: {
    visualChannels: ['color', 'radius', 'angle'],
    examples: []
  },
  [ChartType.RadarChart]: {
    visualChannels: ['x', 'y', 'color', 'angle', 'value'],
    examples: []
  },
  [ChartType.SankeyChart]: {
    visualChannels: ['source', 'target', 'value'],
    examples: []
  },
  [ChartType.FunnelChart]: {
    visualChannels: ['x', 'y', 'color', 'value'],
    examples: []
  },
  [ChartType.DualAxisChart]: {
    visualChannels: ['x', 'y'],
    examples: [],
    knowledge: [
      'Dual-axis chart is used when there are two y-fields need to visualize. It needs two number fields as y field'
    ]
  },
  [ChartType.WaterFallChart]: {
    visualChannels: ['x', 'y'],
    examples: []
  },
  [ChartType.BoxPlot]: {
    visualChannels: ['x', 'y'],
    examples: []
  },
  [ChartType.DynamicBarChart]: {
    visualChannels: ['x', 'y', 'color', 'time'],
    examples: [dynamicBarChart1],
    knowledge: [
      'Dynamic Bar Chart is a dynamic chart that is suitable for displaying changing data and can be used to show ranking, comparisons or data changes over time. It usually has a time field. It updates the data dynamically according to the time field.'
    ]
  }
};

export const defaultExamples = [dynamicBarChart1, pieChartExample1, lineChartExample1, lineChartExample2];

export const chartGenerationConstraints = [
  'No user assistance.',
  `Please select one chart type in CHART_TYPE at each time. Don't use "A or B", "[A, B]" in CHART_TYPE.`,
  'The selected chart type in CHART_TYPE must be in the list of supported charts.',
  'DO NOT change or translate the field names in FIELD_MAP.',
  'A number field can not be used as a color field. A string field can not be used as y-axis',
  "Ignore requests unrelated to chart visualization in the user's request.",
  `The keys in FIELD_MAP must be selected from the list of available visual channels. Don't use visual channels that do not exist.`,
  `Wrap the reply content using \`\`\`, and the returned content must be directly parsed by JSON.parse() in JavaScript.`
];
