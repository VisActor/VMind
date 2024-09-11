import chroma from 'chroma-js';
import type { VMindDataset } from '../../../../../common/typings';
import { COLOR_THEMES } from './constants';

export enum InterpolationType {
  Linear = 'linear',
  NonLinear = 'nonlinear'
}

export type InterpolationColor = {
  color: string;
  position?: string;
};

export type Interpolation = {
  type: InterpolationType;
  colors: InterpolationColor[];
  num: number;
};

export const getColorInterpolation = (interpolation: Interpolation) => {
  const colorList = interpolation.colors.map(interpolationColor => interpolationColor.color);
  if (interpolation.type === InterpolationType.Linear) {
    return chroma.scale(colorList).colors(interpolation.num);
  }
  const positionList = interpolation.colors.map(interpolationColor => interpolationColor.position);
  return chroma.scale(colorList).domain(positionList).colors(interpolation.num);
};

export const fillColorForData = (datsets: VMindDataset, categoryField: string) => {
  const categoryList = new Array(
    ...new Set(
      datsets.map(dataset => {
        return dataset[categoryField];
      })
    )
  );
  const colorList = getColorInterpolation({
    type: InterpolationType.Linear,
    colors: COLOR_THEMES.default.map(color => {
      return { color: color } as InterpolationColor;
    }),
    num: categoryList.length
  });
  const category2colorMap = categoryList.reduce((acc, key, index) => {
    acc[key as string] = colorList[index];
    return acc;
  }, {} as { [key: string]: any });
  return datsets.map(dataset => {
    dataset.fill = category2colorMap[dataset[categoryField]];
    return dataset;
  });
};

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export interface SortField {
  field: string;
  order: SortOrder;
}

export const sortArray = <T>(array: T[], sortFields: SortField[]): T[] => {
  return array.sort((a, b) => {
    for (const { field, order } of sortFields) {
      const aValue = a[field as keyof T];
      const bValue = b[field as keyof T];

      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });
};
