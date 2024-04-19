import { isInteger, isString } from 'lodash';
import { ASTParserContext, ASTParserPipe, DataType, ROLE, SimpleFieldInfo } from './type';
import { Query, TableData } from 'src/types';

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
  } else {
    //Some string may be linked by ASCII characters as non-ASCII characters.Traversing the replaceMap and replaced it to the original character
    const replaceKeys = [...replaceMap.keys()];
    return replaceKeys.reduce((prev, cur) => {
      return replaceAll(prev, cur, replaceMap.get(cur));
    }, str);
  }
};

export const replaceAll = (originStr: string, replaceStr: string, newStr: string) => {
  return originStr.split(replaceStr).join(newStr);
};

function generateRandomString(len: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

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

  const swappedMap = swapMap(nonAsciiCharMap);

  return { validStr: newStr, replaceMap: swappedMap };
};


const swapMap = (map: Map<string, string>) => {
  //swap the map
  const swappedMap = new Map();

  // Swap key with value
  map.forEach((value, key) => {
    swappedMap.set(value, key);
  });
  return swappedMap;
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

function validateDate(date: any) {
  //check if the string is a data string
  //only support YYYY-MM-DD and MM-DD
  return false;
}

export const detectFieldType = (dataset: TableData, column: string): SimpleFieldInfo => {
  let fieldType: DataType | undefined = undefined;
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
    } else {
      //already has a fieldType, check consistency
      if (fieldType == DataType.DATE && !validateDate(value)) {
        //current value is not date, field is string type
        fieldType = DataType.STRING;
        return false;
      }
      if (fieldType == DataType.INT) {
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
      if (fieldType == DataType.FLOAT) {
        if (isNaN(numberValue)) {
          //current value is not number, field is string type
          fieldType = DataType.STRING;
          return false;
        }
        return true;
      }
      if (fieldType == DataType.STRING) {
        //no need to detect.
        return false;
      }
      return true;
    }
  });
  return {
    fieldName: column,
    type: fieldType,
    role: [DataType.STRING, DataType.DATE].includes(fieldType) ? ROLE.DIMENSION : ROLE.MEASURE
  };
};


/**
 * replace random strings into its original string according to replaceMap
 * @param str
 * @param replaceMap
 * @returns
 */
export const getOriginalString = (str: string, replaceMap: Map<string, string>) => {
  if (!isString(str)) {
    return str;
  }
  if (replaceMap.has(str)) {
    return replaceMap.get(str);
  } else {
    //Some string may be linked by ASCII characters as non-ASCII characters.Traversing the replaceMap and replaced it to the original character
    const replaceKeys = [...replaceMap.keys()];
    return replaceKeys.reduce((prev, cur) => {
      return prev.replace(new RegExp(cur, 'g'), replaceMap.get(cur));
    }, str);
  }
};

/**
 * parse the respond field in data query to get field type and role
 * @param fieldInfo
 * @param responseFieldInfo
 * @param dataset
 */
export const parseRespondField = (
  responseFieldInfo: { fieldName: string; description?: string }[],
  dataset: TableData,
  replaceMap: Map<string, string>
) =>
  responseFieldInfo.map(field => ({
    ...field,
    ...detectFieldType(dataset, field.fieldName),
    fieldName: getOriginalString(field.fieldName, replaceMap)
  }));
