import type { GenerateChartAndFieldMapContext, GenerateChartAndFieldMapOutput } from '../generateTypeAndFieldMap/types';

export type GetChartSpecContext = GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput;
export type Spec = any;
export type GetChartSpecOutput = {
  spec: Spec;
};
