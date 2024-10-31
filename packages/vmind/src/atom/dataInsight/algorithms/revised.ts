/** revised Insight */
import { isArray } from '@visactor/vutils';
import type { DataInsightExtractContext } from '../type';
import { InsightType, type Insight } from '../type';
import type { DataCell } from '../../../types';
import { ChartType } from '../../../types';

export interface RevisedInsightParams {
  insights: Insight[];
  [InsightType.Outlier]?: Insight[];
  [InsightType.PairOutlier]?: Insight[];
  [InsightType.AbnormalBand]?: Insight[];
  [InsightType.ExtremeValue]?: Insight[];
  [InsightType.TurningPoint]?: Insight[];
  [InsightType.MajorityValue]?: Insight[];
  [InsightType.AbnormalTrend]?: Insight[];
  [InsightType.OverallTrend]?: Insight[];
  [InsightType.Correlation]?: Insight[];
  [InsightType.Volatility]?: Insight[];
}

type OutliearFieldMapping = Record<
  string,
  {
    insight: Insight;
    key: string;
  }[]
>;

const filterInsight = (insights: Insight[], type: InsightType) => insights.filter(insight => insight.type === type);

const getBandInsightByOutliear = (context: DataInsightExtractContext, outliearFieldMapping: OutliearFieldMapping) => {
  const bandInsightKeys: string[] = [];
  const abnormalBand: Insight[] = [];
  const { dimensionValues, cell, chartType } = context;
  if (
    ![
      ChartType.DualAxisChart,
      ChartType.LineChart,
      ChartType.BarChart,
      ChartType.AreaChart,
      ChartType.WaterFallChart
    ].includes(chartType)
  ) {
    return {
      bandInsightKeys,
      abnormalBand
    };
  }
  const { x: cellx } = cell;
  const xField: string = isArray(cellx) ? cellx[0] : cellx;
  Object.keys(outliearFieldMapping).forEach(fieldId => {
    const fieldInsights = outliearFieldMapping[fieldId];
    const indexOfInsights = fieldInsights
      .map(content => {
        const xValue = content.insight.data[0].dataItem[xField];
        return {
          xIndex: dimensionValues.indexOf(xValue),
          content
        };
      })
      .sort((a, b) => a.xIndex - b.xIndex);
    let band = [indexOfInsights[0]];
    for (let i = 1; i <= indexOfInsights.length; i++) {
      const curIndex = indexOfInsights[i]?.xIndex;
      const prevIndex = band[band.length - 1].xIndex;
      if (i < indexOfInsights.length && curIndex - prevIndex === 1) {
        band.push(indexOfInsights[i]);
      } else {
        if (band.length > 1) {
          abnormalBand.push({
            type: InsightType.AbnormalBand,
            name: InsightType.AbnormalBand,
            data: band.map(v => v.content.insight.data[0]),
            seriesName: fieldId,
            value: null,
            significant: band.length,
            info: {
              startValue: band[0].content.insight.data[0].dataItem[xField],
              endValue: band[band.length - 1].content.insight.data[0].dataItem[xField],
              xField
            }
          });
          bandInsightKeys.push(...band.map(v => v.content.key));
        }
        band = [indexOfInsights[i]];
      }
    }
  });
  return {
    abnormalBand,
    bandInsightKeys
  };
};

export const mergePointInsight = (
  insightCtx: RevisedInsightParams,
  type: InsightType,
  context: DataInsightExtractContext
) => {
  const outliear: Record<string, Insight[]> = {};
  const { insights } = insightCtx;
  const outliearFieldMapping: OutliearFieldMapping = {};
  const filterOutliearInsight = filterInsight(insights, InsightType.Outlier);
  filterOutliearInsight.forEach(insight => {
    const { data } = insight;
    const seriesName = insight?.seriesName as DataCell;
    const key = `${data[0].index}-&&&-${seriesName}`;
    if (!outliear[key]) {
      outliear[key] = [];
      if (!outliearFieldMapping[seriesName]) {
        outliearFieldMapping[seriesName] = [];
      }
      outliearFieldMapping[seriesName].push({
        insight,
        key
      });
    }
    outliear[key].push(insight);
  });
  const majorityValueInsight = filterInsight(insights, InsightType.MajorityValue).filter(insight => {
    const { data } = insight;
    const seriesName = insight?.seriesName as DataCell;
    const key = `${data[0].index}-&&&-${seriesName}`;
    return !outliear[key];
  });

  const pairOutlier = filterPairInsight(insights, filterOutliearInsight);
  const { abnormalBand, bandInsightKeys } = getBandInsightByOutliear(context, outliearFieldMapping);
  bandInsightKeys.forEach(key => {
    delete outliear[key];
  });
  const outliearInsight = Object.keys(outliear).map(key => ({
    ...outliear[key][0],
    significant: outliear[key].reduce((prev, cur) => prev + cur.significant, 0)
  }));

  return {
    ...insightCtx,
    [InsightType.Outlier]: outliearInsight,
    [InsightType.PairOutlier]: pairOutlier,
    [InsightType.AbnormalBand]: abnormalBand,
    [InsightType.MajorityValue]: majorityValueInsight
  };
};

const filterPairInsight = (insights: Insight[], outliers: Insight[]) => {
  const pairs = filterInsight(insights, InsightType.PairOutlier);
  const outlierKeys = new Set();
  outliers.forEach(insight => {
    const { data, seriesName } = insight;
    const key = `${data[0].index}-&&&-${seriesName}`;
    outlierKeys.add(key);
  });
  return pairs.filter(v => {
    const { data, seriesName } = v;
    const keyList = data.map(v => `${v.index}-&&&-${seriesName}`);
    return !keyList.find(key => outlierKeys.has(key));
  });
};

export const filterCorrelationInsight = (insightCtx: RevisedInsightParams) => {
  const { insights } = insightCtx;
  const abnormalTrend = filterInsight(insights, InsightType.AbnormalTrend);
  const trendFields = new Set(abnormalTrend.map(insight => insight.seriesName));
  const correlation = filterInsight(insights, InsightType.Correlation).filter(
    insight =>
      insight.name === 'pearson-coefficient' ||
      (isArray(insight.seriesName) && !insight.seriesName.find(seriesName => trendFields.has(seriesName)))
  );
  return {
    ...insightCtx,
    [InsightType.Correlation]: correlation
  };
};

export const filterInsightByType = (insightCtx: RevisedInsightParams, type: InsightType) => {
  return {
    ...insightCtx,
    [type]: insightCtx?.[type] ? insightCtx?.[type] : filterInsight(insightCtx.insights, type)
  };
};
