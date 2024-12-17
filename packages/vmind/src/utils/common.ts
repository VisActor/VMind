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

const dateFormats = [
  { key: 'YYYY年MM月DD日', regex: /^(\d{4})年(\d{2})月(\d{2})日$/, format: '$1-$2-$3' },
  { key: 'MM月DD日YYYY年', regex: /^(\d{2})月(\d{2})日(\d{4})年$/, format: '$3-$1-$2' },
  { key: 'YYYY年MM月', regex: /^(\d{4})年(\d{2})月$/, format: '$1-$2' },
  { key: 'YYYY年M月', regex: /^(\d{4})年(\d{1})月$/, format: '$1-0$2' },
  { key: 'YYYY年', regex: /^(\d{4})年$/, format: '$1' },
  { key: 'MM月', regex: /^(\d{2})月$/, format: '$1' },
  { key: 'M月', regex: /^(\d{1})月$/, format: '0$1' },
  { key: 'MM月DD日', regex: /^(\d{2})月(\d{2})日$/, format: '$1-$2' }
];
function isQuarterDate(date: string) {
  const patterns = [/^\d{4}-Q[1-4]$/, /^\d{4}年第[一二三四]季度$/, /^Q[1-4]$/, /^\d{4}年-Q[1-4]$/];
  return patterns.some(pattern => pattern.test(date));
}
export function validateDate(date: any) {
  const formaterDate = `${date}`.trim();
  //check if the string is a data string
  return (
    dayjs(formaterDate).isValid() ||
    dateFormats.find(v => dayjs(formaterDate, v.key, true).isValid()) ||
    isQuarterDate(formaterDate)
  );
}

function convertQuarterToMonth(quarter: string) {
  switch (quarter) {
    case 'Q1':
    case '第一季度':
      return '01-01';
    case 'Q2':
    case '第二季度':
      return '04-01';
    case 'Q3':
    case '第三季度':
      return '07-01';
    case 'Q4':
    case '第四季度':
      return '10-01';
    default:
      throw new Error('Invalid quarter');
  }
}

export function convertStringToDateValue(stringDate: string) {
  const date = `${stringDate}`.trim();
  if (dayjs(date).isValid()) {
    return date;
  }
  const validFormat = dateFormats.find(v => dayjs(date, v.key, true).isValid());
  if (validFormat && validFormat.regex.test(date)) {
    return date.replace(validFormat.regex, validFormat.format);
  }
  const patterns = [
    {
      regex: /^(\d{4})-Q([1-4])$/,
      format: (match: RegExpMatchArray) => `${match[1]}-${convertQuarterToMonth('Q' + match[2])}`
    },
    {
      regex: /^(\d{4})年第([一二三四])季度$/,
      format: (match: RegExpMatchArray) => `${match[1]}-${convertQuarterToMonth(match[2] + '季度')}`
    },
    { regex: /^Q([1-4])$/, format: (match: RegExpMatchArray) => `${convertQuarterToMonth('Q' + match[1])}` },
    {
      regex: /^(\d{4})年-Q([1-4])$/,
      format: (match: RegExpMatchArray) => `${match[1]}-${convertQuarterToMonth('Q' + match[2])}`
    }
  ];

  for (const pattern of patterns) {
    const match = date.match(pattern.regex);
    if (match) {
      return typeof pattern.format === 'function' ? pattern.format(match) : date.replace(pattern.regex, pattern.format);
    }
  }
  return date;
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

// Function to find the last index based on a condition
export function findLastIndex(arr: any[], predicate: (value: any, index: number, array: any[]) => boolean) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i], i, arr)) {
      return i;
    }
  }
  return -1;
}
