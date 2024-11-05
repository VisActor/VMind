import { ChartType } from '../../../types';
import type { GenerateChartCellContext } from '../type';
import {
  axis,
  cartesianBar,
  cartesianLine,
  revisedVChartType,
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
  commonLabel
} from './transformers';

const pipelineBar = [
  revisedVChartType,
  data,
  colorBar,
  cartesianBar,
  seriesField,
  axis,
  legend,
  commonLabel,
  displayConfBar,
  //animationCartesianBar,
  theme
];
const pipelineLine = [
  revisedVChartType,
  data,
  colorLine,
  cartesianLine,
  seriesField,
  axis,
  legend,
  commonLabel,
  displayConfLine,
  //animationCartisianLine,
  theme
];
const pipeAreaLine = [...pipelineLine];
const pipelinePie = [
  revisedVChartType,
  data,
  color,
  pieField,
  legend,
  commonLabel,
  // animationCartesianPie,
  theme
];
const pipelineRankingBar = [
  revisedVChartType,
  sequenceData,
  colorDynamicBar,
  rankingBarField,
  rankingBarAxis,
  seriesField,
  commonLabel,
  customMark,
  rankingBarLabel,
  theme
];

const pipelineWordCloud = [
  revisedVChartType,
  wordCloudData,
  color,
  wordCloudField,
  wordCloudDisplayConf,
  //animationOneByOne,
  theme
];

const pipelineScatterPlot = [
  revisedVChartType,
  data,
  color,
  scatterField,
  scatterAxis,
  legend,
  //animationOneByOne,
  theme
];

const pipelineFunnel = [revisedVChartType, funnelData, color, funnelField, legend, theme];

const pipelineDualAxis = [revisedVChartType, data, color, dualAxisSeries, dualAxisAxes, legend, theme];

const pipelineRose = [
  revisedVChartType,
  data,
  color,
  roseField,
  roseAxis,
  legend,
  commonLabel,
  //animationCartesianPie,
  theme
];

const pipelineRadar = [
  revisedVChartType,
  data,
  color,
  radarField,
  radarDisplayConf,
  radarAxis,
  legend,
  commonLabel,
  //animationCartisianLine,
  theme
];

const pipelineSankey = [revisedVChartType, sankeyData, color, sankeyField, sankeyLink, sankeyLabel, legend, theme];

const pipelineWaterfall = [
  revisedVChartType,
  data,
  color,
  waterfallField,
  waterfallAxes,
  waterfallStackLabel,
  legend,
  theme
];

const pipelineBoxPlot = [revisedVChartType, data, color, boxPlotField, boxPlotStyle, legend, theme];

const pipelineLiquid = [revisedVChartType, data, color, liquidField, liquidStyle, indicator, theme];

const pipelineLinearProgress = [
  revisedVChartType,
  data,
  color,
  linearProgressField,
  linearProgressAxes,
  linearProgressStyle,
  theme
];

const pipelineCircularProgress = [
  revisedVChartType,
  data,
  color,
  circularProgressField,
  circularProgressStyle,
  indicator,
  theme
];

const pipelineBubbleCirclePacking = [
  revisedVChartType,
  bubbleCirclePackingData,
  data,
  color,
  bubbleCirclePackingField,
  bubbleCirclePackingDisplayConf,
  theme
];

const pipelineMapChart = [revisedVChartType, basemap, color, arrayData, mapField, mapDisplayConf, theme];
const pipelineRangeColumn = [revisedVChartType, data, color, rangeColumnField, rangeColumnDisplayConf, theme];
const pipelineSunburst = [revisedVChartType, sunburstData, color, sunburstOrTreemapField, sunburstDisplayConf, theme];
const pipelineTreemap = [revisedVChartType, treemapData, color, sunburstOrTreemapField, treemapDisplayConf, theme];
const pipelineGauge = [revisedVChartType, arrayData, color, gaugeField, gaugeDisplayConf, theme];
const pipelineBasicHeatMap = [
  revisedVChartType,
  arrayData,
  color,
  basicHeatMapSeries,
  basicHeatMapRegion,
  basicHeatMapColor,
  basicHeatMapAxes,
  basicHeatMapLegend,
  theme
];
const pipelineVenn = [revisedVChartType, registerChart, vennData, color, vennField, legend, theme];

const pipelineMap: { [chartType: string]: any } = {
  [ChartType.BarChart.toUpperCase()]: pipelineBar,
  [ChartType.LineChart.toUpperCase()]: pipelineLine,
  [ChartType.AreaChart.toUpperCase()]: pipeAreaLine,
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
  [ChartType.VennChart.toUpperCase()]: pipelineVenn
};

const beforePipe = () => {
  return { spec: {} };
};

const afterPipe = (context: GenerateChartCellContext) => {
  const { spec } = context;
  return { spec };
};

export const getChartSpecWithContext = (context: GenerateChartCellContext) => {
  const { chartType } = context;
  const chartSpecPipelines = [beforePipe, ...pipelineMap[chartType.toUpperCase()], afterPipe];
  let newContext = { ...context };
  chartSpecPipelines.forEach(func => {
    newContext = {
      ...newContext,
      ...func(newContext)
    };
  });
  return newContext;
};
