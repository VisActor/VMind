import { ApplicationMeta } from 'src/base/metaTypes';
import ExecuteQueryTaskNodeMeta from './taskNodes/executeQuery';
import GetSQLTaskNodeGPTMeta from './taskNodes/getQuerySQL/GPT';
import { ModelType } from 'src/typings';

const dataAggregationGPTMeta: ApplicationMeta = [
  { taskNode: GetSQLTaskNodeGPTMeta, name: 'getQuerySQL' },
  { taskNode: ExecuteQueryTaskNodeMeta, name: 'executeQuery' }
];

const dataAggregationMetaByModel = {
  [ModelType.GPT]: dataAggregationGPTMeta
};

export default dataAggregationMetaByModel;
