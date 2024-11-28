/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { stringSimilarity } from 'string-similarity-js';
import { DataType } from '../../../../../src';
import type { DataCell, DataExtractionCtx, FieldInfo, DataTable } from '../../../../../src';
import { getRoleByFieldType } from '../../../../../src/utils/field';
import { ROLE } from '../../../../../src/common/typings';
import type { DataExtractionCase, DataExtractionResult, ScoreDetail } from './type';
import { isNumber } from '@visactor/vutils';

function cosineSimilarity(text1: string, text2: string): number {
  return stringSimilarity(text1, text2);
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

const getDataScore = (
  currentDataList: DataCell[],
  answerDataList: DataCell[],
  fieldInfo: FieldInfo,
  isStrict = true
) => {
  let dataScore = 0;
  const seletedList = new Array(answerDataList.length).fill(false);
  for (let i = 0; i < currentDataList.length; i++) {
    let maxScore = 0;
    let currentSelectedIndex = -1;
    const valueCompareFunction = getValueCompareFunction(fieldInfo);
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
  if (answerDataList.length > currentDataList.length && isStrict) {
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
  dataTableB: DataTable,
  isStrict = true
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
        const currentTypeScore = getFieldTypeScore(fieldInfo.type, fieldInfoB[i].type);
        const currentDataScore = getDataScore(dataListB, dataListA, fieldInfo, isStrict);
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

function getValueCompareFunction(fieldInfo: FieldInfo) {
  const { role, type, ratioGranularity } = fieldInfo;
  if (role === ROLE.MEASURE) {
    return (a: any, b: any) => {
      if (+a === +b || a === b) {
        return 1;
      }
      if (type === DataType.RATIO) {
        const rate = ratioGranularity === '‰' ? 1000 : 100;
        return (isNumber(a) && isNumber(b) && a * rate === b) || b * rate === a ? 1 : 0;
      }
      return isNumber(a) && isNumber(b) && Math.abs(a) === Math.abs(b) ? 0.5 : 0;
    };
  }
  return (a: DataCell, b: DataCell) => {
    return cosineSimilarity(`${a}`, `${b}`);
  };
}

export const getScoreOfDataExtraction = (
  resultCtx: DataExtractionCtx,
  answerCtx: DataExtractionCtx,
  isStrict = true
) => {
  const { fieldInfo = [], dataTable } = resultCtx;
  const { fieldInfo: answerInfo = [], dataTable: answerTable } = answerCtx;
  const scoreList = (
    isStrict
      ? getScoreOfDataset(answerInfo || [], fieldInfo || [], answerTable!, dataTable!)
      : getScoreOfDataset(fieldInfo || [], answerInfo || [], dataTable!, answerTable!, false)
  ).filter(v => v.matchedIndex !== -1);
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
  if (answerInfo?.length > fieldInfo?.length && isStrict) {
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

const getValidCellNumber = (ctx: any) => {
  const { dataTable = [], fieldInfo = [] } = ctx;
  return dataTable.length * fieldInfo.length;
};

const getCtx = (ctx: any) => {
  if (ctx.datasets?.length) {
    let res = ctx.datasets[0];
    let preCount = getValidCellNumber(res);
    for (let i = 1; i < ctx.datasets.length; i++) {
      const curCount = getValidCellNumber(ctx.datasets[i]);
      if (curCount > preCount) {
        preCount = curCount;
        res = ctx.datasets[i];
      }
    }
    return res;
  }
  return ctx;
};
export const updateScoreInDataExtraction = (result: DataExtractionResult, answer: DataExtractionCase) => {
  result.forEach(llmResult => {
    llmResult.result.forEach(caseResult => {
      const answerCase = answer.result.find(v => v.dataset === caseResult.dataset);
      if (answerCase) {
        if (caseResult.defaultResult.length) {
          caseResult.defaultResult = caseResult.defaultResult.map((v, index) => ({
            ...v,
            ...getScoreOfDataExtraction(getCtx(v.context), getCtx(answerCase.defaultResult[index].context)),
            dataClean: v?.dataClean
              ? {
                  ...v.dataClean,
                  ...getScoreOfDataExtraction(
                    getCtx(v.dataClean),
                    getCtx(answerCase.defaultResult[index].context),
                    false
                  )
                }
              : undefined
          }));
        }
        if (caseResult.fieldInfoResult.length) {
          caseResult.fieldInfoResult = caseResult.fieldInfoResult.map((v, index) => ({
            ...v,
            ...getScoreOfDataExtraction(getCtx(v.context), getCtx(answerCase.defaultResult[index].context))
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
      modelResult[llm] = [...result];
    } else {
      modelResult[llm].push(...result);
    }
  });
  return Object.keys(modelResult).map(llm => ({
    llm,
    result: modelResult[llm]
  }));
};
