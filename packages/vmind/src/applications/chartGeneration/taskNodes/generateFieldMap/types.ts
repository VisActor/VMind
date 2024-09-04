import type { Cell } from '../../types';
import type { GenerateChartTypeContext, GenerateChartTypeOutput } from '../generateChartType/types';
import type { VMindDataset } from '../../../../common/typings';

export type GenerateFieldMapContext = GenerateChartTypeContext & GenerateChartTypeOutput;

export type GenerateFieldMapOutput = {
  cells?: Cell[];
  datasetsForCombinationChart?: VMindDataset[];
  fieldMapTokenUsage: any;
};
