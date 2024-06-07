import type { Transformer } from '../../../../../base/tools/transformer';
import type { GetChartSpecContext, GetChartSpecOutput } from '../types';
import {
  COLOR_THEMES,
  DEFAULT_PIE_VIDEO_LENGTH,
  DEFAULT_VIDEO_LENGTH,
  DEFAULT_VIDEO_LENGTH_LONG,
  DIMENSION_AXIS_ID,
  LINEAR_COLOR_THEMES,
  MAIN_SERIES_ID,
  MEASURE_AXIS_LEFT_ID,
  MEASURE_AXIS_RIGHT_ID,
  SUB_SERIES_ID,
  WORDCLOUD_NUM_LIMIT,
  animationDuration,
  oneByOneGroupSize
} from './constants';
import { getFieldByDataType } from '../../../../../common/utils/utils';
import { array, isArray } from '@visactor/vutils';
import { isValidDataset } from '../../../../../common/dataProcess';
import { DataType } from '../../../../../common/typings';
import { COLOR_FIELD } from '../../../../../../../chart-advisor/src/constant';

type Context = GetChartSpecContext & GetChartSpecOutput;

const chartTypeMap: { [chartName: string]: string } = {
  'BAR CHART': 'bar',
  'LINE CHART': 'line',
  'PIE CHART': 'pie',
  'WORD CLOUD': 'wordCloud',
  'SCATTER PLOT': 'scatter',
  'DYNAMIC BAR CHART': 'bar',
  'FUNNEL CHART': 'funnel',
  'DUAL AXIS CHART': 'common',
  'ROSE CHART': 'rose',
  'RADAR CHART': 'radar',
  'SANKEY CHART': 'sankey',
  'WATERFALL CHART': 'waterfall',
  'BOX PLOT': 'boxPlot'
};

export const chartType: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { chartType, spec } = context;
  spec.type = chartTypeMap[chartType];
  return { spec };
};

export const data: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { dataset, spec } = context;
  // spec.data = [dataset]
  spec.data = {
    id: 'data',
    values: isValidDataset(dataset) ? dataset.flat(4) : []
  };

  return { spec };
};

export const funnelData: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { dataset, cell, spec } = context;
  // spec.data = [dataset]
  spec.data = {
    id: 'data',
    values: isValidDataset(dataset) ? dataset.sort((a: any, b: any) => b[cell.y as string] - a[cell.y as string]) : []
  };

  return { spec };
};

export const wordCloudData: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { dataset, spec } = context;
  spec.data = {
    id: 'data',
    values: isValidDataset(dataset) ? dataset.slice(0, WORDCLOUD_NUM_LIMIT) : []
  };

  return { spec };
};

export const sequenceData: Transformer<Context & { totalTime: number }, GetChartSpecOutput> = (
  context: Context & { totalTime: number }
) => {
  const { dataset, cell, totalTime, spec } = context;
  const timeField = cell.time as string;
  const latestData = isValidDataset(dataset) ? dataset : [];

  //add the time field into spec, although it has no use for chart rendering.
  //it can be used in getCellFromSpec.
  spec.timeField = timeField;

  // group the data by time field
  const timeArray: any[] = [];
  const contentMap = {} as any;
  latestData.forEach((element: any) => {
    if (!element[timeField]) {
      return;
    }
    const time = element[timeField].toString();
    if (!timeArray.includes(time)) {
      timeArray.push(time);
      contentMap[time] = [];
      contentMap[time].push(element);
    } else {
      contentMap[time].push(element);
    }
  });

  //sort the data by valueField in each group
  const valueField = cell.y as string;
  for (const time in contentMap) {
    const contentItem = contentMap[time];

    contentItem.sort(function (a: any, b: any) {
      return b[valueField] - a[valueField];
    });
  }

  const dataSpecs = Object.keys(contentMap).map(year => {
    return {
      data: [
        {
          id: 'id',
          values: contentMap[year]
        },
        {
          id: 'year',
          values: [{ year }]
        }
      ]
    };
  });

  spec.data = dataSpecs.length > 0 ? dataSpecs[0].data : [];

  const duration = totalTime ? totalTime / (dataSpecs.length ? dataSpecs.length : 1) : 1000;

  //config the player
  spec.player = {
    type: 'continuous',
    orient: 'bottom',
    auto: true,
    loop: true,
    dx: 0,
    position: 'middle',
    interval: duration,
    specs: dataSpecs,
    slider: {
      railStyle: {
        visible: false,
        height: 6
      },
      trackStyle: {
        visible: false
      },
      handlerStyle: {
        visible: false
      }
    },
    controller: {
      backward: {
        style: {
          visible: false,
          size: 12
        }
      },
      forward: {
        style: {
          visible: false,
          size: 12
        }
      },
      start: {
        style: {
          visible: false
        },
        order: 1,
        position: 'end'
      },
      pause: {
        style: {
          visible: false
        }
      }
    }
  };

  spec.animationUpdate = {
    bar: [
      {
        type: 'update',
        options: { excludeChannels: ['x', 'y'] },
        duration: duration,
        easing: 'linear'
      },
      {
        channel: ['x', 'y'],
        options: { excludeChannels: ['width'] },
        duration: duration,
        easing: 'linear'
      }
    ],
    axis: {
      duration: duration,
      easing: 'linear'
    }
  };

  return { spec };
};

export const sankeyData: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { dataset, cell, spec } = context;
  const { source, target } = cell;
  const linkData = isValidDataset(dataset) ? dataset : [];
  const nodes = [
    ...new Set([
      ...linkData.map((item: any) => item[source as string]),
      ...linkData.map((item: any) => item[target as string])
    ])
  ];
  const nodeData = nodes.map(node => ({ name: node }));

  spec.data = {
    id: 'data',
    values: [
      {
        nodes: nodeData,
        links: linkData
      }
    ]
  };

  return { spec };
};

export const color: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { colors, spec } = context;
  // spec.data = [dataset]
  if (colors && colors.length > 0) {
    spec.color = colors;
  } else {
    spec.color = COLOR_THEMES.default;
  }

  return { spec };
};

export const colorBar: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { colors, spec } = context;
  // spec.data = [dataset]
  const colorThemes = COLOR_THEMES.default;

  if (colors && colors.length > 0) {
    spec.color = colors;
  } else {
    //apply transparent gradient
    spec.color = colorThemes.map(c => ({
      gradient: 'linear',
      x0: 0.01,
      y0: 0,
      x1: 0.01,
      y1: 1,
      stops: [
        {
          offset: 0,
          color: `#${c.split('#')[1]}FF`
        },
        {
          offset: 1,
          color: `#${c.split('#')[1]}00`
        }
      ]
    }));
  }

  return { spec };
};

export const colorDynamicBar: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { colors, spec } = context;
  // spec.data = [dataset]
  const colorThemes = COLOR_THEMES.default;
  if (colors && colors.length > 0) {
    spec.color = colors;
  } else {
    //apply transparent gradient
    spec.color = colorThemes.map(c => ({
      gradient: 'linear',
      x0: 1,
      y0: 0.01,
      x1: 0.01,
      y1: 0.01,
      stops: [
        {
          offset: 0,
          color: `#${c.split('#')[1]}FF`
        },
        {
          offset: 1,
          color: `#${c.split('#')[1]}00`
        }
      ]
    }));
  }

  return { spec };
};

export const colorLine: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { colors, spec } = context;
  // spec.data = [dataset]
  if (colors && colors.length > 0) {
    spec.color = colors;
  } else {
    //应用渐变色
    spec.color = LINEAR_COLOR_THEMES.map(c => ({
      gradient: 'linear',
      x0: 0,
      y0: 0.5,
      x1: 1,
      y1: 0.5,
      stops: [
        {
          offset: 0,
          color: c[0]
        },
        {
          offset: 1,
          color: c[1]
        }
      ]
    }));
    spec.point = {
      style: {
        visible: false
      }
    };
  }
  return { spec };
};

export const cartesianLine: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { cell, spec, fieldInfo } = context;
  const cellNew = { ...cell };
  spec.xField = cell.x;
  spec.yField = cell.y;
  if (cell.color) {
    spec.seriesField = cell.color;
  } else {
    //no color field. choose a discrete field among remaining fields
    const remainedFields = fieldInfo.filter(
      ({ fieldName }) => !spec.xField.includes(fieldName) && spec.yField !== fieldName
    );
    const colorField = getFieldByDataType(remainedFields, [DataType.STRING, DataType.DATE]);
    if (colorField) {
      spec.seriesField = colorField.fieldName;
      cellNew.color = colorField.fieldName;
    }
  }
  return { spec, cell: cellNew };
};

export const pieField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  spec.valueField = cell.angle || cell.value;
  if (cell.color || (cell as any).category) {
    spec.categoryField = cell.color || (cell as any).category;
  }
  return { spec };
};

export const scatterField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  spec.xField = cell.x;
  spec.yField = cell.y;
  if (cell.color) {
    spec.seriesField = cell.color;
  }
  if (cell.size) {
    spec.sizeField = cell.size;
    spec.size = {
      type: 'linear'
    };
  }

  return { spec };
};

export const wordCloudField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  spec.nameField = cell.color;

  if (cell.size) {
    spec.valueField = cell.size;
  }

  spec.seriesField = spec.nameField;

  return { spec };
};

export const funnelField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  spec.categoryField = cell.color || cell.x;
  spec.valueField = cell.value || cell.y;

  return { spec };
};

export const waterfallField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  spec.xField = cell.x;
  spec.yField = cell.y;
  spec.total = {
    type: 'end',
    text: '总计'
  };

  return { spec };
};

export const waterfallAxes: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign axises
  const { spec } = context;
  spec.axes = [
    {
      orient: 'left',
      title: { visible: true, text: 'favorability' },
      label: {
        formatMethod: (v: any) => {
          return v + '%';
        }
      }
    },
    {
      orient: 'bottom',
      label: { visible: true },
      type: 'band',
      paddingInner: 0.4,
      title: { visible: true, text: 'date' }
    }
  ];
  return { spec };
};

export const waterfallStackLabel: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign axises
  const { spec } = context;
  spec.stackLabel = {
    valueType: 'absolute',
    formatMethod: (text: any) => {
      return text + '%';
    }
  };
  return { spec };
};

export const dualAxisSeries: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign series in dual-axis chart
  const { cell, spec } = context;
  const { color } = cell;
  const dataValues = spec.data.values;

  spec.series = [
    {
      type: 'bar',
      id: MAIN_SERIES_ID,
      data: {
        id: spec.data.id + '_bar',
        values: color ? dataValues : dataValues.map((d: any) => ({ ...d, [COLOR_FIELD]: cell.y[0] }))
      },
      dataIndex: 0,
      label: { visible: true },
      xField: cell.x,
      yField: cell.y[0],
      seriesField: color ? (isArray(color) ? color[0] : color) : COLOR_FIELD,
      bar: {
        style: {}
      }
    },
    {
      type: 'line',
      id: SUB_SERIES_ID,
      dataIndex: 0,
      data: {
        id: spec.data.id + '_line',
        values: color ? dataValues : dataValues.map((d: any) => ({ ...d, [COLOR_FIELD]: cell.y[1] }))
      },
      label: { visible: true },
      xField: cell.x,
      yField: cell.y[cell.y?.length - 1],
      seriesField: color ? (isArray(color) ? color[0] : color) : COLOR_FIELD,

      line: {
        style: {}
      },
      point: {
        style: {}
      }
    }
  ];
  spec.data = undefined;
  return { spec };
};

export const dualAxisAxes: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign axes in dual-axis chart
  const { spec } = context;
  spec.axes = [
    {
      id: DIMENSION_AXIS_ID,
      type: 'band',
      orient: 'bottom'
    },
    {
      id: MEASURE_AXIS_LEFT_ID,
      seriesId: MAIN_SERIES_ID,
      type: 'linear',
      orient: 'left',
      label: {
        style: {}
      }
    },
    {
      id: MEASURE_AXIS_RIGHT_ID,
      seriesId: SUB_SERIES_ID,
      type: 'linear',
      orient: 'right',
      tick: { visible: false },
      grid: { visible: false },
      label: {
        style: {}
      }
    }
  ];
  return { spec };
};

export const wordCloudDisplayConf: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  spec.fontSizeRange = [20, 50];
  spec.fontWeightRange = [800, 800];
  //spec.wordCloudConfig = {
  //  zoomToFit: {
  //    enlarge: true
  //  }
  //}
  return { spec };
};

export const radarField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { cell, spec } = context;
  if (cell.x || cell.angle) {
    spec.categoryField = cell.x ?? cell.angle;
  }
  if (cell.y || cell.value) {
    spec.valueField = cell.y ?? cell.value;
  }
  if (cell.color) {
    spec.seriesField = cell.color;
  }
  return { spec };
};

export const radarDisplayConf: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  spec.area = {
    visible: true // show area
  };
  return { spec };
};

export const radarAxis: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  spec.axes = [
    {
      orient: 'radius', // radius axis
      zIndex: 100,

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
  ];

  return { spec };
};

export const sankeyField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { cell, spec } = context;
  spec.sourceField = cell.source;
  spec.targetField = cell.target;
  spec.valueField = cell.value;
  spec.categoryField = 'name';
  spec.nodeKey = (datum: any) => datum.name;

  return { spec };
};

export const boxPlotField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { cell, dataset, spec } = context;
  const { x, y } = cell;
  const data = isValidDataset(dataset) ? (dataset as { [key: string]: number }[]) : [];
  // assign x field
  spec.xField = x;
  // assign y field
  // 1. sort y field according to its value
  array(y).sort((a, b) => data[0]?.[a] ?? 0 - data[0]?.[b] ?? 0);
  const yFieldsLen = y.length;
  // 2. Map the maximum, minimum, median, and upper and lower quartiles respectively according to numerical value.
  spec.minField = y[0]; // Minimum value field: the field with the smallest value.
  spec.q1Field = y[Math.min(1, yFieldsLen - 1)]; // Lower quartile field: the field with the second smallest value.
  spec.medianField = y[Math.floor((yFieldsLen - 1) / 2)]; // Median: the field with a value in the middle.
  spec.q3Field = y[Math.max(0, yFieldsLen - 2)]; // Upper quartile field: the field with the second highest value.
  spec.maxField = y[yFieldsLen - 1]; // Maximum value field: the field with the highest value.
  return { spec };
};

export const boxPlotStyle: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  spec.boxPlot = {
    ...spec.boxPlot,
    style: {
      boxWidth: 50,
      shaftWidth: 30,
      shaftShape: 'bar',
      lineWidth: 2,
      shaftOpacity: 0.3
    }
  };
  return { spec };
};

export const sankeyLabel: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  spec.label = {
    visible: true,
    style: {
      fontSize: 12,
      fill: '#000000'
    }
  };
  return { spec };
};

export const sankeyLink: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  spec.link = {
    style: {
      fillOpacity: 0.1
    },
    state: {
      hover: {
        fillOpacity: 0.4
      },
      blur: {
        fill: '#e8e8e8'
      }
    }
  };
  return { spec };
};

export const cartesianBar: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign fields according to cell
  const { cell, fieldInfo, spec } = context;
  const cellNew = { ...cell };
  const flattenedXField = Array.isArray(cell.x) ? cell.x : [cell.x];
  if (cell.color && cell.color.length > 0 && cell.color !== cell.x) {
    flattenedXField.push(cell.color);
  }
  spec.xField = flattenedXField;
  spec.yField = cell.y;
  if (cell.color) {
    spec.seriesField = cell.color;
  } else {
    //没有分配颜色字段，从剩下的字段里选择一个离散字段分配到颜色上
    const remainedFields = fieldInfo.filter(
      ({ fieldName }) => !spec.xField.includes(fieldName) && spec.yField !== fieldName
    );
    const colorField = getFieldByDataType(remainedFields, [DataType.STRING, DataType.DATE]);
    if (colorField) {
      spec.seriesField = colorField.fieldName;
      spec.xField.push(colorField.fieldName);
      cellNew.color = colorField.fieldName;
    }
  }
  return { spec, cell: cellNew };
};

export const rankingBarField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //折线图根据cell分配字段
  const { cell, spec } = context;
  spec.xField = cell.y;
  spec.yField = cell.x;
  if (cell.color) {
    spec.seriesField = cell.color;
  } else {
    spec.seriesField = spec.yField;
  }
  spec.direction = 'horizontal';
  return { spec };
};

export const roseField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { cell, spec } = context;
  spec.valueField = cell.radius || cell.angle;
  if (cell.color) {
    spec.categoryField = cell.color;
    spec.seriesField = cell.color;
  }
  spec.outerRadius = 0.8;
  spec.innerRadius = 0.2;

  return { spec };
};

export const roseAxis: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  spec.axes = [
    {
      orient: 'angle',
      domainLine: {
        visible: false
      },
      grid: {
        visible: false,
        alignWithLabel: false
      },
      label: {
        visible: true
      }
    },
    {
      orient: 'radius',
      grid: {
        visible: false,
        smooth: true
      }
    }
  ];
  return { spec };
};

export const rankingBarAxis: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  spec.axes = [
    {
      animation: true,
      orient: 'bottom',
      type: 'linear',
      visible: true,
      title: {
        visible: false,
        style: {
          fill: '#FFFFFF'
        }
      },
      label: {
        style: {
          fill: '#FFFFFF'
        }
      },
      grid: {
        visible: true
      }
    },
    {
      animation: true,
      id: 'axis-left',
      orient: 'left',
      tick: { visible: false },
      title: {
        visible: false,
        style: {
          fill: '#FFFFFF'
        }
      },
      label: {
        style: {
          fill: '#FFFFFF'
        }
      },
      type: 'band'
    }
  ];

  return { spec };
};

export const axis: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  spec.axes = [
    {
      orient: 'bottom',
      type: 'band',
      label: {
        style: {
          fill: '#FFFFFF'
        }
      },
      title: {
        visible: false,
        style: {
          fill: '#FFFFFF'
        }
      }
    },
    {
      orient: 'left',
      type: 'linear',
      label: {
        style: {
          fill: '#FFFFFF'
        }
      },
      title: {
        visible: false,
        style: {
          fill: '#FFFFFF'
        }
      }
    }
  ];
  return { spec };
};

export const legend: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { cell, spec } = context;
  if (!(cell.color || cell.category) && !spec.seriesField && spec.type !== 'common') {
    return { spec };
  }
  spec.legends = [
    {
      orient: 'right',
      type: 'discrete',
      item: {
        visible: true,
        background: {
          style: {
            fillOpacity: 0
          }
        },
        label: {
          style: {
            fill: '#FFFFFF'
          }
        },
        shape: {
          style: {
            symbolType: 'rect'
          }
        }
      }
    }
  ];

  return { spec };
};

export const customMark: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  spec.customMark = [
    {
      type: 'text',
      dataId: 'year',
      style: {
        textBaseline: 'bottom',
        fontSize: 130,
        textAlign: 'right',
        fontFamily: 'PingFang SC',
        fontWeight: 600,
        text: (datum: { year: any }) => datum.year,
        x: () => 700,
        y: () => 480 - 50,
        fill: 'grey',
        fillOpacity: 0.5
      }
    }
  ];
  return { spec };
};

export const rankingBarLabel: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  spec.label = {
    visible: true,
    style: {
      fill: '#FFFFFF',
      stroke: null
    },
    animation: {
      duration: spec.animationUpdate.axis.duration,
      easing: 'linear'
    }
  };
  return { spec };
};

export const scatterAxis: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec, fieldInfo } = context;

  const xField = spec.xField;
  const yField = spec.yField;
  const xFieldInfo = fieldInfo.find(field => xField === field.fieldName);
  const yFieldInfo = fieldInfo.find(field => yField === field.fieldName);
  spec.axes = [
    {
      orient: 'bottom',
      type: [DataType.DATE, DataType.STRING].includes(xFieldInfo.type) ? 'band' : 'linear',
      label: {
        style: {
          fill: '#FFFFFF'
        }
      },
      title: {
        visible: false,
        style: {
          fill: '#FFFFFF'
        }
      }
    },
    {
      orient: 'left',
      type: [DataType.DATE, DataType.STRING].includes(yFieldInfo.type) ? 'band' : 'linear',
      label: {
        style: {
          fill: '#FFFFFF'
        }
      },
      title: {
        visible: false,
        style: {
          fill: '#FFFFFF'
        }
      }
    }
  ];
  return { spec };
};

const oneByOneDelayFunc = (delay: number) => (datum: any) => {
  const group = datum.__CHARTSPACE_DEFAULT_DATA_INDEX % oneByOneGroupSize;
  return group * delay;
};

export const animationOneByOne: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  if (spec.type === 'wordCloud3d') {
    return { spec };
  }
  const totalTime = context.totalTime ?? DEFAULT_VIDEO_LENGTH_LONG;
  const duration = animationDuration;
  const dataLength = spec.data.values.length;
  const delay = Math.max(totalTime / dataLength - duration, 0);
  const finalDuration = delay === 0 ? totalTime / dataLength : duration;
  const finalDelay = delay === 0 ? Number.MIN_VALUE : delay;

  spec.animationAppear = {
    //word: [
    //  {
    //    channel: {
    //      fontSize: {
    //        from: 0,
    //      },
    //    },
    //    duration: animationDuration,
    //    delay: oneByOneDelayFunc(delay),
    //  },
    //],
    oneByOne: finalDelay,
    duration: finalDuration
  };
  return { spec };
};

export const animationScatter: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  const totalTime = context.totalTime ?? DEFAULT_VIDEO_LENGTH;
  const dataLength = spec.data.values.length;
  const groupNum = Math.ceil(dataLength / oneByOneGroupSize);
  const delay = totalTime / groupNum;
  spec.animationAppear = {
    duration: animationDuration,
    delay: oneByOneDelayFunc(delay)
  };
  return { spec };
};

function onlyUnique(value: any, index: number, array: any) {
  return array.indexOf(value) === index;
}

export const animationCartesianBar: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  const totalTime = context.totalTime ?? DEFAULT_VIDEO_LENGTH;
  const groupKey = Array.isArray(spec.xField) ? spec.xField[0] : spec.xField;
  const dataValues = spec.data.values as any[];
  const groupNum = dataValues.map(d => d[groupKey]).filter(onlyUnique).length;
  //const delay = totalTime / groupNum - 1000;
  spec.animationAppear = {
    oneByOne: Number.MIN_VALUE,
    duration: totalTime / groupNum
  };
  return { spec };
};

export const animationCartisianLine: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  const totalTime = context.totalTime ?? DEFAULT_VIDEO_LENGTH;
  const groupKey = Array.isArray(spec.xField) ? spec.xField[0] : spec.xField;
  const dataValues = spec.data.values as any[];
  const groups = dataValues.map(d => d[groupKey]).filter(onlyUnique);
  const groupNum = groups.length;
  const lineAnimationTotalTime = totalTime > 2000 ? 2000 : totalTime;
  const pointDelay = lineAnimationTotalTime / groupNum;
  spec.animationAppear = {
    line: {
      type: 'clipIn',
      duration: lineAnimationTotalTime,
      easing: 'linear'
    },
    point: {
      delay: (datum: any) => {
        const groupIndex = groups.findIndex(d => d === datum[groupKey]);
        return groupIndex * pointDelay;
      }
    }
  };

  spec.animationNormal = {
    point: {
      loop: true,
      timeSlices: [
        {
          effects: {
            channel: {
              size: { to: 14 }
            },
            easing: 'circInOut'
          },
          duration: 1000
        },
        {
          effects: {
            channel: {
              size: { to: 10 }
            },
            easing: 'circInOut'
          },
          duration: 500
        }
      ]
    }
  };
  return { spec };
};

export const animationCartesianPie: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  const totalTime = context.totalTime ?? DEFAULT_PIE_VIDEO_LENGTH;
  const groupKey = context.cell.color;
  const dataValues = spec.data.values as any[];
  const groupNum = dataValues.map(d => d[groupKey!]).filter(onlyUnique).length;
  //const delay = totalTime / groupNum - 1000;
  const loopTime = 100 + groupNum * 100 + 400;
  // 看看是否可以500ms走一个循环
  if (groupNum * 500 + loopTime < totalTime) {
    // 前面500ms的oneByone
    spec.animationAppear = {
      oneByOne: Number.MIN_VALUE,
      duration: (totalTime - loopTime) / groupNum,
      options: {
        overall: false
      }
    };
    // 然后走循环动画
    spec.animationNormal = {
      pie: [
        {
          startTime: 100,
          oneByOne: 100,
          timeSlices: [
            {
              delay: 0,
              effects: {
                channel: {
                  scaleX: { to: 1.2 },
                  scaleY: { to: 1.2 }
                },
                easing: 'linear'
              },
              duration: 200
            },
            {
              effects: {
                channel: {
                  scaleX: { to: 1 },
                  scaleY: { to: 1 }
                },

                easing: 'linear'
              },
              duration: 200
            }
          ]
        }
      ]
    };
  } else {
    spec.animationAppear = {
      oneByOne: Number.MIN_VALUE,
      duration: totalTime / groupNum,
      options: {
        overall: false
      }
    };
  }
  return { spec };
};

export const displayConfBar: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  spec.bar = {
    style: {
      cornerRadius: [8, 8, 0, 0]
    }
  };

  return { spec };
};

export const displayConfLine: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  spec.line = {
    style: {
      curveType: 'monotone',
      lineWidth: 6,
      lineCap: 'round'
    }
  };

  return { spec };
};
