import { ChannelInfo } from './types';

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
  }
};
