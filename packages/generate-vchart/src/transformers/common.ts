import {
  DEFAULT_ANIMATION_DURATION,
  COLOR_THEMES,
  DEFAULT_VIDEO_LENGTH,
  DEFAULT_VIDEO_LENGTH_LONG,
  ONE_BY_ONE_GROUP_SIZE
} from '../utils/constants';
import { array, isArray, isBoolean, isNil, isValid, merge } from '@visactor/vutils';
import { DataTable, GenerateChartInput, SimpleChartAxisInfo } from '../types/transform';
import { isValidDataTable } from '../utils/data';
import { getFieldIdInCell, getFieldsByRoleType, getRemainedFields } from '../utils/field';
import { DataRole } from '../utils/enum';

export const findRequiredDimensionField = (context: GenerateChartInput, supportedColorFieldNames: string[]) => {
  const { cell, fieldInfo } = context;

  const colorField = supportedColorFieldNames.map(name => cell[name]).filter(Boolean);

  if (colorField.length !== 0) {
    return colorField[0];
  } else {
    const remainedFields = getRemainedFields(cell, fieldInfo);
    const colorField = getFieldsByRoleType(remainedFields, DataRole.DIMENSION);
    if (colorField) {
      return colorField.fieldName;
    } else if (remainedFields?.[0]) {
      return remainedFields[0].fieldName;
    }
  }
  return undefined;
};

export const findRequiredMeasureField = (context: GenerateChartInput, supportedFieldNames: string[]) => {
  const { cell, fieldInfo } = context;

  const sizeField = supportedFieldNames
    .map(name => cell[name])
    .filter(Boolean)
    .flat();

  if (sizeField.length !== 0) {
    return sizeField[0];
  } else {
    const remainedFields = getRemainedFields(cell, fieldInfo);
    const sizeField = getFieldsByRoleType(remainedFields, DataRole.MEASURE);
    if (sizeField) {
      return sizeField.fieldName;
    } else {
      return remainedFields?.[0]?.fieldName;
    }
  }
};

export const formatColorFields = (context: GenerateChartInput, supportedColorFieldNames: string[]) => {
  const { cell } = context;
  const field = findRequiredDimensionField(context, supportedColorFieldNames);

  if (isValid(field)) {
    return {
      cell: {
        ...cell,
        color: field
      }
    };
  }

  return { cell };
};

export const formatSizeFields = (context: GenerateChartInput, supportedSizeFieldNames: string[]) => {
  const { cell } = context;
  const field = findRequiredMeasureField(context, supportedSizeFieldNames);

  if (isValid(field)) {
    return {
      cell: {
        ...cell,
        size: field
      }
    };
  }

  return { cell };
};

export const formatXFields = (context: GenerateChartInput) => {
  const { cell } = context;
  const field = findRequiredDimensionField(context, ['x']);

  if (isValid(field)) {
    return {
      cell: {
        ...cell,
        x: field
      }
    };
  }

  return { cell };
};

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
  const { cell, spec, legends } = context;

  if (
    legends === false ||
    (!legends && !(cell.color || cell.category) && !spec.seriesField && spec.type !== 'common')
  ) {
    return { spec };
  }
  spec.legends = legends ?? [
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

export const commonLegend = (context: GenerateChartInput) => {
  const { cell, spec, legends } = context;

  if (!legends) {
    return { spec };
  }
  spec.legends = legends;

  return { spec };
};

export const theme = (context: GenerateChartInput) => {
  const { chartTheme, spec, background } = context;

  if (typeof chartTheme === 'string') {
    spec.theme = chartTheme;
  } else if (typeof chartTheme === 'object') {
    spec.theme = chartTheme;
  }

  if (spec.theme && spec.theme.colorScheme) {
    spec.color = undefined;
  }

  if (isValid(background)) {
    spec.background = background;
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
    spec.color = COLOR_THEMES.default.slice();
  }

  return { spec };
};

export const commonLabel = (context: GenerateChartInput) => {
  const { spec, fieldInfo, cell, label } = context;
  const { y: celly } = cell;

  if (label !== false) {
    spec.label = handleMaybeArray(label, entry => {
      const labelCfg = { ...entry, visible: true };

      if (isArray(celly) && celly.length > 1) {
      } else if (celly) {
        const field = isArray(celly) ? celly[0] : celly;
        const info = fieldInfo.find(v => v.fieldName === field);
        if (info?.ratioGranularity) {
          labelCfg.formatter = `{${field}:~%}`;
        }
      }

      return labelCfg;
    });
  }

  return { spec };
};

export const labelForDefaultHide = (context: GenerateChartInput) => {
  const { spec, label } = context;

  if (label !== false && isValid(label)) {
    spec.label = handleMaybeArray(label, entry => {
      return {
        ...entry,
        visible: true
      };
    });
  }

  return { spec };
};

export const labelForDefaultShow = (context: GenerateChartInput) => {
  const { spec, label } = context;

  if (label !== false) {
    spec.label = handleMaybeArray(label, entry => {
      return {
        ...entry,
        visible: true
      };
    });
  }

  return { spec };
};

export const indicator = (context: GenerateChartInput) => {
  const { spec, cell, indicator } = context;
  const firstEntry = spec.data.values[0];
  if (!firstEntry || indicator === false) {
    return { spec };
  }
  const valueField = (cell.value ?? cell.y) as string;
  const value = firstEntry[valueField];
  const cat = firstEntry[getFieldIdInCell(cell.radius ?? cell.x)];
  const indicatorCfg = array(indicator)[0];
  const contents = array(indicatorCfg?.content ?? `${(value * 100).toFixed(1)}%`);

  // 暂时没有支持多个指标卡
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
        text: indicatorCfg?.title ?? cat ?? valueField
      }
    },
    content: contents.map(t => {
      return {
        visible: true,
        style: {
          fontSize: 20,
          fill: '#000',
          text: t
        }
      };
    })
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

export const handleMaybeArray = (spec: any, handler: (spec: any) => any) => {
  if (isArray(spec)) {
    return spec.map(handler);
  }
  return handler(spec);
};

const combineTitle = (titleSpec: any) => {
  const titlesByOrient: any = {};

  titleSpec.forEach((title: any) => {
    const { orient } = title;
    if (!titlesByOrient[orient]) {
      titlesByOrient[orient] = [];
    }
    titlesByOrient[orient].push(title);
  });

  const res: any[] = [];

  Object.values(titlesByOrient).forEach((titles: any) => {
    if (titles.length === 2 && titles.every((title: any) => isNil(title.text))) {
      res.push({
        ...titles[0],
        text: titles[0].text,
        subtext: titles[1].text
      });
    } else {
      titles.forEach((title: any) => {
        res.push(title);
      });
    }
  });

  return res;
};

export const addSimpleComponents = (context: GenerateChartInput) => {
  const { title, spec, dataZoom, markArea, markLine, markPoint } = context;

  if (isArray(title) && title.length >= 2) {
    spec.title = combineTitle(title);
  } else if (isValid(title) && title !== false) {
    spec.title = array(title)[0];
  }

  if (isValid(dataZoom) && dataZoom !== false) {
    spec.dataZoom = dataZoom;
  }

  if (isValid(markPoint) && markPoint !== false) {
    spec.markPoint = handleMaybeArray(markPoint, entry => {
      const { label, ...res } = entry;
      return {
        ...res,
        visible: true,
        itemContent: {
          confine: true, // label  限制在图表区域
          type: 'text',
          text: {
            text: label
          }
        }
      };
    });
  }

  if (isValid(markLine) && markLine !== false) {
    spec.markLine = handleMaybeArray(markLine, entry => {
      const { label, ...res } = entry;
      return {
        ...res,
        visible: true,
        label: {
          text: entry.label
        }
      };
    });
  }

  if (isValid(markArea) && markArea !== false) {
    spec.markArea = handleMaybeArray(markArea, entry => {
      const { label, ...res } = entry;
      return {
        ...res,
        visible: true,
        label: {
          text: entry.label
        }
      };
    });
  }

  return { spec };
};

export const parseAxesOfChart = (
  context: GenerateChartInput,
  defaultAxesCfg: {
    defaultConfig: any;
    userConfig?: any;
    /**
     * 多个filters 表示按照优先级去寻找合适的轴配置，第一个条件的优先级最高
     */
    filters: ((axes: SimpleChartAxisInfo) => any)[];
  }[]
) => {
  const finalAxes: any[] = [];
  const { axes } = context;

  defaultAxesCfg.forEach(({ defaultConfig, userConfig, filters }) => {
    let axisCfg: any;

    if (axes === false) {
      axisCfg = { visible: false, hasGrid: false, hasAxisLine: false, hasTick: false, hasLabel: false };
    } else if (axes) {
      const axesArray = array(axes) as SimpleChartAxisInfo[];

      for (let i = 0; i < filters.length; i++) {
        axisCfg = axesArray.find(filters[i]);

        if (axisCfg) {
          break;
        }
      }
    }

    if (axisCfg) {
      const { type, orient, visible, hasGrid, title, hasAxisLine, hasTick, hasLabel } = axisCfg as any;
      const generatedAxis: any = {};

      if (isValid(type)) {
        generatedAxis.type = type;
      }
      if (isValid(type)) {
        generatedAxis.orient = orient;
      }

      if (isBoolean(visible)) {
        generatedAxis.visible = visible;
      }
      if (isBoolean(hasGrid)) {
        generatedAxis.grid = {
          visible: hasGrid
        };
      }
      if (isBoolean(hasAxisLine)) {
        generatedAxis.domainLine = {
          visible: hasAxisLine
        };
      }
      if (isBoolean(hasTick)) {
        generatedAxis.tick = {
          visible: hasTick
        };
      }
      if (isBoolean(hasLabel)) {
        generatedAxis.label = {
          visible: hasLabel
        };
      }
      if (isValid(title)) {
        generatedAxis.title = {
          visible: true,
          text: title
        };
      }

      finalAxes.push(merge(defaultConfig, generatedAxis, userConfig));
    } else {
      finalAxes.push(merge(defaultConfig, userConfig));
    }
  });

  return finalAxes;
};
