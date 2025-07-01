import { isNil, isValid } from '@visactor/vutils';
import { GenerateChartInput } from '../types/transform';
import { WORDCLOUD_NUM_LIMIT } from '../utils/constants';
import { isValidDataTable } from '../utils/data';
import { color, formatColorFields, formatSizeFields } from './common';

export const formatFieldsOfWordCloud = (context: GenerateChartInput) => {
  //Word cloud must have color fields and size fields
  let { cell } = context;

  if (isNil(cell.size) || isNil(cell.color) || cell.color === cell.size) {
    if (isNil(cell.size) || cell.size === cell.color) {
      cell = formatSizeFields(context, ['weight', 'fontSize']).cell;
    }

    if (isNil(cell.color)) {
      cell = formatColorFields({ ...context, cell }, ['text', 'word', 'label', 'x']);
    }
  }
  return {
    cell
  };
};

export const wordCloudData = (context: GenerateChartInput) => {
  const { dataTable, spec } = context;
  spec.data = {
    id: 'data',
    values: isValidDataTable(dataTable) ? dataTable.slice(0, WORDCLOUD_NUM_LIMIT) : []
  };

  return { spec };
};

export const wordCloudField = (context: GenerateChartInput) => {
  //assign field in spec according to cell
  const { cell, spec, fieldInfo } = context;
  const colorField = cell.color;
  const cellNew = { ...cell };

  if (isValid(colorField)) {
    spec.nameField = colorField;
    spec.seriesField = colorField;
  }

  if (isValid(cell.size)) {
    spec.valueField = cell.size;
  }

  return { spec, cell: cellNew };
};

export const wordCloudDisplayConf = (context: GenerateChartInput) => {
  const { spec, chartTheme } = context;

  if (chartTheme) {
    return { spec };
  }
  spec.fontSizeRange = [20, 50];
  spec.fontWeightRange = [800, 800];

  return { spec };
};
export const pipelineWordCloud = [
  formatFieldsOfWordCloud,
  wordCloudData,
  color,
  wordCloudField,
  wordCloudDisplayConf
  //animationOneByOne,
];
