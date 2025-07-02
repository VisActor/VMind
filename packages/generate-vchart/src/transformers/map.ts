import { isArray } from '@visactor/vutils';
import { BasemapOption, GenerateChartInput } from '../types/transform';
import { arrayData, color, formatColorFields, formatSizeFields } from './common';

export const DEFAULT_MAP_OPTION: BasemapOption = {
  regionProjectType: null,
  regionCoordinate: 'geo',
  zoom: 1,
  center: null
};

export const basemap = (context: GenerateChartInput) => {
  const { basemapOption = DEFAULT_MAP_OPTION, spec } = context;
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

  spec.map = basemapOption.mapName ?? 'map';
  return { spec };
};

export const mapField = (context: GenerateChartInput) => {
  let { cell } = formatColorFields(context, ['color', 'label']);
  cell = formatSizeFields({ ...context, cell }, ['size', 'value', 'y']).cell;
  const { spec } = context;

  spec.nameField = cell.color;
  spec.valueField = cell.size;
  spec.nameProperty = cell.color;
  return { spec, cell };
};

export const mapDisplayConf = (context: GenerateChartInput) => {
  const { spec, cell } = context;
  if (isArray(spec.color)) {
    spec.color = {
      type: 'linear',
      range: spec.color
    };
  }

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
