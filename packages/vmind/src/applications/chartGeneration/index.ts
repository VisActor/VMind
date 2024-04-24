import type { ApplicationMeta } from '../../base/metaTypes';
import type { ChartGenerationContext, ChartGenerationOutput } from '../types';
import GetVizSchemaTaskNodeMeta from './taskNodes/getVizSchema';
import ChartGenerationTaskNodeGPTMeta from './taskNodes/generateTypeAndFieldMap/GPT';
import ChartAdvisorErrorWrapper from './taskNodes/chartAdvisor/errorWrapper';
import getVChartSpecTaskNodeMeta from './taskNodes/getChartSpec/VChart';
import { ModelType } from '../../common/typings';
import GenerateChartTypeTaskNodeMeta from './taskNodes/generateChartType/skylark';
import GenerateFieldMapTaskNodeMeta from './taskNodes/generateFieldMap/skylark';
import GetAdvisedListTaskNodeMeta from './taskNodes/chartAdvisor';
import getVChartSpecFromListTaskNodeMeta from './taskNodes/getChartSpec/VChart/getSpecFromList';
import FormatOutputTaskNodeMeta from './taskNodes/formatOutput';

/**
 * GPT version of intelligent chart generation application
 * Overall process: getVizSchema=>generateChart=>chartAdvisorHandler=>getVChartSpec=>formatOutput
 * getVizSchema: Receives ChartGenerationContext as input, generates vizSchema for subsequent processes.
 * generateChart: Receives GenerateChartAndFieldMapContext as input, calls GPT for chart type recommendation and field mapping, gets chartType and cell (GenerateChartAndFieldMapOutput). The cell describes how the fields in the data are mapped to the visual channels of the chart.
 * chartAdvisorHandler: responsible for handling errors in the call to GPT. If the call to GPT to generate a chart fails, use chart-advisor for chart recommendation as a fallback plan
 * getVChartSpec: completes the conversion from chartType and cell to VChart spec
 * formatOutput: format the result of chart generation
 */
const chartGenerationGPTMeta: ApplicationMeta<ChartGenerationContext, ChartGenerationOutput> = {
  name: 'chartGeneration',
  taskNodes: [
    { taskNode: GetVizSchemaTaskNodeMeta, name: 'getVizSchema' },
    { taskNode: ChartGenerationTaskNodeGPTMeta, name: 'generateChart' },
    { taskNode: ChartAdvisorErrorWrapper, name: 'chartAdvisorHandler' },
    { taskNode: getVChartSpecTaskNodeMeta, name: 'getVChartSpec' },
    { taskNode: FormatOutputTaskNodeMeta, name: 'formatOutput' }
  ]
};

/**
 * Skylark version of Intelligent Chart Generation Application
 * Overall process: getVizSchema=>generateChartType=>generateFieldMap=>=>chartAdvisorHandler=>getVChartSpec=>formatOutput
 * getVizSchema: Receives ChartGenerationContext as input, generates vizSchema for subsequent processes.
 * generateChartType: Calls LLM to get a recommended chart type
 * generateFieldMap: Calls LLM to map the fields in data to the visual channel of the current chart type. The cell is used to describe the mapping result.
 * chartAdvisorHandler: Responsible for handling errors during the call to LLM. If the call to LLM to generate a chart fails, use chart-advisor for chart recommendation as a fallback plan
 * getVChartSpec: Completes the conversion from chartType and cell to VChart spec
 * formatOutput: format the result of chart generation
 */
const chartGenerationSkylarkMeta: ApplicationMeta<ChartGenerationContext, ChartGenerationOutput> = {
  name: 'chartGeneration',
  taskNodes: [
    { taskNode: GetVizSchemaTaskNodeMeta, name: 'getVizSchema' },
    { taskNode: GenerateChartTypeTaskNodeMeta, name: 'generateChartType' },
    { taskNode: GenerateFieldMapTaskNodeMeta, name: 'generateFieldMap' },
    { taskNode: ChartAdvisorErrorWrapper, name: 'chartAdvisorHandler' },
    { taskNode: getVChartSpecTaskNodeMeta, name: 'getVChartSpec' },
    { taskNode: FormatOutputTaskNodeMeta, name: 'formatOutput' }
  ]
};

/**
 * Intelligent chart recommendation using ChartAdvisor
 * Overall process: getVizSchema=>getAdvisedList=>getSpecList
 * getVizSchema: Receive ChartGenerationContext as input, generate vizSchema for subsequent processes.
 * getAdvisedList: Call chart-advisor, complete chart generation based on rules according to vizSchema and dataset, and get a list of recommended chart types and field mapping
 * getSpecList: Generate chart Spec for each chart type according to the recommendation list
 */
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
