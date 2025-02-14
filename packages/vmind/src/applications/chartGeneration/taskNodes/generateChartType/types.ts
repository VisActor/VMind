import type { ChartType } from '../../../../common/typings';
import type { GetVizSchemaContext, GetVizSchemaOutput } from '../getVizSchema/types';
import type { CombinationBasicChartType } from '../../../../common/typings';

export type GenerateChartTypeContext = GetVizSchemaContext & GetVizSchemaOutput;

export type GenerateChartTypeOutput = {
  chartType: ChartType;
  subChartType?: CombinationBasicChartType[];
  chartSource: string;
  chartTypeTokenUsage: any;
};
