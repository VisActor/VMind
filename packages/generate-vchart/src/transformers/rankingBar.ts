import { array, isBoolean } from '@visactor/vutils';
import { COLOR_THEMES, DEFAULT_RANKING_BAR_DURATION } from '..//utils/constants';
import { GenerateChartInput, SimpleChartAxisInfo } from '../types/transform';
import { isValidDataTable } from '../utils/data';
import { seriesField } from './cartesian';
import { commonLegend, formatXFields } from './common';

export const sequenceData = (context: GenerateChartInput) => {
  const { dataTable, cell, animationOptions, spec } = context;
  const timeField = cell.time as string;
  const latestData = isValidDataTable(dataTable) ? dataTable : [];

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

  const totalTime = animationOptions?.totalTime ?? DEFAULT_RANKING_BAR_DURATION;
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

  const animationDuration = Math.floor(duration / 2);

  spec.animationUpdate = {
    bar: [
      {
        type: 'update',
        options: { excludeChannels: ['x', 'y'] },
        duration: animationDuration,
        easing: 'linear'
      },
      {
        channel: ['x', 'y'],
        options: { excludeChannels: ['width'] },
        duration: animationDuration,
        easing: 'linear'
      }
    ],
    axis: {
      duration: animationDuration,
      easing: 'linear'
    }
  };

  return { spec };
};

export const colorDynamicBar = (context: GenerateChartInput) => {
  const { colors, spec } = context;
  // spec.data = [dataTable]
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

export const rankingBarField = (context: GenerateChartInput) => {
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

export const rankingBarAxis = (context: GenerateChartInput) => {
  const { spec, axes } = context;
  const bandAxisCfg: SimpleChartAxisInfo =
    axes === false ? { visible: false, hasGrid: false, type: 'band' } : array(axes).find(axis => axis.type === 'band');
  const linearAxisCfg: SimpleChartAxisInfo =
    axes === false
      ? { visible: false, hasGrid: false, type: 'linear' }
      : array(axes).find(axis => axis.type === 'linear');

  spec.axes = [
    {
      visible: linearAxisCfg?.visible ?? true,
      orient: linearAxisCfg?.orient ?? 'bottom',
      animation: true,
      type: 'linear',
      title: {
        visible: false
      },
      grid: {
        visible: linearAxisCfg?.hasGrid ?? true
      }
    },
    {
      visible: bandAxisCfg?.visible ?? true,
      orient: bandAxisCfg?.orient ?? 'left',
      animation: true,
      id: 'axis-left',
      tick: { visible: false },
      title: {
        visible: false
      },
      type: 'band',
      ...(isBoolean(bandAxisCfg?.hasGrid)
        ? {
            grid: { visible: bandAxisCfg.hasGrid }
          }
        : {})
    }
  ];

  return { spec };
};

export const customMark = (context: GenerateChartInput) => {
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

export const rankingBarLabel = (context: GenerateChartInput) => {
  const { spec, label } = context;

  if (label !== false) {
    spec.label = {
      ...array(label)[0],
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
  }
  return { spec };
};

export const pipelineRankingBar = [
  formatXFields,
  sequenceData,
  colorDynamicBar,
  rankingBarField,
  rankingBarAxis,
  seriesField,
  // commonLabel,
  customMark,
  rankingBarLabel,
  commonLegend
];
