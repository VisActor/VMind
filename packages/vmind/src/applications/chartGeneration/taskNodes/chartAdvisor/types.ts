import { GetVizSchemaOutput } from '../getVizSchema/types';
import { GenerateChartAndFieldMapContext, GenerateChartAndFieldMapOutput } from '../generateTypeAndFieldMap/types';
import { TaskError } from 'src/typings';

export type ChartAdvisorContext = GenerateChartAndFieldMapContext & GetVizSchemaOutput;

export type ChartAdvisorOutput = GenerateChartAndFieldMapOutput;
