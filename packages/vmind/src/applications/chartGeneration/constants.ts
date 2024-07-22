import type { BasemapOption } from '../../common/typings';
import { ChartType, MapRegionCoordinate } from '../../common/typings';

export const SUPPORTED_CHART_LIST = Object.values(ChartType);

export const DEFAULT_MAP_OPTION: BasemapOption = {
  jsonUrl: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/geojson/world.json',
  regionProjectType: null,
  regionCoordinate: MapRegionCoordinate.GEO,
  zoom: 1,
  center: null
};
