import { DataType } from '../utils/enum';
import { GenerateChartInput } from '../types/transform';
import { BASIC_HEAT_MAP_COLOR_THEMES } from '../utils/constants';
import { color, data, formatSizeFields } from './common';
import { getAllFieldsByDataType, getRemainedFields } from '../utils/field';

export const formatFieldsOfBasicHeatMapChart = (context: GenerateChartInput) => {
  const { cell, fieldInfo } = context;
  let cellNew: any = { ...cell };
  const colorField = [cellNew.x, cellNew.y, cellNew.label, cellNew.color].filter(Boolean).flat();
  if (colorField.length >= 2) {
    cellNew.x = colorField[0];
    cellNew.y = colorField[1];
  } else {
    const remainedFields = getRemainedFields(cellNew, fieldInfo);
    const colorField = getAllFieldsByDataType(remainedFields, [DataType.STRING]);
    if (colorField.length >= 2) {
      cellNew.x = colorField[0];
      cellNew.y = colorField[1];
    } else {
      cellNew.x = remainedFields?.[0].fieldName;
      cellNew.y = remainedFields[1].fieldName;
    }
  }

  cellNew = formatSizeFields(context, ['size', 'value']).cell;

  return {
    cell: cellNew
  };
};

export const basicHeatMapSeries = (context: GenerateChartInput) => {
  const { spec, cell } = context;
  spec.series = [
    {
      type: 'heatmap',
      xField: cell.x,
      yField: cell.y,
      valueField: cell.size,
      cell: {
        style: {
          fill: {
            field: cell.size,
            scale: 'color'
          }
        }
      }
    }
  ];
  return { spec };
};
export const basicHeatMapColor = (context: GenerateChartInput) => {
  const { spec, cell, colors } = context;
  spec.color = {
    type: 'linear',
    domain: [
      {
        dataId: 'data',
        fields: [cell.size]
      }
    ],
    range: colors ?? BASIC_HEAT_MAP_COLOR_THEMES
  };
  return { spec };
};
export const basicHeatMapAxes = (context: GenerateChartInput) => {
  const { spec } = context;
  spec.axes = [
    {
      orient: 'bottom',
      type: 'band',
      grid: {
        visible: false
      },
      domainLine: {
        visible: false
      }
    },
    {
      orient: 'left',
      type: 'band',
      grid: {
        visible: false
      },
      domainLine: {
        visible: false
      }
    }
  ];
  return { spec };
};

export const basicHeatMapLegend = (context: GenerateChartInput) => {
  const { spec } = context;
  spec.legends = {
    visible: true,
    orient: 'right',
    position: 'start',
    type: 'color',
    field: 'value'
  };
  return { spec };
};

export const pipelineBasicHeatMap = [
  formatFieldsOfBasicHeatMapChart,
  data,
  color,
  basicHeatMapSeries,
  basicHeatMapColor,
  basicHeatMapAxes,
  basicHeatMapLegend
];
