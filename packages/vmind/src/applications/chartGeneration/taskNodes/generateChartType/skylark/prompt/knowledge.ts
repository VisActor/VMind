/* eslint-disable max-len */

import { ChartType } from 'src/common/typings';

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
  }
};
