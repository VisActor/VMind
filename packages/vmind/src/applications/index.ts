import chartGenerationMetaByModel from './chartGeneration';
import dataAggregationMetaByModel from './dataAggregation';
import dataExtractionMetaByModel from "./dataExtraction";

export enum ApplicationType {
  DataAggregation = 'dataAggregation',
  ChartGeneration = 'chartGeneration',
  DataExtraction = 'dataExtraction'
}

const applicationMetaList = {
  [ApplicationType.DataAggregation]: dataAggregationMetaByModel,
  [ApplicationType.ChartGeneration]: chartGenerationMetaByModel,
  [ApplicationType.DataExtraction]: dataExtractionMetaByModel
};

export default applicationMetaList;
