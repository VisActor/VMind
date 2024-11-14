import type { ITheme as ChartTheme } from '@visactor/vchart';
import type { ChartGeneratorCtx, ChartType } from '../../types';
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
  totalTime?: number;
}
