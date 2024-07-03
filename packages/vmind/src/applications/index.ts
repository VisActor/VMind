import chartGenerationMetaByModel from './chartGeneration';
import dataAggregationMetaByModel from './dataAggregation';
import intelligentInsightMetaByModel from './IngelligentInsight';
import dataExtractionMetaByModel from './dataExtraction';

export enum ApplicationType {
  DataAggregation = 'dataAggregation',
  ChartGeneration = 'chartGeneration',
  IntelligentInsight = 'intelligentInsight',
  DataExtraction = 'dataExtraction'
}

const applicationMetaList = {
  [ApplicationType.DataAggregation]: dataAggregationMetaByModel,
  [ApplicationType.ChartGeneration]: chartGenerationMetaByModel,
  [ApplicationType.IntelligentInsight]: intelligentInsightMetaByModel,
  [ApplicationType.DataExtraction]: dataExtractionMetaByModel
};

export default applicationMetaList;
