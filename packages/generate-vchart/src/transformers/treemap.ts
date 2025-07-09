import { array } from '@visactor/vutils';
import {
  color,
  commonLegend,
  formatColorFields,
  formatHierarchyData,
  formatSizeFields,
  labelForDefaultShow,
  sunburstOrTreemapField
} from './common';
import { GenerateChartInput } from '../types/transform';

export const treemapData = (context: GenerateChartInput) => {
  let { cell } = formatColorFields(context, ['color', 'label']);
  cell = formatSizeFields({ ...context, cell }, ['size', 'value']).cell;

  const { dataTable, spec } = context;
  spec.data = {
    id: 'data',
    values: formatHierarchyData(dataTable, array(cell.color), 0, array(cell.size)[0])
  };
  return { spec, cell };
};

export const pipelineTreemap = [treemapData, color, sunburstOrTreemapField, labelForDefaultShow, commonLegend];
