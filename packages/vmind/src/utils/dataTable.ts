import { DataSet, DataView, csvParser, fold as vdatasetFold } from '@visactor/vdataset';
import { getFieldInfo } from './field';
import { DataType } from '../types';
import { isArray, isNil, isNumber } from '@visactor/vutils';
import { FOLD_NAME, FOLD_VALUE, fold } from '@visactor/chart-advisor';
import { ROLE, type DataItem, type DataTable, type FieldInfo } from '../types';

export const parseCSVWithVChart = (csvString: string) => {
  //Parse csv string to VChart Dataview so it can be directly used in VChart spec
  const dataSet = new DataSet();
  dataSet.registerParser('csv', csvParser);
  dataSet.registerTransform('fold', vdatasetFold);
  const dataView = new DataView(dataSet, { name: 'data' });
  dataView.parse(csvString, {
    type: 'csv'
  });
  return dataView;
};

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
export const convertNumberField = (dataset: DataItem[], fieldInfo: FieldInfo[]) => {
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

export const parseCSVData = (csvString: string): { fieldInfo: FieldInfo[]; dataset: DataItem[] } => {
  //parse the CSV string to get information about the fields(fieldInfo) and dataset object
  const { dataset, columns } = getDataset(csvString);
  const fieldInfo = getFieldInfo(dataset, columns);
  convertNumberField(dataset, fieldInfo);
  return { fieldInfo, dataset };
};

export const foldDatasetByYField = (
  dataset: DataItem[],
  yFieldList: string[],
  fieldInfo: FieldInfo[],
  foldName: any = FOLD_NAME,
  foldValue: any = FOLD_VALUE
) => {
  const aliasMap = Object.fromEntries(fieldInfo.map(d => [d.fieldName, d.fieldName]));

  return fold(dataset as any, yFieldList, foldName, foldValue, aliasMap, false);
};

export const foldDataTableByYField = (
  dataTable: DataItem[],
  yFieldList: string[],
  fieldInfo: FieldInfo[],
  foldName: any = FOLD_NAME,
  foldValue: any = FOLD_VALUE
) => {
  const aliasMap = Object.fromEntries(fieldInfo.map(d => [d.fieldName, d.fieldName]));

  return fold(dataTable as any, yFieldList, foldName, foldValue, aliasMap, false);
};

export const isValidDataTable = (dataTable?: DataTable | undefined | null) => {
  return !isNil(dataTable) && isArray(dataTable) && dataTable.length > 0;
};

export const transferMeasureInTable = (dataTable: DataItem[], fieldInfo: FieldInfo[]) => {
  const newDataTable: DataTable = [];
  const measureFields = fieldInfo.filter(field => field.role === ROLE.MEASURE);
  if (measureFields.length) {
    dataTable.forEach(row => {
      const newRow = { ...row };
      measureFields.forEach(field => {
        const value = Number(row[field.fieldName]);
        if (isNumber(value) && row[field.fieldName] !== '') {
          newRow[field.fieldName] = value;
        }
      });
      newDataTable.push(newRow);
    });
    return newDataTable;
  }
  return dataTable;
};
