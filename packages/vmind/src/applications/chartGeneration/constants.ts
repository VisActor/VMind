import type { BasemapOption } from '../../common/typings';
import { ChartType, MapRegionCoordinate } from '../../common/typings';

export const SUPPORTED_CHART_LIST = Object.values(ChartType);

export const NEED_COLOR_FIELD_CHART_LIST = [
  ChartType.WordCloud,
  ChartType.PieChart,
  ChartType.RoseChart,
  ChartType.MapChart,
  ChartType.BubbleCirclePacking,
  ChartType.VennChart,
  ChartType.Gauge
];

export const NEED_SIZE_FIELD_CHART_LIST = [
  ChartType.ScatterPlot,
  ChartType.WordCloud,
  ChartType.MapChart,
  ChartType.BubbleCirclePacking,
  ChartType.VennChart,
  ChartType.Gauge,
  ChartType.BasicHeatMap
];

export const DEFAULT_MAP_OPTION: BasemapOption = {
  jsonUrl: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/geojson/world.json',
  regionProjectType: null,
  regionCoordinate: MapRegionCoordinate.GEO,
  zoom: 1,
  center: null
};
