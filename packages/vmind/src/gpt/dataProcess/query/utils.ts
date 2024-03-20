import { isArray } from 'lodash';
import JSON5 from 'json5';

import { Query } from '@visactor/calculator';
import {
  detectFieldType,
  generateRandomString,
  mergeMap,
  replaceNonASCIICharacters
} from '../../../common/dataProcess/utils';
import { DataItem, SimpleFieldInfo } from '../../../typings';
import { ASTParserContext, ASTParserPipe } from './type';

/**
 * replace invalid characters in sql str and get the replace map
 * @param sql
 * @returns
 */
export const preprocessSQL = (sql: string, fieldInfo: SimpleFieldInfo[]) => {
  //replace \n to space
  const noNewLine = sql.replace('\n', ' ');
  //replace reserved words inside the field name in the sql str
  const reservedMap = {
    KEY: `_KEY_${generateRandomString(10)}_`
  };
  let validSQL = noNewLine;
  const reservedReplaceMap: Map<string, string> = new Map();

  fieldInfo.forEach(field => {
    const { fieldName } = field;
    let validFieldName = fieldName;
    Object.keys(reservedMap).forEach(reserveWord => {
      if (validFieldName.toUpperCase().includes(reserveWord)) {
        const validWord = reservedMap[reserveWord];
        validFieldName = validFieldName.toUpperCase().replace(new RegExp(reserveWord, 'g'), validWord);
      }
    });
    validSQL = validSQL.replace(new RegExp(fieldName, 'g'), validFieldName);
    if (fieldName !== validFieldName) {
      reservedReplaceMap.set(validFieldName, fieldName);
    }
  });
  const { validStr, replaceMap } = replaceNonASCIICharacters(validSQL);
  // merge the two replace map
  const mergedMap = mergeMap(replaceMap, reservedReplaceMap);

  return { validStr, replaceMap: mergedMap };
};

export const addQuotes = (sqlString: string) => {
  let newSQLString = '';
  let startIdx = 0;

  while (startIdx < sqlString.length) {
    // try to find the start and end position of quotes
    let startQuoteIdx = sqlString.indexOf('[', startIdx);
    if (startQuoteIdx === -1) {
      // no quotes found
      startQuoteIdx = sqlString.length;
    }
    let endQuoteIdx = sqlString.indexOf(']', startQuoteIdx + 1);
    if (endQuoteIdx === -1) {
      endQuoteIdx = sqlString.length;
    }

    // handle the part without quotes
    let noQuotesPart = sqlString.substring(startIdx, startQuoteIdx);
    const regex = /([^\x00-\x7F]+)/g;
    noQuotesPart = noQuotesPart.replace(regex, match => `[${match}]`);

    // handle the part with quotes
    const quotesPart = sqlString.substring(startQuoteIdx, endQuoteIdx + 1);

    // add them to the result
    newSQLString += noQuotesPart + quotesPart;

    // move startIdx to the end of quotes
    startIdx = endQuoteIdx + 1;
  }

  return newSQLString;
};

export const execPipeline = (src: Partial<Query>, pipes: ASTParserPipe[], context: ASTParserContext) =>
  pipes.reduce((pre: Partial<Query>, pipe: ASTParserPipe) => {
    const result = pipe(pre, context);
    return result;
  }, src);

export const toFirstUpperCase = (name = '') => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

export const checkIsColumnNode = (node: any, columns: any, fieldInfo: SimpleFieldInfo[]) => {
  if (node.type === 'column_ref') {
    return true;
  }
  return false;
  //else {
  //  const columnNameList = columns
  //    .map((c: any) => c.column)
  //    .concat(columns.map((c: any) => c.alias))
  //    .concat(fieldInfo.map(field => field.fieldName))
  //    .filter(Boolean);
  //  const columnName = node.column ?? node.value;
  //  return columnNameList.includes(columnName);
  //}
};

/**
 * parse the respond field in data query to get field type and role
 * @param fieldInfo
 * @param responseFieldInfo
 * @param dataset
 */
export const parseRespondField = (
  responseFieldInfo: { fieldName: string; description?: string }[],
  dataset: DataItem[]
) =>
  responseFieldInfo.map(field => ({
    ...field,
    ...detectFieldType(dataset, field.fieldName)
  }));

export const patchQueryInput = (userInput: string) => {
  return userInput;
};

export const parseGPTQueryResponse = (response: string) => {
  const sql = response.match(/sql:\n?```(.*?)```/s)[1];
  const fieldInfoStr = response.match(/fieldInfo:\n?```(.*?)```/s)[1];
  let fieldInfo = [];
  try {
    const tempFieldInfo = JSON5.parse(fieldInfoStr);
    if (isArray(tempFieldInfo)) {
      fieldInfo = tempFieldInfo;
    } else {
      fieldInfo = tempFieldInfo.fieldInfo;
    }
  } catch (e) {
    //fieldInfoStr is not a json string; try to wrap it with []
    fieldInfo = JSON5.parse(`[${fieldInfoStr}]`);
  }
  return {
    sql,
    fieldInfo
  };
};
