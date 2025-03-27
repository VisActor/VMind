import { isArray } from '@visactor/vutils';
import type { DataTable } from '../../../../types/base';
import type { GenerateChartCellContext } from '../../type';
import { color, revisedVChartType, sunburstOrTreemapField, theme } from './common';

export const treemapData = (context: GenerateChartCellContext) => {
  const { dataTable, cell, spec } = context;
  spec.data = {
    id: 'data',
    values: getTreemapData(dataTable, isArray(cell.color) ? cell.color : [cell.color], 0, cell.size)
  };
  return { spec };
};

export const getTreemapData: any = (
  dataTable: DataTable,
  colorField: string[] | string,
  index: number,
  sizeField: string
) => {
  if (colorField.length - 1 === index) {
    return Array.from(
      new Set(
        dataTable.map(data => {
          return { name: data[colorField[index]], value: data[sizeField] };
        })
      )
    );
  }
  // Get the value range of this layer
  const values = Array.from(
    new Set(
      dataTable.map(data => {
        return data[colorField[index]];
      })
    )
  );
  return values.map(value => {
    const currentDataset = dataTable.filter(data => {
      return data[colorField[index]] === value;
    });
    if (currentDataset[0] && currentDataset[0][colorField[index + 1]] === '') {
      return { name: value, value: currentDataset[0][sizeField] };
    }
    return { name: value, children: getTreemapData(currentDataset, colorField, index + 1, sizeField) };
  });
};

export const treemapDisplayConf = (context: GenerateChartCellContext) => {
  const { spec } = context;
  spec.label = {
    visible: true,
    style: {
      fontSize: 12
    }
  };
  return { spec };
};

export const pipelineTreemap = [treemapData, color, sunburstOrTreemapField, treemapDisplayConf];
