import { GetVizSchemaOutput } from '../getVizSchema/types';
import { GenerateChartAndFieldMapContext, GenerateChartAndFieldMapOutput } from '../generateTypeAndFieldMap/types';

export type ChartAdvisorContext = GenerateChartAndFieldMapContext & GetVizSchemaOutput;

export type ChartAdvisorOutput = GenerateChartAndFieldMapOutput;
