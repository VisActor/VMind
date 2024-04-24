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
  animationOneByOne,
  animationCartesianBar,
  animationCartisianLine,
  animationCartesianPie,
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
  boxPlotStyle
} from './transformers';

const pipelineBar = [chartType, data, colorBar, cartesianBar, axis, legend, displayConfBar, animationCartesianBar];
const pipelineLine = [chartType, data, colorLine, cartesianLine, axis, legend, displayConfLine, animationCartisianLine];
const pipelinePie = [chartType, data, color, pieField, legend, animationCartesianPie];
const pipelineRankingBar = [
  chartType,
  sequenceData,
  colorDynamicBar,
  rankingBarField,
  rankingBarAxis,
  customMark,
  rankingBarLabel
];

const pipelineWordCloud = [chartType, wordCloudData, color, wordCloudField, wordCloudDisplayConf, animationOneByOne];

const pipelineScatterPlot = [chartType, data, color, scatterField, scatterAxis, legend, animationOneByOne];

const pipelineFunnel = [chartType, funnelData, color, funnelField, legend];

const pipelineDualAxis = [chartType, data, color, dualAxisSeries, dualAxisAxes, legend];

const pipelineRose = [chartType, data, color, roseField, roseAxis, legend, animationCartesianPie];

const pipelineRadar = [chartType, data, color, radarField, radarDisplayConf, radarAxis, legend, animationCartisianLine];

const pipelineSankey = [chartType, sankeyData, color, sankeyField, sankeyLink, sankeyLabel, legend];

const pipelineWaterfall = [chartType, data, color, waterfallField, waterfallAxes, waterfallStackLabel, legend];
const pipelineBoxPlot = [chartType, data, color, boxPlotField, boxPlotStyle, legend];

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
  'BOX PLOT': pipelineBoxPlot
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
  spec.background = '#00000033';
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
