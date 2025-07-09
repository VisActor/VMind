import { DataType } from '../utils/enum';
import { GenerateChartInput, SimpleChartAxisInfo } from '../types/transform';
import { BASIC_HEAT_MAP_COLOR_THEMES } from '../utils/constants';
import { color, data, formatSizeFields, labelForDefaultHide, parseAxesOfChart } from './common';
import { getAllFieldsByDataType, getRemainedFields } from '../utils/field';
import { array, isArray } from '@visactor/vutils';

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
      cellNew.x = remainedFields?.[0]?.fieldName;
      cellNew.y = remainedFields?.[1]?.fieldName;
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
  const { spec, axes } = context;

  spec.axes = parseAxesOfChart(context, [
    {
      defaultConfig: {
        orient: 'bottom',
        grid: { visible: false },
        domainLine: {
          visible: false
        }
      },
      userConfig: {
        type: 'band'
      },
      filters: [axis => axis.orient === 'bottom', axis => axis.orient === 'top']
    },
    {
      defaultConfig: {
        orient: 'left',
        grid: { visible: false },
        domainLine: {
          visible: false
        }
      },
      userConfig: {
        type: 'band'
      },
      filters: [axis => axis.orient === 'left', axis => axis.orient === 'right']
    }
  ]);

  return { spec };
};

export const basicHeatMapLegend = (context: GenerateChartInput) => {
  const { spec, legends } = context;

  if (legends !== false) {
    if (isArray(legends) && legends.length >= 2) {
      const colorLegend = legends.find(entry => entry.type === 'color');

      spec.legends = [
        {
          visible: true,
          orient: 'right',
          position: 'start',
          ...colorLegend,
          field: 'value'
        },
        ...legends.filter(item => item !== colorLegend)
      ];
    } else {
      spec.legends = {
        visible: true,
        orient: 'right',
        position: 'start',
        type: 'color',
        ...array(legends)[0],
        field: 'value'
      };
    }
  }

  return { spec };
};

export const pipelineBasicHeatMap = [
  formatFieldsOfBasicHeatMapChart,
  data,
  color,
  basicHeatMapSeries,
  basicHeatMapColor,
  basicHeatMapAxes,
  basicHeatMapLegend,
  labelForDefaultHide
];
