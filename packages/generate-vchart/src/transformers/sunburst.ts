import { array } from '@visactor/vutils';
import { DataTable, GenerateChartInput } from '../types/transform';
import { color, formatHierarchyData, sunburstOrTreemapField } from './common';

export const sunburstData = (context: GenerateChartInput) => {
  const { dataTable, cell, spec } = context;
  spec.data = {
    id: 'data',
    values: formatHierarchyData(dataTable, array(cell.color), 0, array(cell.size)[0] as string)
  };
  return { spec };
};

export const sunburstDisplayConf = (context: GenerateChartInput) => {
  const { spec } = context;
  spec.offsetX = 0;
  spec.offsetY = 0;
  spec.outerRadius = 1;
  spec.innerRadius = 0;
  spec.gap = 5;
  spec.drill = true;
  spec.sunburst = {
    visible: true,
    style: {
      fillOpacity: (datum: { isLeaf: any }) => {
        return datum.isLeaf ? 0.4 : 0.8;
      }
    }
  };
  spec.label = {
    visible: true,
    style: {
      fillOpacity: (datum: { isLeaf: any }) => {
        return datum.isLeaf ? 0.4 : 0.8;
      }
    }
  };
  spec.tooltip = {
    mark: {
      title: {
        value: (val: { datum: any[] }) => {
          return val?.datum?.map(data => data.name).join(' / ');
        }
      }
    }
  };

  return { spec };
};

export const pipelineSunburst = [sunburstData, color, sunburstOrTreemapField, sunburstDisplayConf];
