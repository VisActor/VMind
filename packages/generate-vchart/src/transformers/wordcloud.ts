import { isValid } from '@visactor/vutils';
import { GenerateChartInput } from '../types/transform';
import { WORDCLOUD_NUM_LIMIT } from '../utils/constants';
import { isValidDataTable } from '../utils/data';
import { color } from './common';
import { getFieldsByRoleType } from '../utils/field';
import { DataRole } from '../utils/enum';

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
  } else {
    //没有分配颜色字段，从剩下的字段里选择一个离散字段分配到颜色上
    const colorField = getFieldsByRoleType(fieldInfo, DataRole.DIMENSION);
    if (colorField) {
      spec.nameField = colorField.fieldName;
      spec.seriesField = colorField.fieldName;
      cellNew.category = colorField.fieldName;
    }
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
  wordCloudData,
  color,
  wordCloudField,
  wordCloudDisplayConf
  //animationOneByOne,
];
