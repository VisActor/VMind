import { AlgorithmType, InsightType, type DataInsightExtractContext, type Insight } from '../type';
import { AbnormalTrend } from './abnormalTrend';
import { ScatterPlotCorrelation } from './correlation/pearson';
import { LineChartCorrelation } from './correlation/spearman';
import { ExtremeValue } from './extremeValue';
import { LineChartMajorityValue } from './majorityValue';
import { DBSCANOutlier } from './outlier/dbscan';
import { LOFOutlier } from './outlier/lof';
import { OverallTrending } from './overallTrending';
import { TurningPoint } from './turningPoint';
import { Volatility } from './volatility';
import type { DataInsightOptions } from '../type';
import { StatisticsAlo } from './outlier/statistics';
import type { RevisedInsightParams } from './revised';
import { filterCorrelationInsight, filterInsightByType, mergePointInsight } from './revised';
import { DifferenceAlg } from './outlier/difference';
import { PageHinkleyAlg } from './drift';
import { generateInsightTemplate } from './template';
import { isPercentChart, isStackChart } from '../utils';
import { BaseStatistics } from './base/baseStatistics';

const algorithmMapping = {
  [AlgorithmType.OverallTrending]: {
    info: OverallTrending,
    priority: 1
  },
  [AlgorithmType.AbnormalTrend]: {
    info: AbnormalTrend,
    priority: 2
  },
  [AlgorithmType.PearsonCorrelation]: {
    info: ScatterPlotCorrelation,
    priority: 3
  },
  [AlgorithmType.SpearmanCorrelation]: {
    info: LineChartCorrelation,
    priority: 4
  },
  [AlgorithmType.ExtremeValue]: {
    info: ExtremeValue,
    priority: 5
  },
  [AlgorithmType.MajorityValue]: {
    info: LineChartMajorityValue,
    priority: 6
  },
  [AlgorithmType.StatisticsAbnormal]: {
    info: StatisticsAlo,
    priority: 7
  },
  [AlgorithmType.LOFOutlier]: {
    info: LOFOutlier,
    priority: 8
  },
  [AlgorithmType.DifferenceOutlier]: {
    info: DifferenceAlg,
    priority: 9
  },
  [AlgorithmType.TurningPoint]: {
    info: TurningPoint,
    priority: 10
  },
  [AlgorithmType.PageHinkley]: {
    info: PageHinkleyAlg,
    priority: 10
  },
  [AlgorithmType.DbscanOutlier]: {
    info: DBSCANOutlier,
    priority: 11
  },
  [AlgorithmType.Volatility]: {
    info: Volatility,
    priority: 12
  },
  [AlgorithmType.StatisticsBase]: {
    info: BaseStatistics,
    priority: 13
  }
};

const InsightSortMapping = {
  [InsightType.Min]: 0,
  [InsightType.Max]: 0,
  [InsightType.Avg]: 0,
  [InsightType.Outlier]: 1,
  [InsightType.PairOutlier]: 2,
  [InsightType.AbnormalBand]: 10,
  [InsightType.ExtremeValue]: 1,
  [InsightType.TurningPoint]: 1,
  [InsightType.MajorityValue]: 1,
  [InsightType.AbnormalTrend]: 2,
  [InsightType.OverallTrend]: 2,
  [InsightType.Correlation]: 2,
  [InsightType.Volatility]: 2
};

const revisedInsightByTypeMapping: Record<
  InsightType,
  (revisedInsights: RevisedInsightParams, type: InsightType, ctx: DataInsightExtractContext) => RevisedInsightParams
> = {
  [InsightType.Outlier]: mergePointInsight,
  [InsightType.PairOutlier]: null,
  [InsightType.AbnormalBand]: null,
  [InsightType.ExtremeValue]: filterInsightByType,
  [InsightType.TurningPoint]: null,
  [InsightType.MajorityValue]: filterInsightByType,
  [InsightType.AbnormalTrend]: filterInsightByType,
  [InsightType.OverallTrend]: filterInsightByType,
  [InsightType.Correlation]: filterCorrelationInsight,
  [InsightType.Volatility]: filterInsightByType,
  [InsightType.Min]: filterInsightByType,
  [InsightType.Max]: filterInsightByType,
  [InsightType.Avg]: filterInsightByType
};

export const getInsights = (context: DataInsightExtractContext, options: DataInsightOptions) => {
  const { algorithms, maxNum, isLimitedbyChartType, detailMaxNum = [], language } = options;
  const { chartType, cell, spec, originDataset } = context;
  const insights: Insight[] = [];
  const insightAlgorithmContext = { ...context, insights };
  const isStack = isStackChart(spec, chartType, cell);
  const isPercent = isPercentChart(spec, chartType, cell);

  algorithms.sort(
    (a: string, b: string) => (algorithmMapping as any)[a].priority - (algorithmMapping as any)[b].priority
  );
  algorithms.forEach(key => {
    const algoInfo = algorithmMapping[key].info;
    const {
      chartType: algoSupportedChartType,
      algorithmFunction,
      forceChartType,
      name,
      canRun,
      supportPercent,
      supportStack
    } = algoInfo;
    if (
      (!forceChartType || forceChartType.includes(chartType)) &&
      (!isLimitedbyChartType || !algoSupportedChartType || algoSupportedChartType.includes(chartType)) &&
      (!canRun || canRun(insightAlgorithmContext)) &&
      ((isStack && supportStack !== false) || !isStack) &&
      (!isPercent || (isPercent && supportPercent !== false))
    ) {
      const res = algorithmFunction(insightAlgorithmContext, options?.algorithmOptions?.[key]);
      insights.push(
        ...res.map(v => ({
          ...v,
          // transfer to origin dataset since dataset may number measurefields but string value in origin dataset
          data: v.info?.isAxesArea
            ? v.data
            : (v.data || []).map(vv => ({
                index: vv.index,
                dataItem: originDataset[vv.index]
              })),
          name
        }))
      );
    }
  });

  let res: RevisedInsightParams = {
    insights
  };
  (Object.keys(revisedInsightByTypeMapping) as InsightType[]).forEach(type => {
    const revisedFunc = revisedInsightByTypeMapping[type];
    if (revisedFunc) {
      res = revisedFunc(res, type, context);
    }
  });
  const revisedInsights: Insight[] = [];
  (Object.keys(revisedInsightByTypeMapping) as InsightType[]).forEach(type => {
    revisedInsights.push(...res[type]);
  });
  //sort the insights according to significant
  revisedInsights.sort((a, b) => {
    const significant1 = a.significant ?? -1;
    const significant2 = b.significant ?? -1;
    return InsightSortMapping[a.type] > InsightSortMapping[b.type] ||
      (InsightSortMapping[a.type] === InsightSortMapping[b.type] && significant2 - significant1 >= 0)
      ? -1
      : 1;
  });
  let afterLimitsInsights: Insight[] = [...revisedInsights];
  detailMaxNum.forEach(item => {
    const { types, maxNum } = item;
    const filteredInsights = revisedInsights.filter(insight => types.includes(insight.type)).slice(maxNum);
    afterLimitsInsights = afterLimitsInsights.filter(insight => !filteredInsights.includes(insight));
  });
  const finalInsights = generateInsightTemplate(
    maxNum ? afterLimitsInsights.slice(0, maxNum) : afterLimitsInsights,
    context,
    language
  );

  return finalInsights;
};
