import { ChartType } from '../../../types';
import type { DataCell, FieldInfo } from '../../../types';
import type { InsightTextContent } from '../type';
import { InsightType, type DataInsightExtractContext, type Insight } from '../type';
import { DEFAULT_SERIES_NAME } from '../const';
import { TrendType } from './statistics';
import { getFieldIdInCell } from '../../../utils/field';

const getFieldInfoById = (fieldInfo: FieldInfo[], fieldId: string) => {
  return fieldInfo.find(info => info.fieldName === fieldId);
};
export const isEmptySeries = (seriesName: any) => !seriesName || seriesName === DEFAULT_SERIES_NAME;

const getOutlierTemplate = (insight: Insight, ctx: DataInsightExtractContext, language: 'chinese' | 'english') => {
  const { seriesName, data, value, fieldId } = insight;
  const { fieldInfo, cell, chartType } = ctx;
  const xFieldId = getFieldIdInCell(cell.x);
  const seriesField = getFieldIdInCell(cell?.color);
  const isChinese = language === 'chinese';
  if ([ChartType.ScatterPlot].includes(chartType)) {
    return {
      content: isEmptySeries(seriesName)
        ? isChinese
          ? '(${b}, ${c})上显著异常'
          : 'Significant anomaly at (${b}, ${c})'
        : isChinese
        ? '${a}在(${b}, ${c})上显著异常'
        : '${a} shows a significant anomaly at (${b}, ${c})',
      variables: {
        ...(isEmptySeries(seriesName)
          ? {}
          : {
              a: {
                value: seriesName as string,
                fieldName: getFieldInfoById(fieldInfo, seriesField)?.alias ?? seriesField
              }
            }),
        b: {
          value: data?.[0]?.dataItem?.[fieldId[0]],
          fieldName: getFieldInfoById(fieldInfo, fieldId[0])?.alias ?? fieldId[0]
        },
        c: {
          value: data?.[0]?.dataItem?.[fieldId[1]],
          fieldName: getFieldInfoById(fieldInfo, fieldId[1])?.alias ?? fieldId[1]
        }
      }
    };
  }
  return {
    content: isEmptySeries(seriesName)
      ? isChinese
        ? '${b}上显著异常,值为${c}'
        : 'Significant anomaly at ${b}, with a value of ${c}'
      : isChinese
      ? '${a}在${b}上显著异常，值为${c}'
      : '${a} shows a significant anomaly at ${b}, with a value of ${c}',
    variables: {
      ...(isEmptySeries(seriesName)
        ? {}
        : {
            a: {
              value: seriesName as string,
              fieldName: getFieldInfoById(fieldInfo, seriesField)?.alias ?? seriesField
            }
          }),
      b: {
        value: data?.[0]?.dataItem?.[xFieldId],
        fieldName: getFieldInfoById(fieldInfo, xFieldId)?.alias ?? xFieldId
      },
      c: {
        value,
        isMeasure: true,
        fieldName: getFieldInfoById(fieldInfo, fieldId as string)?.alias ?? fieldId
      }
    }
  };
};

const getTurnPointTemplate = (insight: Insight, ctx: DataInsightExtractContext, language: 'chinese' | 'english') => {
  const res = getOutlierTemplate(insight, ctx, language);
  return {
    content:
      language === 'chinese'
        ? res.content.replaceAll('上显著异常', '是个拐点')
        : res.content
            .replaceAll('Significant anomaly', 'Turning point')
            .replaceAll('significant anomaly', 'turning point'),
    variables: res.variables
  };
};

const getExtremeTemplate = (insight: Insight, ctx: DataInsightExtractContext, language: 'chinese' | 'english') => {
  const res = getOutlierTemplate(insight, ctx, language);
  return {
    content:
      language === 'chinese'
        ? res.content.replaceAll('上显著异常', '是极值')
        : res.content
            .replaceAll('Significant anomaly', 'Extreme value')
            .replaceAll('significant anomaly', 'extreme value'),
    variables: res.variables
  };
};

const getMajorityTemplate = (insight: Insight, ctx: DataInsightExtractContext, language: 'chinese' | 'english') => {
  const { seriesName, fieldId, info } = insight;
  const { fieldInfo, cell } = ctx;
  const { ratio, dimensionName } = info;
  const xFieldId = getFieldIdInCell(cell.x);
  const seriesField = getFieldIdInCell(cell?.color);
  return {
    content:
      language === 'chinese'
        ? '${a}在${b}的占比贡献度显著，占比高达${c}'
        : '${a} significantly contributes to ${b}, at ${c}',
    variables: {
      a: {
        value: seriesName as string,
        fieldName: getFieldInfoById(fieldInfo, seriesField)?.alias ?? seriesField
      },
      b: {
        value: dimensionName,
        fieldName: getFieldInfoById(fieldInfo, xFieldId)?.alias ?? xFieldId
      },
      c: {
        value: ratio,
        formatValue: `${(ratio * 100).toFixed(1)}%`,
        fieldName: getFieldInfoById(fieldInfo, fieldId as string)?.alias ?? fieldId,
        icon: 'ratio'
      }
    }
  };
};

const getAbnormalBandTemplate = (insight: Insight, ctx: DataInsightExtractContext, language: 'chinese' | 'english') => {
  const { seriesName, data } = insight;
  const { fieldInfo, cell } = ctx;
  const xFieldId = getFieldIdInCell(cell.x);
  const seriesField = getFieldIdInCell(cell?.color);
  const isChinese = language === 'chinese';
  return {
    content: isEmptySeries(seriesName)
      ? isChinese
        ? '${b}至${c}之间存在异常区间'
        : 'There is an anomalous interval between ${b} and ${c}'
      : isChinese
      ? '${a}在${b}至${c}之间存在异常区间'
      : '${a} has an anomalous interval between ${b} and ${c}',
    variables: {
      ...(isEmptySeries(seriesName)
        ? {}
        : {
            a: {
              value: seriesName as string,
              fieldName: getFieldInfoById(fieldInfo, seriesField)?.alias ?? seriesField
            }
          }),
      b: {
        value: data[0].dataItem[xFieldId],
        fieldName: getFieldInfoById(fieldInfo, xFieldId)?.alias ?? xFieldId
      },
      c: {
        value: data[data.length - 1].dataItem[xFieldId],
        fieldName: getFieldInfoById(fieldInfo, xFieldId)?.alias ?? xFieldId
      }
    }
  };
};

const getOverallTrendTemplate = (insight: Insight, ctx: DataInsightExtractContext, language: 'chinese' | 'english') => {
  const { value, info } = insight;
  const { fieldInfo, cell } = ctx;
  const { startDimValue, endDimValue, change, overall } = info;
  const xFieldId = getFieldIdInCell(cell.x);
  const isChinese = language === 'chinese';
  return {
    content: isChinese
      ? `数据整体呈${'${a}'}趋势，整体${
          value === TrendType.INCREASING ? '增长了' : '下降了'
        }${'${d}'}。其中在${'${b}'}至${'${c}'}间连续${'${a}'}。`
      : `The overall data shows a ${'{a}'} trend, with an overall ${
          value === TrendType.INCREASING ? 'increase ' : 'decrease '
        }of ${'{d}'}. Notably, from ${'{b}'} to ${'{c}'}, there was a continuous ${'${a}'} trend.`,
    variables: {
      a: {
        value: isChinese
          ? value === TrendType.INCREASING
            ? '上升'
            : '下降'
          : value === TrendType.INCREASING
          ? 'increasing'
          : 'decreasing',
        fieldName: null as any,
        icon: value === TrendType.INCREASING ? 'ascendTrend' : 'descendTrend'
      },
      b: {
        value: startDimValue,
        fieldName: getFieldInfoById(fieldInfo, xFieldId)?.alias ?? xFieldId
      },
      c: {
        value: endDimValue,
        fieldName: getFieldInfoById(fieldInfo, xFieldId)?.alias ?? xFieldId
      },
      d: {
        formatValue: (Math.abs(overall.change) * 100).toFixed(1) + '%',
        value: overall.change,
        valueType: value === TrendType.INCREASING ? 'ascendTrend' : 'descendTrend',
        fieldName: null as any
      }
    }
  };
};

const getAbnormalTrendTemplate = (
  insight: Insight,
  ctx: DataInsightExtractContext,
  language: 'chinese' | 'english'
) => {
  const { seriesName, value, info } = insight;
  const { fieldInfo, cell } = ctx;
  const seriesField = getFieldIdInCell(cell?.color);
  const isChinese = language === 'chinese';
  return {
    content: isChinese
      ? '${a}趋势异常，呈${b}趋势，整体${b}了${c}'
      : 'The ${a} trend is abnormal, showing a ${b} trend, with an overall ${b} of ${c}.',
    variables: {
      a: {
        value: seriesName as string,
        fieldName: getFieldInfoById(fieldInfo, seriesField)?.alias ?? seriesField
      },
      b: {
        value: isChinese
          ? value === TrendType.INCREASING
            ? '上升'
            : '下降'
          : value === TrendType.INCREASING
          ? 'increase'
          : 'decrease',
        fieldName: null as any,
        icon: value === TrendType.INCREASING ? 'ascendTrend' : 'descendTrend'
      },
      c: {
        value: (Math.abs(info.change) * 100).toFixed(1) + '%',
        valueType: value === TrendType.INCREASING ? 'ascendTrend' : 'descendTrend',
        fieldName: null as any
      }
    }
  };
};

const getCorrelationTemplate = (insight: Insight, ctx: DataInsightExtractContext, language: 'chinese' | 'english') => {
  const { seriesName, value, info, name } = insight;
  const { fieldInfo, cell } = ctx;
  const { correlationType } = info || {};
  const seriesField = getFieldIdInCell(cell?.color);
  const isChinese = language === 'chinese';
  if (name === 'spearman') {
    return {
      content: isChinese ? '${a}和${b}呈${c}相关' : '${a} and ${b} show a ${c} correlation',
      variables: {
        a: {
          value: (seriesName as DataCell[])[0],
          fieldName: getFieldInfoById(fieldInfo, seriesField)?.alias ?? seriesField
        },
        b: {
          value: (seriesName as DataCell[])[1],
          fieldName: getFieldInfoById(fieldInfo, seriesField)?.alias ?? seriesField
        },
        c: {
          value: isChinese
            ? correlationType === 'positive'
              ? '正'
              : '负'
            : correlationType === 'positive'
            ? 'positive'
            : 'negative',
          fieldName: null as any
        }
      }
    };
  }
  return {
    content: isEmptySeries(seriesName)
      ? isChinese
        ? '图表在xy上呈线性相关'
        : 'The chart shows a linear correlation on the xy plane'
      : isChinese
      ? '${a}在xy上呈线性相关'
      : '${a} shows a linear correlation on the xy plane',
    variables: {
      ...(isEmptySeries(seriesName)
        ? {
            a: {
              value: seriesName as string,
              fieldName: getFieldInfoById(fieldInfo, seriesField)?.alias ?? seriesField
            }
          }
        : {})
    }
  };
};

const getVolatilityTemplate = (insight: Insight, ctx: DataInsightExtractContext, language: 'chinese' | 'english') => {
  const { seriesName } = insight;
  const { fieldInfo, cell } = ctx;
  const seriesField = getFieldIdInCell(cell?.color);
  return {
    content: isEmptySeries(seriesName)
      ? language === 'chinese'
        ? '数据呈周期性波动'
        : 'The data shows cyclical fluctuations.'
      : language === 'chinese'
      ? '${a}呈周期性波动'
      : '${a} shows cyclical fluctuations',
    variables: isEmptySeries(seriesName)
      ? {}
      : {
          a: {
            value: seriesName as string,
            fieldName: getFieldInfoById(fieldInfo, seriesField)?.alias ?? seriesField
          }
        }
  };
};

export const addPlainText = (textContent: { content: string; variables?: Record<string, InsightTextContent> }) => {
  const { content, variables = {} } = textContent;
  let plainText = `${content}`;
  Object.keys(variables).forEach(key => {
    const value = variables[key];
    plainText = plainText.replaceAll(`\${${key}}`, `${value.formatValue || value.value}`);
  });
  return {
    ...textContent,
    plainText
  };
};

export const generateInsightTemplate = (
  insights: Insight[],
  ctx: DataInsightExtractContext,
  language: 'chinese' | 'english'
) => {
  for (let i = 0; i < insights.length; i++) {
    const { type } = insights[i];
    let textContent = null;
    switch (type) {
      case InsightType.Outlier:
        textContent = getOutlierTemplate(insights[i], ctx, language);
        break;
      case InsightType.TurningPoint:
        textContent = getTurnPointTemplate(insights[i], ctx, language);
        break;
      case InsightType.MajorityValue:
        textContent = getMajorityTemplate(insights[i], ctx, language);
        break;
      case InsightType.AbnormalBand:
        textContent = getAbnormalBandTemplate(insights[i], ctx, language);
        break;
      case InsightType.OverallTrend:
        textContent = getOverallTrendTemplate(insights[i], ctx, language);
        break;
      case InsightType.AbnormalTrend:
        textContent = getAbnormalTrendTemplate(insights[i], ctx, language);
        break;
      case InsightType.Correlation:
        textContent = getCorrelationTemplate(insights[i], ctx, language);
        break;
      case InsightType.Volatility:
        textContent = getVolatilityTemplate(insights[i], ctx, language);
        break;
      case InsightType.ExtremeValue:
        textContent = getExtremeTemplate(insights[i], ctx, language);
        break;
      default:
        textContent = {
          content: language === 'chinese' ? `数据含有${insights[i].type}的见解` : `Data has ${insights[i].type} insight`
        };
        break;
    }
    insights[i].textContent = addPlainText(textContent);
  }
  return insights;
};
