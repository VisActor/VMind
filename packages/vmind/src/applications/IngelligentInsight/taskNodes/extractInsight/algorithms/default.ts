import type { InsightAlgorithm } from '../../../types';
import AbnormalTrend from './abnormalTrend';
import ScatterPlotCorrelation from './correlation/pearson';
import LineChartCorrelation from './correlation/spearman';
import ExtremeValue from './extremeValue';
import LineChartMajorityValue from './majorityValue';
import DBSCANOutlier from './outlier/dbscan';
import LOFOutlier from './outlier/lof';
import OverallTrending from './overallTrending';
import TurningPoint from './turningPoint';
import Volatility from './volatility';

const defaultInsightAlgorithms: InsightAlgorithm[] = [
  AbnormalTrend,
  ScatterPlotCorrelation,
  LineChartCorrelation,
  ExtremeValue,
  LineChartMajorityValue,
  DBSCANOutlier,
  LOFOutlier,
  OverallTrending,
  TurningPoint,
  Volatility
];

export default defaultInsightAlgorithms;
