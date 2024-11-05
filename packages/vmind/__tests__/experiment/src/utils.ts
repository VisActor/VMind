// import { result as capcutResult } from './results/dataExtraction/result7';
// import { result as capcutResult, caseResult, capcutV2Result } from './results/dataExtraction/version1';
import { result as capcutResult, capcutV2Result } from './results/dataExtraction/version2';
// import { result as caseResult } from './results/dataExtraction/commonResult';
import { result as doubaoResult } from './results/dataExtraction/doubao1';
import { commonAnswer } from './data/dataExtractionData';
import { mergeResult, updateScoreInDataExtraction } from './pages/DataExtraction/verify';
import { AtomName, Schedule, type FieldInfo } from '../../../src';
import { DataType } from '../../../src/common/typings';
import type { SimpleFieldInfo } from '../../../src/common/typings';
import type { DataExtractionResult } from './pages/DataExtraction/type';
import { DataCleanAtom, MultipleDataCleanAtom } from '../../../src/atom';

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

function revisedTestData(data: DataExtractionResult, reGenerateDataClean = false) {
  if (!reGenerateDataClean) {
    return data as any;
  }
  const dataClean = new MultipleDataCleanAtom({} as any, {});
  // for (let i = 0; i < data.length; i++) {
  //   for (let j = 0; j < data[i].result.length; j++) {
  //     const caseResult = data[i].result[j];
  //     for (let l = 0; l < caseResult.defaultResult.length; l++) {
  //       const defaultRes = caseResult.defaultResult[l];
  //       schedule.setNewTask(defaultRes.context);
  //       caseResult.defaultResult[l].dataClean = (await schedule.run()) as any;
  //     }
  //   }
  // }
  return data.map(llmResult => {
    return {
      llm: llmResult.llm,
      result: llmResult.result.map(caseResult => {
        return {
          dataset: caseResult.dataset,
          fieldInfoResult: caseResult.fieldInfoResult,
          defaultResult: caseResult.defaultResult.map(v => {
            dataClean.reset(v.context as any);
            return {
              ...v,
              dataClean: dataClean._runWithOutLLM()
            };
          })
        };
      })
    };
  }) as any;
}
export function getDataExtractionCaseData(reGenerateDataClean = false): DataExtractionResult {
  // const result = [...doubaoResult, commonAnswer];
  const result = [
    ...mergeResult(
      revisedTestData(capcutResult as any, reGenerateDataClean),
      revisedTestData(capcutV2Result as any, reGenerateDataClean)
    ),
    commonAnswer
  ];
  updateScoreInDataExtraction(result as any, commonAnswer);
  return result as any;
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
    type: dataTypeTransfer(item.type),
    role: item.role
  }));
}
