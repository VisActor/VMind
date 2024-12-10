import { isArray, isNil } from '@visactor/vutils';

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
    appendPath: subPaths[0],
    path: subPaths.join('.')
  };
};
