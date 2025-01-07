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

export const getChartAxisType = (chartSpec: any) => {
  if (
    [
      'bar',
      'bar3d',
      'line',
      'scatter',
      'area',
      'boxPlot',
      'histogram',
      'histogram3d',
      'mosaic',
      'rangeArea',
      'rangeColumn',
      'rangeColumn3d',
      'waterfall'
    ].includes(chartSpec.type)
  ) {
    return 'cartesian';
  }

  if (['radar', 'rose'].includes(chartSpec.type)) {
    return 'polar';
  }

  return 'none';
};

export const aliasByComponentType: Record<
  string,
  {
    isArray?: boolean;
    aliasMap?: Record<string, { appendSpec?: any; filter?: (entry: any) => boolean }>;
  }
> = {
  axes: {
    isArray: true,
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
      },
      allAxis: {
        filter: (entry: any) => {
          return true;
        }
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
      lineSeries: {
        appendSpec: {
          type: 'line'
        }
      },
      areaSeries: {
        appendSpec: {
          type: 'area'
        }
      },
      barSeries: {
        appendSpec: {
          type: 'bar'
        }
      },
      bar3dSeries: {
        appendSpec: {
          type: 'bar3d'
        }
      },
      pieSeries: {
        appendSpec: {
          type: 'pie'
        }
      },
      pie3dSeries: {
        appendSpec: {
          type: 'pie3d'
        }
      },
      scatterSeries: {
        appendSpec: {
          type: 'scatter'
        }
      },
      funnelSeries: {
        appendSpec: {
          type: 'funnel'
        }
      },
      funnel3dSeries: {
        appendSpec: {
          type: 'funnel3d'
        }
      },
      mapSeries: {
        appendSpec: {
          type: 'map'
        }
      },
      radarSeries: {
        appendSpec: {
          type: 'radar'
        }
      },
      wordCloudSeries: {
        appendSpec: {
          type: 'wordCloud'
        }
      },
      wordCloud3dSeries: {
        appendSpec: {
          type: 'wordCloud3d'
        }
      },
      heatmapSeries: {
        appendSpec: {
          type: 'heatmap'
        }
      },
      treemapSeries: {
        appendSpec: {
          type: 'treemap'
        }
      },
      gaugeSeries: {
        appendSpec: {
          type: 'gauge'
        }
      },
      rangeColumnSeries: {
        appendSpec: {
          type: 'rangeColumn'
        }
      },
      rangeColumn3dSeries: {
        appendSpec: {
          type: 'rangeColumn3d'
        }
      },
      rangeAreaSeries: {
        appendSpec: {
          type: 'rangeArea'
        }
      },
      dotSeries: {
        appendSpec: {
          type: 'dot'
        }
      },
      geoSeries: {
        appendSpec: {
          type: 'geo'
        }
      },
      linkSeries: {
        appendSpec: {
          type: 'link'
        }
      },
      roseSeries: {
        appendSpec: {
          type: 'rose'
        }
      },
      circularProgressSeries: {
        appendSpec: {
          type: 'circularProgress'
        }
      },
      linearProgressSeries: {
        appendSpec: {
          type: 'linearProgress'
        }
      },
      boxPlotSeries: {
        appendSpec: {
          type: 'boxPlot'
        }
      },
      sankeySeries: {
        appendSpec: {
          type: 'sankey'
        }
      },
      gaugePointerSeries: {
        appendSpec: {
          type: 'gaugePointer'
        }
      },
      sunburstSeries: {
        appendSpec: {
          type: 'sunburst'
        }
      },
      circlePackingSeries: {
        appendSpec: {
          type: 'circlePacking'
        }
      },
      waterfallSeries: {
        appendSpec: {
          type: 'waterfall'
        }
      },
      correlationSeries: {
        appendSpec: {
          type: 'correlation'
        }
      },
      liquidSeries: {
        appendSpec: {
          type: 'liquid'
        }
      },
      vennSeries: {
        appendSpec: {
          type: 'venn'
        }
      },
      mosaicSeries: {
        appendSpec: {
          type: 'mosaic'
        }
      }
    }
  },

  scales: {
    isArray: true
  },
  customMark: {
    isArray: true
  },
  background: {
    isArray: false
  },
  player: {
    isArray: false
  },
  crosshair: {},
  region: {
    isArray: true
  },
  title: {},
  markLine: {},
  markArea: {},
  markPoint: {},
  seriesStyle: {
    isArray: true
  },
  tooltip: {
    isArray: false
  },
  brush: {
    isArray: false
  }
};

export const removeUnneedArrayInSpec = (leafSpec: any, compKey: string, parentKeyPath: string) => {
  if (compKey === parentKeyPath) {
    return isArray(leafSpec) ? leafSpec[0] : leafSpec;
  }

  return leafSpec;
};

export const findComponentNameByAlias = (alias: string) => {
  if (aliasByComponentType[alias]) {
    return alias;
  }

  const comp = Object.keys(aliasByComponentType).find(key => {
    return !!aliasByComponentType[key]?.aliasMap?.[alias];
  });

  if (comp) {
    return comp;
  }

  return alias;
};

const ALIAS_NAME_KEY = '_alias_name';

export const parseAliasOfPath = (parentKeyPath: string, compKey: string, chartSpec: any, leafSpec: any) => {
  const subPaths = parentKeyPath.split('.');
  const aliasOptions = aliasByComponentType[compKey];

  if (!aliasOptions) {
    return { parentKeyPath };
  }
  const aliasName = subPaths[0].replace(/\[\d\]/, '');
  const isValidAlias = aliasOptions && aliasName && !!aliasOptions.aliasMap?.[aliasName];
  let newLeafSpec = leafSpec;

  if (subPaths.length === 1) {
    newLeafSpec = isArray(leafSpec) ? leafSpec[0] : leafSpec;
  }
  const isTargetArray = (chartSpec[compKey] && isArray(chartSpec[compKey])) || aliasOptions?.isArray;

  if (/\[\d\]/.exec(subPaths[0])) {
    // 路径中包含了序号
    if (!isTargetArray) {
      subPaths[0] = compKey;
    } else {
      subPaths[0] = subPaths[0].replace(aliasName, compKey);
    }
  } else {
    // 路径中没包含序号
    if (isTargetArray) {
      subPaths[0] = `${compKey}[0]`;
    } else {
      subPaths[0] = subPaths[0].replace(aliasName, compKey);
    }
  }

  if (!isValidAlias) {
    return { parentKeyPath: subPaths.join('.'), leafSpec: newLeafSpec };
  }
  const appendSpec = { ...aliasOptions.aliasMap[aliasName].appendSpec, [ALIAS_NAME_KEY]: aliasName };
  const appendPath: string[][] = [];

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
      let specifiedComps = chartSpec[compKey].filter((comp: any) => comp[ALIAS_NAME_KEY] === aliasName);

      if (!specifiedComps.length) {
        specifiedComps = chartSpec[compKey].filter(isMatchComp);
      }

      if (specifiedComps.length) {
        specifiedComps.forEach((comp: any) => {
          const index = chartSpec[compKey].indexOf(comp);

          const appended = [...subPaths];

          appended[0] = `${compKey}[${index}]`;

          appendPath.push(appended);
        });
      } else if (isValidAlias) {
        const appended = [...subPaths];

        appended[0] = `${compKey}[${chartSpec[compKey].length}]`;

        appendPath.push(appended);
      }
    } else {
      // 单个组件的配置，判断是否符合条件
      if (isMatchComp(chartSpec[compKey])) {
        const appended = [...subPaths];

        appended[0] = `${compKey}`;

        appendPath.push(appended);
      } else {
        // 扩展成数组
        chartSpec[compKey] = [chartSpec[compKey]];
        const appended = [...subPaths];

        appended[0] = `${compKey}[1]`;

        appendPath.push(appended);
      }
    }
  } else if (aliasName === 'allAxis') {
    // 这种情况需要特殊处理
    const axisType = getChartAxisType(chartSpec);

    if (axisType === 'cartesian') {
      return {
        aliasName: aliasName,
        appendContent: [
          {
            appendPath: 'axes[0]',
            appendSpec: { ...aliasByComponentType.axes.aliasMap.xAxis.appendSpec },
            parentKeyPath: ['axes[0]', ...subPaths.slice(1)].join('.')
          },
          {
            appendPath: 'axes[1]',
            appendSpec: { ...aliasByComponentType.axes.aliasMap.yAxis.appendSpec },
            parentKeyPath: ['axes[1]', ...subPaths.slice(1)].join('.')
          }
        ],
        parentKeyPath: subPaths.join('.')
      };
    } else if (axisType === 'polar') {
      return {
        aliasName: aliasName,
        appendContent: [
          {
            appendPath: 'axes[0]',
            appendSpec: { ...aliasByComponentType.axes.aliasMap.radiusAxis.appendSpec },
            parentKeyPath: ['axes[0]', ...subPaths.slice(1)].join('.')
          },
          {
            appendPath: 'axes[1]',
            appendSpec: { ...aliasByComponentType.axes.aliasMap.angleAxis.appendSpec },
            parentKeyPath: ['axes[1]', ...subPaths.slice(1)].join('.')
          }
        ],
        parentKeyPath: subPaths.join('.')
      };
    }
  } else {
    appendPath.push(subPaths);
  }

  return {
    aliasName: aliasName,
    appendContent: appendPath.map(path => {
      return {
        appendPath: path[0],
        appendSpec,
        parentKeyPath: path.join('.')
      };
    }),
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
  const { spec } = appendSpec;
  const newSpec = merge({}, prevSpec);

  if (isPlainObject(spec)) {
    Object.keys(spec).forEach(key => {
      let parentKeyPath: string = key;
      let updatedKeyPaths: string[] = null;
      let leafSpec = (spec as any)[key];
      const aliasName = parentKeyPath.split('.')[0].replace(/\[\d\]/, '');
      const compKey = findComponentNameByAlias(aliasName);

      if (compKey.startsWith('series') && newSpec.type !== 'common' && !newSpec.series) {
        leafSpec = removeUnneedArrayInSpec((spec as any)[key], 'series', key);

        parentKeyPath = parentKeyPath.indexOf('.') > 0 ? parentKeyPath.slice(parentKeyPath.indexOf('.') + 1) : '';
      } else {
        const aliasResult = parseAliasOfPath(parentKeyPath, compKey, newSpec, leafSpec);

        if (aliasResult.appendContent) {
          aliasResult.appendContent.forEach(entry => {
            set(newSpec, entry.appendPath, entry.appendSpec);
          });

          if (aliasResult.appendContent.length) {
            updatedKeyPaths = aliasResult.appendContent.map(entry => entry.parentKeyPath);
          }
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

      (updatedKeyPaths ?? [parentKeyPath]).forEach(kp => {
        if (kp) {
          set(newSpec, kp, leafSpec);
        } else {
          merge(newSpec, leafSpec);
        }
      });
    });
  }

  return {
    newSpec,
    code: 0
  };
};
