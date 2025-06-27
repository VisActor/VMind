import { GenerateChartInput } from '../types/transform';
import { isValidDataTable } from '../utils/data';
import { color, discreteLegend } from './common';

export const sankeyData = (context: GenerateChartInput) => {
  const { dataTable, cell, spec } = context;
  const { source, target } = cell;
  const linkData = isValidDataTable(dataTable) ? dataTable : [];
  const nodes = [
    ...new Set([
      ...linkData.map((item: any) => item[source as string]),
      ...linkData.map((item: any) => item[target as string])
    ])
  ];
  const nodeData = nodes.map(node => ({ name: node }));

  spec.data = {
    id: 'data',
    values: [
      {
        nodes: nodeData,
        links: linkData.map(item => {
          return {
            ...item,
            [source as string]: nodes.indexOf((item as any)[source as string]),
            [target as string]: nodes.indexOf((item as any)[target as string])
          };
        })
      }
    ]
  };

  return { spec };
};

export const sankeyField = (context: GenerateChartInput) => {
  const { cell, spec } = context;
  spec.sourceField = cell.source;
  spec.targetField = cell.target;
  spec.valueField = cell.value;
  spec.categoryField = 'name';

  return { spec };
};

export const sankeyLabel = (context: GenerateChartInput) => {
  const { spec } = context;

  spec.label = {
    visible: true
  };
  return { spec };
};

export const pipelineSankey = [sankeyData, color, sankeyField, sankeyLabel, discreteLegend];
