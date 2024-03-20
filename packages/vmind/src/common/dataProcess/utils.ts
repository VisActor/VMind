import { sampleSize, isNumber, isInteger, isString } from 'lodash';
import { DataItem, DataType, ROLE, SimpleFieldInfo } from '../../typings';
import dayjs from 'dayjs';
import { uniqArray } from '@visactor/vutils';
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

function generateRandomString(len: number) {
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
  } else {
    //Some string may be linked by ASCII characters as non-ASCII characters.Traversing the replaceMap and replaced it to the original character
    const replaceKeys = [...replaceMap.keys()];
    return replaceKeys.reduce((prev, cur) => {
      return prev.replace(new RegExp(cur, 'g'), replaceMap.get(cur));
    }, str);
  }
};

//replace data keys and data values according to replaceMap
export const replaceDataset = (dataset: DataItem[], replaceMap: Map<string, string>) => {
  return dataset.map((d: DataItem) => {
    const dataKeys = Object.keys(d);
    return dataKeys.reduce((prev, cur) => {
      const replacedKey = replaceString(cur, replaceMap);
      const replacedValue = replaceString(d[cur], replaceMap);
      prev[replacedKey] = replacedValue;
      return prev;
    }, {});
  });
};
