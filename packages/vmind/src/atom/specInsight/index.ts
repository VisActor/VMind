import type { SpecInsightCtx, SpecInsightOptions } from '../../types';
import { AtomName } from '../../types/atom';
import { BaseAtom } from '../base';
import { isNumber, isValidNumber, merge } from '@visactor/vutils';
import { InsightType } from '../dataInsight/type';
import { getCellFromSpec } from '../../utils/spec';
import { TrendType } from '../dataInsight/algorithms/statistics';
import { isStackChart } from '../dataInsight/utils';
import { Factory } from '../../core/factory';
import type { BaseAtomConstructor } from '../../types';
import type { DataItem } from '@visactor/generate-vchart';
import VChart from '@visactor/vchart';
// 辅助函数：通用值比较
function compareValues(a: any, b: any): number {
  // 如果是日期字符串，转换为时间戳比较
  if (isDateString(a) && isDateString(b)) {
    return new Date(a).getTime() - new Date(b).getTime();
  }
  // 默认按数字或字符串比较
  return a > b ? 1 : a < b ? -1 : 0;
}

// 辅助函数：检测是否是日期字符串
function isDateString(value: any): boolean {
  return typeof value === 'string' && (/^\d{4}-\d{2}-\d{2}$/.test(value) || /^[A-Za-z]{3}-\d{2}$/.test(value));
}
export class SpecInsightAtom extends BaseAtom<SpecInsightCtx, SpecInsightOptions> {
  name = AtomName.SPEC_INSIGHT;

  isLLMAtom: boolean = false;

  constructor(context: SpecInsightCtx, option: SpecInsightOptions) {
    super(context, option);
  }

  buildDefaultContext(context: SpecInsightCtx): SpecInsightCtx {
    return merge(
      {},
      {
        spec: {},
        insights: []
      },
      context
    );
  }

  buildDefaultOptions(): SpecInsightOptions {
    return {
      ...super.buildDefaultOptions(),
      defaultMarkerLineStyle: {
        stroke: '#000',
        lineWidth: 1,
        pickStrokeBuffer: 10
      },
      defaultMarkerSymbolStyle: {
        fill: '#000',
        lineWidth: 0,
        stroke: null
      },
      diffMarkerSymbolStyle: {
        size: 12,
        originSymbolType: 'arrow',
        style: {
          stroke: '#000',
          fill: false,
          lineWidth: 1
        }
      },
      labelBackground: {
        visible: true,
        padding: 4,
        style: {
          fill: '#3e3e3e',
          fillOpacity: 0.85,
          stroke: '#3e3e3e',
          lineWidth: 1,
          cornerRadius: 4
        }
      },
      defaultOffsetInGrowthMarkLine: 10
    };
  }

  shouldRunByContextUpdate(context: SpecInsightCtx): boolean {
    return true;
  }

  /** generate mark point into chart by datum into coordinates */
  protected generateMarkPoint(spec: any, datum: DataItem, options: { direction: string; text: string; info: any }) {
    const { direction, text, info } = options;
    if (!spec.markPoint) {
      spec.markPoint = [];
    }
    const { labelBackground } = this.options;
    const { seriesId, seriesIndex } = info || {};
    const offset = 12;
    const offsetD = 8;
    let offsetX = 0;
    let offsetY = -offset;
    const dOffset = {
      dx: 0,
      dy: offsetD
    };
    if (direction === 'bottom') {
      offsetY = offset;
      dOffset.dy = -offsetD;
    } else if (direction !== 'top') {
      dOffset.dy = 0;
      offsetY = 0;
      if (direction === 'right') {
        offsetX = offset;
        dOffset.dx = -offsetD;
      } else if (direction === 'left') {
        offsetX = -offset;
        dOffset.dx = offsetD;
      }
    }
    spec.markPoint.push({
      coordinate: datum,
      ...(isNumber(seriesIndex) ? { relativeSeriesIndex: seriesIndex } : {}),
      ...(seriesId ? { relativeSeriesId: seriesId } : {}),
      itemContent: {
        offsetX,
        offsetY,
        autoRotate: false,
        confine: true,
        text: {
          text: text,
          padding: 4,
          ...dOffset,
          labelBackground,
          style: {
            fill: '#fff'
          }
        }
      },
      itemLine: {
        type: 'type-s',
        arcRatio: 0.05,
        startSymbol: {
          visible: false
        },
        endSymbol: {
          visible: false
        },
        line: {
          style: {
            lineWidth: 1.5
          }
        }
      },
      targetSymbol: {
        offset: 0,
        style: {
          size: 6,
          lineWidth: 1
        }
      }
    });
  }

  protected formatterValue(value: string | number) {
    const floatValue = Number(value);
    if (floatValue > 10) {
      return floatValue.toFixed(0);
    } else if (floatValue >= 1) {
      return floatValue.toFixed(1);
    } else if (floatValue >= 0.1) {
      return floatValue.toFixed(2);
    }
    return isValidNumber(floatValue) ? floatValue.toFixed(3) : '';
  }

  protected getMarkPointText(type: InsightType, value: string) {
    switch (type) {
      case InsightType.Min:
      case InsightType.Max:
        return value ? `${type}: ${value}` : type;
      case InsightType.TurningPoint:
        return value ? `Turning Point: ${value}` : 'Turning Point';
      default:
        return value ? `Outlier: ${value}` : 'Outlier';
    }
  }

  /** generate markline of avg insights */
  protected getAvgMarkLine(spec: any, value: number, options: { position: 'x' | 'y'; text: string; info: any }) {
    const { position, text, info } = options;
    if (!spec.markLine) {
      spec.markLine = [];
    }
    const { defaultMarkerLineStyle, defaultMarkerSymbolStyle, labelBackground } = this.options;
    const { seriesId, seriesIndex } = info || {};
    spec.markLine.push({
      [position]: value,
      ...(isNumber(seriesIndex) ? { relativeSeriesIndex: seriesIndex } : {}),
      ...(seriesId ? { relativeSeriesId: seriesId } : {}),
      label: {
        visible: true,
        autoRotate: false,
        text,
        position: 'insideEndTop',
        labelBackground,
        formatConfig: {
          content: ['percentage'],
          fixed: 1
        },
        style: {
          fill: '#fff',
          fontSize: 12
        }
      },
      line: {
        style: {
          ...defaultMarkerLineStyle
        }
      },
      endSymbol: {
        visible: true,
        size: 10,
        refX: 6,
        symbolType: 'triangleLeft',
        autoRotate: false,
        style: {
          ...defaultMarkerSymbolStyle
        }
      }
    });
  }

  /** generate markline of overall trend by coordinates */
  protected getGrowthMarkLine(
    spec: any,
    options: {
      coordinates: DataItem[];
      text: string;
      isTransposed: boolean;
    }
  ) {
    if (!spec.markLine) {
      spec.markLine = [];
    }
    const { defaultMarkerLineStyle, defaultMarkerSymbolStyle, defaultOffsetInGrowthMarkLine, labelBackground } =
      this.options;
    const { coordinates, text, isTransposed = false } = options;
    const offset = `${isTransposed ? defaultOffsetInGrowthMarkLine : -defaultOffsetInGrowthMarkLine}%`;
    spec.markLine.push({
      coordinates,
      autoRange: true,
      line: {
        style: {
          ...defaultMarkerLineStyle,
          lineDash: [0]
        }
      },
      label: {
        position: 'middle',
        text,
        labelBackground,
        style: {
          fill: '#fff',
          fontSize: 14
        },
        pickable: true,
        childrenPickable: false,
        refY: 0
      },
      endSymbol: {
        ...defaultMarkerSymbolStyle
      },
      coordinatesOffset: [
        {
          x: isTransposed ? offset : 0,
          y: isTransposed ? 0 : offset
        },
        {
          x: isTransposed ? offset : 0,
          y: isTransposed ? 0 : offset
        }
      ]
    });
  }

  /** generate markline of Abnormal trend by coordinates */
  protected getAbnormalTrendMarkLine(
    spec: any,
    options: {
      series_name: string;
      text: string;
      isTransposed: boolean;
      info: any;
    }
  ) {
    if (!spec.markLine) {
      spec.markLine = [];
    }

    const { series_name, text, isTransposed = false, info } = options;

    const datavalues = spec.data[0].values;
    const xField = Array.isArray(spec.xField) ? spec.xField[0] : spec.xField;
    const yField = Array.isArray(spec.yField) ? spec.yField[0] : spec.yField;
    const { startDimValue, startValue, endDimValue, endValue } = info;

    const coordinates = [
      {
        [xField]: startDimValue,
        [yField]: startValue
      },
      {
        [xField]: endDimValue,
        [yField]: endValue
      }
    ];

    spec.markLine.push({
      type: 'type-step',
      coordinates,
      connectDirection: 'right',
      expandDistance: -100,
      line: {
        multiSegment: true,
        mainSegmentIndex: 1,
        style: [
          {
            lineDash: [2, 2],
            stroke: '#000',
            lineWidth: 2
          },
          {
            stroke: '#000',
            lineWidth: 2
          },
          {
            lineDash: [2, 2],
            stroke: '#000',
            lineWidth: 2
          }
        ]
      },
      label: {
        position: 'middle',
        text: text,
        labelBackground: {
          padding: { left: 4, right: 4, top: 4, bottom: 4 },
          style: {
            fill: '#fff',
            fillOpacity: 1,
            stroke: '#000',
            lineWidth: 1,
            cornerRadius: 4
          }
        },
        style: {
          fill: '#000'
        }
      },
      endSymbol: {
        size: 12,
        refX: -4
      }
    });
  }

  protected getAbnormalBandMarkArea(
    spec: any,
    options: {
      series_name: string;
      isTransposed: boolean;
      info: any;
      text: string;
    }
  ) {
    if (!spec.markArea) {
      spec.markArea = [];
    }
    if (!spec.line) {
      spec.line = {};
    }

    const { series_name, isTransposed = false, info, text } = options;

    const timeField = Array.isArray(spec.xField) ? spec.xField[0] : spec.xField;

    if (!timeField) {
      console.error('No time field found in spec.xField');
      return;
    }

    const { startValue, endValue } = options.info;
    const datavalues = spec.data[0].values;

    // 2. 标记预测数据
    datavalues.forEach((item: any) => {
      const timeValue = item[timeField];
      if (timeValue === undefined) {
        return;
      }

      // 3. 通用比较逻辑（支持字符串、数字或日期）
      if (compareValues(timeValue, startValue) >= 0 && compareValues(timeValue, endValue) <= 0) {
        item.forecast = true;
      }
    });

    // 添加 lineDash
    if (!spec.line.style) {
      spec.line.style = {};
    }
    // spec.line.style.lineDash =
    // `__FUNCTION__: (data => {
    //   if (data.forecast) {
    //     return [5, 5]; // 预测数据用虚线
    //   }
    //   return [0]; // 其他数据用实线
    // })`

    spec.line.style.lineDash = function (data) {
      return data.forecast ? [5, 5] : [0];
    };

    //console.log("lineDash exists?", typeof spec.line.style.lineDash === 'function'); // 应为 true

    if (spec.type === 'waterfall' || spec.type === 'bar') {
      spec.markArea.push({
        x: startValue,
        x1: endValue,
        label: {
          text: text,
          position: 'insideTop',
          labelBackground: {
            padding: 2,
            style: {
              fill: '#E8346D'
            }
          }
        }
      });
    } else {
      spec.markArea.push({
        x: startValue,
        x1: endValue,
        label: {
          text: text,
          position: 'insideTop',
          labelBackground: {
            padding: 2,
            style: {
              fill: '#E8346D'
            }
          }
        }
      });
    }
    //console.log(spec.markArea)
  }

  protected runBeforeLLM(): SpecInsightCtx {
    const { spec, insights, chartType } = this.context;
    const newSpec = merge({}, spec);
    const { cell, transpose } = getCellFromSpec(spec, chartType);
    const pointIndexMap: Record<string, boolean> = {};
    const isStack = isStackChart(spec, chartType, cell);
    insights.forEach(insight => {
      const { type, data, value, fieldId, info, seriesName, textContent } = insight;
      const series_name = Array.isArray(seriesName) ? seriesName[0] : seriesName;
      const direction = transpose
        ? Number(value) >= 0
          ? 'right'
          : 'left'
        : Number(value) >= 0 || !isValidNumber(value)
        ? 'top'
        : 'bottom';
      if (
        [InsightType.Outlier, InsightType.ExtremeValue, InsightType.MajorityValue, InsightType.TurningPoint].includes(
          type
        ) &&
        isStack
      ) {
        // @todo @czx don't support stack chart in markPoint since no vchart instance to get absolute point
        return;
      }
      const formatV = this.formatterValue(value);
      const dataString = JSON.stringify(data?.[0]?.dataItem || {});
      switch (type) {
        case InsightType.Min:
        case InsightType.Max:
        case InsightType.Outlier:
        case InsightType.ExtremeValue:
        case InsightType.MajorityValue:
        case InsightType.TurningPoint:
          if (!pointIndexMap[dataString]) {
            pointIndexMap[dataString] = true;
            this.generateMarkPoint(
              newSpec,
              { ...data[0].dataItem, [fieldId]: Number(value) },
              {
                direction,
                text: this.getMarkPointText(type, formatV),
                info
              }
            );
          }
          break;
        case InsightType.Avg:
          this.getAvgMarkLine(newSpec, Number(value), {
            position: transpose ? 'x' : 'y',
            text: formatV ? `Avg: ${formatV}` : 'Avg',
            info
          });
          break;
        case InsightType.OverallTrend:
          this.getGrowthMarkLine(newSpec, {
            coordinates: info.overall.coordinates,
            isTransposed: transpose,
            text:
              value === TrendType.INCREASING
                ? `+${(info.change * 100).toFixed(1)}%`
                : `${(info.change * 100).toFixed(1)}%`
          });
          break;
        case InsightType.AbnormalTrend:
          this.getAbnormalTrendMarkLine(newSpec, {
            series_name: String(series_name),
            isTransposed: transpose,
            text:
              value === TrendType.INCREASING
                ? `Abnormal upward trend +${(info.change * 100).toFixed(1)}%`
                : `Abnormal downward trend ${(info.change * 100).toFixed(1)}%`,
            info: info
          });
          break;
        case InsightType.AbnormalBand:
          this.getAbnormalBandMarkArea(newSpec, {
            series_name: String(series_name),
            isTransposed: transpose,
            info: info,
            text: textContent.plainText
          });
          break;
      }
    });
    this.updateContext({
      newSpec
    });
    return this.context;
  }
}

export const registerSpecInsightAtom = () => {
  Factory.registerAtom(
    AtomName.SPEC_INSIGHT,
    SpecInsightAtom as unknown as BaseAtomConstructor<SpecInsightCtx, SpecInsightOptions>
  );
};
