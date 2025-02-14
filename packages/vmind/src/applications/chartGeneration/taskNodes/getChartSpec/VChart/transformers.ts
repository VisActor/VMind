import type { Transformer } from '../../../../../base/tools/transformer';
import { registerVennChart } from '@visactor/vchart';
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
  oneByOneGroupSize,
  BASIC_HEAT_MAP_COLOR_THEMES
} from './constants';
import { getFieldByDataType } from '../../../../../common/utils/utils';
import { array, isArray, uniqArray } from '@visactor/vutils';
import { isValidDataset } from '../../../../../common/dataProcess';
import type { VMindDataset } from '../../../../../common/typings';
import type { DataCell } from '../../../../../types';
import type { DataItem } from '../../../../../common/typings';

import { ChartType, CombinationBasicChartType, DataType, ROLE } from '../../../../../common/typings';
import { builtinThemeMap } from '../../../../../common/builtinTheme';
import { FOLD_NAME, FOLD_VALUE, COLOR_FIELD } from '@visactor/chart-advisor';
import { CARTESIAN_CHART_LIST } from '../../../constants';
import { getCell } from '../../utils';
import { fillColorForData, sortArray, SortOrder } from './utils';

const CARTESIAN_CHART_LIST_UPPER = CARTESIAN_CHART_LIST.map(chartType => chartType.toUpperCase() as ChartType);

type Context = GetChartSpecContext & GetChartSpecOutput;

const chartTypeMap: { [chartName: string]: string } = {
  [ChartType.BarChart.toUpperCase()]: 'bar',
  [ChartType.LineChart.toUpperCase()]: 'line',
  [ChartType.PieChart.toUpperCase()]: 'pie',
  [ChartType.WordCloud.toUpperCase()]: 'wordCloud',
  [ChartType.ScatterPlot.toUpperCase()]: 'scatter',
  [ChartType.DynamicBarChart.toUpperCase()]: 'bar',
  [ChartType.FunnelChart.toUpperCase()]: 'funnel',
  [ChartType.DualAxisChart.toUpperCase()]: 'common',
  [ChartType.RoseChart.toUpperCase()]: 'rose',
  [ChartType.RadarChart.toUpperCase()]: 'radar',
  [ChartType.SankeyChart.toUpperCase()]: 'sankey',
  [ChartType.WaterFallChart.toUpperCase()]: 'waterfall',
  [ChartType.BoxPlot.toUpperCase()]: 'boxPlot',
  [ChartType.LiquidChart.toUpperCase()]: 'liquid',
  [ChartType.LinearProgress.toUpperCase()]: 'linearProgress',
  [ChartType.CircularProgress.toUpperCase()]: 'circularProgress',
  [ChartType.BubbleCirclePacking.toUpperCase()]: 'circlePacking',
  [ChartType.MapChart.toUpperCase()]: 'map',
  [ChartType.RangeColumnChart.toUpperCase()]: 'rangeColumn',
  [ChartType.SunburstChart.toUpperCase()]: 'sunburst',
  [ChartType.TreemapChart.toUpperCase()]: 'treemap',
  [ChartType.Gauge.toUpperCase()]: 'gauge',
  [ChartType.BasicHeatMap.toUpperCase()]: 'common',
  [ChartType.VennChart.toUpperCase()]: 'venn',
  [ChartType.SingleColumnCombinationChart.toUpperCase()]: 'common',
  [ChartType.DynamicScatterPlotChart.toUpperCase()]: 'common',
  [ChartType.DynamicRoseChart.toUpperCase()]: 'rose',
  [ChartType.SequenceChart.toUpperCase()]: 'sequence'
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

export const arrayData: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { dataset, spec } = context;
  spec.data = [
    {
      id: 'data',
      values: isValidDataset(dataset) ? dataset.flat(4) : []
    }
  ];
  return { spec };
};

export const funnelData: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { dataset, cells, spec } = context;
  const cell = getCell(cells);
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
  const { dataset, cells, totalTime, spec, chartType } = context;
  const cell = getCell(cells);
  const timeField = cell.time as string;
  let latestData = isValidDataset(dataset) ? dataset : [];
  if (chartType.toUpperCase() === ChartType.DynamicRoseChart.toUpperCase()) {
    latestData = fillColorForData(
      sortArray(latestData, [
        { field: timeField, order: SortOrder.ASC },
        { field: cell.radius, order: SortOrder.DESC }
      ]),
      cell.color as string
    );
  }

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
  const { dataset, cells, spec } = context;
  const cell = getCell(cells);
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
  const { colors, spec, chartTheme } = context;
  if (chartTheme) {
    return { spec };
  }
  // spec.data = [dataset]
  if (colors && colors.length > 0) {
    spec.color = colors;
  } else {
    spec.color = COLOR_THEMES.default;
  }

  return { spec };
};

export const colorBar: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { colors, spec, chartTheme } = context;
  // spec.data = [dataset]
  const colorThemes = COLOR_THEMES.default;
  if (chartTheme) {
    return { spec };
  }
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
  const { colors, spec, chartTheme } = context;
  // spec.data = [dataset]
  if (chartTheme) {
    return { spec };
  }
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
        //visible: false
      }
    };
  }
  return { spec };
};

export const seriesField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec, fieldInfo, dataset, cells } = context;
  const cellNew: any = { ...cells };
  const { seriesField, xField } = spec;
  const colorField = isArray(seriesField) ? seriesField[0] : seriesField;
  const colorFieldInfo = fieldInfo.find(v => v.fieldName === colorField);
  if (colorField && colorFieldInfo?.role === ROLE.DIMENSION && xField) {
    const xMap = new Map<DataCell, DataCell[]>();
    dataset.forEach(row => {
      const xValue = row[xField[0]];
      if (xMap.has(xValue)) {
        xMap.get(xValue).push(row[colorField]);
      } else {
        xMap.set(xValue, [row[colorField]]);
      }
    });
    const xValues = Array.from(xMap.keys());
    let isValidColor = false;
    for (let i = 0; i < xValues.length; i++) {
      const xValue = xValues[i];
      const colorValues = uniqArray(xMap.get(xValue));
      if (isArray(colorValues) && colorValues.length > 1) {
        isValidColor = true;
        break;
      }
    }
    if (!isValidColor) {
      spec.seriesField = undefined;
      spec.xField = spec.xField?.filter((field: string) => field !== colorField);
      cellNew.color = undefined;
    }
  }
  return { spec, cell: cellNew };
};

export const cartesianLine: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { cells, spec, fieldInfo } = context;
  const cell = getCell(cells);
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
  return { spec, cells: [cellNew] };
};

export const pieField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { cells, spec } = context;
  const cell = getCell(cells);
  spec.valueField = cell.angle || cell.value;
  if (cell.color || (cell as any).category) {
    spec.categoryField = cell.color || (cell as any).category;
  }
  return { spec };
};

export const scatterField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { cells, spec } = context;
  const cell = getCell(cells);
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
  const { cells, spec } = context;
  const cell = getCell(cells);
  spec.nameField = cell.color;

  if (cell.size) {
    spec.valueField = cell.size;
  }

  spec.seriesField = spec.nameField;

  return { spec };
};

export const funnelField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { cells, spec } = context;
  const cell = getCell(cells);
  spec.categoryField = cell.color || cell.x;
  spec.valueField = cell.value || cell.y;

  return { spec };
};

export const waterfallField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { cells, spec } = context;
  const cell = getCell(cells);
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
  const { cells, spec } = context;
  const cell = getCell(cells);
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
  spec.labelLayout = 'region';
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
  const { spec, chartTheme } = context;

  if (chartTheme) {
    return { spec };
  }
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
  const { cells, spec } = context;
  const cell = getCell(cells);
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
  const { spec, chartTheme } = context;
  if (chartTheme) {
    return { spec };
  }
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
          //textAlign: 'center',
          //stroke: '#fff',
          //lineWidth: 4
        }
      },
      grid: {
        smooth: false,
        style: {
          //lineDash: [0]
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
          //lineDash: [0]
        }
      }
    }
  ];

  return { spec };
};

export const sankeyField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { cells, spec } = context;
  const cell = getCell(cells);
  spec.sourceField = cell.source;
  spec.targetField = cell.target;
  spec.valueField = cell.value;
  spec.categoryField = 'name';
  spec.nodeKey = (datum: any) => datum.name;

  return { spec };
};

export const boxPlotField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { cells, dataset, spec } = context;
  const cell = getCell(cells);
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
      //boxWidth: 50,
      //shaftWidth: 30,
      //shaftShape: 'bar',
      //lineWidth: 2,
      //shaftOpacity: 0.3
    }
  };
  return { spec };
};

export const sankeyLabel: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  spec.label = {
    visible: true,
    style: {
      //fontSize: 12
      //fill: '#000000'
    }
  };
  return { spec };
};

export const sankeyLink: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;

  spec.link = {
    style: {
      //fillOpacity: 0.1
    },
    state: {
      hover: {
        //fillOpacity: 0.4
      },
      blur: {
        //fill: '#e8e8e8'
      }
    }
  };
  return { spec };
};

export const cartesianBar: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign fields according to cell
  const { cells, fieldInfo, spec } = context;
  const cell = getCell(cells);
  const cellNew = { ...cell };
  const flattenedXField = Array.isArray(cell.x) ? cell.x : [cell.x];
  if (cell.color && cell.color.length > 0 && cell.color !== cell.x) {
    flattenedXField.push(cell.color as string);
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
  return { spec, cells: [cellNew] };
};

export const rankingBarField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //折线图根据cell分配字段
  const { cells, spec } = context;
  const cell = getCell(cells);
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
  const { cells, spec } = context;
  const cell = getCell(cells);
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
          //fill: '#FFFFFF'
        }
      },
      label: {
        style: {
          //fill: '#FFFFFF'
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
          //fill: '#FFFFFF'
        }
      },
      label: {
        style: {
          //fill: '#FFFFFF'
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
          //fill: '#FFFFFF'
        }
      },
      title: {
        visible: false,
        style: {
          //fill: '#FFFFFF'
        }
      }
    },
    {
      orient: 'left',
      type: 'linear',
      label: {
        style: {
          //fill: '#FFFFFF'
        }
      },
      title: {
        visible: false,
        style: {
          //fill: '#FFFFFF'
        }
      }
    }
  ];
  return { spec };
};

export const legend: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { cells, spec } = context;
  const cell = getCell(cells);
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
            //fillOpacity: 0
          }
        },
        label: {
          style: {
            //fill: '#FFFFFF'
          }
        },
        shape: {
          style: {
            //symbolType: 'rect'
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
          //fill: '#FFFFFF'
        }
      },
      title: {
        visible: false,
        style: {
          //fill: '#FFFFFF'
        }
      }
    },
    {
      orient: 'left',
      type: [DataType.DATE, DataType.STRING].includes(yFieldInfo.type) ? 'band' : 'linear',
      label: {
        style: {
          //fill: '#FFFFFF'
        }
      },
      title: {
        visible: false,
        style: {
          //fill: '#FFFFFF'
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
  const groupKey = getCell(context.cells).color as string;
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
  const { spec, chartTheme } = context;

  if (chartTheme) {
    return { spec };
  }
  spec.bar = {
    style: {
      //cornerRadius: [8, 8, 0, 0]
    }
  };

  return { spec };
};

export const displayConfLine: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec, chartTheme } = context;
  if (chartTheme) {
    return { spec };
  }
  spec.line = {
    style: {
      //curveType: 'monotone',
      //lineWidth: 6,
      //lineCap: 'round'
    }
  };

  return { spec };
};

export const theme: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { chartTheme, spec } = context;

  if (typeof chartTheme === 'string') {
    Object.keys(builtinThemeMap).some(key => {
      if (key === chartTheme) {
        spec.theme = builtinThemeMap[chartTheme];
        return true;
      }
      return false;
    });
  } else if (typeof chartTheme === 'object') {
    spec.theme = chartTheme;
  }
  if (spec.theme && spec.theme.colorScheme) {
    spec.color = undefined;
  }

  return { spec };
};

export const liquidField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { cells, dataset, spec } = context;
  const cell = getCell(cells);

  spec.valueField = (cell.value ?? cell.y ?? cell.size) as string;
  spec.indicatorSmartInvert = true;

  return { spec };
};

export const liquidStyle: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  spec.liquid = {
    ...spec.liquid,
    style: {}
  };
  return { spec };
};

export const linearProgressField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { cells, spec } = context;
  const cell = getCell(cells);

  spec.xField = cell.y;
  spec.yField = cell.x;
  if (cell.color) {
    spec.seriesField = cell.color;
  }
  spec.cornerRadius = 20;

  return { spec };
};

export const linearProgressAxes: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { cells, spec } = context;
  const cell = getCell(cells);
  const hasSingleData = spec.data.values && spec.data.values.length === 1;

  spec.axes = [
    {
      orient: 'left',
      type: 'band',
      domainLine: { visible: false },
      tick: { visible: false },
      label: {
        formatMethod: hasSingleData ? (val: any) => `${cell.x}: ${val}` : null,
        style: {
          fontSize: 16
        }
      }
    },
    {
      orient: 'bottom',
      type: 'linear',
      visible: true,
      grid: {
        visible: false
      },
      label: {
        formatMethod: (val: number) => {
          return val >= 0 && val <= 1 ? `${val * 100}%` : val;
        },
        flush: true
      }
    }
  ];

  return { spec };
};

export const linearProgressStyle: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  spec.progress = {
    ...spec.progress,
    style: {}
  };
  return { spec };
};

export const circularProgressField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { cells, spec } = context;
  const cell = getCell(cells);

  spec.categoryField = cell.color;
  spec.valueField = (cell.value ?? cell.size) as string;
  spec.seriesField = cell.color;

  spec.radius = 0.8;
  spec.innerRadius = 0.7;
  spec.roundCap = true;
  spec.cornerRadius = 20;

  return { spec };
};

export const circularProgressStyle: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  spec.progress = {
    ...spec.progress,
    style: {}
  };
  return { spec };
};

export const indicator: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec, cells } = context;
  const cell = getCell(cells);
  const firstEntry = spec.data.values[0];
  if (!firstEntry) {
    return { spec };
  }
  const valueField = (cell.value ?? cell.y ?? cell.size) as string;
  const value = firstEntry[valueField];
  const cat = firstEntry[cell.radius ?? cell.x];

  spec.indicator = {
    visible: true,
    fixed: true,
    trigger: 'none',
    title: {
      visible: true,
      autoLimit: true,
      space: 12,
      style: {
        fontSize: 16,
        fill: 'gray',
        text: cat ?? valueField
      }
    },
    content: [
      {
        visible: true,
        style: {
          fontSize: 20,
          fill: '#000',
          text: value >= 0 && value <= 1 ? `${(value * 100).toFixed(2)}%` : `${value}`
        }
      }
    ]
  };
  return { spec };
};

export const bubbleCirclePackingData: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { dataset, spec, cells } = context;
  const cell = getCell(cells);
  if (cell.size) {
    dataset.forEach(data => {
      data.value = data[cell.size];
      delete data[cell.size];
    });
  }
  return { spec };
};

export const bubbleCirclePackingField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { cells, spec } = context;
  const cell = getCell(cells);
  spec.categoryField = cell.color || cell.x;

  if (cell.size) {
    spec.valueField = cell.size;
  }

  return { spec };
};

export const bubbleCirclePackingDisplayConf: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  spec.drill = true;
  spec.layoutPadding = 5;
  spec.animationEnter = {
    easing: 'cubicInOut'
  };
  spec.animationExit = {
    easing: 'cubicInOut'
  };
  spec.animationUpdate = {
    easing: 'cubicInOut'
  };
  return { spec };
};

export const rangeColumnField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { cells, spec } = context;
  const cell = getCell(cells);
  spec.yField = cell.x;

  spec.xField = [cell.y[0], cell.y[1]];

  return { spec };
};

export const rangeColumnDisplayConf: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  spec.direction = 'horizontal';
  spec.label = {
    visible: true
  };
  return { spec };
};

export const sunburstData: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { dataset, cells, spec } = context;
  const cell = getCell(cells);
  spec.data = { id: 'data', values: getSunburstData(dataset, cell.color, 0, cell.size) };
  return { spec };
};

export const getSunburstData: any = (
  dataset: VMindDataset,
  colorField: string[] | string,
  index: number,
  sizeField: string
) => {
  if (colorField.length - 1 === index) {
    return Array.from(
      new Set(
        dataset.map(data => {
          return { name: data[colorField[index]], value: data[sizeField] };
        })
      )
    );
  }
  // Get the value range of this layer
  const values = Array.from(
    new Set(
      dataset.map(data => {
        return data[colorField[index]];
      })
    )
  );
  return values.map(value => {
    const currentDataset = dataset.filter(data => {
      return data[colorField[index]] === value;
    });
    return { name: value, children: getSunburstData(currentDataset, colorField, index + 1, sizeField) };
  });
};

export const sunburstOrTreemapField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  //assign field in spec according to cell
  const { spec } = context;
  spec.categoryField = 'name';

  spec.valueField = 'value';

  return { spec };
};

export const sunburstDisplayConf: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  spec.offsetX = 0;
  spec.offsetY = 0;
  spec.outerRadius = 1;
  spec.innerRadius = 0;
  spec.gap = 5;
  spec.drill = true;
  spec.sunburst = {
    visible: true,
    style: {
      fillOpacity: (datum: { isLeaf: any }) => {
        return datum.isLeaf ? 0.4 : 0.8;
      }
    }
  };
  spec.label = {
    visible: true,
    style: {
      fontSize: 12,
      fillOpacity: (datum: { isLeaf: any }) => {
        return datum.isLeaf ? 0.4 : 0.8;
      }
    }
  };
  spec.tooltip = {
    mark: {
      title: {
        value: (val: { datum: any[] }) => {
          return val?.datum?.map(data => data.name).join(' / ');
        }
      }
    }
  };
  spec.animationEnter = {
    easing: 'cubicInOut',
    duration: 1000
  };
  spec.animationExit = {
    easing: 'cubicInOut',
    duration: 1000
  };
  spec.animationUpdate = {
    easing: 'cubicInOut',
    duration: 1000
  };
  return { spec };
};

export const treemapData: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { dataset, cells, spec } = context;
  const cell = getCell(cells);
  spec.data = { id: 'data', values: getTreemapData(dataset, cell.color, 0, cell.size) };
  return { spec };
};

export const getTreemapData: any = (
  dataset: VMindDataset,
  colorField: string[] | string,
  index: number,
  sizeField: string
) => {
  if (colorField.length - 1 === index) {
    return Array.from(
      new Set(
        dataset.map(data => {
          return { name: data[colorField[index]], value: data[sizeField] };
        })
      )
    );
  }
  // Get the value range of this layer
  const values = Array.from(
    new Set(
      dataset.map(data => {
        return data[colorField[index]];
      })
    )
  );
  return values.map(value => {
    const currentDataset = dataset.filter(data => {
      return data[colorField[index]] === value;
    });
    if (currentDataset[0] && currentDataset[0][colorField[index + 1]] === '') {
      return { name: value, value: currentDataset[0][sizeField] };
    }
    return { name: value, children: getTreemapData(currentDataset, colorField, index + 1, sizeField) };
  });
};

export const treemapDisplayConf: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  spec.label = {
    visible: true,
    style: {
      fontSize: 12
    }
  };
  return { spec };
};

export const gaugeField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec, cells } = context;
  const cell = getCell(cells);
  spec.valueField = cell.size;
  spec.categoryField = cell.color;
  return { spec };
};

export const gaugeDisplayConf: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  spec.outerRadius = 0.8;
  spec.innerRadius = 0.5;
  spec.startAngle = -180;
  spec.endAngle = 0;
  return { spec };
};

export const vennData: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { dataset, spec, cells } = context;
  const cell = getCell(cells);
  const id2dataMap = {};
  const setsField = cell.color[0];
  const nameField = cell.color[1];
  dataset.forEach(data => {
    if (id2dataMap[data[setsField]]) {
      id2dataMap[data[setsField]].sets.push(data[nameField]);
    } else {
      id2dataMap[data[setsField]] = { sets: [data[nameField]], value: data[cell.size] };
    }
  });
  spec.data = {
    values: Object.values(id2dataMap)
  };

  return { spec };
};

export const vennField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  spec.valueField = 'value';
  spec.categoryField = 'sets';
  spec.seriesField = 'sets';
  return { spec };
};
export const registerChart: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  if (spec.type === 'venn') {
    registerVennChart();
  }
  return { spec };
};

export const basicHeatMapSeries: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec, cells } = context;
  const cell = getCell(cells);
  spec.series = [
    {
      type: 'heatmap',
      regionId: 'region0',
      xField: cell.x,
      yField: cell.y,
      valueField: cell.size,
      cell: {
        style: {
          fill: {
            field: cell.size,
            scale: 'color'
          }
        }
      }
    }
  ];
  return { spec };
};
export const basicHeatMapRegion: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  spec.region = [
    {
      id: 'region0',
      width: 200, // limit the width of the region
      height: 200, // limit the height of the region
      padding: {
        top: 40
      }
    }
  ];
  return { spec };
};
export const basicHeatMapColor: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec, cells } = context;
  const cell = getCell(cells);
  spec.color = {
    type: 'linear',
    domain: [
      {
        dataId: 'data',
        fields: [cell.size]
      }
    ],
    range: BASIC_HEAT_MAP_COLOR_THEMES
  };
  return { spec };
};
export const basicHeatMapAxes: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  spec.axes = [
    {
      orient: 'bottom',
      type: 'band',
      grid: {
        visible: false
      },
      domainLine: {
        visible: false
      },
      label: {
        space: 10,
        style: {
          textAlign: 'left',
          textBaseline: 'middle',
          angle: 90,
          fontSize: 8
        }
      },
      bandPadding: 0,
      height: (layoutRect: any) => {
        // canvas height - region height - paddingTop - paddingBottom
        return layoutRect.height - 314;
      }
    },
    {
      orient: 'left',
      type: 'band',
      grid: {
        visible: false
      },
      domainLine: {
        visible: false
      },
      label: {
        space: 10,
        style: {
          fontSize: 8
        }
      },
      bandPadding: 0
    }
  ];
  return { spec };
};

export const basicHeatMapLegend: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  spec.legends = {
    visible: true,
    orient: 'right',
    position: 'start',
    type: 'color',
    field: 'value'
  };
  return { spec };
};

export const basemap: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { basemapOption, spec } = context;
  if (basemapOption.regionProjectType) {
    spec.region = [
      {
        roam: true,
        projection: { type: basemapOption.regionProjectType },
        coordinate: basemapOption.regionCoordinate
      }
    ];
  } else {
    spec.region = [
      {
        roam: true,
        coordinate: basemapOption.regionCoordinate
      }
    ];
  }

  spec.map = 'map';
  return { spec };
};

export const mapField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec, cells } = context;
  const cell = getCell(cells);

  spec.nameField = cell.color;
  spec.valueField = cell.size;
  spec.nameProperty = cell.color;
  return { spec };
};

export const mapDisplayConf: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec, cells } = context;
  const cell = getCell(cells);
  spec.legends = [
    {
      visible: true,
      type: 'color',
      field: cell.size,
      orient: 'bottom',
      position: 'start'
    }
  ];
  spec.area = {
    style: {
      fill: {
        field: cell.size,
        scale: 'color',
        changeDomain: 'replace'
      }
    }
  };
  return { spec };
};

export const commonSingleColumnRegion: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { cells, spec, datasetsForCombinationChart, subChartType } = context;

  const regionList: string[] = [];

  cells.forEach((cell, index) => {
    if (subChartType[index] === undefined) {
      return;
    }
    const sizeField = [cell.y, cell.size, cell.angle, cell.radius, cell.value].filter(Boolean).flat();
    const dataset = datasetsForCombinationChart[index];
    if (sizeField.length !== 0) {
      if (sizeField[0] === FOLD_VALUE.toString()) {
        const sizeFieldName = [...new Set(dataset.map(data => data[FOLD_NAME.toString()]))];
        regionList.push(sizeFieldName.join(' & ') + '-' + subChartType[index]);
      } else {
        regionList.push(sizeField[0] + '-' + subChartType[index]);
      }
    }
  });

  spec.region = regionList.map((region, index) => {
    return { id: region };
  });
  spec.regionList = regionList;
  return { spec };
};

export const commonSingleColumnSeries: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { cells, spec, datasetsForCombinationChart, subChartType, fieldInfo } = context;
  const commonData = {};
  spec.seriesField = 'type';
  spec.region.forEach((region: { [id: string]: string }) => {
    commonData[region.id] = [];
  });
  cells.forEach((cell, index) => {
    if (subChartType[index] === undefined) {
      return;
    }
    const regionId = spec.regionList[index];
    const dataset = datasetsForCombinationChart[index];
    dataset.forEach(data => {
      const subData = {
        type: regionId
      };
      for (const visualChannel in cell) {
        subData[cell[visualChannel]] = data[cell[visualChannel]];
      }
      commonData[regionId].push(subData);
    });
  });

  spec.series = spec.region.map((region: { [id: string]: string }, index: number) => {
    const regionId = region.id;
    const seriesSubset = {
      id: regionId,
      regionId: regionId,
      type: chartTypeMap[subChartType[index].toUpperCase()],
      data: { id: regionId, values: commonData[regionId] }
    };
    let specNew: { spec: any };

    switch (subChartType[index].toUpperCase()) {
      case CombinationBasicChartType.BarChart.toUpperCase():
        specNew = cartesianBar({ ...context, cells: [getCell(cells, index)], spec: {}, fieldInfo: fieldInfo });

        return {
          ...seriesSubset,
          ...specNew.spec
        };
      case CombinationBasicChartType.LineChart.toUpperCase():
        specNew = cartesianLine({ ...context, cells: [getCell(cells, index)], spec: {}, fieldInfo: fieldInfo });
        return {
          ...seriesSubset,
          ...specNew.spec
        };
      default:
        return {
          ...seriesSubset,
          xField: getCell(cells, index).x,
          yField: getCell(cells, index).y
        };
    }
  });

  return { spec };
};

export const commonSingleColumnLegend: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  spec.legends = {
    padding: {
      top: 10
    },
    visible: true,
    orient: 'bottom',
    id: 'legend',
    regionId: spec.region.map((region: { [id: string]: string }) => {
      return region.id;
    })
  };
  return { spec };
};
export const commonSingleColumnAxes: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec, subChartType } = context;

  const cartesianRegion: string[] = spec.legends.regionId.filter((item: string, index: number) => {
    return CARTESIAN_CHART_LIST_UPPER.includes(subChartType[index].toUpperCase() as ChartType);
  });

  const leftAxesCommonSpec = {
    expand: { max: 0.2 },
    label: { flush: true, visible: true },
    tick: { visible: false },
    forceTickCount: 3
  };
  if (cartesianRegion.length !== 0) {
    // Y-axes
    spec.axes = cartesianRegion.map((region: string) => {
      return {
        id: region + '-left',
        regionId: region,
        orient: 'left',
        title: { visible: true, text: region },
        ...leftAxesCommonSpec
      };
    });

    // X-axes
    spec.axes.push({
      id: 'bottom',
      regionId: cartesianRegion,
      orient: 'bottom',
      label: {
        firstVisible: true,
        lastVisible: true,
        visible: true
      },
      tick: { visible: false }
    });
  }
  return { spec };
};
export const commonSingleColumnLayout: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec, subChartType } = context;
  const regionLength = spec.legends.regionId.length;
  const elements = [];

  const existCartesianChart = subChartType.some(chartType =>
    CARTESIAN_CHART_LIST_UPPER.includes(chartType.toUpperCase() as ChartType)
  );

  spec.region.forEach((region: { [id: string]: string }, index: number) => {
    if (CARTESIAN_CHART_LIST_UPPER.includes(subChartType[index].toUpperCase() as ChartType)) {
      elements.push({
        modelId: region.id + '-left',
        col: 0,
        row: index
      });
      elements.push({
        modelId: region.id,
        col: 1,
        row: index
      });
    } else if (!existCartesianChart) {
      elements.push({
        modelId: region.id,
        col: 0,
        row: index
      });
    } else {
      elements.push({
        modelId: region.id,
        col: 0,
        colSpan: 2,
        row: index
      });
    }
  });
  if (
    subChartType.some(item => {
      return CARTESIAN_CHART_LIST_UPPER.includes(item.toUpperCase() as ChartType);
    })
  ) {
    elements.push({
      modelId: 'legend',
      col: 0,
      colSpan: 2,
      row: regionLength + 1
    });
    elements.push({
      modelId: 'bottom',
      col: 1,
      row: regionLength
    });
    spec.layout = { type: 'grid', col: 2, row: regionLength + 2, elements: elements };
  } else {
    elements.push({
      modelId: 'legend',
      col: 0,
      row: regionLength
    });
    spec.layout = { type: 'grid', col: 1, row: regionLength + 1, elements: elements };
  }
  return { spec };
};

export const colorDynamicScatterPlot: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { colors, spec, cells, fieldInfo } = context;
  const cell = getCell(cells);
  const colorThemes = COLOR_THEMES.default;
  if (colors && colors.length > 0) {
    spec.color = colors;
  } else {
    spec.color = {
      type: 'ordinal',
      domain: fieldInfo.filter(fieldInfo => {
        return fieldInfo.fieldName === cell.color;
      })?.[0].domain,
      range: colorThemes
    };
  }

  return { spec };
};

export const dynamicScatterPlotAxes: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec, cells, fieldInfo } = context;
  const cell = getCell(cells);
  const xFieldInfo = fieldInfo.filter(fieldInfo => {
    return fieldInfo.fieldName === cell.x;
  })?.[0];
  const yFieldInfo = fieldInfo.filter(fieldInfo => {
    return fieldInfo.fieldName === cell.y;
  })?.[0];

  spec.axes = [
    {
      orient: 'left',
      nice: true,
      zero: false,
      type: 'linear',
      range: { min: yFieldInfo.domain[0], max: yFieldInfo.domain[1] },
      tick: {
        tickCount: 10
      },
      grid: {
        visible: true,
        style: {
          lineDash: [0]
        }
      }
    },
    {
      orient: 'bottom',
      nice: true,
      label: { visible: true },
      type: 'linear',
      range: { min: xFieldInfo.domain[0], max: xFieldInfo.domain[1] },
      tick: {
        tickCount: 10
      },
      grid: {
        visible: true,
        style: {
          lineDash: [0]
        }
      }
    }
  ];
  return { spec };
};

export const dynamicScatterPlotSeries: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec, cells } = context;
  const cell = getCell(cells);
  spec.series = [
    {
      type: 'scatter',
      // 通过数据中的 index 进行数据匹配
      dataKey: cell.color,
      // 声明点半径大小
      sizeField: cell.size,
      size: {
        type: 'linear',
        range: [5, 30]
      },
      seriesField: cell.color,
      point: {
        style: {}
      },
      xField: cell.x,
      yField: cell.y,
      animationAppear: {
        duration: 300,
        easing: 'linear'
      },
      animationUpdate: {
        duration: 300,
        easing: 'linear'
      }
    }
  ];
  return { spec };
};

export const dynamicScatterPlotAnimation: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  const duration = spec.animationUpdate.bar[0].duration;
  spec.animationUpdate = {
    point: [
      {
        type: 'update',
        options: {
          excludeChannels: ['x', 'y']
        },
        duration: duration,
        easing: 'cubicInOut'
      },
      {
        channel: ['x', 'y'],
        options: {
          excludeChannels: ['width']
        },
        duration: duration,
        easing: 'cubicInOut'
      }
    ],
    axis: {
      duration: duration,
      easing: 'cubicInOut'
    }
  };
  return { spec };
};

export const dynamicScatterPlotTooltip: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec, cells } = context;
  const cell = getCell(cells);
  spec.tooltip = {
    mark: {
      title: {
        key: cell.color,
        value: (datum: any) => datum[cell.color as string]
      },
      content: [
        {
          key: cell.x,
          value: (datum: any) => datum[cell.x]
        },
        {
          key: cell.y,
          value: (datum: any) => datum[cell.y as string]
        },
        {
          key: cell.size,
          value: (datum: any) => datum[cell.size]
        }
      ]
    }
  };
  return { spec };
};

export const dynamicRoseAnimation: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  const duration = 1000;
  const exchangeDuration = 600;
  spec.animationUpdate = {
    rose: [
      {
        type: 'update',
        options: { excludeChannels: ['startAngle', 'endAngle'] },
        easing: 'linear',
        duration
      },
      {
        channel: ['startAngle', 'endAngle'],
        easing: 'circInOut',
        duration: exchangeDuration
      }
    ]
  };
  spec.animationEnter = {
    easing: 'linear',
    duration: exchangeDuration
  };
  spec.animationExit = {
    easing: 'linear',
    duration: exchangeDuration
  };
  return { spec };
};
export const dynamicRoseField: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec, cells } = context;
  const cell = getCell(cells);
  spec.categoryField = cell.color;
  spec.valueField = cell.radius;
  spec.seriesField = cell.color;
  return { spec };
};
export const dynamicRoseDisplayConf: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { spec } = context;
  spec.outerRadius = 1;
  spec.innerRadius = 0.2;
  spec.rose = {
    style: {
      fill: (datum: any) => datum.fill
    }
  };
  spec.axes = [
    {
      orient: 'angle',
      label: {
        visible: false
      }
    },
    {
      orient: 'radius'
    }
  ];
  spec.label = {
    visible: true,
    position: 'outside'
  };
  spec.startAngle = -90;
  return { spec };
};

export const sequenceChartData: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { cells, dataset, spec } = context;
  const cell = getCell(cells);
  const timeField = cell.time as string;
  const groupField = cell.group;
  const colorField = cell.color as string;
  const dataMap: { [key: string]: DataItem[] } = {};
  dataset.forEach(data => {
    dataMap[data[groupField]]
      ? dataMap[data[groupField]].push({ ...data })
      : (dataMap[data[groupField]] = [{ ...data }]);
  });
  const dataDot: { [key: string]: DataItem[] | string }[] = [];
  const dataLink: { [key: string]: string | number }[] = [];
  Object.keys(dataMap).forEach(key => {
    const dotList = sortArray(dataMap[key], [{ field: timeField, order: SortOrder.ASC }]).map((data, index, array) => {
      const newData = { ...data };
      newData.node_name = `${data[groupField]}_${Math.floor(index / 2).toString()}_${data[colorField]}_node`;
      return newData;
    });
    dataDot.push({
      [cell.group]: key,
      dots: dotList
    });
    dotList.forEach((dot, index, array) => {
      if (index % 2 !== 0) {
        dataLink.push({
          from: array[index - 1].node_name,
          to: dot.node_name
        });
      }
    });
  });
  spec.data = [
    { id: 'dataDotSeries', values: dataDot },
    { id: 'dataLinkSeries', values: dataLink }
  ];
  return { spec };
};

export const sequenceChartSeries: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { cells, spec } = context;
  const cell = getCell(cells);

  spec.series = [
    {
      type: 'link',
      dataId: 'dataLinkSeries',
      dotSeriesIndex: 1,
      fromField: 'from',
      toField: 'to',
      arrow: {
        style: {
          visible: false
        }
      }
    },
    {
      type: 'dot',
      dataId: 'dataDotSeries',
      xField: cell.time as string,
      yField: cell.group,
      dotTypeField: cell.color as string,
      titleField: cell.group,
      highLightSeriesGroup: '',
      height: 500,
      clipHeight: 800,
      title: {
        style: {
          fill: 'rgba(46, 47, 50)'
        }
      },
      subTitle: {
        style: {
          fill: 'rgba(46, 47, 50)',
          dy: 7
        }
      },
      grid: {
        style: {
          visible: false
        }
      },
      symbol: {
        style: {
          visible: false
        }
      },
      tooltip: {
        mark: {
          title: {
            key: 'event 信息',
            value: 'event 信息'
          },
          content: [
            {
              hasShape: true,
              shapeType: 'square',
              key: (datum: any) => datum[cell.group]
            },
            {
              hasShape: false,
              key: 'event_time_stamp',
              value: (datum: any) => datum[cell.group as string]
            }
          ]
        }
      }
    }
  ];
  return { spec };
};
export const sequenceChartAxes: Transformer<Context, GetChartSpecOutput> = (context: Context) => {
  const { cells, spec, fieldInfo } = context;
  const cell = getCell(cells);

  spec.axes = [
    {
      orient: 'top',
      type: 'time',
      range: {
        min: fieldInfo.filter(fieldInfo => {
          return fieldInfo.fieldName === cell.time;
        })[0].domain[0],
        max: fieldInfo.filter(fieldInfo => {
          return fieldInfo.fieldName === cell.time;
        })[0].domain[1]
      },
      layers: [
        {
          tickStep: 28800,
          timeFormat: '%Y%m%d'
        },
        {
          tickStep: 28800,
          timeFormat: '%H:%M'
        }
      ]
    }
  ];
  spec.appendPadding = {
    left: 80,
    right: 80
  };
  return { spec };
};
