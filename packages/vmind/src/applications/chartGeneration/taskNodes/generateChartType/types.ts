import { ChartType } from 'src/common/typings';
import { GetVizSchemaContext, GetVizSchemaOutput } from '../getVizSchema/types';

export type GenerateChartTypeContext = GetVizSchemaContext & GetVizSchemaOutput;

export type GenerateChartTypeOutput = {
  chartType: ChartType;
  chartSource: string;
  chartTypeTokenUsage: any;
};
