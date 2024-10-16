import { isArray } from '@visactor/vutils';

import { originalMKTest, TrendType } from '../statistics';
import type { DataInsightExtractContext } from '../../type';
import { InsightType, type Insight, type InsightAlgorithm } from '../../type';
import type { DataCell } from '../../../../types';
import { ChartType } from '../../../../types';

type TrendInfo = {
  trend: string;
  pValue: number;
  zScore: number;
  measureId: number | string;
  series: string;
};

export interface AbnormalTrendOptions {
  threshold?: number;
}

const abnormalTrendAlgo = (context: DataInsightExtractContext, options: AbnormalTrendOptions) => {
  const result: Insight[] = [];
  const { threshold = 0.2 } = options || {};
  const { insights, seriesDataMap, cell } = context;
  const { y: celly, color } = cell;
  const yField: string[] = isArray(celly) ? celly.flat() : [celly];
  const seriesField: string = isArray(color) ? color[0] : color;
  if (!seriesField) {
    return [];
  }
  const seriesTrendInfo: TrendInfo[] = [];
  Object.keys(seriesDataMap).forEach(series => {
    yField.forEach(measureId => {
      const seriesDataset = seriesDataMap[series].map((d: { [x: string]: any }) => d.dataItem[measureId]);
      const { trend, pValue, zScore } = originalMKTest(seriesDataset, 0.05, false);
      if (trend !== TrendType.NO_TREND) {
        seriesTrendInfo.push({
          trend,
          pValue,
          zScore,
          measureId,
          series
        });
      }
    });
  });

  yField.forEach(measureId => {
    const measureOverallTrend = insights.find(
      (i: { type: InsightType; fieldId: DataCell }) => i.type === InsightType.OverallTrend && i.fieldId === measureId
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
            seriesName: seriesTrend.series
          } as unknown as Insight)
      );
      result.push(...seriesInsights);
    } else {
      const increaseTrends = seriesTrendInfo.filter(t => t.trend === TrendType.INCREASING);
      const decreasedTrends = seriesTrendInfo.filter(t => t.trend === TrendType.DECREASING);
      if (increaseTrends.length > 0 && decreasedTrends.length > 0) {
        if (
          increaseTrends.length > decreasedTrends.length &&
          decreasedTrends.length / (increaseTrends.length + decreasedTrends.length) < threshold
        ) {
          const decreaseInsights = decreasedTrends.map(
            dt =>
              ({
                type: InsightType.AbnormalTrend,
                data: [],
                fieldId: measureId,
                value: dt.trend,
                significant: 1 - dt.pValue,
                seriesName: dt.series
              } as unknown as Insight)
          );
          result.push(...decreaseInsights);
        } else if (
          increaseTrends.length < decreasedTrends.length &&
          increaseTrends.length / (increaseTrends.length + decreasedTrends.length) < threshold
        ) {
          const increaseInsights = increaseTrends.map(
            it =>
              ({
                type: InsightType.AbnormalTrend,
                fieldId: measureId,
                value: it.trend,
                significant: 1 - it.pValue,
                seriesName: it.series
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
  algorithmFunction: abnormalTrendAlgo
};
