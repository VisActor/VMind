import { ChartType } from '../../../../../common/typings';
import { InsightType, type InsightAlgorithm } from '../../../types';

const defaultInsightAlgorithms: InsightAlgorithm[] = [
  {
    name: 'test',
    chartType: [ChartType.BarChart, ChartType.LineChart],
    insightType: InsightType.Outlier,
    algorithmFunction: (context: any) => {
      return {
        type: InsightType.Outlier, // Insight type
        data: [],
        text: [],
        significant: 0.1
      };
    }
  },
  {
    name: 'test2',
    chartType: [ChartType.BarChart, ChartType.LineChart],
    insightType: InsightType.ExtremeValue,
    algorithmFunction: (context: any) => {
      return {
        type: InsightType.ExtremeValue, // Insight type
        data: [],
        text: [],
        significant: 0.2
      };
    }
  }
];

export default defaultInsightAlgorithms;
