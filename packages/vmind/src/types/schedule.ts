import type {
  AtomName,
  BaseContext,
  DataExtractionCtx,
  DataCleanCtx,
  DataQueryCtx,
  ChartGeneratorCtx,
  ChartCommandCtx,
  DataInsightCtx,
  MultipleDataCleanCtx,
  MultipleChartCommandsCtx,
  ChartQAExtractionCtx,
  VChartSpecCtx,
  SpecInsightCtx
} from './atom';

export interface Tasks {
  /** current atom task should run or not */
  shouldRun: boolean;
  /** current user's query in atom task */
  query: string;
}

export type TaskMapping = Partial<Record<AtomName, Tasks>>;

/** Map of atom - context */
export type AtomTypeMap = {
  [AtomName.BASE]: BaseContext;
  [AtomName.DATA_EXTRACT]: DataExtractionCtx;
  [AtomName.DATA_CLEAN]: DataCleanCtx;
  [AtomName.MULTIPLE_DATA_CLEAN]: MultipleDataCleanCtx;
  [AtomName.DATA_QUERY]: DataQueryCtx;
  [AtomName.DATA_INSIGHT]: DataInsightCtx;
  [AtomName.SPEC_INSIGHT]: SpecInsightCtx;
  [AtomName.CHART_COMMAND]: ChartCommandCtx;
  [AtomName.MULTIPLE_CHART_COMMAND]: MultipleChartCommandsCtx;
  [AtomName.CHART_GENERATE]: ChartGeneratorCtx;
  [AtomName.CHART_QA_EXTRACTION]: ChartQAExtractionCtx;
  [AtomName.CUSTOM_PROMPT]: any;
  [AtomName.VCHART_SPEC]: VChartSpecCtx;
};

export type MapAtomTypes<T extends (keyof AtomTypeMap)[]> = {
  [K in keyof T]: T[K] extends keyof AtomTypeMap ? AtomTypeMap[T[K]] : never;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CombineAll<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First & CombineAll<Rest>
  : Record<string, unknown>;
