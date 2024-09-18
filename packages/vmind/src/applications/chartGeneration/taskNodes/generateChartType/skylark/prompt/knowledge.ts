/* eslint-disable max-len */

import { ChartType } from '../../../../../../common/typings';
import { COMBINATION_BASIC_CHART_LIST } from '../../../../constants';

type ChartKnowledgeBase = {
  [chartType: string]: {
    knowledge: string[];
    constraints?: string[];
  };
};
export const chartKnowledgeBase: ChartKnowledgeBase = {
  [ChartType.BarChart]: {
    knowledge: ['Bar chart shows the changes or comparisons of various categories of data.']
  },
  [ChartType.LineChart]: {
    knowledge: ['Line Chart shows the trend of data over time.']
  },
  [ChartType.PieChart]: {
    knowledge: ['Pie chart shows the proportion of each part in the total.']
  },
  [ChartType.ScatterPlot]: {
    knowledge: ['Scatter plot shows the relationship between two variables']
  },
  [ChartType.WordCloud]: {
    knowledge: [
      'Word cloud shows word frequency of text data, usually used to show trends, comparison or popularity of keywords.'
    ]
  },
  [ChartType.DualAxisChart]: {
    knowledge: ['Dual-axis chart is used when there are two y-fields need to visualize.']
  },
  [ChartType.SankeyChart]: {
    knowledge: ['Sankey chart shows the transfer of flow or energy, reflecting the relationship between various parts.']
  },
  [ChartType.RadarChart]: {
    knowledge: ['Radar chart shows data of multiple variables, allowing comparisons between various variables.']
  },
  [ChartType.RoseChart]: {
    knowledge: ['Rose chart shows the distribution of periodic data.']
  },
  [ChartType.WaterFallChart]: {
    knowledge: [
      'Waterfall chart shows the cumulative effect of data, particularly suitable for showing the total change between the beginning and the end, and how this total change is composed of increases and decreases from individual sub-items.'
    ]
  },
  [ChartType.FunnelChart]: {
    knowledge: ['Funnel chart shows the process or stages of data, or conversion rates.']
  },
  [ChartType.BoxPlot]: {
    knowledge: [
      'Box Plot is suitable for displaying data that contains maximum values, lower quartiles, medians, upper quartiles, and maximum values.'
    ],
    constraints: [
      'Use Box Plot if data includes fields related to the minimum value, lower quartile, median, upper quartile, and maximum value.'
    ]
  },
  [ChartType.DynamicBarChart]: {
    knowledge: [
      'Dynamic Bar Chart shows changes in rankings over time.',
      'Dynamic Bar Chart can only be used when data has a field that is date type.'
    ],
    constraints: ['Use Dynamic Bar Chart if user want to show changes of rankings in data.']
  },

  [ChartType.LinearProgress]: {
    knowledge: ['Linear progress chart shows progress value of one or more categories ']
  },

  [ChartType.CircularProgress]: {
    knowledge: ['Circular progress chart shows progress value of one or more categories']
  },

  [ChartType.LiquidChart]: {
    knowledge: ['Liquid chart show a percent value'],
    constraints: ['Use Liquid Chart if user want to show a percent value']
  },
  [ChartType.BubbleCirclePacking]: {
    knowledge: [
      'Bubble Circle Packing is useful for visualizing hierarchical data with circles representing nodes, where the size and color can convey additional information about the data points.'
    ]
  },
  [ChartType.MapChart]: {
    knowledge: [
      'Map Charts are used to visualize geographical data, allowing for the identification of spatial patterns and trends.'
    ]
  },
  [ChartType.RangeColumnChart]: {
    knowledge: [
      'Range Column Charts are designed to show data that has a minimum and a maximum value, making them effective for displaying variability or uncertainty within data sets.'
    ]
  },
  [ChartType.SunburstChart]: {
    knowledge: [
      'Sunburst Charts are excellent for visualizing hierarchical data, allowing users to see relationships between categories and subcategories at varying levels of detail.',
      'The colors field for sunburst chart and treemap chart must be an array. The order of the elements in the array needs to be sorted from large to small according to the coverage described by the data field.'
    ]
  },
  [ChartType.TreemapChart]: {
    knowledge: [
      'Treemap Charts are effective for displaying large amounts of hierarchical data in a compact space, where areas represent the size of each category.',
      'The colors field for sunburst chart and treemap chart must be an array. The order of the elements in the array needs to be sorted from large to small according to the coverage described by the data field.'
    ]
  },
  [ChartType.Gauge]: {
    knowledge: [
      'Gauge Charts are useful for displaying performance metrics against a target, providing a quick visual summary at a glance.',
      'The gauge chart must contain two fields: size and color.'
    ]
  },
  [ChartType.BasicHeatMap]: {
    knowledge: [
      'Basic Heat Maps are great for visualizing data intensity over two dimensions, helping to identify patterns through color coding.'
    ]
  },
  [ChartType.VennChart]: {
    knowledge: [
      'Venn Charts are useful for displaying the relationships between different groups, emphasizing similarities and differences visually.',
      'The color field of the Venn diagram requires an array of length 2. The field with subscript 0 maps to the sets, and the field with subscript 1 maps to the name.'
    ]
  },
  [ChartType.SingleColumnCombinationChart]: {
    knowledge: ['Single column combination charts can be combined with a variety of different basic chart types'],
    constraints: [`subChartType cannot be empty, it is an array of values in ${COMBINATION_BASIC_CHART_LIST}.`]
  },
  [ChartType.DynamicScatterPlotChart]: {
    knowledge: [
      'Dynamic Scatter Plot Chart can highlight changes in the correlation between variables as time progresses.',
      'It can display the distribution of data points and trends, along with movement or growth of specific categories over time.'
    ],
    constraints: [
      'Use a dynamic scatter plot chart when you want to visualize the relationship between two or three quantitative variables and observe how that relationship evolves over time.'
    ]
  },
  [ChartType.DynamicRoseChart]: {
    knowledge: [
      'Dynamic Rose Chart is used to display cyclical or seasonal data over time, with values represented by the length of radial bars.',
      'Dynamic Rose Chart highlights changes in categorical data or periodic trends across multiple categories over time.'
    ],
    constraints: [
      'Use Dynamic Rose Chart if you want to show cyclical data and observe changes in multiple categories over time.'
    ]
  },
  [ChartType.SequenceChart]: {
    knowledge: [
      'Sequence Chart visualizes events in chronological order along a time axis.',
      'Sequence Chart is ideal for showing the progression of time-based events.'
    ],
    constraints: [
      'Use Sequence Chart when the data contains a sequence of events that are ordered by time.',
      'Sequence Chart requires a continuous time field in the data for accurate rendering.'
    ]
  }
};
