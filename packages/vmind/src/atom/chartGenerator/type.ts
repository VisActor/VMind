import type { ITheme as ChartTheme } from '@visactor/vchart';
import type { BasemapOption, Cell, ChartGeneratorCtx, ChartType, DataTable } from '../../types';
import type { VizSchema } from '../type';

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
  vizSchema: VizSchema;
  chartTypeList: ChartType[];
  /** only use in map chart */
  basemapOption?: BasemapOption;
  totalTime?: number;
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
