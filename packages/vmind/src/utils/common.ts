import { isFunction } from '@visactor/vutils';
import type { DataCell } from '../types';

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

const KNOWLEDGE_START_INDEX = 1;
export const getStrFromArray = (array: string[]) =>
  array.map((item, index) => `${index + KNOWLEDGE_START_INDEX}. ${item}`).join('\n');
