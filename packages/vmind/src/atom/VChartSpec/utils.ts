import { isArray, isNil, isObject, isPlainObject, isString, isValid, merge } from '@visactor/vutils';
import type { AppendSpecInfo } from '../../types/atom';
import { set } from '../../utils/set';

export const validSeriesForChart: Record<
  string,
  {
    series: string[];
  }
> = {
  line: {
    series: ['line']
  },
  area: {
    series: ['area']
  },
  bar: {
    series: ['bar']
  },
  bar3d: {
    series: ['bar3d']
  },
  pie: {
    series: ['pie']
  },
  pie3d: {
    series: ['pie3d']
  },
  scatter: {
    series: ['scatter']
  },
  funnel: {
    series: ['funnel']
  },
  funnel3d: {
    series: ['funnel3d']
  },
  map: {
    series: ['map']
  },
  radar: {
    series: ['radar']
  },
  wordCloud: {
    series: ['wordCloud']
  },
  wordCloud3d: {
    series: ['wordCloud3d']
  },
  heatmap: {
    series: ['heatmap']
  },
  treemap: {
    series: ['treemap']
  },
  gauge: {
    series: ['gauge', 'gaugePointer']
  },
  rangeColumn: {
    series: ['rangeColumn']
  },
  rangeColumn3d: {
    series: ['rangeColumn3d']
  },
  rangeArea: {
    series: ['rangeArea']
  },
  sequence: {
    series: ['dot', 'link']
  },
  rose: {
    series: ['rose']
  },
  circularProgress: {
    series: ['circularProgress']
  },
  linearProgress: {
    series: ['linearProgress']
  },
  boxPlot: {
    series: ['boxPlot']
  },
  sankey: {
    series: ['sankey']
  },
  gaugePointer: {
    series: ['gaugePointer']
  },
  sunburst: {
    series: ['sunburst']
  },
  circlePacking: {
    series: ['circlePacking']
  },
  waterfall: {
    series: ['waterfall']
  },
  correlation: {
    series: ['correlation']
  },
  liquid: {
    series: ['liquid']
  },
  venn: {
    series: ['venn']
  },
  mosaic: {
    series: ['mosaic']
  },
  histogram: {
    series: ['bar']
  },
  histogram3d: {
    series: ['bar3d']
  },
  pictogram: {
    series: ['pictogram']
  }
};

export const aliasByComponentType: Record<
  string,
  {
    isArray?: boolean;
    aliasMap: Record<string, { appendSpec?: any; filter?: (entry: any) => boolean }>;
  }
> = {
  axes: {
    aliasMap: {
      xAxis: {
        appendSpec: { orient: 'bottom' }
      },
      yAxis: {
        appendSpec: { orient: 'left' }
      },
      radiusAxis: {
        appendSpec: { orient: 'radius' }
      },
      angleAxis: {
        appendSpec: { orient: 'angle' }
      },
      leftAxis: {
        appendSpec: { orient: 'left' }
      },
      rightAxis: {
        appendSpec: { orient: 'right' }
      },
      topAxis: {
        appendSpec: { orient: 'top' }
      },
      bottomAxis: {
        appendSpec: { orient: 'bottom' }
      }
    }
  },

  legends: {
    aliasMap: {
      discreteLegend: {
        filter: (entry: any) => {
          return isNil(entry.type) || entry.type === 'discrete';
        }
      },
      colorLegend: {
        appendSpec: { type: 'color' }
      },

      sizeLegend: {
        appendSpec: { type: 'size' }
      }
    }
  },

  dataZoom: {
    aliasMap: {
      yDataZoom: {
        appendSpec: { orient: 'left' },
        filter: (entry: any) => {
          return entry.orient === 'left';
        }
      },
      xDataZoom: {
        appendSpec: { orient: 'bottom' },
        filter: (entry: any) => {
          return entry.orient === 'bottom';
        }
      }
    }
  },

  scrollBar: {
    aliasMap: {
      yScrollbar: {
        appendSpec: { orient: 'right' },
        filter: (entry: any) => {
          return entry.orient === 'right';
        }
      },
      xScrollbar: {
        appendSpec: { orient: 'bottom' },
        filter: (entry: any) => {
          return entry.orient === 'bottom';
        }
      }
    }
  },

  series: {
    isArray: true,
    aliasMap: {
      line: {
        appendSpec: { type: 'line' }
      },
      area: {
        appendSpec: { type: 'area' }
      },
      bar: {
        appendSpec: { type: 'bar' }
      },
      bar3d: {
        appendSpec: { type: 'bar3d' }
      },
      pie: {
        appendSpec: { type: 'pie' }
      },
      pie3d: {
        appendSpec: { type: 'pie3d' }
      },
      scatter: {
        appendSpec: { type: 'scatter' }
      },
      funnel: {
        appendSpec: { type: 'funnel' }
      },
      funnel3d: {
        appendSpec: { type: 'funnel3d' }
      },
      map: {
        appendSpec: { type: 'map' }
      },
      radar: {
        appendSpec: { type: 'radar' }
      },
      wordCloud: {
        appendSpec: { type: 'wordCloud' }
      },
      wordCloud3d: {
        appendSpec: { type: 'wordCloud3d' }
      },
      heatmap: {
        appendSpec: { type: 'heatmap' }
      },
      treemap: {
        appendSpec: { type: 'treemap' }
      },
      gauge: {
        appendSpec: { type: 'gauge' }
      },
      rangeColumn: {
        appendSpec: { type: 'rangeColumn' }
      },
      rangeColumn3d: {
        appendSpec: { type: 'rangeColumn3d' }
      },
      rangeArea: {
        appendSpec: { type: 'rangeArea' }
      },
      dot: {
        appendSpec: { type: 'dot' }
      },
      geo: {
        appendSpec: { type: 'geo' }
      },

      link: {
        appendSpec: { type: 'link' }
      },

      rose: {
        appendSpec: {
          type: 'rose'
        }
      },
      circularProgress: {
        appendSpec: {
          type: 'circularProgress'
        }
      },
      linearProgress: { appendSpec: { type: 'linearProgress' } },
      boxPlot: { appendSpec: { type: 'boxPlot' } },
      sankey: { appendSpec: { type: 'sankey' } },
      gaugePointer: { appendSpec: { type: 'gaugePointer' } },
      sunburst: { appendSpec: { type: 'sunburst' } },
      circlePacking: { appendSpec: { type: 'circlePacking' } },
      waterfall: { appendSpec: { type: 'waterfall' } },
      correlation: { appendSpec: { type: 'correlation' } },
      liquid: { appendSpec: { type: 'liquid' } },
      venn: { appendSpec: { type: 'venn' } },
      mosaic: { appendSpec: { type: 'mosaic' } }
    }
  }
};

export const removeUnneedArrayInSpec = (leafSpec: any, compKey: string, parentKeyPath: string) => {
  return leafSpec[compKey]
    ? isArray(leafSpec[compKey])
      ? leafSpec[compKey][0]
      : leafSpec[compKey]
    : parentKeyPath in leafSpec
    ? leafSpec[parentKeyPath]
    : `${compKey}[0]` in leafSpec
    ? leafSpec[`${compKey}[0]`]
    : leafSpec;
};

export const addArrayInSpec = (leafSpec: any, compKey: string, parentKeyPath: string) => {
  return leafSpec[compKey]
    ? isArray(leafSpec[compKey])
      ? leafSpec[compKey][0]
      : leafSpec[compKey]
    : parentKeyPath in leafSpec
    ? leafSpec[parentKeyPath]
    : leafSpec;
};

const ALIAS_NAME_KEY = '_alias_name';

export const parseAliasOfPath = (parentKeyPath: string, aliasKeyPath: string, chartSpec: any, leafSpec: any) => {
  const aliasName = aliasKeyPath ? aliasKeyPath.split('.')[0] : null;
  const subPaths = parentKeyPath.split('.');
  const compKey = subPaths[0].replace(/\[\d\]/, '');
  const aliasOptions = aliasByComponentType[compKey];
  const isValidAlias = aliasOptions && aliasName && !!aliasOptions.aliasMap[aliasName];

  if (!isValidAlias) {
    if (chartSpec[compKey]) {
      // 组件配置没有固定为数组类型的时候
      if (isArray(chartSpec[compKey])) {
        if (subPaths[0] === compKey) {
          subPaths[0] = `${compKey}[0]`;
        }
        return {
          parentKeyPath: subPaths.join('.'),
          leafSpec: addArrayInSpec(leafSpec, compKey, parentKeyPath)
        };
      }

      if (subPaths[0] !== compKey) {
        subPaths[0] = compKey;
      }
      return {
        parentKeyPath: subPaths.join('.'),
        leafSpec: removeUnneedArrayInSpec(leafSpec, compKey, parentKeyPath)
      };
    } else if (aliasOptions && aliasOptions.isArray) {
      // 像系列这种只支持数组类型的，需要扩展成数组
      if (subPaths[0] === compKey) {
        subPaths[0] = `${compKey}[0]`;
      }
      return {
        parentKeyPath: subPaths.join('.'),
        leafSpec: addArrayInSpec(leafSpec, compKey, parentKeyPath)
      };
    }

    return { parentKeyPath };
  }
  const appendSpec = { ...aliasOptions.aliasMap[aliasName].appendSpec, [ALIAS_NAME_KEY]: aliasName };

  if (chartSpec[compKey]) {
    const isMatchComp = (comp: any) => {
      const aliasEntry = aliasOptions.aliasMap[aliasName];

      if (aliasEntry.filter) {
        return aliasEntry.filter(comp);
      } else if (aliasEntry.appendSpec) {
        return Object.keys(aliasEntry.appendSpec).every((key: string) => {
          return comp[key] === aliasEntry.appendSpec[key];
        });
      }

      return false;
    };

    if (isArray(chartSpec[compKey])) {
      // 固定为array类型
      let specifiedComp = chartSpec[compKey].find((comp: any) => comp[ALIAS_NAME_KEY] === aliasName);

      if (!specifiedComp) {
        specifiedComp = chartSpec[compKey].find(isMatchComp);
      }

      if (specifiedComp) {
        const index = chartSpec[compKey].indexOf(specifiedComp);

        subPaths[0] = `${compKey}[${index}]`;
      } else if (isValidAlias) {
        subPaths[0] = `${compKey}[${chartSpec[compKey].length}]`;
      }
    } else {
      // 单个组件的配置，判断是否符合条件
      if (isMatchComp(chartSpec[compKey])) {
        subPaths[0] = `${compKey}`;
      } else {
        // 扩展成数组
        chartSpec[compKey] = [chartSpec[compKey]];
        subPaths[0] = `${compKey}[1]`;
      }
    }
  }

  return {
    appendSpec,
    aliasName: aliasName,
    appendPath: subPaths[0],
    parentKeyPath: subPaths.join('.')
  };
};

export const checkDuplicatedKey = (parentPath: string, key: string) => {
  let isDuplicated = false;

  if (parentPath === key) {
    return {
      remainKeyPath: ''
    };
  }

  if (/^\d$/.exec(key)) {
    const indexString = `[${key}]`;

    if (parentPath.startsWith(indexString)) {
      isDuplicated = true;

      if (isDuplicated) {
        return {
          remainKeyPath: parentPath.substring(indexString.length + 1)
        };
      }
    }
  }

  if (parentPath.startsWith(`${key}`)) {
    let remainKeyPath = parentPath.substring(key.length);

    if (remainKeyPath[0] === '.') {
      remainKeyPath = remainKeyPath.substring(1);
    }

    return {
      remainKeyPath
    };
  } else if (parentPath.includes(`.${key}`)) {
    const str = `.${key}`;
    let remainKeyPath = parentPath.substring(parentPath.indexOf(str) + str.length);

    if (remainKeyPath[0] === '.') {
      remainKeyPath = remainKeyPath.substring(1);
    }

    return {
      remainKeyPath
    };
  }

  return null;
};

export const reduceDuplicatedPath = (parentPath: string, spec: any): any => {
  if (isPlainObject(spec) && parentPath) {
    const keys = Object.keys(spec);

    if (keys.length === 1) {
      const res = checkDuplicatedKey(parentPath, keys[0]);

      return res ? reduceDuplicatedPath(res.remainKeyPath, (spec as any)[keys[0]]) : spec;
    } else if (keys.length > 1) {
      const fixedKey = keys.find(k => checkDuplicatedKey(parentPath, k));

      if (fixedKey) {
        const res = checkDuplicatedKey(parentPath, fixedKey);

        return reduceDuplicatedPath(res.remainKeyPath, (spec as any)[fixedKey]);
      }
    }
  } else if (isArray(spec) && parentPath) {
    const res = /^\[((\d)+)\]/.exec(parentPath);

    if (res) {
      const remainPath = parentPath.substring(res[0].length + 1);
      const val = spec[+res[1]] ?? spec[spec.length - 1];

      return remainPath ? reduceDuplicatedPath(remainPath, val) : val;
    }
  }

  return spec;
};

/**
 * 将大模型返回的spec中的函数字符串转换成函数
 * @param spec 转换后的spec
 * @returns
 */
export const convertFunctionString = (spec: any): any => {
  if (isPlainObject(spec)) {
    const newSpec: any = {};

    Object.keys(spec).forEach(key => {
      newSpec[key] = convertFunctionString((spec as any)[key]);
    });

    return newSpec;
  } else if (isArray(spec)) {
    return spec.map(convertFunctionString);
  }

  if (isString(spec)) {
    if (spec.includes('=>') || spec.includes('function')) {
      try {
        // 将函数自浮窗转换成可执行的函数
        return new Function(`return (${spec})`)();
      } catch (e) {
        return spec;
      }
    }
  }

  return spec;
};

export const mergeAppendSpec = (prevSpec: any, appendSpec: AppendSpecInfo) => {
  const { aliasKeyPath = '' } = appendSpec;
  let { parentKeyPath = '', leafSpec } = appendSpec;
  let newSpec = merge({}, prevSpec);

  if (parentKeyPath) {
    if (parentKeyPath.startsWith('series') && newSpec.type !== 'common' && !newSpec.series) {
      leafSpec = removeUnneedArrayInSpec(leafSpec, 'series', parentKeyPath);

      parentKeyPath = parentKeyPath.indexOf('.') > 0 ? parentKeyPath.slice(parentKeyPath.indexOf('.') + 1) : '';
    } else {
      const aliasResult = parseAliasOfPath(parentKeyPath, aliasKeyPath, newSpec, leafSpec);

      if (aliasResult.appendSpec && aliasResult.appendPath) {
        set(newSpec, aliasResult.appendPath, aliasResult.appendSpec);
      }

      if (isValid(aliasResult.parentKeyPath)) {
        parentKeyPath = aliasResult.parentKeyPath;
      }

      if (isValid(aliasResult.leafSpec)) {
        leafSpec = aliasResult.leafSpec;
      }

      leafSpec = convertFunctionString(
        reduceDuplicatedPath(
          parentKeyPath,
          aliasResult.aliasName ? reduceDuplicatedPath(aliasResult.aliasName, leafSpec) : leafSpec
        )
      );
    }

    if (parentKeyPath) {
      set(newSpec, parentKeyPath, leafSpec);
    } else {
      merge(newSpec, leafSpec);
    }
  } else {
    newSpec = merge(newSpec, leafSpec);
  }

  return {
    newSpec,
    code: 0
  };
};
