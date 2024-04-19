import chartGenerationMetaByModel from './chartGeneration';
import dataAggregationMetaByModel from './dataAggregation';

export enum ApplicationType {
  DataAggregation = 'dataAggregation',
  ChartGeneration = 'chartGeneration'
}

const applicationMetaList = {
  [ApplicationType.DataAggregation]: dataAggregationMetaByModel,
  [ApplicationType.ChartGeneration]: chartGenerationMetaByModel
};

export default applicationMetaList;
