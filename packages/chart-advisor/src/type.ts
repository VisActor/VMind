//屏幕尺寸：小、中、大
export enum ScreenSize {
  LARGE = 0,
  MEDIUM = 1,
  SMALL = 2
}

//用户目的：对比、趋势、分布、排名、占比、组成、StoryTelling
export enum UserPurpose {
  NONE = 0, //未指定目的
  COMPARISON = 1,
  TREND = 2,
  DISTRIBUTION = 3,
  RANK = 4,
  PROPORTION = 5,
  COMPOSITION = 6,
  STORYTELLING = 7
}

export interface DimensionField {
  uniqueId: number; //该字段的id
  type: DataTypeName; //该字段的类型
  isGeoField?: boolean;
}

export interface MeasureField {
  uniqueId: number;
}

//measure数据集
export interface MeasureDataset {
  uniqueID?: number;
  data: number[];
  min?: number;
  max?: number;
  mean?: number; //平均值
  standardDev?: number; //标准差
  coefficient?: number; //变异系数
  Q1?: number; //下四分位数
}

//dimension数据集
export interface DimensionDataset {
  uniqueID?: number;
  data: string[];
  dataType?: DataTypeName;
  dimensionName?: string; //字段名
  cardinal?: number; //基数(不同值的数量)
  ratio?: number; //基数除以数据条数
  isGeoField?: boolean; // 是否为地理字段
}

export interface AutoChartCell {
  x: UniqueId[];
  y: UniqueId[];
  row: UniqueId[]; //作为透视行的字段
  column: UniqueId[]; //作为透视列的字段
  color?: UniqueId[];
  size?: UniqueId[];
  angle?: UniqueId[];
  value?: UniqueId[];
  text?: UniqueId[];
  group?: UniqueId[];
  error?: boolean;
  errMsg?: string;
  // 维度展开的信息（笛卡尔积）
  cartesianInfo?: CartesianInfo;
  // 指标展开的信息（指标平坦化）
  foldInfo?: FoldInfo;
}

export interface CartesianInfo {
  key: UniqueId;
  fieldList: UniqueId[];
}

export interface FoldInfo {
  key: UniqueId;
  value: UniqueId;
  foldMap: {
    [key: number]: string;
  };
}

export interface FieldTypeMap {
  [key: number]: DataTypeName;
}

export type DataItem = { [key: number]: string };

export type Dataset = DataItem[];

export type Datasets = DataItem[][][][] | Dataset;

export type UniqueId = number | string;

export type DataTypeName = 'number' | 'string' | 'date';

/**
 * vqs 接口中 visData 中的 aliasMap
 * 做字段名字映射
 */
export type AliasMap = {
  [key: number]: string;
};

/**
 * 图表类型枚举
 */
export enum ChartType {
  /** 表格 */
  TABLE = 'table',
  /** 明细表 */
  RAW_TABLE = 'raw_table',
  /** 透视表 */
  PIVOT_TABLE = 'pivot_table',

  /** 柱状图 */
  COLUMN = 'column',
  /** 百分比柱状图 */
  COLUMN_PERCENT = 'column_percent',
  /** 并列柱状图 */
  COLUMN_PARALLEL = 'column_parallel',
  /** 条形图 */
  BAR = 'bar',
  /** 百分比条形图 */
  BAR_PERCENT = 'bar_percent',
  /** 并列条形图 */
  BAR_PARALLEL = 'bar_parallel',

  /** 折线图 */
  LINE = 'line',
  /** 面积图 */
  AREA = 'area',
  /** 百分比面积图 */
  AREA_PERCENT = 'area_percent',

  /** 饼图 */
  PIE = 'pie',
  /** 环形饼图 */
  ANNULAR = 'annular',
  /** 南丁格尔玫瑰图 */
  ROSE = 'rose',

  /** 散点图 */
  SCATTER = 'scatter',
  /** 圆视图 */
  CIRCLE_VIEWS = 'circle_views',

  /** 双轴图 */
  DUAL_AXIS = 'double_axis',
  /** 双向条形图 */
  BILATERAL = 'bilateral',
  /** 组合图 */
  COMBINATION = 'combination',

  /** 填充地图 */
  MAP = 'map',
  /** 标记地图 */
  SCATTER_MAP = 'scatter_map',

  /** 指标卡 */
  MEASURE_CARD = 'measure_card',
  /** 对比指标卡 */
  COMPARATIVE_MEASURE_CARD = 'comparative_measure_card',
  /** 词云 */
  WORD_CLOUD = 'word_cloud',
  /** 直方图 */
  HISTOGRAM = 'histogram',
  /** 漏斗图 */
  FUNNEL = 'funnel',
  /** 雷达图 */
  RADAR = 'radar',
  /** 桑基图 */
  SANKEY = 'sankey',

  /** 扩展自定义类型 */
  EXTEND = 'extend',
  /** 单值百分比环形图 */
  PROGRESS = 'progress'
}

export interface ScoreResult {
  chartType: ChartType;
  originScore: number;
  fullMark: number;
  score: number;
  scoreDetails: Array<{ name: string; score: number }>;
  cell?: AutoChartCell | AutoChartCell[];
  dataset?: Datasets;
  error?: any;
}

export interface PivotTree {
  field: UniqueId;
  values: {
    value: string;
    child: PivotTree | null;
  }[];
}

export interface AdviseResult {
  chartType: ChartType; //vizData中的chartType
  scores: ScoreResult[];
  error?: any;
}

interface ScorerParams {
  inputDataSet: Dataset;
  dimList: DimensionDataset[];
  measureList: MeasureDataset[];
  aliasMap?: AliasMap;
  maxRowNum?: number;
  maxColNum?: number;
  purpose?: UserPurpose;
  screen?: ScreenSize;
}

export type Scorer = (params: ScorerParams) => Array<() => ScoreResult>;

export interface AdviserParams {
  originDataset: Dataset;
  dimensionList: DimensionField[];
  measureList: MeasureField[];
  aliasMap?: AliasMap;
  maxPivotRow?: number;
  maxPivotColumn?: number;
  purpose?: UserPurpose;
  screen?: ScreenSize;
  scorer?: Scorer;
}
