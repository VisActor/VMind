import { isArray, uniqArray } from '@visactor/vutils';
import type { GenerateChartCellContext } from '../../type';
import type { DataCell } from '../../../../types/base';
import { ROLE } from '../../../../types/base';

export const seriesField = (context: GenerateChartCellContext) => {
  const { spec, fieldInfo, dataTable, cell } = context;
  const cellNew: any = { ...cell };
  const { seriesField, xField: propsXField } = spec;
  const colorField = isArray(seriesField) ? seriesField[0] : seriesField;
  const colorFieldInfo = fieldInfo.find(v => v.fieldName === colorField);
  const xField = isArray(propsXField) ? propsXField : [propsXField];
  if (colorField && colorFieldInfo?.role === ROLE.DIMENSION && xField) {
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
      if (xField.includes(colorField) && xField.length > 1) {
        // 对于分组柱图的情况，因为没有有效的分组，这种设置没有意义，所以删掉分组字段
        spec.seriesField = undefined;
        cellNew.color = undefined;
        spec.xField = xField.filter((field: string) => field !== colorField);
      }
    }
  }
  return { spec, cell: cellNew };
};

export const axis = (context: GenerateChartCellContext) => {
  const { spec, cell, fieldInfo } = context;
  // if (spec.axes) {
  //   // 如果已经有轴配置，直接返回
  //   return { spec };
  // }

  const { y: celly } = cell;
  const yFields = isArray(celly) ? celly : [celly];
  const yFieldsInfo = yFields.map(field => fieldInfo.find(v => v.fieldName === field));
  const isAllRatio = yFieldsInfo.every(v => !!v?.ratioGranularity);
  const isSameUnit = uniqArray(yFieldsInfo.map(v => v?.unit).filter(v => !!v)).length === 1;

  spec.axes = [
    {
      orient: 'bottom',
      type: 'band',
      label: {
        style: {
          //fill: '#FFFFFF'
        }
      },
      title: {
        visible: false,
        style: {
          //fill: '#FFFFFF'
        }
      }
    },
    {
      orient: 'left',
      type: 'linear',
      label: {
        style: {
          //fill: '#FFFFFF'
        },
        formatter: isAllRatio ? `{label:~%}` : undefined
      },
      unit:
        isSameUnit && !['%', '‰'].includes(yFieldsInfo[0]?.unit)
          ? {
              visible: true,
              text: yFieldsInfo[0]?.unit
            }
          : undefined,
      title: {
        visible: false,
        style: {
          //fill: '#FFFFFF'
        }
      }
    }
  ];
  return { spec };
};
