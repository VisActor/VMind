import { ChartType } from '../../types';

export const SUPPORTED_CHART_LIST = Object.values(ChartType);

/**
 * 需要处理color 映射的图表
 */
export const NEED_COLOR_FIELD_CHART_LIST = [ChartType.PieChart, ChartType.RoseChart, ChartType.LinearProgress];

export const NEED_SIZE_FIELD_CHART_LIST = [ChartType.ScatterPlot, ChartType.BasicHeatMap, ChartType.LiquidChart];

export const NEED_VALUE_FIELD = [ChartType.SankeyChart, ChartType.CircularProgress];

export const NEED_COLOR_AND_SIZE_CHART_LIST = [
  ChartType.WordCloud,
  ChartType.MapChart,
  ChartType.BubbleCirclePacking,
  ChartType.VennChart,
  ChartType.Gauge,
  ChartType.SunburstChart,
  ChartType.TreemapChart,
  ChartType.CircularProgress
];

export const CARTESIAN_CHART_LIST = [
  ChartType.DynamicBarChart,
  ChartType.BarChart,
  ChartType.LineChart,
  ChartType.ScatterPlot,
  ChartType.FunnelChart,
  ChartType.DualAxisChart,
  ChartType.WaterFallChart,
  ChartType.BoxPlot,
  ChartType.RangeColumnChart,
  ChartType.LinearProgress,
  ChartType.BasicHeatMap
];
