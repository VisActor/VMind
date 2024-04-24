import type { ChartType } from '../../../../common/typings';
import type { GetVizSchemaContext, GetVizSchemaOutput } from '../getVizSchema/types';

export type GenerateChartTypeContext = GetVizSchemaContext & GetVizSchemaOutput;

export type GenerateChartTypeOutput = {
  chartType: ChartType;
  chartSource: string;
  chartTypeTokenUsage: any;
};
