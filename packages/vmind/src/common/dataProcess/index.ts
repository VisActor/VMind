import { DataSet, DataView, csvParser, fold } from '@visactor/vdataset';
import { DataItem, DataType, SimpleFieldInfo } from '../../typings';
import { getFieldInfoFromDataset } from './utils';
import { isNil } from 'lodash';

export const parseCSVWithVChart = (csvString: string) => {
  //Parse csv string to VChart Dataview so it can be directly used in VChart spec
  const dataSet = new DataSet();
  dataSet.registerParser('csv', csvParser);
  dataSet.registerTransform('fold', fold);
  const dataView = new DataView(dataSet, { name: 'data' });
  dataView.parse(csvString, {
    type: 'csv'
  });
  return dataView;
};

export const getDataView = (dataset: DataItem[]) => {};

export const getDataset = (csvString: string): { dataset: DataItem[]; columns: string[] } => {
  //get dataset from csv string
  const dataView = parseCSVWithVChart(csvString);
  const { columns, ...dataColumns } = dataView.latestData;
  const dataset = Object.keys(dataColumns).map(key => dataColumns[key]);
  return { dataset, columns };
};

/**
 * convert number string to number in dataset
 */
const convertNumberField = (dataset: DataItem[], fieldInfo: SimpleFieldInfo[]) => {
  const numberFields = fieldInfo
    .filter(field => [DataType.INT, DataType.FLOAT].includes(field.type))
    .map(field => field.fieldName);
  dataset.forEach(d => {
    numberFields.forEach(numberField => {
      if (!isNil(d[numberField])) {
        d[numberField] = Number(d[numberField]);
      }
    });
  });
  return dataset;
};

export const parseCSVData = (csvString: string): { fieldInfo: SimpleFieldInfo[]; dataset: DataItem[] } => {
  //parse the CSV string to get information about the fields(fieldInfo) and dataset object
  const { dataset, columns } = getDataset(csvString);
  const fieldInfo = getFieldInfoFromDataset(dataset, columns);
  convertNumberField(dataset, fieldInfo);
  return { fieldInfo, dataset };
};
