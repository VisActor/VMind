import { MapProjectionType } from '../utils/enum';

export interface BasemapOption {
  regionProjectType: MapProjectionType;
  regionCoordinate: 'polar' | 'cartesian' | 'geo';
  zoom: number;
  center: number[];
  mapName?: string;
}
/**
 * 动画配置
 */
export interface AnimationOptions {
  totalTime?: number;
}

/** Base DataCell */
export type DataCell = string | number;

/** Base Data Item */
export type DataItem = Record<string, DataCell>;

/** Data Table */
export type DataTable = DataItem[];

export type FieldDataType = 'date' | 'time' | 'string' | 'region' | 'numerical' | 'ratio' | 'count' | 'float' | 'int';

export type FieldDataRole = 'dimension' | 'measure';

export interface FieldInfoItem {
  /**
   * 字段的名称，需要保持唯一性
   */
  fieldName: string;
  /**
   * 字段的类型
   */
  type?: FieldDataType | string;
  /**
   *
   */
  role: FieldDataRole;
  /**
   * 字段别名，通常更加有语意
   */
  alias?: string;
  /**
   * 字段的描述
   */
  description?: string;
  /**
   * 度量字段对应的单位
   */
  unit?: string;
  /**
   * 百分比字段的粒度
   */
  ratioGranularity?: '%' | '‰';
}

/**
 * 最简化的系列配置，通常是大模型生成的
 */
export interface SimpleSeriesInfo {
  /**
   * 系列的类型
   */
  type: string;
  /**
   * 系列对应的数据
   */
  data: DataTable;
}

export interface GenerateChartInput {
  /**
   * Data Table values
   */
  dataTable: DataTable;
  /**
   * 数据对应的字段配置
   */
  fieldInfo?: FieldInfoItem[];
  /**
   * 系列配置
   */
  series?: SimpleSeriesInfo[];
  /**
   * field mapping result
   */
  cell: Record<string, string | string[]>;
  /**
   * chart type generator result
   */
  chartType?: string;
  /**
   * 图表配色
   */
  colors?: string[];
  /**
   * 图表主题配置
   */
  chartTheme?: any | string;
  /**
   * 地图配置
   */
  basemapOption?: BasemapOption;
  /**
   * 动画配置
   */
  animationOptions?: AnimationOptions;
  /**
   * 堆叠或百分比堆积
   * 堆叠：stack
   * 百分比堆积：percent
   */
  stackOrPercent?: 'stack' | 'percent';
  /**
   * 是否发生转置
   */
  transpose?: boolean;
  /**
   * 最终生成的图表spec
   */
  spec?: any;
}
