import { array, isArray, isBoolean, uniqArray } from '@visactor/vutils';
import { DataCell, GenerateChartInput, SimpleChartAxisInfo } from '../types/transform';
import { DataRole } from '../utils/enum';
import { parseAxesOfChart } from './common';

export const seriesField = (context: GenerateChartInput) => {
  const { spec, fieldInfo, dataTable, cell } = context;
  const cellNew: any = { ...cell };
  const { seriesField, xField: propsXField } = spec;
  const colorField = isArray(seriesField) ? seriesField[0] : seriesField;
  const colorFieldInfo = fieldInfo.find(v => v.fieldName === colorField);
  const xField = isArray(propsXField) ? propsXField : [propsXField];

  // 对于分组柱图的情况，因为没有有效的分组，这种设置没有意义，所以删掉分组字段
  if (
    colorField &&
    colorFieldInfo?.role === DataRole.DIMENSION &&
    xField &&
    xField.includes(colorField) &&
    xField.length > 1
  ) {
    const xMap = new Map<DataCell, DataCell[]>();
    dataTable.forEach(row => {
      const xValue = row[xField[0]];
      if (xMap.has(xValue)) {
        xMap.get(xValue).push(row[colorField]);
      } else {
        xMap.set(xValue, [row[colorField]]);
      }
    });
    const xValues = Array.from(xMap.keys());
    let isValidColor = false;

    for (let i = 0; i < xValues.length; i++) {
      const xValue = xValues[i];
      const colorValues = uniqArray(xMap.get(xValue));
      if (isArray(colorValues) && colorValues.length > 1) {
        isValidColor = true;
        break;
      }
    }
    if (!isValidColor) {
      delete spec.seriesField;
      delete cellNew.color;
      spec.xField = xField.filter((field: string) => field !== colorField);
    }
  }
  return { spec, cell: cellNew };
};

export const axis = (context: GenerateChartInput) => {
  const { spec, cell, fieldInfo, axes, transpose } = context;
  // 现在只有柱图和rangeColumn 支持了转置
  const validTranspose = transpose && (spec.type === 'bar' || spec.type === 'rangeColumn');
  const bandAxisOrient = validTranspose ? 'left' : 'bottom';
  const linearAxisOrient = validTranspose ? 'bottom' : 'left';

  const { y: celly } = cell;
  const yFields = isArray(celly) ? celly : [celly];
  const yFieldsInfo = yFields.map(field => fieldInfo.find(v => v.fieldName === field));
  const isAllRatio = yFieldsInfo.every(v => !!v?.ratioGranularity);
  const isSameUnit = uniqArray(yFieldsInfo.map(v => v?.unit).filter(v => !!v)).length === 1;

  spec.axes = parseAxesOfChart(context, [
    {
      defaultConfig: {
        orient: bandAxisOrient,
        type: 'band',
        title: {
          visible: false
        }
      },
      filters: [axis => axis.type === 'band']
    },
    {
      defaultConfig: {
        orient: linearAxisOrient,
        type: 'linear',
        title: {
          visible: false
        }
      },
      userConfig: {
        ...(isAllRatio
          ? {
              label: { formatter: `{label:~%}` }
            }
          : {}),
        ...(isSameUnit && !['%', '‰'].includes(yFieldsInfo[0]?.unit)
          ? {
              unit: {
                visible: true,
                text: yFieldsInfo[0]?.unit
              }
            }
          : {})
      },
      filters: [axis => axis.type === 'linear']
    }
  ]);

  return { spec };
};
