import { Cell } from '../../types';
import { GenerateChartTypeContext, GenerateChartTypeOutput } from '../generateChartType/types';

export type GenerateFieldMapContext = GenerateChartTypeContext & GenerateChartTypeOutput;

export type GenerateFieldMapOutput = {
  cell: Cell;
};
