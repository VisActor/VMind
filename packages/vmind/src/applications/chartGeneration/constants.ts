import type { BasemapOption } from '../../common/typings';
import { ChartType, CombinationBasicChartType, CombinationChartType, MapRegionCoordinate } from '../../common/typings';

export const SUPPORTED_CHART_LIST = Object.values(ChartType);
export const COMBINATION_BASIC_CHART_LIST = Object.values(CombinationBasicChartType);
export const COMBINATION_CHART_LIST = Object.values(CombinationChartType);

export const NEED_COLOR_FIELD_CHART_LIST = [ChartType.PieChart, ChartType.RoseChart, ChartType.LinearProgress];

export const NEED_SIZE_FIELD_CHART_LIST = [ChartType.ScatterPlot, ChartType.BasicHeatMap, ChartType.LiquidChart];

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

export const DYNAMIC_CHART_LIST = [
  ChartType.DynamicBarChart,
  ChartType.DynamicScatterPlotChart,
  ChartType.DynamicRoseChart
];

export const DEFAULT_MAP_OPTION: BasemapOption = {
  regionProjectType: null,
  regionCoordinate: MapRegionCoordinate.GEO,
  zoom: 1,
  center: null
};
