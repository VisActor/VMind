import type { Transformer } from '../../../../../../base/tools/transformer';
import type { GenerateFieldMapContext, GenerateFieldMapOutput } from '../../types';
import { isArray, isString } from 'lodash';
import { matchFieldWithoutPunctuation } from './utils';
import { ChartType } from '../../../../../../common/typings';
import { DataType, ROLE } from '../../../../../../common/typings';
import { calculateTokenUsage, foldDatasetByYField } from '../../../../../../common/utils/utils';
import { FOLD_NAME, FOLD_VALUE } from '@visactor/chart-advisor';
import { addChartSource } from '../../../utils';
import { isValidDataset } from '../../../../../../common/dataProcess';

type PatchContext = GenerateFieldMapContext & GenerateFieldMapOutput;

const patchNullField: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
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
    cell: cellNew
  };
};

const patchField: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
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
    cell: cellNew
  };
};

const patchColorField: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
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
        if (chartTypeNew === ChartType.DualAxisChart.toUpperCase() && cellNew.y.length > 2) {
          chartTypeNew = ChartType.BarChart.toUpperCase() as ChartType;
        }
      }
    }
  }

  return {
    cell: cellNew
  };
};

const patchRadarChart: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
  const { chartType, cell } = context;

  if (chartType === ChartType.RadarChart.toUpperCase()) {
    const cellNew = {
      x: cell.angle,
      y: cell.value,
      color: cell.color
    };

    return {
      cell: cellNew
    };
  }
  return context;
};

const patchBoxPlot: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
  const { chartType, cell } = context;

  if (chartType === ChartType.BoxPlot.toUpperCase()) {
    const { x, min, q1, median, q3, max } = cell as any;
    const cellNew = {
      x,
      y: [min, q1, median, q3, max].filter(Boolean)
    };
    return {
      cell: cellNew
    };
  }
  return context;
};

const patchFoldField: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
  const { chartType, cell, fieldInfo, dataset } = context;
  const chartTypeNew = chartType;
  const cellNew = { ...cell };
  let datasetNew = dataset;
  if (
    chartTypeNew === ChartType.BarChart.toUpperCase() ||
    chartTypeNew === ChartType.LineChart.toUpperCase() ||
    chartTypeNew === ChartType.RadarChart.toUpperCase()
  ) {
    if (isValidDataset(datasetNew) && isArray(cellNew.y) && cellNew.y.length > 1) {
      datasetNew = foldDatasetByYField(datasetNew, cellNew.y, fieldInfo);
      cellNew.y = FOLD_VALUE.toString();
      cellNew.color = FOLD_NAME.toString();
    }
  }
  return {
    chartType: chartTypeNew,
    cell: cellNew,
    dataset: datasetNew
  };
};

const patchDualAxisChart: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
  const { chartType, cell } = context;
  const cellNew: any = { ...cell };
  //Dual-axis drawing yLeft and yRight

  if (chartType === ChartType.DualAxisChart.toUpperCase()) {
    cellNew.y = [
      ...(isArray(cellNew.y) ? cellNew.y : []),
      cellNew.leftAxis,
      cellNew.rightAxis,
      cellNew.leftaxis,
      cellNew.rightaxis
    ].filter(Boolean);
  }

  return { cell: cellNew };
};

const patchDynamicBarChart: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
  const { chartType, cell, fieldInfo } = context;
  const cellNew = {
    ...cell
  };
  let chartTypeNew = chartType;

  if (chartType === ChartType.DynamicBarChart.toUpperCase()) {
    if (!cellNew.time || cellNew.time === '' || cellNew.time.length === 0) {
      const flattenedXField = Array.isArray(cellNew.x) ? cellNew.x : [cellNew.x];
      const usedFields = Object.values(cellNew).filter(f => !Array.isArray(f));
      usedFields.push(...flattenedXField);
      const remainedFields = fieldInfo.filter(f => !usedFields.includes(f.fieldName));

      //Dynamic bar chart does not have a time field, choose a discrete field as time.
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
        } else {
          //no available field, set chart type to bar chart
          chartTypeNew = ChartType.BarChart.toUpperCase() as ChartType;
        }
      }
    }
  }
  return {
    cell: cellNew,
    chartType: chartTypeNew
  };
};

const patchArrayField: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
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
    cell: cellNew
  };
};

const calculateUsage: Transformer<PatchContext, any> = (context: PatchContext) => {
  const { fieldMapTokenUsage, chartTypeTokenUsage } = context;
  const usage = calculateTokenUsage([fieldMapTokenUsage, chartTypeTokenUsage]);

  return {
    usage
  };
};

export const patchPipelines: Transformer<PatchContext, Partial<GenerateFieldMapOutput>>[] = [
  addChartSource as any,
  calculateUsage,
  patchNullField,
  patchField,
  patchColorField,
  patchRadarChart,
  patchBoxPlot,
  patchFoldField,
  patchDualAxisChart,
  patchDynamicBarChart,
  patchArrayField
];
