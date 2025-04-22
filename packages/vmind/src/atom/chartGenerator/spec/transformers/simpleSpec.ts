import { array, isArray, isNil } from '@visactor/vutils';
import type { GenerateChartCellContext } from '../../type';

const handleMaybeArray = (spec: any, handler: (spec: any) => any) => {
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

export const fomartSimpleSpec = (context: GenerateChartCellContext) => {
  const { simpleVChartSpec, spec } = context;

  if (simpleVChartSpec) {
    if (simpleVChartSpec.legends) {
      spec.legends = simpleVChartSpec.legends;
    } else if ('legends' in spec) {
      delete spec.legends;
    }
    if (simpleVChartSpec.title) {
      spec.title =
        isArray(simpleVChartSpec.title) && simpleVChartSpec.title.length >= 2
          ? combineTitle(simpleVChartSpec.title)
          : simpleVChartSpec.title;
    } else if ('title' in spec) {
      delete spec.title;
    }

    if (simpleVChartSpec.axes) {
      if (spec.axes) {
        array(simpleVChartSpec.axes).forEach(axis => {
          const { hasGrid, type, orient } = axis;
          const specAxis = spec.axes.find((a: any) => a.type === type && a.orient === orient);

          if (specAxis) {
            specAxis.grid = { ...specAxis.grid, visible: hasGrid };
          } else {
            spec.axes.push({
              ...axis,
              grid: { visible: hasGrid }
            });
          }
        });

        spec.axes = spec.axes.filter((specAxis: any) => {
          return simpleVChartSpec.axes.some((axis: any) => {
            return axis.type === specAxis.type && axis.orient === specAxis.orient;
          });
        });
      } else {
        spec.axes = array(simpleVChartSpec.axes).map(axis => {
          const { hasGrid, ...others } = axis;
          return {
            ...others,
            ...(hasGrid ? { grid: { visible: true } } : {})
          };
        });
      }
    } else if (spec.axes) {
      spec.axes = spec.axes.map((axis: any) => {
        return {
          ...axis,
          visible: false
        };
      });
    }

    if (simpleVChartSpec.dataZoom) {
      spec.dataZoom = simpleVChartSpec.dataZoom;
    } else {
      delete spec.dataZoom;
    }

    if (simpleVChartSpec.markPoint) {
      spec.markPoint = handleMaybeArray(simpleVChartSpec.markPoint, entry => {
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

    if (simpleVChartSpec.markLine) {
      spec.markLine = handleMaybeArray(simpleVChartSpec.markLine, entry => {
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

    if (simpleVChartSpec.markArea) {
      spec.markArea = handleMaybeArray(simpleVChartSpec.markArea, entry => {
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

    if (simpleVChartSpec.label) {
      spec.label = handleMaybeArray(simpleVChartSpec.label, entry => {
        return {
          ...entry,
          visible: true
        };
      });
    } else if (spec.label) {
      delete spec.label;
    }

    if (simpleVChartSpec.indicator) {
      const formatIndicator = (entry: any) => {
        return {
          title: {
            style: {
              text: entry.title
            }
          },
          content: handleMaybeArray(entry.content, (t: string) => {
            return {
              style: {
                text: t
              }
            };
          })
        };
      };
      spec.indicator = handleMaybeArray(simpleVChartSpec.indicator, formatIndicator);
    } else if (spec.indicator) {
      delete spec.indicator;
    }

    if (simpleVChartSpec.background) {
      spec.background = simpleVChartSpec.background;
    }

    if (simpleVChartSpec.palette && simpleVChartSpec.palette.length) {
      spec.color = simpleVChartSpec.palette;
    }
  }

  return { spec };
};
