import { color, discreteLegend } from './common';
import { DataCell, GenerateChartInput } from '../types/transform';
import { array, isArray, isString, isValid } from '@visactor/vutils';

export const vennData = (context: GenerateChartInput) => {
  const { dataTable, spec, cell } = context;

  if (isArray(cell.color) && cell.color.length === 2) {
    const id2dataMap: Record<
      DataCell,
      {
        sets: DataCell[];
        value: DataCell;
      }
    > = {};
    const setsField = cell.color[0];
    const nameField = cell.color[1];
    dataTable.forEach(data => {
      if (id2dataMap[data[setsField]]) {
        id2dataMap[data[setsField]].sets.push(data[nameField]);
      } else {
        id2dataMap[data[setsField]] = { sets: [data[nameField]], value: data[cell.size as string] };
      }
    });
    spec.data = {
      values: Object.values(id2dataMap)
    };

    spec.valueField = 'value';
    spec.categoryField = 'sets';
    spec.seriesField = 'sets';
  } else if (isString(cell.sets)) {
    spec.data = {
      values: dataTable.map(entry => {
        const setString = `${entry[cell.sets as string]}`;
        const sets = setString.split(/[,&]/).map(s => s.trim());
        return {
          ...entry,
          [cell.sets as string]: sets
        };
      })
    };

    spec.valueField = cell.size;
    spec.categoryField = cell.sets;
    spec.seriesField = cell.sets;
  }

  return { spec };
};

export const pipelineVenn = [vennData, color, discreteLegend];
