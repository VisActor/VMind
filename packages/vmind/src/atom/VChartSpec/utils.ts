import { isArray, isNil, isObject, isPlainObject, isString, isValid, merge } from '@visactor/vutils';
import type { AppendSpecInfo } from '../../types/atom';
import { set } from '../../utils/set';

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

const ALIAS_NAME_KEY = '_alias_name';

export const parseRealPath = (path: string, aliasKeyPath: string, spec: any) => {
  if (!aliasKeyPath) {
    return { path };
  }

  const topKeyPath = aliasKeyPath.split('.')[0];
  const subPaths = path.split('.');
  const compKey = subPaths[0].replace(/\[\d\]/, '');

  if (!aliasByComponentType[compKey]) {
    return { path };
  }
  const aliasOptions = aliasByComponentType[compKey];
  const isValidAlias = !!aliasOptions.aliasMap[topKeyPath];

  if (!isValidAlias) {
    if (spec[compKey]) {
      if (!isArray(spec[compKey])) {
        subPaths[0] = compKey;
        return {
          path: subPaths.join('.')
        };
      }
    }

    return { path };
  }
  const appendSpec = { ...aliasOptions.aliasMap[topKeyPath].appendSpec, [ALIAS_NAME_KEY]: topKeyPath };

  if (spec[compKey]) {
    const isMatchComp = (comp: any) => {
      const aliasEntry = aliasOptions.aliasMap[topKeyPath];

      if (aliasEntry.filter) {
        return aliasEntry.filter(comp);
      } else if (aliasEntry.appendSpec) {
        return Object.keys(aliasEntry.appendSpec).every((key: string) => {
          return comp[key] === aliasEntry.appendSpec[key];
        });
      }

      return false;
    };

    if (isArray(spec[compKey])) {
      // 固定为array类型
      let specifiedComp = spec[compKey].find((comp: any) => comp[ALIAS_NAME_KEY] === topKeyPath);

      if (!specifiedComp) {
        specifiedComp = spec[compKey].find(isMatchComp);
      }

      if (specifiedComp) {
        const index = spec[compKey].indexOf(specifiedComp);

        subPaths[0] = `${compKey}[${index}]`;
      } else if (isValidAlias) {
        subPaths[0] = `${compKey}[${spec[compKey].length}]`;
      }
    } else {
      // 单个组件的配置，判断是否符合条件
      if (isMatchComp(spec[compKey])) {
        subPaths[0] = `${compKey}`;
      } else {
        // 扩展成数组
        spec[compKey] = [spec[compKey]];
        subPaths[0] = `${compKey}[1]`;
      }
    }
  }

  return {
    appendSpec,
    aliasName: topKeyPath,
    appendPath: subPaths[0],
    path: subPaths.join('.')
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
    let aliasResult = parseRealPath(parentKeyPath, aliasKeyPath, newSpec);

    if (aliasResult.appendSpec && aliasResult.appendPath) {
      if (aliasResult.appendPath.includes('series') && !newSpec.series) {
        // 系列比较特殊，默认是打平在第一层的
        leafSpec = leafSpec.series
          ? isArray(leafSpec.series)
            ? leafSpec.series[0]
            : leafSpec.series
          : parentKeyPath in leafSpec
          ? leafSpec[parentKeyPath]
          : leafSpec;
        parentKeyPath = parentKeyPath.slice(parentKeyPath.indexOf('.') + 1);
        aliasResult = { path: parentKeyPath };
      } else {
        set(newSpec, aliasResult.appendPath, aliasResult.appendSpec);
      }
    }

    const finalParentKeyPath = aliasResult.path ?? parentKeyPath;

    set(
      newSpec,
      finalParentKeyPath,
      convertFunctionString(
        reduceDuplicatedPath(
          finalParentKeyPath,
          aliasResult.aliasName ? reduceDuplicatedPath(aliasResult.aliasName, leafSpec) : leafSpec
        )
      )
    );
  } else {
    newSpec = merge(newSpec, leafSpec);
  }

  return {
    newSpec,
    code: 0
  };
};
