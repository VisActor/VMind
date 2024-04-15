import { ApplicationMeta } from 'src/base/metaTypes';
import { ChartGenerationContext, ChartGenerationOutput } from '../types';
import GetVizSchemaTaskNodeMeta from './taskNodes/getVizSchema';
import ChartGenerationTaskNodeGPTMeta from './taskNodes/generateTypeAndFieldMap/GPT';
import ChartAdvisorErrorWrapper from './taskNodes/chartAdvisor/errorWrapper';
import getVChartSpecTaskNodeMeta from './taskNodes/getChartSpec/VChart';
import { ModelType } from 'src/typings';

const chartGenerationGPTMeta: ApplicationMeta<ChartGenerationContext, ChartGenerationOutput> = {
  name: 'chartGeneration',
  taskNodes: [
    { taskNode: GetVizSchemaTaskNodeMeta, name: 'getVizSchema' },
    { taskNode: ChartGenerationTaskNodeGPTMeta, name: 'generateChart' },
    { taskNode: ChartAdvisorErrorWrapper, name: 'chartAdvisorHandler' },
    { taskNode: getVChartSpecTaskNodeMeta, name: 'getVChartSpec' }
  ]
};

const chartGenerationMetaByModel = {
  [ModelType.GPT]: chartGenerationGPTMeta
};

export default chartGenerationMetaByModel;
