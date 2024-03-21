import { isArray } from 'lodash';
import { Cell, DataItem, DataType, SimpleFieldInfo } from '../../typings';
import { detectAxesType } from '../../common/vizDataToSpec/utils';
import { execPipeline } from '../../common/utils';

type PatchContext = {
  chartType: string;
  cell: Cell;
  dataset: DataItem[];
  fieldInfo: SimpleFieldInfo[];
};

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

const patchNullField = (context: PatchContext, _originalContext: PatchContext) => {
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

const patchRadarChart = (context: PatchContext, _originalContext: PatchContext) => {
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

const patchBoxPlot = (context: PatchContext, _originalContext: PatchContext) => {
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

const patchBarChart = (context: PatchContext, _originalContext: PatchContext) => {
  const { chartType, cell } = context;
  let chartTypeNew = chartType;
  let cellNew = { ...cell };
  if (chartTypeNew === 'BAR CHART') {
    if (isArray(cell.y) && cell.y.length === 2) {
      chartTypeNew = 'DUAL AXIS CHART';
    } else if ((cell.y ?? '').includes(',')) {
      const yNew = (cell.y as string).split(',');
      if (yNew.length === 2) {
        chartTypeNew = 'DUAL AXIS CHART';
        cellNew = {
          ...cell,
          y: yNew
        };
      }
    }
  }
  return {
    ...context,
    chartType: chartTypeNew,
    cell: cellNew
  };
};

const patchDynamicBarChart = (context: PatchContext, _originalContext: PatchContext) => {
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

const patchArrayField = (context: PatchContext, _originalContext: PatchContext) => {
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

const patchPipelines = [
  patchNullField,
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
