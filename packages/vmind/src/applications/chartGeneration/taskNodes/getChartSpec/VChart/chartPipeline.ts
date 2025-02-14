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
  registerChart,
  seriesField,
  commonSingleColumnRegion,
  commonSingleColumnSeries,
  commonSingleColumnLegend,
  commonSingleColumnAxes,
  commonSingleColumnLayout,
  dynamicScatterPlotAxes,
  dynamicScatterPlotSeries,
  dynamicScatterPlotAnimation,
  colorDynamicScatterPlot,
  dynamicScatterPlotTooltip,
  dynamicRoseAnimation,
  dynamicRoseField,
  dynamicRoseDisplayConf,
  sequenceChartData,
  sequenceChartSeries,
  sequenceChartAxes
} from './transformers';

const pipelineBar = [
  chartType,
  data,
  colorBar,
  cartesianBar,
  seriesField,
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
  seriesField,
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
  seriesField,
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

const pipelineMapChart = [chartType, basemap, color, arrayData, mapField, mapDisplayConf, theme];
const pipelineRangeColumn = [chartType, data, color, rangeColumnField, rangeColumnDisplayConf, theme];
const pipelineSunburst = [chartType, sunburstData, color, sunburstOrTreemapField, sunburstDisplayConf, theme];
const pipelineTreemap = [chartType, treemapData, color, sunburstOrTreemapField, treemapDisplayConf, theme];
const pipelineGauge = [chartType, arrayData, color, gaugeField, gaugeDisplayConf, theme];
const pipelineBasicHeatMap = [
  chartType,
  arrayData,
  color,
  basicHeatMapSeries,
  basicHeatMapRegion,
  basicHeatMapColor,
  basicHeatMapAxes,
  basicHeatMapLegend,
  theme
];
const pipelineVenn = [chartType, registerChart, vennData, color, vennField, legend, theme];
const pipelineSingleColumnCombinationChart = [
  chartType,
  commonSingleColumnRegion,
  commonSingleColumnSeries,
  commonSingleColumnLegend,
  commonSingleColumnAxes,
  commonSingleColumnLayout,
  theme
];
const pipelineDynamicScatterPlotChart = [
  chartType,
  sequenceData,
  colorDynamicScatterPlot,
  dynamicScatterPlotAnimation,
  dynamicScatterPlotAxes,
  dynamicScatterPlotSeries,
  customMark,
  dynamicScatterPlotTooltip,
  theme
];
const pipelineDynamicRoseChart = [
  chartType,
  sequenceData,
  dynamicRoseAnimation,
  dynamicRoseField,
  dynamicRoseDisplayConf,
  customMark,
  theme
];
const pipelineSequenceChart = [chartType, sequenceChartData, sequenceChartSeries, sequenceChartAxes, theme];

const pipelineMap: { [chartType: string]: any } = {
  [ChartType.BarChart.toUpperCase()]: pipelineBar,
  [ChartType.LineChart.toUpperCase()]: pipelineLine,
  [ChartType.PieChart.toUpperCase()]: pipelinePie,
  [ChartType.WordCloud.toUpperCase()]: pipelineWordCloud,
  [ChartType.ScatterPlot.toUpperCase()]: pipelineScatterPlot,
  [ChartType.DynamicBarChart.toUpperCase()]: pipelineRankingBar,
  [ChartType.FunnelChart.toUpperCase()]: pipelineFunnel,
  [ChartType.DualAxisChart.toUpperCase()]: pipelineDualAxis,
  [ChartType.RoseChart.toUpperCase()]: pipelineRose,
  [ChartType.RadarChart.toUpperCase()]: pipelineRadar,
  [ChartType.SankeyChart.toUpperCase()]: pipelineSankey,
  [ChartType.WaterFallChart.toUpperCase()]: pipelineWaterfall,
  [ChartType.BoxPlot.toUpperCase()]: pipelineBoxPlot,
  [ChartType.LiquidChart.toUpperCase()]: pipelineLiquid,
  [ChartType.LinearProgress.toUpperCase()]: pipelineLinearProgress,
  [ChartType.CircularProgress.toUpperCase()]: pipelineCircularProgress,
  [ChartType.BubbleCirclePacking.toUpperCase()]: pipelineBubbleCirclePacking,
  [ChartType.MapChart.toUpperCase()]: pipelineMapChart,
  [ChartType.RangeColumnChart.toUpperCase()]: pipelineRangeColumn,
  [ChartType.SunburstChart.toUpperCase()]: pipelineSunburst,
  [ChartType.TreemapChart.toUpperCase()]: pipelineTreemap,
  [ChartType.Gauge.toUpperCase()]: pipelineGauge,
  [ChartType.BasicHeatMap.toUpperCase()]: pipelineBasicHeatMap,
  [ChartType.VennChart.toUpperCase()]: pipelineVenn,
  [ChartType.SingleColumnCombinationChart.toUpperCase()]: pipelineSingleColumnCombinationChart,
  [ChartType.DynamicScatterPlotChart.toUpperCase()]: pipelineDynamicScatterPlotChart,
  [ChartType.DynamicRoseChart.toUpperCase()]: pipelineDynamicRoseChart,
  [ChartType.SequenceChart.toUpperCase()]: pipelineSequenceChart
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
