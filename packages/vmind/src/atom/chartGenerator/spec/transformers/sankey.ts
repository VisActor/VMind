import { isValidDataTable } from '../../../../utils/dataTable';
import type { GenerateChartCellContext } from '../../type';
import { color, discreteLegend, revisedVChartType, theme } from './common';

export const sankeyData = (context: GenerateChartCellContext) => {
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
        links: linkData
      }
    ]
  };

  return { spec };
};

export const sankeyField = (context: GenerateChartCellContext) => {
  const { cell, spec } = context;
  spec.sourceField = cell.source;
  spec.targetField = cell.target;
  spec.valueField = cell.value;
  spec.categoryField = 'name';
  spec.nodeKey = (datum: any) => datum.name;

  return { spec };
};

export const sankeyLink = (context: GenerateChartCellContext) => {
  const { spec } = context;

  spec.link = {
    style: {
      //fillOpacity: 0.1
    },
    state: {
      hover: {
        //fillOpacity: 0.4
      },
      blur: {
        //fill: '#e8e8e8'
      }
    }
  };
  return { spec };
};

export const sankeyLabel = (context: GenerateChartCellContext) => {
  const { spec } = context;

  spec.label = {
    visible: true,
    style: {
      //fontSize: 12
      //fill: '#000000'
    }
  };
  return { spec };
};

export const pipelineSankey = [sankeyData, color, sankeyField, sankeyLink, sankeyLabel, discreteLegend];
