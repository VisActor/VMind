import type { BasemapOption } from '../../common/typings';
import { ChartType, MapRegionCoordinate } from '../../common/typings';

export const SUPPORTED_CHART_LIST = Object.values(ChartType);

export const NEED_COLOR_FIELD_CHART_LIST = [ChartType.PieChart, ChartType.RoseChart, ChartType.LinearProgress];

export const NEED_SIZE_FIELD_CHART_LIST = [ChartType.ScatterPlot, ChartType.BasicHeatMap];

export const NEED_COLOR_AND_SIZE_CHART_LIST = [
  ChartType.WordCloud,
  ChartType.MapChart,
  ChartType.BubbleCirclePacking,
  ChartType.VennChart,
  ChartType.Gauge,
  ChartType.SunburstChart,
  ChartType.TreemapChart,
  ChartType.CircularProgress,
  ChartType.LiquidChart
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
  ChartType.LinearProgress
];

export const DEFAULT_MAP_OPTION: BasemapOption = {
  regionProjectType: null,
  regionCoordinate: MapRegionCoordinate.GEO,
  zoom: 1,
  center: null
};
