import { ApplicationMeta } from 'src/base/metaTypes';
import { ChartGenerationContext, ChartGenerationOutput } from '../types';
import GetVizSchemaTaskNodeMeta from './taskNodes/getVizSchema';
import ChartGenerationTaskNodeGPTMeta from './taskNodes/generateTypeAndFieldMap/GPT';
import ChartAdvisorErrorWrapper from './taskNodes/chartAdvisor/errorWrapper';
import getVChartSpecTaskNodeMeta from './taskNodes/getChartSpec/VChart';
import { ModelType } from 'src/typings';
import GenerateChartTypeTaskNodeMeta from './taskNodes/generateChartType/skylark';
import GenerateFieldMapTaskNodeMeta from './taskNodes/generateFieldMap/skylark';
import ChartAdvisorTaskNodeMeta from './taskNodes/chartAdvisor';

const chartGenerationGPTMeta: ApplicationMeta<ChartGenerationContext, ChartGenerationOutput> = {
  name: 'chartGeneration',
  taskNodes: [
    { taskNode: GetVizSchemaTaskNodeMeta, name: 'getVizSchema' },
    { taskNode: ChartGenerationTaskNodeGPTMeta, name: 'generateChart' },
    { taskNode: ChartAdvisorErrorWrapper, name: 'chartAdvisorHandler' },
    { taskNode: getVChartSpecTaskNodeMeta, name: 'getVChartSpec' }
  ]
};

const chartGenerationSkylarkMeta: ApplicationMeta<ChartGenerationContext, ChartGenerationOutput> = {
  name: 'chartGeneration',
  taskNodes: [
    { taskNode: GetVizSchemaTaskNodeMeta, name: 'getVizSchema' },
    { taskNode: GenerateChartTypeTaskNodeMeta, name: 'generateChartType' },
    { taskNode: GenerateFieldMapTaskNodeMeta, name: 'generateFieldMap' },
    { taskNode: ChartAdvisorErrorWrapper, name: 'chartAdvisorHandler' },
    { taskNode: getVChartSpecTaskNodeMeta, name: 'getVChartSpec' }
  ]
};

const chartGenerationAdvisorMeta: ApplicationMeta<ChartGenerationContext, ChartGenerationOutput> = {
  name: 'chartGeneration',
  taskNodes: [
    { taskNode: GetVizSchemaTaskNodeMeta, name: 'getVizSchema' },
    { taskNode: ChartAdvisorTaskNodeMeta, name: 'chartAdvisor' }
  ]
};

const chartGenerationMetaByModel = {
  [ModelType.GPT]: chartGenerationGPTMeta,
  [ModelType.SKYLARK]: chartGenerationSkylarkMeta
};

export default chartGenerationMetaByModel;
