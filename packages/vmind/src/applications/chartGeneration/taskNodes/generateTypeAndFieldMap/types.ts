import { GenerateChartTypeOutput } from '../generateChartType/types';
import { GenerateFieldMapOutput } from '../generateFieldMap/types';
import { GetVizSchemaContext, GetVizSchemaOutput } from '../getVizSchema/types';

export type GenerateChartAndFieldMapContext = GetVizSchemaContext & GetVizSchemaOutput;

export type GenerateChartAndFieldMapOutput = Omit<GenerateFieldMapOutput, 'fieldMapTokenUsage'> &
  Omit<GenerateChartTypeOutput, 'chartTypeTokenUsage'> & { usage: any };
