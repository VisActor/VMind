import type { ApplicationMeta } from '../../base/metaTypes';
import GetDatasetTaskNodeGPTMeta from './taskNodes/generateDataset/GPT';
import { ModelType } from '../../common/typings';
import type { DataExtractionContext, DataExtractionOutput } from '../types';
import GetDatasetTaskNodeSkylarkMeta from './taskNodes/generateDataset/skylark';

/**
 * data extraction application in vmind
 * pipeline: generateDataset
 * first it gets userInput, original text as input (DataExtractionContext)
 * then it run GetDatasetTaskNode to get instruction, dataset and llmFieldInfo(DataExtractionOutput)
 */
const dataExtractionGPTMeta: ApplicationMeta<DataExtractionContext, DataExtractionOutput> = {
  name: 'dataExtraction',
  taskNodes: [
    { taskNode: GetDatasetTaskNodeGPTMeta, name: 'getDataset' }
  ]
};

const dataExtractionSkylarkMeta: ApplicationMeta<DataExtractionContext, DataExtractionOutput> = {
  name: 'dataExtraction',
  taskNodes: [
    { taskNode: GetDatasetTaskNodeSkylarkMeta, name: 'getDataset' }
  ]
};

const dataExtractionMetaByModel = {
  [ModelType.GPT]: dataExtractionGPTMeta,
  [ModelType.SKYLARK]: dataExtractionSkylarkMeta
};

export default dataExtractionMetaByModel;
