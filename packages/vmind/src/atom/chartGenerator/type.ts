import type { ITheme as ChartTheme } from '@visactor/vchart';
import type { Cell, ChartGeneratorCtx, ChartType } from '../../types';
import type { BaseOptions } from '../../types/atom';
import type { BasemapOption, DataTable } from '@visactor/generate-vchart';

export type VisualChannel = 'x' | 'y' | 'color' | 'angle' | 'radius' | 'size' | 'value' | 'source' | 'target' | 'time';

export type ChartKnowledge = {
  [chartType: string]: {
    index: number;
    visualChannels: VisualChannel[]; //Visual channel available in this chart type
    examples: ((showThoughts: boolean) => string)[]; //examples of the response
    knowledge?: string[]; //extra knowledge of this chart
  };
};

export interface GenerateChartCellContext extends ChartGeneratorCtx {
  chartTypeList: ChartType[];
}

export interface ChartAdvistorResult {
  chartType: ChartType;
  cell?: Cell[];
  dataset?: DataTable[];
  spec: any;
  chartSource: string;
  usage: any; //token usage of the LLM
  time?: { totalTime: number; frameArr: any[] };
}

export interface ChartGeneratorOptions extends BaseOptions {
  useChartAdvisor?: boolean;
  useChartRule?: boolean;
  /** supported chart list */
  chartTypeList?: ChartType[];
  /** un-supported chart list */
  unsupportChartTypeList?: ChartType[];
  animationDuration?: number;
  basemapOption?: BasemapOption;
  colorPalette?: string[];
  theme?: ChartTheme | string;
}

export interface SimpleVChartSpecMockContext {
  ctx: Partial<GenerateChartCellContext>;
  mockLLMContent: {
    CHART_TYPE: ChartType;
    FIELD_MAP: Cell;
    stackOrPercent?: 'stack' | 'percent';
    transpose?: boolean;
  };
}
