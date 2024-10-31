export enum ChartType {
  DynamicBarChart = 'Dynamic Bar Chart',
  BarChart = 'Bar Chart',
  LineChart = 'Line Chart',
  AreaChart = 'Area Chart',
  PieChart = 'Pie Chart',
  ScatterPlot = 'Scatter Plot',
  WordCloud = 'Word Cloud',
  RoseChart = 'Rose Chart',
  RadarChart = 'Radar Chart',
  SankeyChart = 'Sankey Chart',
  FunnelChart = 'Funnel Chart',
  DualAxisChart = 'Dual Axis Chart',
  WaterFallChart = 'Waterfall Chart',
  BoxPlot = 'Box Plot',
  LinearProgress = 'Linear Progress chart',
  CircularProgress = 'Circular Progress chart',
  LiquidChart = 'Liquid Chart',
  BubbleCirclePacking = 'Bubble Circle Packing',
  MapChart = 'Map Chart',
  RangeColumnChart = 'Range Column Chart',
  SunburstChart = 'Sunburst Chart',
  TreemapChart = 'Treemap Chart',
  Gauge = 'Gauge Chart',
  // LinearProgressChart = 'Linear Progress Chart',
  BasicHeatMap = 'Basic Heat Map',
  VennChart = 'Venn Chart'
}

export enum mapRegionProjectionType {
  ALBERS = 'albers',
  ALBERS_USA = 'albersUsa',
  AZIMUTHAL_EQUAL_AREA = 'azimuthalEqualArea',
  AZIMUTHAL_EQUIDISTANT = 'azimuthalEquidistant',
  CONIC_CONFORMAL = 'conicConformal',
  CONIC_EQUAL_AREA = 'conicEqualArea',
  CONIC_EQUIDISTANT = 'conicEquidistant',
  EQUAL_EARTH = 'equalEarth',
  EQUIRECTANGULAR = 'equirectangular',
  GNOMONIC = 'gnomonic',
  MERCATOR = 'mercator',
  NATURAL_EARTH1 = 'naturalEarth1',
  ORTHOGRAPHIC = 'orthographic',
  STEREOGRAPHIC = 'stereographic',
  TRANSVERSE_MERCATOR = 'transverseMercator'
}

export enum MapRegionCoordinate {
  CARTESIAN = 'cartesian',
  POLAR = 'polar',
  GEO = 'geo'
}

export type BasemapOption = {
  regionProjectType: mapRegionProjectionType;
  regionCoordinate: MapRegionCoordinate;
  zoom: number;
  center: number[];
};

export type Cell = {
  //字段映射，可用的视觉通道：["x","y","color","size","angle","time"]
  x?: string | string[];
  y?: string | string[];
  color?: string | string[];
  size?: string;
  angle?: string;
  radius?: string;
  time?: string;
  source?: string;
  target?: string;
  value?: string;
  category?: string;
  // if true, x and y will be transposed
  isTransposed?: boolean;
};
