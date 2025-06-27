import { array } from '@visactor/vutils';
import { color, formatHierarchyData, sunburstOrTreemapField } from './common';
import { GenerateChartInput } from '../types/transform';

export const treemapData = (context: GenerateChartInput) => {
  const { dataTable, cell, spec } = context;
  spec.data = {
    id: 'data',
    values: formatHierarchyData(dataTable, array(cell.color), 0, array(cell.size)[0])
  };
  return { spec };
};

export const treemapDisplayConf = (context: GenerateChartInput) => {
  const { spec } = context;
  spec.label = {
    visible: true
  };
  return { spec };
};

export const pipelineTreemap = [treemapData, color, sunburstOrTreemapField, treemapDisplayConf];
