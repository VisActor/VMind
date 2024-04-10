import dataAggregationMetaByModel from 'src/applications/dataAggregation';
import { ModelType } from 'src/typings';

export enum ApplicationType {
  DataAggregation = 'dataAggregation'
}

const applicationMetaList = {
  [ApplicationType.DataAggregation]: dataAggregationMetaByModel
};

export default applicationMetaList;
