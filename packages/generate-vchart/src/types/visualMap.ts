/**
 * 直角坐标系图表公共的视觉通道
 */
export interface CartesianVisualMap {
  x?: string | string[];
  y?: string | string[];
}

/**
 * 散点图的视觉通道
 */
export interface ScatterVisualMap extends CartesianVisualMap {
  color?: string | string[];
  size?: string;
}
/**
 * 玫瑰图的视觉通道
 */
export interface RoseVisualMap {
  angle?: string;
  radius?: string;
  color?: string | string[];
}

/**
 * 玫瑰图的视觉通道
 */
export interface RadarVisualMap {
  /**
   * angle
   */
  x?: string | string[];
  /**
   * radius
   */
  y?: string | string[];
  /**
   * radius
   */
  value?: string | string[];
  color?: string | string[];
}

/**
 * 饼图的视觉通道
 */
export interface PieVisualMap {
  angle?: string;
  color?: string | string[];
}

/**
 * 饼图的视觉通道
 */
export interface WordCloudVisualMap {
  size?: string;
  color?: string | string[];
}

/**
 * 桑基图的视觉通道
 */
export interface SankeyVisualMap {
  source?: string;
  target?: string;
  value?: string;
}

export interface FunnelVisualMap extends CartesianVisualMap {
  value?: string;
  color?: string | string[];
}

export interface DualAxisVisualMap {
  x?: string;
  y?: [string, string];
}
