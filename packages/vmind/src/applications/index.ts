import chartGenerationMetaByModel from './chartGeneration';
import dataAggregationMetaByModel from './dataAggregation';
import intelligentInsightMetaByModel from './IngelligentInsight';

export enum ApplicationType {
  DataAggregation = 'dataAggregation',
  ChartGeneration = 'chartGeneration',
  IntelligentInsight = 'intelligentInsight'
}

const applicationMetaList = {
  [ApplicationType.DataAggregation]: dataAggregationMetaByModel,
  [ApplicationType.ChartGeneration]: chartGenerationMetaByModel,
  [ApplicationType.IntelligentInsight]: intelligentInsightMetaByModel
};

export default applicationMetaList;
