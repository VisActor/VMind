/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import stringSimilarity from 'string-similarity';
import { DataType } from '../../../../../src';
import type { DataCell, DataExtractionCtx, FieldInfo, DataTable } from '../../../../../src';
import { getRoleByFieldType } from '../../../../../src/utils/field';
import { ROLE } from '../../../../../src/common/typings';
import type { DataExtractionCase, DataExtractionResult, ScoreDetail } from './type';
import { isNumber } from '@visactor/vutils';

function cosineSimilarity(text1: string, text2: string): number {
  return stringSimilarity.compareTwoStrings(text1, text2);
}

function getFieldTypeScore(typeA: DataType, typeB: DataType) {
  if (typeA === typeB) {
    return 1;
  }
  const roleA = getRoleByFieldType(typeA);
  const roleB = getRoleByFieldType(typeB);
  if (roleA !== roleB) {
    return -1;
  }
  if (roleA === ROLE.MEASURE && [typeA, typeB].includes(DataType.RATIO)) {
    return -0.5;
  }
  return 0;
}

const getFieldScore = (nameScore: number, typeScore: number) => nameScore * 0.75 + typeScore * 0.25;

const getFinalScore = (fieldScore: number, dataScore: number) => fieldScore * 0.3 + dataScore * 0.7;

const getDataScore = (currentDataList: DataCell[], answerDataList: DataCell[], role: ROLE) => {
  let dataScore = 0;
  const seletedList = new Array(answerDataList.length).fill(false);
  for (let i = 0; i < currentDataList.length; i++) {
    let maxScore = 0;
    let currentSelectedIndex = -1;
    const valueCompareFunction = getValueCompareFunction(role);
    for (let j = 0; j < answerDataList.length; j++) {
      if (!seletedList[j]) {
        const currentScore = valueCompareFunction(currentDataList[i], answerDataList[j]);
        if (maxScore < currentScore) {
          currentSelectedIndex = j;
          maxScore = currentScore;
        }
      }
    }
    if (currentSelectedIndex !== -1) {
      dataScore += maxScore;
      seletedList[currentSelectedIndex] = true;
    }
  }
  if (answerDataList.length > currentDataList.length) {
    dataScore /= answerDataList.length;
  } else {
    dataScore /= seletedList.filter(v => !!v).length;
  }
  return dataScore || 0;
};

/** fieldInfoA is answer */
function getScoreOfDataset(
  fieldInfoA: FieldInfo[],
  fieldInfoB: FieldInfo[],
  dataTableA: DataTable,
  dataTableB: DataTable
) {
  const seletedList = fieldInfoB.map(v => false);
  const scoreList: ScoreDetail[] = [];
  fieldInfoA.forEach((fieldInfo, originIndex) => {
    let finalScore = 0;
    let nameScore = 0;
    let index = -1;
    let typeScore = -1;
    let dataScore = -1;
    const dataListA = dataTableA?.map(v => v[fieldInfo.fieldName]) || [];
    for (let i = 0; i < fieldInfoB.length; i++) {
      if (!seletedList[i]) {
        const dataListB = dataTableB?.map(v => v[fieldInfoB[i].fieldName]) || [];
        const cosValue = cosineSimilarity(fieldInfo.fieldName, fieldInfoB[i].fieldName);
        const currentTypeScore = getFieldTypeScore(fieldInfo.fieldType, fieldInfoB[i].fieldType);
        const role = fieldInfo.role ?? getRoleByFieldType(fieldInfo.fieldType);
        const currentDataScore = getDataScore(dataListB, dataListA, role);
        const currentScore = getFinalScore(getFieldScore(cosValue, currentTypeScore), currentDataScore);
        if (currentScore > finalScore && currentTypeScore !== -1 && currentDataScore > 0) {
          index = i;
          finalScore = currentScore;
          nameScore = cosValue;
          typeScore = currentTypeScore;
          dataScore = currentDataScore;
        }
      }
    }
    scoreList.push({
      originIndex,
      matchedIndex: index,
      nameScore,
      typeScore,
      dataScore
    });
    seletedList[index] = true;
  });
  return scoreList;
}

function getValueCompareFunction(role: ROLE) {
  if (role === ROLE.MEASURE) {
    return (a: any, b: any) => {
      if (+a === +b || a === b) {
        return 1;
      }
      return isNumber(a) && isNumber(b) && Math.abs(a) === Math.abs(b) ? 0.2 : 0;
    };
  }
  return (a: DataCell, b: DataCell) => {
    return cosineSimilarity(`${a}`, `${b}`);
  };
}

export const getScoreOfDataExtraction = (resultCtx: DataExtractionCtx, answerCtx: DataExtractionCtx) => {
  const { fieldInfo = [], dataTable } = resultCtx;
  const { fieldInfo: answerInfo = [], dataTable: answerTable } = answerCtx;
  const scoreList = getScoreOfDataset(answerInfo || [], fieldInfo || [], answerTable!, dataTable!).filter(
    v => v.matchedIndex !== -1
  );
  if (!scoreList.length) {
    return {
      score: 0,
      fieldScore: 0,
      dataScore: 0,
      scoreDetail: []
    };
  }
  let fieldScore = 0;
  let dataScore = 0;
  scoreList.forEach(v => {
    fieldScore += getFieldScore(v.nameScore, v.typeScore);
    dataScore += v.dataScore;
  });
  dataScore /= scoreList.length;
  if (answerInfo?.length > fieldInfo?.length) {
    fieldScore /= answerInfo?.length;
  } else {
    fieldScore /= scoreList.length;
  }
  return {
    score: getFinalScore(fieldScore, dataScore),
    fieldScore,
    dataScore,
    scoreDetail: scoreList
  };
};

export const updateScoreInDataExtraction = (result: DataExtractionResult, answer: DataExtractionCase) => {
  result.forEach(llmResult => {
    llmResult.result.forEach(caseResult => {
      const answerCase = answer.result.find(v => v.dataset === caseResult.dataset);
      if (answerCase) {
        if (caseResult.defaultResult.length) {
          caseResult.defaultResult = caseResult.defaultResult.map((v, index) => ({
            ...v,
            ...getScoreOfDataExtraction(v.context, answerCase.defaultResult[index].context)
          }));
        }
        if (caseResult.fieldInfoResult.length) {
          caseResult.fieldInfoResult = caseResult.fieldInfoResult.map((v, index) => ({
            ...v,
            ...getScoreOfDataExtraction(v.context, answerCase.defaultResult[index].context)
          }));
        }
      }
    });
  });
  return result;
};

export const mergeResult = (result1: DataExtractionResult, result2: DataExtractionResult) => {
  const modelResult: Record<string, DataExtractionCase['result']> = {};
  [...result1, ...result2].forEach(v => {
    const { llm, result } = v;
    if (!modelResult[llm]) {
      modelResult[llm] = result;
    } else {
      modelResult[llm].push(...result);
    }
  });
  return Object.keys(modelResult).map(llm => ({
    llm,
    result: modelResult[llm]
  }));
};
