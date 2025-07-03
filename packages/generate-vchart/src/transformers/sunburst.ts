import { array } from '@visactor/vutils';
import { GenerateChartInput } from '../types/transform';
import {
  color,
  commonLegend,
  formatColorFields,
  formatHierarchyData,
  formatSizeFields,
  sunburstOrTreemapField
} from './common';

export const sunburstData = (context: GenerateChartInput) => {
  let { cell } = formatColorFields(context, ['color', 'label']);
  cell = formatSizeFields({ ...context, cell }, ['size', 'value']).cell;

  const { dataTable, spec } = context;
  spec.data = {
    id: 'data',
    values: formatHierarchyData(dataTable, array(cell.color), 0, array(cell.size)[0] as string)
  };
  return { spec, cell };
};

export const sunburstDisplayConf = (context: GenerateChartInput) => {
  const { spec, label } = context;
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

  if (label !== false) {
    spec.label = {
      ...array(label)[0],
      visible: true,
      style: {
        fillOpacity: (datum: { isLeaf: any }) => {
          return datum.isLeaf ? 0.4 : 0.8;
        }
      }
    };
  }
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

export const pipelineSunburst = [sunburstData, color, sunburstOrTreemapField, sunburstDisplayConf, commonLegend];
