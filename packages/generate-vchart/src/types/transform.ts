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
export interface SimpleChartSeriesInfo {
  /**
   * 系列的类型
   */
  type: string;
  /**
   * 系列对应的数据
   */
  data: DataTable;
}

/**
 * 图表标题的配置
 */
export interface SimpleChartTitleInfo {
  text: string;
  subText?: string;
  orient?: 'top' | 'left' | 'right' | 'bottom';
}

/**
 * 图例组件, 其中type: 'discrete'表示离散类型，type: 'color'表示颜色图例；'size'表示连续数值图例
 */
export interface SimpleChartLegendInfo {
  type?: 'discrete' | 'color' | 'size';
  orient: 'top' | 'left' | 'right' | 'bottom';
}

/**
 * 坐标轴配置
 */
export interface SimpleChartAxisInfo {
  visible?: boolean;
  type: 'band' | 'linear';
  orient?: 'top' | 'left' | 'right' | 'bottom' | 'radius' | 'angle';
  hasGrid?: boolean;
  title?: string;
  hasAxisLine?: boolean;
  hasTick?: boolean;
  hasLabel?: boolean;
}

/**
 * 指标组件配置，一般在环形图、水波图、进度条等图表中使用
 */
export interface SimpleChartIndicatorInfo {
  /** 指标标题 */
  title?: string;
  /** 指标内容 */
  content?: string[];
}

/**
 * 缩略轴组件配置
 */
export interface SimpleChartDataZoomInfo {
  /** 缩略轴位置 */
  orient: 'top' | 'left' | 'right' | 'bottom';
}

/**
 * 标注点配置
 */
export interface SimpleChartMarkPointInfo {
  /** X 坐标值 */
  x: any;
  /** Y 坐标值 */
  y: any;
  /** 标注点标签 */
  label?: string;
}

/**
 * 标注线配置
 */
export interface SimpleChartMarkLineInfo {
  /** X 坐标值 */
  x?: any;
  /** Y 坐标值 */
  y?: any;
  /** 标注线标签 */
  label?: string;
}

/**
 * 标注区域配置
 */
export interface SimpleChartMarkAreaInfo {
  /** 起始 X 坐标值 */
  x?: any;
  /** 结束 X 坐标值 */
  x1?: any;
  /** 起始 Y 坐标值 */
  y?: any;
  /** 结束 Y 坐标值 */
  y1?: any;
  /** 标注区域标签 */
  label?: string;
}

/**
 * 数据标签组件配置
 */
export interface SimpleChartLabelInfo {
  /** 标签位置 */
  position: 'top' | 'left' | 'right' | 'bottom' | 'inside' | 'outside';
}

export interface GenerateChartInput {
  /**
   * Data Table values
   */
  dataTable: DataTable;
  /**
   * field mapping result
   */
  cell: Record<string, string | string[]>;
  /**
   * 数据对应的字段配置
   */
  fieldInfo?: FieldInfoItem[];
  /**
   * 系列配置
   */
  series?: SimpleChartSeriesInfo[];
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
  /** 背景色 */
  background?: string;
  /**
   * 图例组件
   * false表示不展示任何图例
   */
  legends?: SimpleChartLegendInfo | SimpleChartLegendInfo[] | false;
  /**
   * 图表的标题，可能包含主标题和副标题，通常位于图表的顶部或者底部
   */
  title?: SimpleChartTitleInfo | SimpleChartTitleInfo[] | false;
  /**
   * 返回所有的坐标轴，注意：
   * 直角坐标系的坐标轴可以位于'top' | 'left' | 'right' |'bottom', 极坐标系可以位于'radius' | 'angle'
   * hasGrid 表示是否存在垂直于轴线方向的网格线或者网格块
   * 当坐标轴不可见时，visible 为 false
   */
  axes?: SimpleChartAxisInfo | SimpleChartAxisInfo[] | false;
  /**
   * 指标组件，一般在环形图、水波图、进度条等图表中，用于展示特定的指标数据，一般位于图表的中心或者底部
   */
  indicator?: SimpleChartIndicatorInfo | SimpleChartIndicatorInfo[] | false;
  /** 缩略轴组件 */
  dataZoom?: SimpleChartDataZoomInfo | SimpleChartDataZoomInfo[] | false;
  /** 标注点 */
  markPoint?: SimpleChartMarkPointInfo | SimpleChartMarkPointInfo[] | false;
  /** 标注线 */
  markLine?: SimpleChartMarkLineInfo | SimpleChartMarkLineInfo[] | false;
  /** 标注区域 */
  markArea?: SimpleChartMarkAreaInfo | SimpleChartMarkAreaInfo[] | false;
  /**
   * 是否显示数据标签组件，注意数据标签一般位于系列图形的周围
   */
  label?: SimpleChartLabelInfo | SimpleChartLabelInfo[] | false;
}
