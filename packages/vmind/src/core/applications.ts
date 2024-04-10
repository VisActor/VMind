import dataAggregationMetaByModel from 'src/applications/dataAggregation';

export enum ApplicationType {
  DataAggregation = 'dataAggregation'
}

const applicationMetaList = {
  [ApplicationType.DataAggregation]: dataAggregationMetaByModel
};

export default applicationMetaList;
