import type { ApplicationMeta } from '../../base/metaTypes';
import { ModelType } from '../../common/typings';
import type { InsightContext, InsightOutput } from '../types';
import DataProcessTaskNodeMeta from './taskNodes/dataProcess';
import ExtractInsightTaskNodeMeta from './taskNodes/extractInsight';
import GenerateInsightTextGPTMeta from './taskNodes/generateInsightText/GPT';
import GenerateInsightTextSkylarkMeta from './taskNodes/generateInsightText/skylark';

const intelligentInsightGPTMeta: ApplicationMeta<InsightContext, InsightOutput> = {
  name: 'IntelligentInsight',
  taskNodes: [
    {
      taskNode: DataProcessTaskNodeMeta,
      name: 'dataProcess'
    },
    {
      taskNode: ExtractInsightTaskNodeMeta,
      name: 'extractInsight'
    },
    {
      taskNode: GenerateInsightTextGPTMeta,
      name: 'generateInsightText'
    }
  ]
};

const intelligentInsightSkylarkMeta: ApplicationMeta<InsightContext, InsightOutput> = {
  name: 'IntelligentInsight',
  taskNodes: [
    {
      taskNode: DataProcessTaskNodeMeta,
      name: 'dataProcess'
    },
    {
      taskNode: ExtractInsightTaskNodeMeta,
      name: 'extractInsight'
    },
    {
      taskNode: GenerateInsightTextSkylarkMeta,
      name: 'generateInsightText'
    }
  ]
};

const intelligentInsightMetaByModel = {
  [ModelType.GPT]: intelligentInsightGPTMeta,
  [ModelType.SKYLARK]: intelligentInsightSkylarkMeta
};

export default intelligentInsightMetaByModel;
