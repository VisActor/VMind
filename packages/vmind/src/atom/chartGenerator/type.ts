import type { ITheme as ChartTheme } from '@visactor/vchart';
import type { BasemapOption, Cell, ChartGeneratorCtx, ChartType, DataTable, VizSchema } from '../../types';
import type { BaseOptions } from '../../types/atom';

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
  colors?: string[];
  chartTheme?: ChartTheme | string;
  chartTypeList: ChartType[];
  /** only use in map chart */
  basemapOption?: BasemapOption;
  totalTime?: number;
  stackOrPercent?: 'stack' | 'percent';
  transpose?: boolean;
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
