import { array, maxInArray, minInArray } from '@visactor/vutils';
import type { UnfoldTransformOptions } from '../types/utils';

const aggregateFuncs = {
  sum: (arr: number[]) => arr.reduce((sum: number, val: number) => sum + val, 0),
  min: (arr: number[]) => minInArray(arr),
  max: (arr: number[]) => maxInArray(arr),
  count: (arr: number[]) => arr.length,
  mean: (arr: number[]) => arr.reduce((sum: number, val: number) => sum + val, 0) / arr.length
};

export const unfoldTransform = (options: UnfoldTransformOptions, upstreamData: any[]) => {
  if (!upstreamData || !upstreamData.length) {
    return [];
  }

  const res: any[] = [];
  const groups: any = {};
  const keyField = options.keyField;
  const valueField = options.valueField;
  const aggregate = aggregateFuncs[options.aggregateType ?? 'sum'];

  if (options.groupBy) {
    const groupByFields = array(options.groupBy);
    upstreamData.forEach((entry: any) => {
      if (!entry) {
        return;
      }
      const datum: any = {};
      const keys: any[] = [];

      groupByFields.forEach((field: string) => {
        datum[field] = entry[field];
        keys.push(entry[field]);
      });

      const groupKey = keys.join('~');

      if (groups[groupKey]) {
        if (groups[groupKey].values[entry[keyField]]) {
          groups[groupKey].values[entry[keyField]].push(entry[valueField]);
        } else {
          groups[groupKey].values[entry[keyField]] = [entry[valueField]];
        }
      } else {
        groups[groupKey] = { datum, values: { [entry[keyField]]: [entry[valueField]] } };
      }
    });
  } else {
    groups[0] = { datum: {}, values: {} };
    upstreamData.forEach((entry: any) => {
      if (!entry) {
        return;
      }

      if (groups[0].values[entry[keyField]]) {
        groups[0].values[entry[keyField]].push(entry[valueField]);
      } else {
        groups[0].values[entry[keyField]] = [entry[valueField]];
      }
    });
  }
  Object.keys(groups).forEach(groupKey => {
    const datum = groups[groupKey].datum;
    const values = groups[groupKey].values;

    Object.keys(values).forEach(key => {
      const rows = values[key];

      datum[key] = aggregate(rows as number[]);
    });

    res.push(datum);
  });

  return res;
};
