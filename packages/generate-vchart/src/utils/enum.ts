export enum MapProjection {
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

/**
 * 地图投影类型的字符串字面量联合类型
 * 自动从 MapProjectionType 枚举派生，确保类型与枚举值同步
 */
export type MapProjectionType = typeof MapProjection[keyof typeof MapProjection];

export enum DataType {
  DATE = 'date',
  TIME = 'time',
  STRING = 'string',
  REGION = 'region',
  NUMERICAL = 'numerical',
  RATIO = 'ratio',
  COUNT = 'count',
  FLOAT = 'float',
  INT = 'int'
}

export enum DataRole {
  DIMENSION = 'dimension',
  MEASURE = 'measure'
}
