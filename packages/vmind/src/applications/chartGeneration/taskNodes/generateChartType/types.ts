import type { ChartType } from '../../../../common/typings';
import type { GetVizSchemaContext, GetVizSchemaOutput } from '../getVizSchema/types';
import type { BasicChartType } from '../../../../common/typings';

export type GenerateChartTypeContext = GetVizSchemaContext & GetVizSchemaOutput;

export type GenerateChartTypeOutput = {
  chartType: ChartType;
  subChartType?: BasicChartType[];
  chartSource: string;
  chartTypeTokenUsage: any;
};
