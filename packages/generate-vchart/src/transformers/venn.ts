import { color, discreteLegend, formatColorFields, formatSizeFields } from './common';
import { DataCell, GenerateChartInput } from '../types/transform';
import { array, isArray, isString, isValid } from '@visactor/vutils';

export const vennData = (context: GenerateChartInput) => {
  const { dataTable, spec } = context;
  let { cell } = formatColorFields(context, ['color', 'x', 'label', 'sets']);
  cell = formatSizeFields({ ...context, cell }, ['size', 'value']).cell;
  const colorField = cell.color;

  if (isArray(colorField) && colorField.length === 2) {
    const id2dataMap: Record<
      DataCell,
      {
        sets: DataCell[];
        value: DataCell;
      }
    > = {};
    const setsField = colorField[0];
    const nameField = colorField[1];
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
  } else if (isString(colorField)) {
    spec.data = {
      values: dataTable.map(entry => {
        const setString = `${entry[colorField as string]}`;
        const sets = setString.split(/[,&]/).map(s => s.trim());
        return {
          ...entry,
          [colorField as string]: sets
        };
      })
    };

    spec.valueField = cell.size;
    spec.categoryField = colorField;
    spec.seriesField = colorField;
  }

  return { spec, cell };
};

export const pipelineVenn = [vennData, color, discreteLegend];
