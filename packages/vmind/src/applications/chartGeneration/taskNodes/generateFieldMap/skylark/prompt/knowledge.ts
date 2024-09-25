/* eslint-disable max-len */
import { ChartType } from '../../../../../../common/typings';
import type { ChannelInfo } from './types';
import { COMBINATION_BASIC_CHART_LIST } from '../../../../constants';

export const ChartFieldInfo: ChannelInfo = {
  'BAR CHART': {
    visualChannels: {
      x: "x-axis of bar chart. Can't be empty. Only string fields",
      y: "y-axis of bar chart. Can't be empty. Only number fields. Use array if there are more than one number fields need to show.",
      color:
        'color channel of bar chart. Used to distinguish different bars. Only string fields. Can be empty if no suitable field.'
    },
    responseDescription: {
      x: 'field assigned to x channel',
      y: 'field assigned to y channel',
      color: 'field assigned to color channel'
    },
    knowledge: [
      'Only string fields can be used in color channel.',
      'You can use color channel to distinguish different categories.',
      'Use an array in y-axis if you want to assign more than one fields in y-axis.'
    ]
  },
  'PIE CHART': {
    visualChannels: {
      value: "angle of sectors in the pie chart. Only number fields. Can't be empty.",
      color:
        "color of sectors in the pie chart. Used to distinguish different sectors. Only string fields. Can't be empty."
    },
    responseDescription: {
      value: 'field assigned to angle channel',
      color: 'field assigned to color channel'
    },
    knowledge: ['Only string fields can be used in color channel.']
  },
  'LINE CHART': {
    visualChannels: {
      x: "x-axis of line chart. Can't be empty. Only string fields",
      y: "y-axis of line chart. Can't be empty. Only number fields. Use array if there are more than one number fields need to show.",
      color:
        'color channel of line chart. Used to distinguish different lines. Only string fields. Can be empty if no suitable field.'
    },
    responseDescription: {
      x: 'field assigned to x channel',
      y: 'field assigned to y channel',
      color: 'field assigned to color channel. Can be empty if no suitable field.'
    },
    knowledge: [
      'Only string fields can be used in color channel.',
      'Use an array in y-axis if you want to assign more than one fields in y-axis.'
    ]
  },
  'SCATTER PLOT': {
    visualChannels: {
      x: "x-axis of scatter plot. Can't be empty.",
      y: "y-axis of scatter plot. Can't be empty.",
      color: 'color channel of scatter plot. Used to distinguish different points. Can be empty if no suitable field.',
      size: 'size channel of scatter plot. Mapped to the size of each point. Only number fields. Can be empty if no suitable field.'
    },
    responseDescription: {
      x: 'field assigned to x channel',
      y: 'field assigned to y channel',
      color: 'field assigned to color channel',
      size: 'field assigned to size channel'
    },
    knowledge: ['Only number fields can be used in size channel.']
  },
  'WORD CLOUD': {
    visualChannels: {
      size: "size channel of wordcloud. Mapped to the size of each word. Only number fields. Can't be empty",
      color:
        "color channel of wordcloud. Mapped to the color of each word. Used to distinguish different words. Only string fields. Can't be empty."
    },
    responseDescription: {
      size: 'field assigned to x channel',
      color: 'field assigned to color channel'
    },
    knowledge: ['Only string fields can be used in color channel.', 'Only number fields can be used in size channel.']
  },
  'RADAR CHART': {
    visualChannels: {
      angle: "angle channel of radar chart. Used to distinguish different variables. Can't be empty.",
      value: "Used to show the value of each variable in radar chart. Can't be empty.",
      color: 'color channel of radar chart. Used to distinguish different variables. Can be empty if no suitable field.'
    },
    responseDescription: {
      angle: 'field assigned to angle channel',
      value: 'field assigned to value channel',
      color: 'field assigned to color channel'
    },
    knowledge: [
      'Only string fields can be used in angle channel.',
      'Only number fields can be used in value channel.',
      'Only string fields can be used in color channel.'
    ]
  },
  'SANKEY CHART': {
    visualChannels: {
      source: "mapped to the source node of flow in sankey chart. Can't be empty.",
      target: "mapped to the target node of flow in sankey chart. Can't be empty.",
      value: "mapped to the amount of the flow in sankey chart. Can't be empty."
    },
    responseDescription: {
      source: 'field assigned to source channel',
      target: 'field assigned to target channel',
      value: 'field assigned to value channel'
    },
    knowledge: [
      'Only string fields can be used in source channel.',
      'Only number fields can be used in value channel.',
      'Only string fields can be used in target channel.'
    ]
  },
  'ROSE CHART': {
    visualChannels: {
      radius: 'radius of sectors in the rose chart. Only number fields',
      color:
        "color of sectors in rose chart. Used to distinguish different sectors. Only string fields. Can't be empty."
    },
    responseDescription: {
      radius: 'field assigned to radius channel',
      color: 'field assigned to color channel'
    },
    knowledge: ['Only string fields can be used in color channel.']
  },
  'FUNNEL CHART': {
    visualChannels: {
      color:
        "color of each category or stage. Used to distinguish different category or stages in funnel chart. Only string fields. Can't be empty",
      value:
        "values of each category or stage. Mapped to the width of the bar representing each category or stage. Only number fields. Can't be empty."
    },
    responseDescription: {
      color: 'field assigned to color channel',
      value: 'field assigned to value channel'
    },
    knowledge: ['Only string fields can be used in color channel.', 'Only number fields can be used in value channel.']
  },
  'WATERFALL CHART': {
    visualChannels: {
      x: "x-axis of waterfall chart. Can't be empty. Only string fields",
      y: "y-axis of waterfall chart. Can't be empty. Only number fields",
      color:
        'color channel of waterfall chart. Used to distinguish different categories. Only string fields. Can be empty if no suitable field.'
    },
    responseDescription: {
      x: 'field assigned to x channel',
      y: 'field assigned to y channel',
      color: 'field assigned to color channel'
    },
    knowledge: ['Only string fields can be used in color channel.']
  },
  'BOX PLOT': {
    visualChannels: {
      x: "x-axis of box plot. Can't be empty. Only string fields",
      min: 'field representing min value of box plot. Can be empty. Only number fields',
      q1: 'field representing lower quartile of box plot. Can be empty. Only number fields',
      median: 'field representing median of box plot. Can be empty. Only number fields',
      q3: 'field representing upper quartile of box plot. Can be empty. Only number fields',
      max: 'field representing max value of box plot. Can be empty. Only number fields'
    },
    responseDescription: {
      x: 'field assigned to x channel',
      min: 'field assigned to min channel',
      q1: 'field assigned to q1 channel',
      median: 'field assigned to median channel',
      q3: 'field assigned to q3 channel',
      max: 'field assigned to max channel'
    },
    knowledge: ['Only string fields can be used in color channel.']
  },
  'DUAL AXIS CHART': {
    visualChannels: {
      x: "x-axis of dual axis chart. Can't be empty. Only string fields",
      leftAxis: "left y-axis of dual axis chart. Can't be empty. Only number fields",
      rightAxis: "right y-axis of dual axis chart. Can't be empty. Only number fields"
    },
    responseDescription: {
      x: 'field assigned to x channel',
      leftAxis: 'field assigned to leftAxis channel',
      rightAxis: 'field assigned to rightAxis channel'
    },
    knowledge: [
      'left y-axis is used as main axis and usually used to show main field',
      'right y-axis is used as sub-axis'
    ]
  },
  'DYNAMIC BAR CHART': {
    visualChannels: {
      time: "date field used to divide time frames. Used to divide the data into time frames. Can't be empty. Only date fields. Can't be the same as x-axis.",
      x: "x-axis of bar chart. Can't be empty. Can only use categorical field. Can't use time field",
      y: "y-axis of bar chart. Can't be empty. Only number fields",
      color:
        'color channel of bar chart. Used to distinguish different bars. Only categorical fields. Can be empty if no suitable field.'
    },
    responseDescription: {
      time: 'field assigned to time channel',
      x: 'field assigned to x channel',
      y: 'field assigned to y channel',
      color: 'field assigned to color channel'
    },
    knowledge: [
      "x-axis in dynamic bar chart can only be a categorical field. Don't use time field",
      'Only use categorical field can be used in x channel',
      "time channel can't be empty",
      'Only date fields can be used in time channel.'
    ]
  },

  [ChartType.LinearProgress.toUpperCase()]: {
    visualChannels: {
      x: "x-axis of bar chart. Can't be empty. Can only use categorical field.",
      y: "y-axis of bar chart. Can't be empty. Only number fields",
      color:
        'color channel of bar. Used to distinguish different bars. Only categorical fields. Can be empty if no suitable field.'
    },
    responseDescription: {
      x: 'field assigned to x channel',
      y: 'field assigned to y channel',
      color: 'field assigned to color channel'
    },
    knowledge: [
      "x-axis in linear progress chart can only be a categorical field. Don't use time field",
      'Only use categorical field can be used in x channel',
      'y field can not be empty'
    ]
  },

  [ChartType.CircularProgress.toUpperCase()]: {
    visualChannels: {
      color: 'color channel of Circular Progress Chart is used to mark the title.',
      value: 'value channel of Circular Progress Chart.'
    },
    responseDescription: {
      color: 'field assigned to color channel',
      value: 'field assigned to value channel'
    },
    knowledge: [
      'Circular progress chart is also used to display progress data, presented in a circular form, with the values on the numerical axis typically ranging from 0 to 1.'
    ]
  },

  [ChartType.LiquidChart.toUpperCase()]: {
    visualChannels: {
      value: "value field of liquid chart. Can't be empty. Only number fields"
    },
    responseDescription: {
      value: 'field assigned to value channel'
    },
    knowledge: [
      'Liquid chart is used to display a single value, with the value range typically from 0 to 1.',
      'The value usually represents progress, completion, or percentage, and is associated with only one field'
    ]
  },

  [ChartType.BubbleCirclePacking.toUpperCase()]: {
    visualChannels: {
      color: 'color channel of bubble circle packing. Used to differentiate between bubbles.',
      size: 'size channel of bubble circle packing. Mapped to the size of each bubble. Only number fields.'
    },
    responseDescription: {
      color: 'field assigned to color channel',
      size: 'field assigned to size channel'
    },
    knowledge: ['Only number fields can be used in size channel.']
  },
  [ChartType.MapChart.toUpperCase()]: {
    visualChannels: {
      color: 'color channel of map chart. Used to represent different regions/distinctions.',
      size: 'size channel of map chart. Represents a numeric value for each region. Only number fields.'
    },
    responseDescription: {
      color: 'field assigned to color channel',
      size: 'field assigned to size channel'
    },
    knowledge: ['Color fields should represent categorical variables, while size fields represent numerical data.']
  },
  [ChartType.RangeColumnChart.toUpperCase()]: {
    visualChannels: {
      y: "y-axis of range column chart. An array of length 2 is required to map to the numeric field, representing the maximum and minimum values respectively. Can't be empty.",
      x: "x-axis of range column chart. Represents the categorical field for grouping. Can't be empty."
    },
    responseDescription: {
      y: 'field assigned to y channel',
      x: 'field assigned to x channel'
    },
    knowledge: []
  },
  [ChartType.SunburstChart.toUpperCase()]: {
    visualChannels: {
      color:
        "color channel of sunburst chart. Used to represent different layers in the hierarchy. Must be an array. Can't be empty. The elements in the array are sorted from the highest level to the lowest level.",
      size: 'size channel of sunburst chart. Mapped to the relative size of each segment.'
    },
    responseDescription: {
      color: 'field assigned to color channel',
      size: 'field assigned to size channel'
    },
    knowledge: [
      'The color field must be an array sorted from large to small according to the coverage described by the data field.'
    ]
  },
  [ChartType.TreemapChart.toUpperCase()]: {
    visualChannels: {
      color:
        "The color channel of the treemap is used to distinguish different areas. It must be an array. Can't be empty. The elements in the array are sorted from the highest level to the lowest level.",
      size: 'size channel of treemap chart. Represents the area occupied by each segment.'
    },
    responseDescription: {
      color: 'field assigned to color channel',
      size: 'field assigned to size channel'
    },
    knowledge: [
      'The color field must be an array sorted from large to small according to the coverage described by the data field.'
    ]
  },
  [ChartType.Gauge.toUpperCase()]: {
    visualChannels: {
      color: 'color channel of gauge chart. Must be a string field.',
      size: "size channel of gauge chart. Represents a numeric value indicating the current state. Can't be empty."
    },
    responseDescription: {
      color: 'field assigned to color channel. Often used to distinguish themes.',
      size: 'field assigned to size channel'
    },
    knowledge: [
      'The gauge chart must contain two fields: size and color. They are essential for displaying the gauge effectively.'
    ]
  },
  [ChartType.BasicHeatMap.toUpperCase()]: {
    visualChannels: {
      y: "y-axis of basic heat map. Represents categorical values along the vertical axis. Can't be empty.",
      x: "x-axis of basic heat map. Represents categorical values along the horizontal axis. Can't be empty.",
      size: 'size channel of basic heat map. Represents the intensity of each cell in the heat map. Only number fields. Can be empty if no suitable field.'
    },
    responseDescription: {
      y: 'field assigned to y channel',
      x: 'field assigned to x channel',
      size: 'field assigned to size channel'
    },
    knowledge: ['All visual channels must reflect the structure of the data presented.']
  },
  [ChartType.VennChart.toUpperCase()]: {
    visualChannels: {
      size: "size channel of Venn chart. Represents the area of each segment. Only number fields. Can't be empty.",
      color:
        'color channel of Venn chart. Represents different sets. Must be an array of length 2, with the first field for the sets and the second for the labels.'
    },
    responseDescription: {
      size: 'field assigned to size channel',
      color: 'field assigned to color channel'
    },
    knowledge: [
      'The color field of the Venn Chart requires an array of length 2. The field with subscript 0 maps to the sets, and the field with subscript 1 maps to the name.'
    ]
  },
  [ChartType.SingleColumnCombinationChart.toUpperCase()]: {
    visualChannels: {
      // 该图表类型没有特定的视觉通道描述
    },
    responseDescription: {
      // 响应描述不适用
    },
    knowledge: [
      `Single column combination charts can be combined with a variety of different basic chart types. such as ${COMBINATION_BASIC_CHART_LIST.join(
        ','
      )}.`
    ]
  },
  [ChartType.DynamicScatterPlotChart.toUpperCase()]: {
    visualChannels: {
      x: "x-axis of dynamic scatter plot. Represents a quantitative variable along the horizontal axis. Can't be empty.",
      y: "y-axis of dynamic scatter plot. Represents a quantitative variable along the vertical axis. Can't be empty.",
      color:
        'color channel of dynamic scatter plot. Represents different categories or groups. Can be empty if no suitable field.',
      size: 'size channel of dynamic scatter plot. Represents the magnitude or importance of each data point. Can be empty if no suitable field.',
      time: "time channel of dynamic scatter plot. Represents the temporal dimension that drives the dynamic behavior of the plot. Can't be empty."
    },
    responseDescription: {
      x: 'field assigned to x channel',
      y: 'field assigned to y channel',
      color: 'field assigned to color channel',
      size: 'field assigned to size channel',
      time: 'field assigned to time channel'
    },
    knowledge: [
      'All visual channels must reflect the structure of the data presented.',
      'Dynamic Scatter Plot shows relationships between variables over time, where x and y represent quantitative variables, color represents categories, and size indicates magnitude.'
    ]
  },
  [ChartType.DynamicRoseChart.toUpperCase()]: {
    visualChannels: {
      radius:
        "radius channel of dynamic rose chart. Represents the magnitude of values in a radial format. Can't be empty.",
      color: "color channel of dynamic rose chart. Represents different categories or groups. Can't be empty.",
      time: "time channel of dynamic rose chart. Represents the temporal dimension that drives the dynamic behavior of the chart. Can't be empty."
    },
    responseDescription: {
      radius: 'field assigned to radius channel',
      color: 'field assigned to color channel',
      time: 'field assigned to time channel'
    },
    knowledge: [
      'All visual channels must reflect the structure of the data presented.',
      'Dynamic Rose Chart is useful for visualizing cyclical patterns, where radius represents the magnitude, color distinguishes categories, and time drives the dynamic updates.'
    ]
  },
  [ChartType.SequenceChart.toUpperCase()]: {
    visualChannels: {
      group:
        "group channel of sequence chart. Represents the initiator of the timeline or event, showing which entity or individual is involved in each sequence. Can't be empty.",
      time: "time channel of sequence chart. Represents the timeline or time series, displaying the chronological order of events. This is essential for showing when events occur. Often a numeric value. Can't be empty.",
      color:
        'color channel of sequence chart. Differentiates the types or categories of events within the timeline. It is useful for distinguishing between different types of events in the sequence. For example: start or end'
    },
    responseDescription: {
      group: 'field assigned to group channel, representing the initiator of the timeline or event',
      time: 'field assigned to time channel, typically used for time progression',
      color: 'field assigned to color channel, representing event types'
    },
    knowledge: [
      'Sequence charts are ideal for displaying event sequences over time, where the time-axis represents time progression, the group-axis shows the initiator of the timeline, and color helps distinguish between event types.',
      'This chart is useful for visualizing workflows, event timelines, or sequences where time, initiators, and event types need to be clearly represented.'
    ]
  }
};
