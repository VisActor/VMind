import type { BaseContext } from '../../types/atom';

export interface SimpleVChartSpec {
  /** 图表的类型 */
  type:
    | 'common'
    | 'area'
    | 'line'
    | 'bar'
    | 'rangeColumn'
    | 'rangeArea'
    | 'map'
    | 'pie'
    | 'radar'
    | 'rose'
    | 'scatter'
    | 'sequence'
    | 'circularProgress'
    | 'linearProgress'
    | 'wordCloud'
    | 'funnel'
    | 'waterfall'
    | 'boxPlot'
    | 'gauge'
    | 'sankey'
    | 'treemap'
    | 'sunburst'
    | 'circlePacking'
    | 'heatmap'
    | 'liquid'
    | 'venn'
    | 'mosaic'
    | 'bidirectionalBar';
  /**
   * "none" - 无坐标系
   * "rect" - 直角坐标系
   * "polar' - "极坐标系"
   */
  coordinate?: 'none' | 'rect' | 'polar';
  /** 是否发生堆积，如果是百分比堆积，返回 'percent' */
  stackOrPercent?: 'stack' | 'percent';
  /**
   * 是否存在横向条形图
   */
  transpose?: boolean;
  /*
   * 图表中的数据，数据需要按照明细数据的格式返回回来，name表示数据对应的维度值，value表示数据对应的度量值，对于有两个度量值的图（如散点图）value1表示第二个度量值；group表示分组值；注意组合图不需要在这里返回数据
   */
  data?: { name: string; value: number; group?: string; value1?: number }[];
  /** 主要图形的配色色板 */
  palette?: string[];
  /** 背景色 */
  background?: string;
  /**
   * 图例组件, 其中type: 'discrete'表示离散类型，type: 'color'表示颜色图例；'size'表示连续数值图例
   */
  legends?: { type: 'discrete' | 'color' | 'size'; orient: 'top' | 'left' | 'right' | 'bottom' }[];
  /**
   * 图表的标题，可能包含主标题和副标题，通常位于图表的顶部或者底部
   */
  title?: { text: string; subText?: string; orient: 'top' | 'left' | 'right' | 'bottom' }[];
  /**
   * 返回所有的坐标轴，注意：
   * 直角坐标系的坐标轴可以位于'top' | 'left' | 'right' |'bottom', 极坐标系可以位于'radius' | 'angle'
   * hasGrid 表示是否存在垂直于轴线方向的网格线或者网格块
   * 当坐标轴不可见时，visible 为 false
   */
  axes?: {
    visible?: boolean;
    type: 'band' | 'linear';
    orient: 'top' | 'left' | 'right' | 'bottom' | 'radius' | 'angle';
    hasGrid?: boolean;
  }[];
  /**
   * 指标组件，一般在环形图、水波图、进度条等图表中，用于展示特定的指标数据，一般位于图表的中心或者底部
   */
  indicator?: { title?: string; content?: string[] }[];
  /** 缩略轴组件 */
  dataZoom?: { orient: 'top' | 'left' | 'right' | 'bottom' }[];
  /** 标注点 */
  markPoint?: { x: any; y: any; label?: string }[];
  /** 标注线 */
  markLine?: { x?: any; y?: any; label?: string }[];
  /** 标注区域 */
  markArea?: { x?: any; x1?: any; y?: any; y1?: any; label?: string }[];
  /**
   * 是否显示数据标签组件，注意数据标签一般位于系列图形的周围
   */
  label?: { position: 'top' | 'left' | 'right' | 'bottom' | 'inside' | 'outside' }[];
  /**
   * 组合图返回图形的系列配置，非组合图不需要返回，每个系列要返回解析到的数据，数据中name表示数据对应的维度值，value表示数据对应的度量值；group表示分组值：*/
  series?: {
    type: string;
    data: { name: string; value: number; group?: string }[];
    links?: { source: string; target: string; value: number }[];
  }[];
}

/** Context of Chart Command Atom */
export interface ImageReaderCtx extends BaseContext {
  /**
   * 图片 base 64 编码
   */
  image?: string;
  /**
   * 简单图表 spec，用于生成最终的vchart spec
   */
  simpleVChartSpec?: SimpleVChartSpec;
}
