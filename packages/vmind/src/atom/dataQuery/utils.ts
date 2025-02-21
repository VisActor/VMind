import JSON5 from 'json5';
import { isArray, isString, uniqArray } from '@visactor/vutils';
import { capitalize, replaceAll } from '../../utils/text';
import { alasqlKeywordList } from './const';
import type { DataItem, DataTable, FieldInfo } from '../../types';
import { ROLE } from '../../types';
import alasql from 'alasql';
import { detectFieldType } from '../../utils/field';

export function generateRandomString(len: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const operatorList = [
  ['+', `_${generateRandomString(3)}_PLUS_${generateRandomString(3)}_`],
  ['-', `_${generateRandomString(3)}_DASH_${generateRandomString(3)}_`],
  ['*', `_${generateRandomString(3)}_ASTERISK_${generateRandomString(3)}_`],
  ['/', `_${generateRandomString(3)}_SLASH_${generateRandomString(3)}_`]
];

const operators = operatorList.map(op => op[0]);

const RESERVE_REPLACE_MAP = new Map<string, string>([
  ...operatorList,
  ...(alasqlKeywordList.map(keyword => [keyword, generateRandomString(10)]) as any)
]);

export const parseSQLResponse = (response: string) => {
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
    llmFieldInfo: fieldInfo,
    thoughts: ''
  };
};

export function removeEmptyLines(str: string) {
  return str.replace(/\n\s*\n/g, '\n');
}

export const swapMap = (map: Map<string, string>) => {
  //swap the map
  const swappedMap = new Map();

  // Swap key with value
  map.forEach((value, key) => {
    swappedMap.set(value, key);
  });
  return swappedMap;
};

/**
 * replace the string according to replaceMap
 * @param str
 * @param replaceMap
 */
export const replaceByMap = (str: string, replaceMap: Map<string, string>) => {
  const originalStringList = [...replaceMap.keys()];

  const finalSql = originalStringList.reduce((prev, cur) => {
    const originColumnName = cur;
    const validColumnName = replaceMap.get(cur);
    return replaceAll(prev, originColumnName, validColumnName);
  }, str);

  return finalSql;
};

/**
 * replace all the non-ascii characters in the sql str into valid strings.
 * @param str
 * @returns
 */
const replaceNonASCIICharacters = (str: string) => {
  const nonAsciiCharMap = new Map();

  const newStr = str.replace(/([^\x00-\x7F]+)/g, m => {
    let replacement;
    if (nonAsciiCharMap.has(m)) {
      replacement = nonAsciiCharMap.get(m);
    } else {
      replacement = generateRandomString(10);
      nonAsciiCharMap.set(m, replacement);
    }
    return replacement;
  });

  //const swappedMap = swapMap(nonAsciiCharMap);

  return { validStr: newStr, replaceMap: nonAsciiCharMap };
};

/**
 * replace strings according to replaceMap
 * @param str
 * @param replaceMap
 * @returns
 */
export const replaceString = (str: string | number, replaceMap: Map<string, string>) => {
  if (!isString(str)) {
    return str;
  }
  if (replaceMap.has(str)) {
    return replaceMap.get(str);
  }
  //Some string may be linked by ASCII characters as non-ASCII characters.Traversing the replaceMap and replaced it to the original character
  //sort the replace keys according to their length to make sure longer string can be replaced first
  const replaceKeys = [...replaceMap.keys()].sort((a, b) => b.length - a.length);
  return replaceKeys.reduce((prev, cur) => {
    return replaceAll(prev, cur, replaceMap.get(cur));
  }, str);
};

//replace data keys and data values according to replaceMap
export const replaceDataset = (dataset: DataTable, replaceMap: Map<string, string>, keysOnly: boolean): DataTable => {
  return dataset.map((d: DataItem) => {
    const dataKeys = Object.keys(d);
    return dataKeys.reduce((prev, cur) => {
      const replacedKey = replaceString(cur, replaceMap);
      const replacedValue = replaceString(d[cur], replaceMap);
      prev[replacedKey] = keysOnly ? d[cur] : replacedValue;
      return prev;
    }, {} as DataItem);
  });
};

export const getValueByAttributeName = (obj: any, outterKey: string): string[] => {
  //get all the attributes of an object by outterKey
  const values: string[] = [];
  for (const key in obj) {
    if (key === outterKey && typeof obj[key] === 'string') {
      values.push(obj[key]);
    } else if (typeof obj[key] === 'object') {
      const childValues = getValueByAttributeName(obj[key], outterKey);
      values.push(...childValues);
    }
  }
  return uniqArray(values) as string[];
};

/**
 * replace operator and reserved words inside the column name in the sql str
 * operators such as +, -, *, / in column names in sql will cause ambiguity and parsing error
 * so we need to replace them only in column names
 * sometimes skylark2 pro will return a sql statement in which non-ascii characters are not wrapped with ``
 * this will cause error in alasql
 * so we need to replace them with random string in the whole sql
 * @param sql
 * @param columns
 * @returns validStr: sql without invalid characters; columnReplaceMap: replace map of column names; sqlReplaceMap: replace map of the whole sql including dimension values.
 *
 */
export const replaceInvalidWords = (sql: string, columns: string[]) => {
  const operatorReplaceMap = new Map<string, string>();

  //replace column names according to RESERVED_REPLACE_MAP
  const validColumnNames = columns.map(column => {
    const nameWithoutOperator = [...RESERVE_REPLACE_MAP.keys()].reduce((prev, cur) => {
      //try to match the keywords in column names with different style
      const replaceStr = [cur.toUpperCase(), cur.toLowerCase(), capitalize(cur)].find(str => {
        //operators need to be replaced if it is includes by the column name
        //while other reserved words need to be replaced if it is exactly the same as column words
        return operators.includes(cur) ? prev.includes(str) : prev === str;
      });
      if (replaceStr) {
        if (!operatorReplaceMap.has(replaceStr)) {
          operatorReplaceMap.set(replaceStr, RESERVE_REPLACE_MAP.get(cur));
        }
        return replaceAll(prev, replaceStr, RESERVE_REPLACE_MAP.get(cur));
      }
      return prev;
    }, column);

    return nameWithoutOperator;
  });

  const columnReplaceMap = new Map<string, string>(
    columns
      .map((column, index) => {
        const validStr = validColumnNames[index];
        if (column !== validStr) {
          return [column, validStr];
        }
        return undefined;
      })
      .filter(Boolean) as any
  );

  //only replace operators in column names, not all operators in the sql
  const sqlWithoutOperator = replaceByMap(sql, columnReplaceMap);

  //replace non-ascii characters in sql
  const { validStr: sqlWithoutAscii, replaceMap: asciiReplaceMap } = replaceNonASCIICharacters(sqlWithoutOperator);

  return { validStr: sqlWithoutAscii, columnReplaceMap: operatorReplaceMap, sqlReplaceMap: asciiReplaceMap };
};

/**
 * merge two maps
 * @param map1
 * @param map2
 * @returns
 */
export const mergeMap = (map1: Map<string, string>, map2: Map<string, string>) => {
  // merge map2 into map1
  map2.forEach((value, key) => {
    map1.set(key, value);
  });
  return map1;
};

/**
 * match the column name with field name without blank spaces
 * @param columnName
 * @param fieldName
 * @returns
 */
export const matchColumnName = (columnName: string, fieldName: string) => {
  const fieldWithoutSpace = fieldName.replace(/\s/g, '');
  const columnWithoutString = columnName.replace(/\s/g, '');

  if (columnWithoutString === fieldWithoutSpace) {
    return true;
  }
  return false;
};

/**
 * sometimes skylark2 pro will return a sql statement with some blank spaces in column names
 * this will make the alasql can't find the correct column in dataset
 * so we need to remove these blank spaces
 * only replace when no fields can match the column name in sql
 *
 */
export const replaceBlankSpace = (sql: string, fieldNames: string[]) => {
  //extract all the columns in sql str
  const ast = alasql.parse(sql) as any;
  const columnsInSql = getValueByAttributeName(ast.statements[0], 'columnid');

  //replace all the spaces and reserved words in column names in sql
  //only replace when two names can match without space
  const validColumnNames = columnsInSql.map(column => {
    const matchedFieldName = fieldNames.find(field => matchColumnName(column, field));
    return matchedFieldName ?? column;
  });

  const finalSql = columnsInSql.reduce((prev, _cur, index) => {
    const originColumnName = columnsInSql[index];
    const validColumnName = validColumnNames[index];
    if (validColumnName !== originColumnName) {
      return replaceAll(prev, originColumnName, validColumnName);
    }
    return prev;
  }, sql);
  return finalSql;
};

/**
 * sometimes skylark2 pro will return a sql statement with some measure fields not being aggregated
 * this will make an empty field in dataset
 * so we need to aggregate these fields.
 *
 */
export const sumAllMeasureFields = (
  sql: string,
  fieldInfo: FieldInfo[],
  columnReplaceMap: Map<string, string>,
  sqlReplaceMap: Map<string, string>
) => {
  const measureFieldsInSql = fieldInfo
    .filter(field => field.role === ROLE.MEASURE)
    .map(field => {
      const { fieldName } = field;
      const replacedName1 = replaceString(fieldName, columnReplaceMap);
      const replacedName2 = replaceString(replacedName1, sqlReplaceMap);

      return replacedName2;
    });

  const ast: any = alasql.parse(sql);
  const selectedColumns = ast.statements[0].columns;
  const nonAggregatedColumns: string[] = selectedColumns
    .filter((column: any) => !column.aggregatorid)
    .map((column: any) => column.columnid);

  const groupByColumns: string[] = (ast.statements[0].group ?? []).map((column: any) => column.columnid);

  //if there exist some aggregated columns in sql and there exist GROUP BY statement in sql, then aggregate all the measure columns
  let needAggregateColumns: string[] = [];
  if (groupByColumns.length > 0 && nonAggregatedColumns.length !== selectedColumns.length) {
    //aggregate columns that is not in group by statement
    needAggregateColumns = nonAggregatedColumns
      //filter all the measure fields
      .filter(column => measureFieldsInSql.includes(column))
      //filter measure fields that is not in groupby
      .filter(column => !groupByColumns.includes(column));
  }

  const patchedFields = needAggregateColumns.map(column => `SUM(\`${column}\`) as ${column}`);

  const finalSql = needAggregateColumns.reduce((prev, cur, index) => {
    const regexStr = `\`?${cur}\`?`;
    const regex = new RegExp(regexStr, 'g');
    return prev.replace(regex, patchedFields[index]);
  }, sql);

  return finalSql;
};

/**
 * convert group by columns to string
 */
export const convertGroupByToString = (sql: string, dataset: DataItem[]) => {
  const ast: any = alasql.parse(sql);
  const groupByColumns: string[] = ast.statements[0].group.map((column: any) => column.columnid);
  dataset.forEach(item => {
    groupByColumns.forEach(column => {
      item[column] = item[column].toString();
    });
  });
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
