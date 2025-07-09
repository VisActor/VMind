export enum ChartType {
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
  VennChart = 'Venn Chart',
  DynamicBarChart = 'Dynamic Bar Chart'
}

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
};

export type VMindTheme = {
  colorScheme: string[];
  background: string;
};

/**
 * Semi-design official theme
 */
export const SemiTheme: VMindTheme = {
  colorScheme: [
    '#5769FF',
    '#8ED4E7',
    '#F58700',
    '#DCB7FC',
    '#4A9CF7',
    '#F3CC35',
    '#FE8090',
    '#8BD7D2',
    '#83B023',
    '#E9A5E5',
    '#30a7ce',
    '#f9c064',
    '#b171f9',
    '#77b6f9',
    '#c88f02',
    '#ffaab2',
    '#33b0ab',
    '#b6d781',
    '#d458d4',
    '#bcc6ff'
  ],
  background: 'rgba(255,255,255,1)'
};

/**
 * Arco-design official theme
 */
export const ArcoTheme: VMindTheme = {
  colorScheme: [
    '#4080FF',
    '#BEDAFF',
    '#55C5FD',
    '#9CDCFC',
    '#FF7D00',
    '#FFCF8B',
    '#4CD263',
    '#AFF0B5',
    '#A871E3',
    '#DDBEF6',
    '#F7BA1E',
    '#FADC6D',
    '#9FDB1D',
    '#C9E968',
    '#F979B7',
    '#FB9DC7',
    '#0FC6C2',
    '#86E8DD',
    '#E865DF',
    '#F7BAEF'
  ],
  background: 'rgba(255,255,255,1)'
};

/**
 * Ve-o-design official theme
 */
export const VeOTheme: VMindTheme = {
  colorScheme: [
    '#1664FF',
    '#B2CFFF',
    '#1AC6FF',
    '#94EFFF',
    '#FF8A00',
    '#FFCE7A',
    '#3CC780',
    '#B9EDCD',
    '#7442D4',
    '#DDC5FA',
    '#FFC400',
    '#FAE878',
    '#304D77',
    '#8B959E',
    '#B48DEB',
    '#EFE3FF',
    '#009488',
    '#59BAA8',
    '#FF7DDA',
    '#FFCFEE'
  ],
  background: 'rgba(255,255,255,1)'
};

/**
 * Ve-o-design official theme for financial industry
 */
export const VeOThemeFinance: VMindTheme = {
  colorScheme: [
    '#E2B890',
    '#294C60',
    '#E04D43',
    '#324BCC',
    '#9CADC8',
    '#9D0800',
    '#AD7F45',
    '#3C4579',
    '#97A1A6',
    '#57A1B1'
  ],
  background: 'rgba(255,255,255,1)'
};

/**
 * Ve-o-design official theme for government industry
 */
export const VeOThemeGovernment: VMindTheme = {
  colorScheme: [
    '#D03132',
    '#FFC330',
    '#0147B2',
    '#758D6C',
    '#801F1F',
    '#5476A9',
    '#3F4F3A',
    '#EA750A',
    '#87929F',
    '#CF9400'
  ],
  background: 'rgba(255,255,255,1)'
};

/**
 * Ve-o-design official theme for consumer industry
 */
export const VeOThemeConsumer: VMindTheme = {
  colorScheme: [
    '#4136B2',
    '#FF334E',
    '#FFA640',
    '#8A36FF',
    '#0BE0E0',
    '#FF4DCD',
    '#8ADB00',
    '#FE8700',
    '#FF999E',
    '#00A3A3'
  ],
  background: 'rgba(255,255,255,1)'
};

/**
 * Ve-o-design official theme for automobile industry
 */
export const VeOThemeAutomobile: VMindTheme = {
  colorScheme: [
    '#1515DA',
    '#A9B6CF',
    '#142A5D',
    '#71D9D3',
    '#D9AC8C',
    '#749EFF',
    '#F95757',
    '#616C84',
    '#ABCCD1',
    '#AE2210'
  ],
  background: 'rgba(255,255,255,1)'
};

/**
 * Ve-o-design official theme for cultural and tourism industry
 */
export const VeOThemeCulturalTourism: VMindTheme = {
  colorScheme: [
    '#61BA95',
    '#335B4A',
    '#7A94BF',
    '#2E5599',
    '#B9A582',
    '#735A40',
    '#BC9B44',
    '#99533D',
    '#809E9D',
    '#2E8582'
  ],
  background: 'rgba(255,255,255,1)'
};

/**
 * Ve-o-design official theme for medical industry
 */
export const VeOThemeMedical: VMindTheme = {
  colorScheme: [
    '#50D3D2',
    '#2A488C',
    '#F08EBB',
    '#DD3382',
    '#93B3FF',
    '#816CE2',
    '#FCC18F',
    '#398282',
    '#B3AFC5',
    '#4F68A1'
  ],
  background: 'rgba(255,255,255,1)'
};

/**
 * Ve-o-design official theme for new energy industry
 */
export const VeOThemeNewEnergy: VMindTheme = {
  colorScheme: [
    '#0BDB7D',
    '#133C7A',
    '#FFBE00',
    '#217185',
    '#7DD4EA',
    '#126FFE',
    '#B0C71B',
    '#8B4BFB',
    '#01C2C2',
    '#78808C'
  ],
  background: 'rgba(255,255,255,1)'
};

export type { ITheme as ChartTheme } from '@visactor/vchart';
