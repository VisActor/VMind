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
const isEmptySeries = (seriesName: any) => !seriesName || seriesName === DEFAULT_SERIES_NAME;

const getOutlierTemplate = (insight: Insight, ctx: DataInsightExtractContext) => {
  const { seriesName, data, value, fieldId } = insight;
  const { fieldInfo, cell, chartType } = ctx;
  const xFieldId = getFieldIdInCell(cell.x);
  const seriesField = getFieldIdInCell(cell?.color);
  if ([ChartType.ScatterPlot].includes(chartType)) {
    return {
      content: isEmptySeries(seriesName) ? '(${b}, ${c})上存在异常点' : '${a}在(${b}, ${c})上存在异常点',
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
    content: isEmptySeries(seriesName) ? '${b}上有异常值,值为${c}' : '${a}在${b}上有异常值，值为${c}',
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
        fieldName: getFieldInfoById(fieldInfo, fieldId as string)?.alias ?? fieldId
      }
    }
  };
};

const getTurnPointTemplate = (insight: Insight, ctx: DataInsightExtractContext) => {
  const res = getOutlierTemplate(insight, ctx);
  return {
    content: res.content.replaceAll('异常值', '拐点'),
    variables: res.variables
  };
};

const getExtremeTemplate = (insight: Insight, ctx: DataInsightExtractContext) => {
  const res = getOutlierTemplate(insight, ctx);
  return {
    content: res.content.replaceAll('异常值', '极值'),
    variables: res.variables
  };
};

const getMajorityTemplate = (insight: Insight, ctx: DataInsightExtractContext) => {
  const { seriesName, fieldId, info } = insight;
  const { fieldInfo, cell } = ctx;
  const { ratio, dimensionName } = info;
  const xFieldId = getFieldIdInCell(cell.x);
  const seriesField = getFieldIdInCell(cell?.color);
  return {
    content: '${a}在${b}的占比贡献度显著，占比高达${c}',
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

const getAbnormalBandTemplate = (insight: Insight, ctx: DataInsightExtractContext) => {
  const { seriesName, data } = insight;
  const { fieldInfo, cell } = ctx;
  const xFieldId = getFieldIdInCell(cell.x);
  const seriesField = getFieldIdInCell(cell?.color);
  return {
    content: isEmptySeries(seriesName) ? '${b}至${c}之间存在异常区间' : '${a}在${b}至${c}之间存在异常区间',
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

const getOverallTrendTemplate = (insight: Insight, ctx: DataInsightExtractContext) => {
  const { value, info } = insight;
  const { fieldInfo, cell } = ctx;
  const { startDimValue, endDimValue, change } = info;
  const xFieldId = getFieldIdInCell(cell.x);
  return {
    content:
      '数据整体呈${a}趋势，其中在${b}至${c}间连续${a},数据' +
      (value === TrendType.INCREASING ? '增长了' : '下降了') +
      '${d}',
    variables: {
      a: {
        value: value === TrendType.INCREASING ? '上升' : '下降',
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
        formatValue: (Math.abs(change) * 100).toFixed(1) + '%',
        value: change,
        valueType: value === TrendType.INCREASING ? 'ascendTrend' : 'descendTrend',
        fieldName: null as any
      }
    }
  };
};

const getAbnormalTrendTemplate = (insight: Insight, ctx: DataInsightExtractContext) => {
  const { seriesName, value, info } = insight;
  const { fieldInfo, cell } = ctx;
  const seriesField = getFieldIdInCell(cell?.color);
  return {
    content: '${a}趋势异常，呈${b}趋势，整体${b}了${c}',
    variables: {
      a: {
        value: seriesName as string,
        fieldName: getFieldInfoById(fieldInfo, seriesField)?.alias ?? seriesField
      },
      b: {
        value: value === TrendType.INCREASING ? '上升' : '下降',
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

const getCorrelationTemplate = (insight: Insight, ctx: DataInsightExtractContext) => {
  const { seriesName, value, info, name } = insight;
  const { fieldInfo, cell } = ctx;
  const { correlationType } = info || {};
  const seriesField = getFieldIdInCell(cell?.color);
  if (name === 'spearman') {
    return {
      content: '${a}和${b}呈${c}相关',
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
          value: correlationType === 'positive' ? '正' : '负',
          fieldName: null as any
        }
      }
    };
  }
  return {
    content: isEmptySeries(seriesName) ? '图表在xy上呈线性相关' : '${a}在xy上呈线性相关',
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

const getVolatilityTemplate = (insight: Insight, ctx: DataInsightExtractContext) => {
  const { seriesName } = insight;
  const { fieldInfo, cell } = ctx;
  const seriesField = getFieldIdInCell(cell?.color);
  return {
    content: isEmptySeries(seriesName) ? '数据呈周期性波动' : '${a}呈周期性波动',
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

export const generateInsightTemplate = (insights: Insight[], ctx: DataInsightExtractContext) => {
  for (let i = 0; i < insights.length; i++) {
    const { type } = insights[i];
    let textContent = null;
    switch (type) {
      case InsightType.Outlier:
        textContent = getOutlierTemplate(insights[i], ctx);
        break;
      case InsightType.TurningPoint:
        textContent = getTurnPointTemplate(insights[i], ctx);
        break;
      case InsightType.MajorityValue:
        textContent = getMajorityTemplate(insights[i], ctx);
        break;
      case InsightType.AbnormalBand:
        textContent = getAbnormalBandTemplate(insights[i], ctx);
        break;
      case InsightType.OverallTrend:
        textContent = getOverallTrendTemplate(insights[i], ctx);
        break;
      case InsightType.AbnormalTrend:
        textContent = getAbnormalTrendTemplate(insights[i], ctx);
        break;
      case InsightType.Correlation:
        textContent = getCorrelationTemplate(insights[i], ctx);
        break;
      case InsightType.Volatility:
        textContent = getVolatilityTemplate(insights[i], ctx);
        break;
      case InsightType.ExtremeValue:
        textContent = getExtremeTemplate(insights[i], ctx);
        break;
      default:
        textContent = {
          content: `数据含有${insights[i].type}的见解`
        };
        break;
    }
    insights[i].textContent = addPlainText(textContent);
  }
  return insights;
};
