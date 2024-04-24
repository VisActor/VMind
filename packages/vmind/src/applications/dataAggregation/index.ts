import type { ApplicationMeta } from '../../base/metaTypes';
import ExecuteQueryTaskNodeMeta from './taskNodes/executeQuery';
import GetSQLTaskNodeGPTMeta from './taskNodes/generateQuerySQL/GPT';
import { ModelType } from '../../common/typings';
import type { DataAggregationContext, DataAggregationOutput } from '../types';
import GetSQLTaskNodeSkylarkMeta from './taskNodes/generateQuerySQL/skylark';

/**
 * data aggregation application in vmind
 * pipeline: getQuerySQL=>executeQuery
 * first it gets userInput, fieldInfo, sourceDataset as input (DataAggregationContext)
 * then it run getQuerySQL to get sql and llmFieldInfo
 * finally it runs the sql using alasql and return the final dataset and fieldInfo (DataAggregationOutput)
 */
const dataAggregationGPTMeta: ApplicationMeta<DataAggregationContext, DataAggregationOutput> = {
  name: 'dataAggregation',
  taskNodes: [
    { taskNode: GetSQLTaskNodeGPTMeta, name: 'getQuerySQL' },
    { taskNode: ExecuteQueryTaskNodeMeta, name: 'executeQuery' }
  ]
};

const dataAggregationSkylarkMeta: ApplicationMeta<DataAggregationContext, DataAggregationOutput> = {
  name: 'dataAggregation',
  taskNodes: [
    { taskNode: GetSQLTaskNodeSkylarkMeta, name: 'getQuerySQL' },
    { taskNode: ExecuteQueryTaskNodeMeta, name: 'executeQuery' }
  ]
};

const dataAggregationMetaByModel = {
  [ModelType.GPT]: dataAggregationGPTMeta,
  [ModelType.SKYLARK]: dataAggregationSkylarkMeta
};

export default dataAggregationMetaByModel;
