import { GenerateChartInput } from './types';
import * as allTransformers from './transformers';
import { isNil } from '@visactor/vutils';
import { getFieldInfoFromDataset } from './utils/field';

const {
  pipelineBar,
  pipelineBasicHeatMap,
  pipelineBoxPlot,
  pipelineBubbleCirclePacking,
  pipelineCircularProgress,
  pipelineDualAxis,
  pipelineFunnel,
  pipelineGauge,
  pipelineLine,
  pipelineLinearProgress,
  pipelineLiquid,
  pipelineMapChart,
  pipelinePie,
  pipelineRadar,
  pipelineRangeColumn,
  pipelineRankingBar,
  pipelineRose,
  pipelineSankey,
  pipelineScatterPlot,
  pipelineSunburst,
  pipelineTreemap,
  pipelineVenn,
  pipelineWaterfall,
  pipelineWordCloud,
  addSimpleComponents,
  theme
} = allTransformers;

const pipelineMap: {
  [chartType: string]: {
    type: string;
    aliasName: string;
    pipline: ((context: GenerateChartInput) => Partial<GenerateChartInput>)[];
  };
} = {
  bar: { type: 'bar', aliasName: 'Bar Chart', pipline: pipelineBar },
  line: { type: 'line', aliasName: 'Line Chart', pipline: pipelineLine },
  area: { type: 'area', aliasName: 'Area Chart', pipline: pipelineLine },
  pie: { type: 'pie', aliasName: 'Pie Chart', pipline: pipelinePie },
  wordcloud: { type: 'wordCloud', aliasName: 'Word Cloud', pipline: pipelineWordCloud },
  scatter: { type: 'scatter', aliasName: 'Scatter Plot', pipline: pipelineScatterPlot },
  ranking_bar: { type: 'bar', aliasName: 'Dynamic Bar Chart', pipline: pipelineRankingBar },
  funnel: { type: 'funnel', aliasName: 'Funnel Chart', pipline: pipelineFunnel },
  dual_axis: { type: 'common', aliasName: 'Dual Axis Chart', pipline: pipelineDualAxis },
  rose: { type: 'rose', aliasName: 'Rose Chart', pipline: pipelineRose },
  radar: { type: 'radar', aliasName: 'Radar Chart', pipline: pipelineRadar },
  sankey: { type: 'sankey', aliasName: 'Sankey Chart', pipline: pipelineSankey },
  waterfall: { type: 'waterfall', aliasName: 'Waterfall Chart', pipline: pipelineWaterfall },
  boxplot: { type: 'boxPlot', aliasName: 'Box Plot', pipline: pipelineBoxPlot },
  liquid: { type: 'liquid', aliasName: 'Liquid Chart', pipline: pipelineLiquid },
  linear_progress: { type: 'linearProgress', aliasName: 'Linear Progress chart', pipline: pipelineLinearProgress },
  circular_progress: {
    type: 'circularProgress',
    aliasName: 'Circular Progress chart',
    pipline: pipelineCircularProgress
  },
  circle_packing: { type: 'circlePacking', aliasName: 'Bubble Circle Packing', pipline: pipelineBubbleCirclePacking },
  map: { type: 'map', aliasName: 'Map Chart', pipline: pipelineMapChart },
  range_column: { type: 'rangeColumn', aliasName: 'Range Column Chart', pipline: pipelineRangeColumn },
  sunburst: { type: 'sunburst', aliasName: 'Sunburst Chart', pipline: pipelineSunburst },
  treemap: { type: 'treemap', aliasName: 'Treemap Chart', pipline: pipelineTreemap },
  gauge: { type: 'gauge', aliasName: 'Gauge Chart', pipline: pipelineGauge },
  heatmap: { type: 'heatmap', aliasName: 'Basic Heat Map', pipline: pipelineBasicHeatMap },
  venn: { type: 'venn', aliasName: 'Venn Chart', pipline: pipelineVenn }
};

export const findPipelineByType = (type: string) => {
  if (pipelineMap[type]) {
    return pipelineMap[type];
  }

  return Object.values(pipelineMap).find(entry => {
    return entry.type === type || entry.aliasName.toLocaleLowerCase() === type.toLocaleLowerCase();
  });
};

export const generateChart = (type: string, context: GenerateChartInput) => {
  if (!type) {
    return context;
  }
  const pipeline = findPipelineByType(type);
  if (pipeline) {
    context.spec = {
      type: pipeline.type
    };

    if (isNil(context.fieldInfo)) {
      context.fieldInfo = getFieldInfoFromDataset(context.dataTable);
    }

    const chartSpecPipelines = [addSimpleComponents, ...pipeline.pipline, theme];
    let newContext = { ...context };
    chartSpecPipelines.forEach(func => {
      newContext = {
        ...newContext,
        ...func(newContext)
      };
    });
    return newContext;
  }

  return context;
};
