import { sampleSize, isNumber, isInteger, isString, isArray, capitalize, startCase } from 'lodash';
import type { DataItem, SimpleFieldInfo } from '../../../../common/typings';
import { DataType, ROLE } from '../../../../common/typings';
import dayjs from 'dayjs';
import { uniqArray } from '@visactor/vutils';
import alasql from 'alasql';
import { RESERVE_REPLACE_MAP, operators } from './constants';
import { replaceAll } from 'src/common/utils/utils';

export const readTopNLine = (csvFile: string, n: number) => {
  // get top n lines of a csv file
  let res = '';
  //possible separators.：\r,\n,\r\n
  const finish = ['\r\n', '\r', '\n'].some(splitter => {
    if (csvFile.includes(splitter)) {
      res = csvFile
        .split(splitter)
        .slice(0, n + 1)
        .join(splitter);
      return true;
    }
    return false;
  });
  if (finish) {
    return res;
  }
  return csvFile;
};
function isDecimal(n: any) {
  return isNumber(n) && !isInteger(n);
}
function validateDate(date: any) {
  //check if the string is a data string
  //only support YYYY-MM-DD and MM-DD
  return dayjs(date, 'YYYY-MM-DD').isValid() || dayjs(date, 'MM-DD').isValid();
}

export function removeEmptyLines(str: string) {
  return str.replace(/\n\s*\n/g, '\n');
}

export const getFieldDomain = (dataset: DataItem[], column: string, role: ROLE) => {
  //calculate domain of the column
  const domain: (string | number)[] = dataset.map(d => (role === ROLE.DIMENSION ? d[column] : Number(d[column])));
  return role === ROLE.DIMENSION
    ? (uniqArray(domain) as string[]).slice(0, 20)
    : [Math.min(...(domain as number[])), Math.max(...(domain as number[]))];
};

export const detectFieldType = (dataset: DataItem[], column: string): SimpleFieldInfo => {
  let fieldType: DataType | undefined;
  //detect field type based on rules
  //The data types have the following inclusion relationships:
  //date=>string
  //int=>float=>string
  //detect field type from strict to loose

  dataset.every(data => {
    const value = data[column];
    const numberValue = Number(value);
    if (!fieldType) {
      //no accurate fieldType at the beginning, make the first one as fieldType
      if (!isNaN(numberValue)) {
        if (isInteger(numberValue)) {
          fieldType = DataType.INT;
        } else {
          fieldType = DataType.FLOAT;
        }
      } else if (validateDate(value)) {
        //check if the value is date
        fieldType = DataType.DATE;
      } else {
        fieldType = DataType.STRING;
      }
      return true;
    }
    //already has a fieldType, check consistency
    if (fieldType === DataType.DATE && !validateDate(value)) {
      //current value is not date, field is string type
      fieldType = DataType.STRING;
      return false;
    }
    if (fieldType === DataType.INT) {
      if (isNaN(numberValue)) {
        //current value is not number, field is string type
        fieldType = DataType.STRING;
        return false;
      } else if (!isInteger(numberValue)) {
        //current value is not int, convert to float type and continue checking
        fieldType = DataType.FLOAT;
        return true;
      }
      return true;
    }
    if (fieldType === DataType.FLOAT) {
      if (isNaN(numberValue)) {
        //current value is not number, field is string type
        fieldType = DataType.STRING;
        return false;
      }
      return true;
    }
    if (fieldType === DataType.STRING) {
      //no need to detect.
      return false;
    }
    return true;
  });
  const role = [DataType.STRING, DataType.DATE].includes(fieldType) ? ROLE.DIMENSION : ROLE.MEASURE;
  const domain = getFieldDomain(dataset, column, role);

  return {
    fieldName: column,
    type: fieldType,
    role,
    domain
  };
};
export const getFieldInfo = (dataset: DataItem[], columns: string[]): SimpleFieldInfo[] => {
  let sampledDataset = dataset;
  if (dataset.length > 1000) {
    //sample the dataset if too large
    sampledDataset = sampleSize(dataset, 1000);
  }
  return columns.map(column => detectFieldType(sampledDataset, column));
};

export function generateRandomString(len: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
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
 * replace all the non-ascii characters in the sql str into valid strings.
 * @param str
 * @returns
 */
export const replaceNonASCIICharacters = (str: string) => {
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
  const replaceKeys = [...replaceMap.keys()];
  return replaceKeys.reduce((prev, cur) => {
    return replaceAll(prev, cur, replaceMap.get(cur));
  }, str);
};

//replace data keys and data values according to replaceMap
export const replaceDataset = (dataset: DataItem[], replaceMap: Map<string, string>, keysOnly: boolean) => {
  return dataset.map((d: DataItem) => {
    const dataKeys = Object.keys(d);
    return dataKeys.reduce((prev, cur) => {
      const replacedKey = replaceString(cur, replaceMap);
      const replacedValue = replaceString(d[cur], replaceMap);
      prev[replacedKey] = keysOnly ? d[cur] : replacedValue;
      return prev;
    }, {});
  });
};

export const getValueByAttributeName = (obj: any, outterKey: string): string[] => {
  //get all the attributes of an object by outterKey
  const values = [];
  for (const key in obj) {
    if (key === outterKey && typeof obj[key] === 'string') {
      values.push(obj[key]);
    } else if (typeof obj[key] === 'object') {
      const childValues = getValueByAttributeName(obj[key], outterKey);
      values.push(...childValues);
    }
  }
  return uniqArray(values);
};

export const replaceInvalidContent = (str: string) => {
  const INVALID_CONTENT_LIST = [' '];
  return INVALID_CONTENT_LIST.reduce((prev, cur) => {
    return replaceAll(prev, cur, '');
  }, str);
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
const matchColumnName = (columnName: string, fieldName: string) => {
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
  fieldInfo: SimpleFieldInfo[],
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
