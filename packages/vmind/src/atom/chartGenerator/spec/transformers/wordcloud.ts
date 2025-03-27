import { isValidDataTable } from '../../../../utils/dataTable';
import type { GenerateChartCellContext } from '../../type';
import { WORDCLOUD_NUM_LIMIT } from '../constants';
import { color, revisedVChartType, theme } from './common';

export const wordCloudData = (context: GenerateChartCellContext) => {
  const { dataTable, spec } = context;
  spec.data = {
    id: 'data',
    values: isValidDataTable(dataTable) ? dataTable.slice(0, WORDCLOUD_NUM_LIMIT) : []
  };

  return { spec };
};

export const wordCloudField = (context: GenerateChartCellContext) => {
  //assign field in spec according to cell
  const { cell, spec } = context;
  spec.nameField = cell.color;

  if (cell.size) {
    spec.valueField = cell.size;
  }

  spec.seriesField = spec.nameField;

  return { spec };
};

export const wordCloudDisplayConf = (context: GenerateChartCellContext) => {
  const { spec, chartTheme } = context;

  if (chartTheme) {
    return { spec };
  }
  spec.fontSizeRange = [20, 50];
  spec.fontWeightRange = [800, 800];
  //spec.wordCloudConfig = {
  //  zoomToFit: {
  //    enlarge: true
  //  }
  //}
  return { spec };
};
export const pipelineWordCloud = [
  wordCloudData,
  color,
  wordCloudField,
  wordCloudDisplayConf
  //animationOneByOne,
];
