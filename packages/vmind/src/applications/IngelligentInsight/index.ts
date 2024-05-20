import type { ApplicationMeta } from '../../base/metaTypes';
import { ModelType } from '../../common/typings';
import type { InsightContext, InsightOutput } from '../types';
import DataProcessTaskNodeMeta from './taskNodes/dataProcess';

const intelligentInsightGPTMeta: ApplicationMeta<InsightContext, InsightOutput> = {
  name: 'IntelligentInsight',
  taskNodes: [
    {
      taskNode: DataProcessTaskNodeMeta,
      name: 'dataProcess'
    }
  ]
};

const intelligentInsightSkylarkMeta: ApplicationMeta<InsightContext, InsightOutput> = {
  name: 'IntelligentInsight',
  taskNodes: []
};

const intelligentInsightMetaByModel = {
  [ModelType.GPT]: intelligentInsightGPTMeta,
  [ModelType.SKYLARK]: intelligentInsightSkylarkMeta
};

export default intelligentInsightMetaByModel;
