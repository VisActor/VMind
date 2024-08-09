import { ChartType } from '../../../../../../common/typings';
import type { InsightAlgorithm } from '../../../../types';
import { InsightType } from '../../../../types';

const barChartCorrelationAlgo = (_context: any): any => {
  return [];
};

const BarChartCorrelation: InsightAlgorithm = {
  name: 'spearman',
  chartType: [ChartType.BarChart, ChartType.RadarChart],
  insightType: InsightType.Correlation,
  algorithmFunction: barChartCorrelationAlgo
};

export default BarChartCorrelation;
