import type { GenerateChartTypeOutput } from '../generateChartType/types';
import type { GenerateFieldMapOutput } from '../generateFieldMap/types';
import type { GetVizSchemaContext, GetVizSchemaOutput } from '../getVizSchema/types';

export type GenerateChartAndFieldMapContext = GetVizSchemaContext & GetVizSchemaOutput;

export type GenerateChartAndFieldMapOutput = Omit<GenerateFieldMapOutput, 'fieldMapTokenUsage'> &
  Omit<GenerateChartTypeOutput, 'chartTypeTokenUsage'> & { usage: any };
