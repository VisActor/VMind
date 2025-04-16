import { isArray } from '@visactor/vutils';
import { ChartType } from '../../../types';
import type { GenerateChartCellContext } from '../type';
import { estimateVideoTime } from '../utils';
import { llmChartTypeMap } from './chartTypeUtils';
import { pipelineBar } from './transformers/bar';
import { pipelineBoxPlot } from './transformers/boxplot';
import { pipelineBubbleCirclePacking } from './transformers/circlePacking';
import { pipelineCircularProgress } from './transformers/circularProgress';
import { revisedVChartType, theme } from './transformers/common';
import { pipelineDualAxis } from './transformers/dualAxis';
import { pipelineFunnel } from './transformers/funnel';
import { pipelineGauge } from './transformers/gauge';
import { pipelineBasicHeatMap } from './transformers/heatmap';
import { pipelineLine } from './transformers/line';
import { pipelineLinearProgress } from './transformers/linearProgress';
import { pipelineLiquid } from './transformers/liquid';
import { pipelineMapChart } from './transformers/map';
import { pipelinePie } from './transformers/pie';
import { pipelineRadar } from './transformers/radar';
import { pipelineRangeColumn } from './transformers/rangeColumn';
import { pipelineRankingBar } from './transformers/rankingBar';
import { pipelineRose } from './transformers/rose';
import { pipelineSankey } from './transformers/sankey';
import { pipelineScatterPlot } from './transformers/scatter';
import { pipelineSunburst } from './transformers/sunburst';
import { pipelineTreemap } from './transformers/treemap';
import { pipelineVenn } from './transformers/venn';
import { pipelineWaterfall } from './transformers/waterfall';
import { pipelineWordCloud } from './transformers/wordcloud';

const pipelineMap: { [chartType: string]: any } = {
  [ChartType.BarChart.toUpperCase()]: pipelineBar,
  [ChartType.LineChart.toUpperCase()]: pipelineLine,
  [ChartType.AreaChart.toUpperCase()]: pipelineLine,
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

const beforePipe = (context: GenerateChartCellContext) => {
  const { simpleVChartSpec } = context;
  const spec: any = {};

  if (simpleVChartSpec) {
    if (simpleVChartSpec.legends) {
      spec.legends = simpleVChartSpec.legends;
    }
    if (simpleVChartSpec.title) {
      spec.title = simpleVChartSpec.title;
    }

    if (simpleVChartSpec.axes) {
      spec.axes = simpleVChartSpec.axes;
    }

    if (simpleVChartSpec.dataZoom) {
      spec.dataZoom = simpleVChartSpec.dataZoom;
    }

    if (simpleVChartSpec.markPoint) {
      spec.markPoint = simpleVChartSpec.markPoint.map(entry => {
        return {
          ...entry,
          visible: true,
          x: entry.x,
          y: entry.y,
          label: {
            text: entry.label
          }
        };
      });
    }

    if (simpleVChartSpec.markLine) {
      spec.markLine = simpleVChartSpec.markLine.map(entry => {
        return {
          ...entry,
          visible: true,
          x: entry.x,
          y: entry.y,
          label: {
            text: entry.label
          }
        };
      });
    }

    if (simpleVChartSpec.markArea) {
      spec.markArea = simpleVChartSpec.markArea.map(entry => {
        return {
          ...entry,
          visible: true,
          x: entry.x,
          y: entry.y,
          label: {
            text: entry.label
          }
        };
      });
    }

    if (simpleVChartSpec.label) {
      spec.label = isArray(simpleVChartSpec.label)
        ? simpleVChartSpec.label.map(entry => {
            return {
              ...entry,
              visible: true
            };
          })
        : {
            ...(simpleVChartSpec.label as any),
            visible: true
          };
    }

    if (simpleVChartSpec.indicator) {
      const formatIndicator = (entry: any) => {
        return {
          title: {
            style: {
              text: entry.title
            }
          },
          content: isArray(entry.content)
            ? entry.content.map((t: string) => {
                return {
                  style: {
                    text: t
                  }
                };
              })
            : {
                style: {
                  text: entry.content
                }
              }
        };
      };
      spec.indicator = isArray(simpleVChartSpec.indicator)
        ? simpleVChartSpec.indicator.map(formatIndicator)
        : formatIndicator(simpleVChartSpec.indicator);
    }

    if (simpleVChartSpec.background) {
      spec.background = simpleVChartSpec.background;
    }

    if (simpleVChartSpec.palette && simpleVChartSpec.palette.length) {
      spec.color = simpleVChartSpec.palette;
    }
  }

  return { spec };
};

const afterPipe = (context: GenerateChartCellContext) => {
  const { spec, chartType, totalTime } = context;
  return {
    spec,
    chartType: llmChartTypeMap[chartType],
    time: estimateVideoTime(chartType, spec, totalTime ? totalTime * 1000 : undefined)
  };
};

export const getChartSpecWithContext = (context: GenerateChartCellContext) => {
  const { chartType } = context;
  const pipline = pipelineMap[chartType.toUpperCase()] ? pipelineMap[chartType.toUpperCase()] : [];

  const chartSpecPipelines = [beforePipe, revisedVChartType, ...pipline, theme, afterPipe];
  let newContext = { ...context };
  chartSpecPipelines.forEach(func => {
    newContext = {
      ...newContext,
      ...func(newContext)
    };
  });
  return newContext;
};
