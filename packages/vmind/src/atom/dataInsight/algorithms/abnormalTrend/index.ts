import { isArray } from '@visactor/vutils';

import { originalMKTest, TrendType } from '../statistics';
import type { DataInsightExtractContext } from '../../type';
import { InsightType, type Insight, type InsightAlgorithm } from '../../type';
import type { DataCell } from '../../../../types';
import { ChartType } from '../../../../types';
import { overallTrendingAlgo } from '../overallTrending';
import { isValidData } from '../.../../../../../utils/common';
import { isPercenSeries, isStackSeries } from '../../utils';

type TrendInfo = {
  trend: string;
  pValue: number;
  zScore: number;
  measureId: number | string;
  series: string;
  info?: any;
};

export interface AbnormalTrendOptions {
  threshold?: number;
}

const abnormalTrendAlgo = (context: DataInsightExtractContext, options: AbnormalTrendOptions) => {
  const result: Insight[] = [];
  const { threshold = 0.2 } = options || {};
  const { insights, seriesDataMap, cell, spec } = context;
  const { y: celly, color } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];
  const seriesField: string = isArray(color) ? color[0] : color;
  if (!seriesField) {
    return [];
  }
  const seriesTrendInfo: TrendInfo[] = [];
  Object.keys(seriesDataMap).forEach(series => {
    yField.forEach(measureId => {
      if (isStackSeries(spec, measureId) || isPercenSeries(spec, measureId)) {
        return;
      }
      const seriesDataset: number[] = seriesDataMap[series]
        .map(d => Number(d.dataItem[measureId]))
        .filter(v => isValidData(v) && !isNaN(v));
      const { trend, pValue, zScore } = originalMKTest(seriesDataset, 0.05, false);
      if (trend !== TrendType.NO_TREND) {
        const startValue = seriesDataset[0];
        const endValue = seriesDataset[seriesDataset.length - 1];
        seriesTrendInfo.push({
          trend,
          pValue,
          zScore,
          measureId,
          series,
          info: {
            startValue,
            endValue,
            change: endValue / startValue - 1
          }
        });
      }
    });
  });

  let overallTrendInsights = insights.filter(v => v.type === InsightType.OverallTrend);
  if (overallTrendInsights.length === 0) {
    overallTrendInsights = overallTrendingAlgo(context, {});
  }
  yField.forEach(measureId => {
    const measureOverallTrend = insights.find(
      (i: { type: InsightType; fieldId?: DataCell }) => i.type === InsightType.OverallTrend && i?.fieldId === measureId
    );
    if (measureOverallTrend) {
      const measureSeriesTrend = seriesTrendInfo.filter(
        t => t.measureId === measureId && t.trend !== measureOverallTrend.value
      );
      const seriesInsights = measureSeriesTrend.map(
        seriesTrend =>
          ({
            type: InsightType.AbnormalTrend,
            data: [],
            fieldId: measureId,
            value: seriesTrend.trend,
            significant: 1 - seriesTrend.pValue,
            seriesName: seriesTrend.series,
            info: seriesTrend.info
          } as unknown as Insight)
      );
      result.push(...seriesInsights);
    } else {
      const increaseTrends = seriesTrendInfo.filter(t => t.trend === TrendType.INCREASING && t.measureId === measureId);
      const decreasedTrends = seriesTrendInfo.filter(
        t => t.trend === TrendType.DECREASING && t.measureId === measureId
      );
      if (increaseTrends.length > 0 && decreasedTrends.length > 0) {
        if (
          increaseTrends.length > decreasedTrends.length &&
          (decreasedTrends.length / (increaseTrends.length + decreasedTrends.length) <= threshold ||
            decreasedTrends.length === 1)
        ) {
          const decreaseInsights = decreasedTrends.map(
            dt =>
              ({
                type: InsightType.AbnormalTrend,
                data: [],
                fieldId: measureId,
                value: dt.trend,
                significant: 1 - dt.pValue,
                seriesName: dt.series,
                info: dt.info
              } as unknown as Insight)
          );
          result.push(...decreaseInsights);
        } else if (
          increaseTrends.length < decreasedTrends.length &&
          (increaseTrends.length / (increaseTrends.length + decreasedTrends.length) <= threshold ||
            increaseTrends.length === 1)
        ) {
          const increaseInsights = increaseTrends.map(
            it =>
              ({
                type: InsightType.AbnormalTrend,
                fieldId: measureId,
                value: it.trend,
                significant: 1 - it.pValue,
                seriesName: it.series,
                info: it.info
              } as unknown as Insight)
          );
          result.push(...increaseInsights);
        }
      }
    }
  });
  return result;
};

export const AbnormalTrend: InsightAlgorithm = {
  name: 'abnormalTrend',
  chartType: [ChartType.DualAxisChart, ChartType.LineChart, ChartType.BarChart, ChartType.AreaChart],
  insightType: InsightType.AbnormalTrend,
  algorithmFunction: abnormalTrendAlgo,
  supportPercent: false,
  supportStack: false
};
