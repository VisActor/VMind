import type { GenerateChartCellContext } from '../../type';
import { getVChartTypeByVmind } from '../chartTypeUtils';
import { isValidDataTable } from '../../../../utils/dataTable';
import { builtinThemeMap } from '../../const';
import {
  animationDuration,
  COLOR_THEMES,
  DEFAULT_VIDEO_LENGTH,
  DEFAULT_VIDEO_LENGTH_LONG,
  oneByOneGroupSize
} from '../constants';
import { isArray } from '@visactor/vutils';
import { getFieldIdInCell } from '../../../../utils/field';

/**
 * 更新spec中的图表类型
 * @param context
 * @returns
 */
export const revisedVChartType = (context: GenerateChartCellContext) => {
  const { chartType, spec } = context;

  spec.type = getVChartTypeByVmind(chartType);

  return { spec };
};

export const data = (context: GenerateChartCellContext) => {
  const { dataTable, spec } = context;
  spec.data = {
    id: 'data',
    values: isValidDataTable(dataTable) ? dataTable.flat(4) : []
  };

  return { spec };
};

export const arrayData = (context: GenerateChartCellContext) => {
  const { dataTable, spec } = context;
  spec.data = [
    {
      id: 'data',
      values: isValidDataTable(dataTable) ? dataTable.flat(4) : []
    }
  ];
  return { spec };
};

export const discreteLegend = (context: GenerateChartCellContext) => {
  const { cell, spec, simpleVChartSpec } = context;

  if (spec.legends || (!(cell.color || cell.category) && !spec.seriesField && spec.type !== 'common')) {
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

export const theme = (context: GenerateChartCellContext) => {
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

export const color = (context: GenerateChartCellContext) => {
  const { colors, spec, chartTheme } = context;
  if (chartTheme) {
    return { spec };
  }
  // spec.data = [dataTable]
  if (colors && colors.length > 0) {
    spec.color = colors;
  } else {
    spec.color = COLOR_THEMES.default;
  }

  return { spec };
};

export const commonLabel = (context: GenerateChartCellContext) => {
  const { spec, fieldInfo, cell } = context;
  const { y: celly } = cell;
  spec.label = {
    visible: true
  };
  if (isArray(celly) && celly.length > 1) {
  } else if (celly) {
    const field = isArray(celly) ? celly[0] : celly;
    const info = fieldInfo.find(v => v.fieldName === field);
    if (info?.ratioGranularity) {
      spec.label.formatter = `{${field}:~%}`;
    }
  }
  return { spec };
};

export const indicator = (context: GenerateChartCellContext) => {
  const { spec, cell } = context;
  const firstEntry = spec.data.values[0];
  if (!firstEntry) {
    return { spec };
  }
  const valueField = (cell.value ?? cell.y) as string;
  const value = firstEntry[valueField];
  const cat = firstEntry[getFieldIdInCell(cell.radius ?? cell.x)];

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
          text: `${(value * 100).toFixed(1)}%`
        }
      }
    ]
  };
  return { spec };
};

export const sunburstOrTreemapField = (context: GenerateChartCellContext) => {
  //assign field in spec according to cell
  const { spec } = context;
  spec.categoryField = 'name';

  spec.valueField = 'value';

  return { spec };
};

export function onlyUnique(value: any, index: number, array: any) {
  return array.indexOf(value) === index;
}

export const oneByOneDelayFunc = (delay: number) => (datum: any) => {
  const group = datum.__CHARTSPACE_DEFAULT_DATA_INDEX % oneByOneGroupSize;
  return group * delay;
};

export const animationOneByOne = (context: GenerateChartCellContext) => {
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

export const animationCartisianLine = (context: GenerateChartCellContext) => {
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
