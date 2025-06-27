import { allThemeMap } from '@visactor/vchart-theme';
import {
  DEFAULT_ANIMATION_DURATION,
  COLOR_THEMES,
  DEFAULT_VIDEO_LENGTH,
  DEFAULT_VIDEO_LENGTH_LONG,
  ONE_BY_ONE_GROUP_SIZE
} from '../utils/constants';
import { isArray } from '@visactor/vutils';
import { DataTable, GenerateChartInput } from '../types/transform';
import { isValidDataTable } from '../utils/data';
import { getFieldIdInCell } from '../utils/field';

export const data = (context: GenerateChartInput) => {
  const { dataTable, spec } = context;
  spec.data = {
    id: 'data',
    values: isValidDataTable(dataTable) ? dataTable.flat(4) : []
  };

  return { spec };
};

export const arrayData = (context: GenerateChartInput) => {
  const { dataTable, spec } = context;
  spec.data = [
    {
      id: 'data',
      values: isValidDataTable(dataTable) ? dataTable.flat(4) : []
    }
  ];
  return { spec };
};

export const discreteLegend = (context: GenerateChartInput) => {
  const { cell, spec } = context;

  if (spec.legends || (!(cell.color || cell.category) && !spec.seriesField && spec.type !== 'common')) {
    return { spec };
  }
  spec.legends = [
    {
      orient: 'right',
      type: 'discrete',
      item: {
        visible: true
      }
    }
  ];

  return { spec };
};

export const theme = (context: GenerateChartInput) => {
  const { chartTheme, spec } = context;

  if (typeof chartTheme === 'string') {
    // if (allThemeMap.has(chartTheme)) {
    //   return true;
    // }
    // return false;
  } else if (typeof chartTheme === 'object') {
    spec.theme = chartTheme;
  }
  if (spec.theme && spec.theme.colorScheme) {
    spec.color = undefined;
  }

  return { spec };
};

export const color = (context: GenerateChartInput) => {
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

export const commonLabel = (context: GenerateChartInput) => {
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

export const indicator = (context: GenerateChartInput) => {
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

export const sunburstOrTreemapField = (context: GenerateChartInput) => {
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
  const group = datum.__CHARTSPACE_DEFAULT_DATA_INDEX % ONE_BY_ONE_GROUP_SIZE;
  return group * delay;
};

export const animationOneByOne = (context: GenerateChartInput) => {
  const { spec, animationOptions } = context;

  if (spec.type === 'wordCloud3d') {
    return { spec };
  }
  const totalTime = animationOptions.totalTime ?? DEFAULT_VIDEO_LENGTH_LONG;
  const duration = DEFAULT_ANIMATION_DURATION;
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
    //    duration: DEFAULT_ANIMATION_DURATION,
    //    delay: oneByOneDelayFunc(delay),
    //  },
    //],
    oneByOne: finalDelay,
    duration: finalDuration
  };
  return { spec };
};

export const animationCartisianLine = (context: GenerateChartInput) => {
  const { spec, animationOptions } = context;

  const totalTime = animationOptions.totalTime ?? DEFAULT_VIDEO_LENGTH;
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

export const formatHierarchyData = (
  dataTable: DataTable,
  colorField: string[] | string,
  index: number,
  sizeField: string
): any[] => {
  if (colorField.length - 1 === index) {
    return Array.from(
      new Set(
        dataTable.map(data => {
          return { name: data[colorField[index]], value: data[sizeField] };
        })
      )
    );
  }
  // Get the value range of this layer
  const values = Array.from(
    new Set(
      dataTable.map(data => {
        return data[colorField[index]];
      })
    )
  );
  return values.map((value: any) => {
    const currentDataset = dataTable.filter(data => {
      return data[colorField[index]] === value;
    });
    if (currentDataset[0] && currentDataset[0][colorField[index + 1]] === '') {
      return { name: value, value: currentDataset[0][sizeField] };
    }
    return { name: value, children: formatHierarchyData(currentDataset, colorField, index + 1, sizeField) };
  });
};
