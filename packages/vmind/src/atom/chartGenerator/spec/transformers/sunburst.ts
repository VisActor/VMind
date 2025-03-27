import type { DataTable } from '../../../../types/base';
import type { GenerateChartCellContext } from '../../type';
import { color, revisedVChartType, sunburstOrTreemapField, theme } from './common';

export const sunburstData = (context: GenerateChartCellContext) => {
  const { dataTable, cell, spec } = context;
  spec.data = { id: 'data', values: getSunburstData(dataTable, cell.color, 0, cell.size) };
  return { spec };
};

export const getSunburstData: any = (
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
    return { name: value, children: getSunburstData(currentDataset, colorField, index + 1, sizeField) };
  });
};

export const sunburstDisplayConf = (context: GenerateChartCellContext) => {
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
      fontSize: 12,
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
  spec.animationEnter = {
    easing: 'cubicInOut',
    duration: 1000
  };
  spec.animationExit = {
    easing: 'cubicInOut',
    duration: 1000
  };
  spec.animationUpdate = {
    easing: 'cubicInOut',
    duration: 1000
  };
  return { spec };
};

export const pipelineSunburst = [sunburstData, color, sunburstOrTreemapField, sunburstDisplayConf];
