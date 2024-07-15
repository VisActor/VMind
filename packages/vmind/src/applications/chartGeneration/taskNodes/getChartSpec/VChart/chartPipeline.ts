import { ChartType } from '../../../../../common/typings';
import type { Transformer } from '../../../../../base/tools/transformer';
import type { GetChartSpecContext, GetChartSpecOutput } from '../types';
import {
  axis,
  cartesianBar,
  cartesianLine,
  chartType,
  color,
  data,
  legend,
  pieField,
  scatterField,
  wordCloudField,
  roseField,
  roseAxis,
  radarField,
  radarDisplayConf,
  radarAxis,
  sankeyData,
  sankeyField,
  sankeyLabel,
  sankeyLink,
  sequenceData,
  rankingBarAxis,
  rankingBarField,
  customMark,
  scatterAxis,
  wordCloudData,
  displayConfBar,
  displayConfLine,
  colorLine,
  colorBar,
  colorDynamicBar,
  wordCloudDisplayConf,
  rankingBarLabel,
  funnelField,
  funnelData,
  dualAxisSeries,
  dualAxisAxes,
  waterfallField,
  waterfallAxes,
  waterfallStackLabel,
  boxPlotField,
  boxPlotStyle,
  theme,
  liquidField,
  liquidStyle,
  linearProgressField,
  circularProgressField,
  circularProgressStyle,
  linearProgressStyle,
  linearProgressAxes,
  indicator,
  bubbleCirclePackingField,
  bubbleCirclePackingDisplayConf,
  bubbleCirclePackingData,
  rangeColumnField,
  rangeColumnDisplayConf,
  sunburstData,
  sunburstDisplayConf,
  treemapData,
  sunburstOrTreemapField,
  treemapDisplayConf,
  gaugeField,
  gaugeDisplayConf,
  // linearProgressField,
  // linearProgressDisplayConf,
  arrayData,
  vennData,
  vennField,
  basicHeatMapSeries,
  basicHeatMapRegion,
  basicHeatMapColor,
  basicHeatMapAxes,
  basicHeatMapLegend,
  basemap,
  mapField,
  mapDisplayConf,
  registerChart
} from './transformers';

const pipelineBar = [
  chartType,
  data,
  colorBar,
  cartesianBar,
  axis,
  legend,
  displayConfBar,
  //animationCartesianBar,
  theme
];
const pipelineLine = [
  chartType,
  data,
  colorLine,
  cartesianLine,
  axis,
  legend,
  displayConfLine,
  //animationCartisianLine,
  theme
];
const pipelinePie = [
  chartType,
  data,
  color,
  pieField,
  legend,
  // animationCartesianPie,
  theme
];
const pipelineRankingBar = [
  chartType,
  sequenceData,
  colorDynamicBar,
  rankingBarField,
  rankingBarAxis,
  customMark,
  rankingBarLabel,
  theme
];

const pipelineWordCloud = [
  chartType,
  wordCloudData,
  color,
  wordCloudField,
  wordCloudDisplayConf,
  //animationOneByOne,
  theme
];

const pipelineScatterPlot = [
  chartType,
  data,
  color,
  scatterField,
  scatterAxis,
  legend,
  //animationOneByOne,
  theme
];

const pipelineFunnel = [chartType, funnelData, color, funnelField, legend, theme];

const pipelineDualAxis = [chartType, data, color, dualAxisSeries, dualAxisAxes, legend, theme];

const pipelineRose = [
  chartType,
  data,
  color,
  roseField,
  roseAxis,
  legend,
  //animationCartesianPie,
  theme
];

const pipelineRadar = [
  chartType,
  data,
  color,
  radarField,
  radarDisplayConf,
  radarAxis,
  legend,
  //animationCartisianLine,
  theme
];

const pipelineSankey = [chartType, sankeyData, color, sankeyField, sankeyLink, sankeyLabel, legend, theme];

const pipelineWaterfall = [chartType, data, color, waterfallField, waterfallAxes, waterfallStackLabel, legend, theme];

const pipelineBoxPlot = [chartType, data, color, boxPlotField, boxPlotStyle, legend, theme];

const pipelineLiquid = [chartType, data, color, liquidField, liquidStyle, indicator, theme];

const pipelineLinearProgress = [
    chartType,
    data,
    color,
    linearProgressField,
    linearProgressAxes,
    linearProgressStyle,
    theme
];

const pipelineCircularProgress = [
    chartType,
    data,
    color,
    circularProgressField,
    circularProgressStyle,
    indicator,
    theme
];

const pipelineBubbleCirclePacking = [
  chartType,
  bubbleCirclePackingData,
  data,
  color,
  bubbleCirclePackingField,
  bubbleCirclePackingDisplayConf,
  theme
];

const pipelineMapChart = [chartType, basemap, arrayData, mapField, mapDisplayConf, theme];
const pipelineRangeColumn = [chartType, data, rangeColumnField, rangeColumnDisplayConf, theme];
const pipelineSunburst = [chartType, sunburstData, sunburstOrTreemapField, sunburstDisplayConf, theme];
const pipelineTreemap = [chartType, treemapData, sunburstOrTreemapField, treemapDisplayConf, theme];
const pipelineGauge = [chartType, arrayData, gaugeField, gaugeDisplayConf, theme];
// const pipelineLinearProgress = [chartType, arrayData, linearProgressField, linearProgressDisplayConf, theme];
const pipelineBasicHeatMap = [
  chartType,
  arrayData,
  basicHeatMapSeries,
  basicHeatMapRegion,
  basicHeatMapColor,
  basicHeatMapAxes,
  basicHeatMapLegend,
  theme
];
const pipelineVenn = [chartType, registerChart, vennData, vennField, legend, theme];

const pipelineMap: { [chartType: string]: any } = {
  'BAR CHART': pipelineBar,
  'LINE CHART': pipelineLine,
  'PIE CHART': pipelinePie,
  'WORD CLOUD': pipelineWordCloud,
  'SCATTER PLOT': pipelineScatterPlot,
  'DYNAMIC BAR CHART': pipelineRankingBar,
  'FUNNEL CHART': pipelineFunnel,
  'DUAL AXIS CHART': pipelineDualAxis,
  'ROSE CHART': pipelineRose,
  'RADAR CHART': pipelineRadar,
  'SANKEY CHART': pipelineSankey,
  'WATERFALL CHART': pipelineWaterfall,
  'BOX PLOT': pipelineBoxPlot,
  [ChartType.LiquidChart.toUpperCase()]: pipelineLiquid,
  [ChartType.LinearProgress.toUpperCase()]: pipelineLinearProgress,
  [ChartType.CircularProgress.toUpperCase()]: pipelineCircularProgress,
  'BOX PLOT': pipelineBoxPlot,
  'BUBBLE CIRCLE PACKING': pipelineBubbleCirclePacking,
  'MAP CHART': pipelineMapChart,
  'RANGE COLUMN CHART': pipelineRangeColumn,
  'SUNBURST CHART': pipelineSunburst,
  'TREEMAP CHART': pipelineTreemap,
  'GAUGE CHART': pipelineGauge,
  // 'LINEAR PROGRESS CHART': pipelineLinearProgress,
  'BASIC HEAT MAP': pipelineBasicHeatMap,
  'VENN CHART': pipelineVenn
};

export const beforePipe: Transformer<GetChartSpecContext & GetChartSpecOutput, GetChartSpecOutput> = (
  _context: GetChartSpecContext & GetChartSpecOutput
) => {
  return { spec: {} };
};

export const afterPipe: Transformer<GetChartSpecContext & GetChartSpecOutput, GetChartSpecOutput> = (
  context: GetChartSpecContext & GetChartSpecOutput
) => {
  const { spec } = context;
  // spec.background = '#00000033';
  return { spec };
};

export const getChartPipelines: (
  context: GetChartSpecContext
) => Transformer<GetChartSpecContext, GetChartSpecOutput>[] = (context: GetChartSpecContext) => {
  const { chartType } = context;
  return [beforePipe].concat(pipelineMap[chartType.toUpperCase()]).concat([afterPipe]) as Transformer<
    GetChartSpecContext,
    GetChartSpecOutput
  >[];
};
