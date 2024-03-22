import { isArray, isString } from 'lodash';
import { Cell, DataItem, DataType, PatchContext, PatchPipeline, ROLE, SimpleFieldInfo } from '../../typings';
import { execPipeline } from '../../common/utils';
import { foldDatasetByYField } from '../../common/vizDataToSpec/utils';
import { FOLD_NAME, FOLD_VALUE } from '@visactor/chart-advisor';

const matchFieldWithoutPunctuation = (field: string, fieldList: string[]): string | undefined => {
  //try to match the field without punctuation
  //return undefined if no field is match
  if (!field) {
    return field;
  }
  const punctuationRegex = /[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g;
  const pureFieldStr = field.replace(punctuationRegex, '');
  let matchedField = undefined;
  fieldList.some((f: string) => {
    const pureStr = f.replace(punctuationRegex, '');
    if (pureStr === pureFieldStr) {
      matchedField = f;
      return true;
    }
    return false;
  });
  return matchedField;
};

const patchNullField: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
  const { fieldInfo, cell } = context;
  const cellNew = { ...cell };

  const columns = fieldInfo.map(field => field.fieldName);

  //set null field to undefined
  Object.keys(cellNew).forEach(key => {
    const value = cellNew[key];
    if (isArray(value)) {
      cellNew[key] = value
        .map(v => (columns.includes(v) ? v : matchFieldWithoutPunctuation(v, columns)))
        .filter(Boolean);
    } else if (!columns.includes(value) || value === '') {
      cellNew[key] = matchFieldWithoutPunctuation(cellNew[key], columns);
    }
  });

  return {
    ...context,
    cell: cellNew
  };
};

const patchField: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
  const { fieldInfo, cell } = context;
  const fieldNames = fieldInfo.map(field => field.fieldName);
  const cellNew = { ...cell };
  Object.keys(cellNew).forEach(key => {
    const value = cellNew[key];
    if (isString(value) && (value ?? '').includes(',')) {
      const newValue = (value as string).split(',').map(f => f.trim());
      if (newValue.every(f => fieldNames.includes(f))) {
        cellNew[key] = newValue;
      }
    }
  });
  return {
    ...context,
    cell: cellNew
  };
};

const patchColorField: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
  const { chartType, fieldInfo, cell } = context;
  const cellNew = { ...cell };
  const { color } = cellNew;
  let chartTypeNew = chartType;
  if (color) {
    const colorField = fieldInfo.find(f => f.fieldName === color);
    if (colorField && colorField.role === ROLE.MEASURE) {
      cellNew.color = undefined;
      if (['BAR CHART', 'LINE CHART', 'DUAL AXIS CHART'].includes(chartTypeNew)) {
        cellNew.y = [cellNew.y, color].flat();
        if (chartTypeNew === 'DUAL AXIS CHART' && cellNew.y.length > 2) {
          chartTypeNew = 'BAR CHART';
        }
      }
    }
  }

  return {
    ...context,
    cell: cellNew
  };
};

const patchRadarChart: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
  const { chartType, cell } = context;

  if (chartType === 'RADAR CHART') {
    const cellNew = {
      x: cell.angle,
      y: cell.value,
      color: cell.color
    };

    return {
      ...context,
      cell: cellNew
    };
  }
  return context;
};

const patchBoxPlot: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
  const { chartType, cell } = context;

  if (chartType === 'BOX PLOT') {
    const { x, min, q1, median, q3, max } = cell as any;
    const cellNew = {
      x,
      y: [min, q1, median, q3, max].filter(Boolean)
    };
    return {
      ...context,
      cell: cellNew
    };
  }
  return context;
};

const patchBarChart: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
  const { chartType, cell, fieldInfo, dataset } = context;
  const chartTypeNew = chartType;
  const cellNew = { ...cell };
  let datasetNew = dataset;
  if (chartTypeNew === 'BAR CHART' || chartTypeNew === 'LINE CHART') {
    if (isArray(cellNew.y) && cellNew.y.length > 1) {
      datasetNew = foldDatasetByYField(datasetNew, cellNew.y, fieldInfo);
      cellNew.y = FOLD_VALUE.toString();
      cellNew.color = FOLD_NAME.toString();
    }
  }
  return {
    ...context,
    chartType: chartTypeNew,
    cell: cellNew,
    dataset: datasetNew
  };
};

const patchDynamicBarChart: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
  const { chartType, cell, fieldInfo } = context;
  const cellNew = {
    ...cell
  };

  if (chartType === 'DYNAMIC BAR CHART') {
    if (!cellNew.time || cellNew.time === '' || cellNew.time.length === 0) {
      const flattenedXField = Array.isArray(cellNew.x) ? cellNew.x : [cellNew.x];
      const usedFields = Object.values(cellNew).filter(f => !Array.isArray(f));
      usedFields.push(...flattenedXField);
      const remainedFields = fieldInfo.filter(f => !usedFields.includes(f.fieldName));

      //动态条形图没有time字段，选择一个离散字段作为time
      const timeField = remainedFields.find(f => {
        return f.type === DataType.DATE;
      });
      if (timeField) {
        cellNew.time = timeField.fieldName;
      } else {
        const stringField = remainedFields.find(f => {
          return f.type === DataType.STRING;
        });
        if (stringField) {
          cellNew.time = stringField.fieldName;
        }
      }
    }
  }
  return {
    ...context,
    cell: cellNew
  };
};

const patchArrayField: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
  const { cell } = context;
  const cellNew = {
    ...cell
  };
  //only x and y field can be array
  Object.keys(cellNew).forEach(key => {
    if (key !== 'x' && key !== 'y' && isArray(cellNew[key])) {
      cellNew[key] = cellNew[key][0];
    }
  });

  return {
    ...context,
    cell: cellNew
  };
};

const patchPipelines: PatchPipeline[] = [
  patchNullField,
  patchField,
  patchColorField,
  patchRadarChart,
  patchBoxPlot,
  patchBarChart,
  patchDynamicBarChart,
  patchArrayField
];

export const patchChartTypeAndCell = (
  chartTypeRes: string,
  cellRes: Cell,
  dataset: DataItem[],
  fieldInfo: SimpleFieldInfo[]
) => {
  const context = {
    chartType: chartTypeRes,
    cell: cellRes,
    dataset,
    fieldInfo
  };
  const {
    chartType: chartTypeNew,
    cell: cellNew,
    dataset: datasetNew,
    fieldInfo: fieldInfoNew
  } = execPipeline<PatchContext>(context, patchPipelines, context);
  return {
    chartTypeNew,
    cellNew,
    datasetNew,
    fieldInfoNew
  };
};
