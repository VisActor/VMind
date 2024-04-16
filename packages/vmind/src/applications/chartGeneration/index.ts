import { ApplicationMeta } from 'src/base/metaTypes';
import { ChartGenerationContext, ChartGenerationOutput } from '../types';
import GetVizSchemaTaskNodeMeta from './taskNodes/getVizSchema';
import ChartGenerationTaskNodeGPTMeta from './taskNodes/generateTypeAndFieldMap/GPT';
import ChartAdvisorErrorWrapper from './taskNodes/chartAdvisor/errorWrapper';
import getVChartSpecTaskNodeMeta from './taskNodes/getChartSpec/VChart';
import { ModelType } from 'src/common/typings';
import GenerateChartTypeTaskNodeMeta from './taskNodes/generateChartType/skylark';
import GenerateFieldMapTaskNodeMeta from './taskNodes/generateFieldMap/skylark';
import GetAdvisedListTaskNodeMeta from './taskNodes/chartAdvisor';
import getVChartSpecFromListTaskNodeMeta from './taskNodes/getChartSpec/VChart/getSpecFromList';

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
    { taskNode: GetAdvisedListTaskNodeMeta, name: 'getAdvisedList' },
    { taskNode: getVChartSpecFromListTaskNodeMeta, name: 'getSpecList' }
  ]
};

const chartGenerationMetaByModel = {
  [ModelType.GPT]: chartGenerationGPTMeta,
  [ModelType.SKYLARK]: chartGenerationSkylarkMeta,
  [ModelType.CHART_ADVISOR]: chartGenerationAdvisorMeta
};

export default chartGenerationMetaByModel;
