import { result as capcutResult } from './results/dataExtraction/result6';
import { result as caseResult } from './results/dataExtraction/commonResult';
import { commonAnswer } from './data/dataExtractionData';
import { mergeResult, updateScoreInDataExtraction } from './pages/DataExtraction/verify';
import type { FieldInfo } from '../../../src';
import { DataType } from '../../../src/common/typings';
import type { SimpleFieldInfo } from '../../../src/common/typings';

export function getCurrentFormattedTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要加1
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getDataExtractionCaseData() {
  const result = [...mergeResult(capcutResult as any, caseResult as any), commonAnswer];
  updateScoreInDataExtraction(result as any, commonAnswer);
  return result;
}

function dataTypeTransfer(dataType: string): DataType {
  switch (dataType) {
    case 'date':
    case 'time':
      return DataType.DATE;
    case 'count':
      return DataType.INT;
    case 'numerical':
    case 'ratio':
      return DataType.FLOAT;
    default:
      return DataType.STRING;
  }
}
export function transferFieldInfoInSimpleFieldInfo(fieldInfo: FieldInfo[]): SimpleFieldInfo[] {
  return fieldInfo.map(item => ({
    fieldName: item.fieldName,
    description: item.description,
    type: dataTypeTransfer(item.fieldType),
    role: item.role
  }));
}
