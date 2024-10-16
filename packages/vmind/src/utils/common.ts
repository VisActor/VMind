import { isFunction, isValidNumber } from '@visactor/vutils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { DataCell } from '../types';

dayjs.extend(customParseFormat);

export const sampleSize = (array: any, n: number) => {
  const length = array === null ? 0 : array.length;
  if (!length || n < 1) {
    return [];
  }
  n = n > length ? length : n;
  const randIndexs = [];
  while (randIndexs.length < n) {
    const rand = Math.floor(Math.random() * length);
    if (randIndexs.indexOf(rand) === -1) {
      randIndexs.push(rand);
    }
  }
  return randIndexs.map(i => array[i]);
};

export const uniqBy = (array: any, key: string | ((item: any) => string)) => {
  const seen = new Set();
  return array.filter((item: any) => {
    const k = isFunction(key) ? key(item) : item[key];
    if (k === undefined) {
      return false;
    }
    if (!seen.has(k)) {
      seen.add(k);
      return true;
    }
    return false;
  });
};

export const isValidData = (data: DataCell) => {
  return data !== null && data !== undefined && data !== 'null' && data !== '';
};

function isQuarterDate(date: string) {
  const patterns = [/^\d{4}-Q[1-4]$/, /^\d{4}年第[一二三四]季度$/, /^Q[1-4]$/, /^\d{4}年-Q[1-4]$/];
  return patterns.some(pattern => pattern.test(date));
}
export function validateDate(date: any) {
  //check if the string is a data string
  const formats = [
    'YYYY-MM-DD',
    'YYYY/MM/DD',
    'DD/MM/YYYY',
    'MM-DD-YYYY',
    'YYYY年MM月DD日',
    'MM月DD日YYYY年',
    'YYYY年MM月',
    'YYYY年M月',
    'YYYY-MM',
    'YYYY/MM',
    'YYYY',
    'YYYY年',
    'MM',
    'MM月',
    'M月',
    'MM-DD',
    'MM月DD日'
  ];
  return dayjs(date).isValid() || formats.some(format => dayjs(date, format, true).isValid()) || isQuarterDate(date);
}

export function average(data: any[], field?: string): number {
  let sum = 0;
  let count = 0;
  data.forEach((x: any) => {
    const v = field ? +x[field] : +x;
    if (isValidNumber(v)) {
      sum += v;
      count++;
    }
  });

  const average = sum / count;
  return average;
}

export function getIntersection(array1: DataCell[], array2: DataCell[]) {
  return array1.filter(value => array2.includes(value));
}

const KNOWLEDGE_START_INDEX = 1;
export const getStrFromArray = (array: string[]) =>
  array.map((item, index) => `${index + KNOWLEDGE_START_INDEX}. ${item}`).join('\n');
