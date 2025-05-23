import type { Cell, ChartType } from '../../types/chart';
import type { DataCell, FieldInfo, DataTable, DataItem } from '../../types/base';
import type { AbnormalTrendOptions } from './algorithms/abnormalTrend';
import type { PearsonOptions } from './algorithms/correlation/pearson';
import type { OverallTrendingOptions } from './algorithms/overallTrending';
import type { SpearmanOptions } from './algorithms/correlation/spearman';
import type { ExtremeValueOptions } from './algorithms/extremeValue';
import type { MajorityValueOptions } from './algorithms/majorityValue';
import type { LOFOptions } from './algorithms/outlier/lof';
import type { DbscanOptions } from './algorithms/outlier/dbscan';
import type { VolatilityOptions } from './algorithms/volatility';
import type { StatisticsOptions } from './algorithms/outlier/statistics';
import type { DifferenceOptions } from './algorithms/outlier/difference';
import type { PageHinkleyOptions } from './algorithms/drift';
import type { BaseStatisticsOptions } from './algorithms/base/baseStatistics';
import type { BaseOptions } from '../../types/atom';

export enum AlgorithmType {
  OverallTrending = 'overallTrend',
  AbnormalTrend = 'abnormalTrend',
  PearsonCorrelation = 'pearsonCorrelation',
  SpearmanCorrelation = 'spearmanCorrelation',
  ExtremeValue = 'extremeValue',
  MajorityValue = 'majorityValue',
  StatisticsAbnormal = 'statisticsAbnormal',
  StatisticsBase = 'statisticsBase',
  DbscanOutlier = 'dbscanOutlier',
  LOFOutlier = 'lofOutlier',
  TurningPoint = 'turningPoint',
  PageHinkley = 'pageHinkley',
  DifferenceOutlier = 'differenceOutlier',
  Volatility = 'volatility'
}

export interface AlgorithmOptions {
  [AlgorithmType.OverallTrending]?: OverallTrendingOptions;
  [AlgorithmType.AbnormalTrend]?: AbnormalTrendOptions;
  [AlgorithmType.PearsonCorrelation]?: PearsonOptions;
  [AlgorithmType.SpearmanCorrelation]: SpearmanOptions;
  [AlgorithmType.ExtremeValue]?: ExtremeValueOptions;
  [AlgorithmType.MajorityValue]?: MajorityValueOptions;
  [AlgorithmType.StatisticsAbnormal]?: StatisticsOptions;
  [AlgorithmType.LOFOutlier]?: LOFOptions;
  [AlgorithmType.DifferenceOutlier]?: DifferenceOptions;
  [AlgorithmType.TurningPoint]?: {};
  [AlgorithmType.PageHinkley]?: PageHinkleyOptions;
  [AlgorithmType.DbscanOutlier]: DbscanOptions;
  [AlgorithmType.Volatility]: VolatilityOptions;
  [AlgorithmType.StatisticsBase]?: BaseStatisticsOptions;
}
export enum InsightType {
  Min = 'min',
  Max = 'max',
  Avg = 'avg',
  Outlier = 'outlier',
  PairOutlier = 'pair_outlier',
  ExtremeValue = 'extreme_value',
  MajorityValue = 'majority_value',
  TurningPoint = 'turning_point',
  OverallTrend = 'overall_trend',
  AbnormalTrend = 'abnormal_trend',
  AbnormalBand = 'abnormal_band',
  Correlation = 'correlation',
  Volatility = 'volatility'
}

export interface InsightTextContent {
  value: DataCell;
  formatValue?: string;
  fieldName: string;
  isMeasure?: boolean;
  color?: string;
  valueType?: 'ascendTrend' | 'descendTrend' | string;
  icon?: 'ratio' | 'ascendTrend' | 'descendTrend' | string;
  isDimValue?: boolean;
}

export interface Insight {
  name: string; // algorithm name
  type: InsightType; // Insight type
  data: {
    // Abnormal data points
    index: number; // The index of the data point in the dataset
    dataItem: DataItem; // Data item
  }[];
  fieldId?: string; //abnormal field id
  seriesName?: DataCell | DataCell[]; //series name
  textContent?: {
    // The text explanation of the insight, included variables placeholder
    content: string;
    // Plain text after parse variables placeholder into text
    plainText: string;
    variables?: Record<string, InsightTextContent>;
  }; // The text array is composed of text fragments, and all elements in the array are combined to form a complete text.
  value?: number | string; // The specific value of the insight
  significant: number; // The prominence of insights, used for sorting
  info?: { [key: string]: any }; //additional information about this insight
}

export type InsightAlgorithm = {
  name: string; //specific algorithm name of this insight algorithm
  chartType?: ChartType[]; //supported chart type of this insight algorithm
  forceChartType?: ChartType[]; //force chart type of this insight algorithm
  /** support stack chart or not */
  supportStack?: boolean;
  /** support percent chart or not */
  supportPercent?: boolean;
  insightType: InsightType;
  canRun?: (context: DataInsightExtractContext) => boolean;
  algorithmFunction: (context: DataInsightExtractContext, options: any) => Insight[];
};

export type DataProcessOutput = {
  chartType: ChartType;
  cell: DataCell;
  fieldInfo: FieldInfo[];
  dataTable: DataTable;
  seriesDataMap: Record<string | number, { index: number; dataItem: DataItem }[]>;
};

export type ExtractInsightOutput = {
  insights: Insight[];
};

export type GenerateTextOutput = {
  insights: Insight[];
  usage: any;
};

export interface ChartDataItem {
  index: number;
  dataItem: DataItem;
}

export type DimValueDataMap = Record<string | number, ChartDataItem[]>;

export interface AxesDataInfo {
  dataset: DataTable;
  seriesNames: string[];
  series: any[];
  seriesIndex: number;
  seriesId: string;
  dimensionDataMap: DimValueDataMap;
  dimensionValues: DataCell[];
  dimensionSumMap: Record<string, number[]>;
  dimensionStackSumMap: Record<string, number[]>;
  axisTitle: string | string[];
  yField: string | string[];
}

export interface DataInsightExtractContext {
  dataset: DataTable;
  originDataset: DataTable;
  fieldInfo: FieldInfo[];
  dimensionDataMap: DimValueDataMap;
  dimensionSumMap: Record<string, number[]>;
  dimensionStackSumMap: Record<string, number[]>;
  dimensionValues: DataCell[];
  seriesDataMap: DimValueDataMap;
  chartType: ChartType;
  cell: Cell;
  spec: any;
  insights?: Insight[];
  leftAxesDataList?: AxesDataInfo;
  rightAxesDataList?: AxesDataInfo;
}

export interface DataInsightOptions extends BaseOptions {
  /** max number of insight */
  maxNum?: number;
  /** detail number limits of insight, higher priority than maxNum */
  detailMaxNum?: {
    types: InsightType[];
    maxNum: number;
  }[];
  /** using algorithms list */
  algorithms?: AlgorithmType[];
  /** options of each algorithms */
  algorithmOptions?: AlgorithmOptions;
  /** insight limited by chartType, eg. cluster only in scatter chart */
  isLimitedbyChartType?: boolean;
  /** polish insights by llm or not */
  usePolish?: boolean;
  /** add insights into spec */
  enableInsightAnnotation?: boolean;
}
