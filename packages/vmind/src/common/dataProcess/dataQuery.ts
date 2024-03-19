import { DataItem } from 'src/typings';
import { replaceDataKeys, replaceNonASCIICharacters, swapMap } from './utils';
import alasql from 'alasql';

export const VMIND_DATA_SOURCE = 'VMind_data_source';

export const queryDataset = (sql: string, sourceDataset: DataItem[]) => {
  const sqlParts = (sql + ' ').split(VMIND_DATA_SOURCE);

  const sqlCount = sqlParts.length - 1;
  const alasqlQuery = sqlParts.join('?');
  const { validStr, replaceMap } = replaceNonASCIICharacters(alasqlQuery);
  console.log(alasqlQuery);
  console.log(validStr);
  console.log(replaceMap);
  //replace field names according to replaceMap
  const validDataset = replaceDataKeys(sourceDataset, replaceMap);
  console.log(validDataset);

  const alasqlDataset = alasql(validStr, new Array(sqlCount).fill(validDataset));
  console.log(alasqlDataset);

  //restore the dataset
  const reversedMap = swapMap(replaceMap);
  const restoredDataset = replaceDataKeys(alasqlDataset, reversedMap);
  console.log(restoredDataset);

  return restoredDataset;
};
