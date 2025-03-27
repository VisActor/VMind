import type { GenerateChartCellContext } from '../../type';
import { arrayData, color, revisedVChartType, theme } from './common';

export const basemap = (context: GenerateChartCellContext) => {
  const { basemapOption, spec } = context;
  if (basemapOption.regionProjectType) {
    spec.region = [
      {
        roam: true,
        projection: { type: basemapOption.regionProjectType },
        coordinate: basemapOption.regionCoordinate
      }
    ];
  } else {
    spec.region = [
      {
        roam: true,
        coordinate: basemapOption.regionCoordinate
      }
    ];
  }

  spec.map = 'map';
  return { spec };
};

export const mapField = (context: GenerateChartCellContext) => {
  const { spec, cell } = context;

  spec.nameField = cell.color;
  spec.valueField = cell.size;
  spec.nameProperty = cell.color;
  return { spec };
};

export const mapDisplayConf = (context: GenerateChartCellContext) => {
  const { spec, cell } = context;
  spec.legends = [
    {
      visible: true,
      type: 'color',
      field: cell.size,
      orient: 'bottom',
      position: 'start'
    }
  ];
  spec.area = {
    style: {
      fill: {
        field: cell.size,
        scale: 'color',
        changeDomain: 'replace'
      }
    }
  };
  return { spec };
};

export const pipelineMapChart = [basemap, color, arrayData, mapField, mapDisplayConf];
