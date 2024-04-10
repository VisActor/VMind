import { ApplicationMeta } from 'src/base/metaTypes';
import ExecuteQueryTaskNodeMeta from './taskNodes/executeQuery';
import GetSQLTaskNodeGPTMeta from './taskNodes/getQuerySQL/GPT';
import { ModelType } from 'src/typings';
import { DataAggregationContext, DataAggregationOutput } from '../types';
import { ApplicationType } from 'src/core/applications';

/**
 * data aggregation application in vmind
 * pipeline: getQuerySQL=>executeQuery
 * first it gets userInput, fieldInfo, sourceDataset as input (DataAggregationContext)
 * then it run getQuerySQL to get sql and llmFieldInfo
 * finally it runs the sql using alasql and return the final dataset and fieldInfo (DataAggregationOutput)
 */
const dataAggregationGPTMeta: ApplicationMeta<DataAggregationContext, DataAggregationOutput> = {
  name: ApplicationType.DataAggregation,
  taskNodes: [
    { taskNode: GetSQLTaskNodeGPTMeta, name: 'getQuerySQL' },
    { taskNode: ExecuteQueryTaskNodeMeta, name: 'executeQuery' }
  ]
};

const dataAggregationMetaByModel = {
  [ModelType.GPT]: dataAggregationGPTMeta
};

export default dataAggregationMetaByModel;
