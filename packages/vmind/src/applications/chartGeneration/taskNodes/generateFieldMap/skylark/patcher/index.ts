import type { Transformer } from '../../../../../../base/tools/transformer';
import type { GenerateFieldMapContext, GenerateFieldMapOutput } from '../../types';
import { isArray, isString } from '@visactor/vutils';
import { matchFieldWithoutPunctuation } from './utils';
import type { CombinationBasicChartType, VMindDataset } from '../../../../../../common/typings';
import { ChartType } from '../../../../../../common/typings';
import { DataType, ROLE } from '../../../../../../common/typings';
import { calculateTokenUsage, foldDatasetByYField } from '../../../../../../common/utils/utils';
import { FOLD_NAME, FOLD_VALUE } from '@visactor/chart-advisor';
import { addChartSource, getCell, isCombinationChartType } from '../../../utils';
import { isValidDataset } from '../../../../../../common/dataProcess';
import { dataUtils } from '@visactor/chart-advisor';
import { COMBINATION_CHART_LIST } from '../../../../constants';
import type { Cell } from '../../../../types';
import {
  patchBasicHeatMapChart,
  patchCartesianXField,
  patchDynamicScatterPlotChart,
  patchLinearProgressChart,
  patchNeedColor,
  patchNeedSize,
  patchRangeColumnChart
} from '../../../generateTypeAndFieldMap/GPT/patcher';
import GenerateFieldMapTaskNodeMeta from '../index';

type PatchContext = GenerateFieldMapContext & GenerateFieldMapOutput;

const patchNullField: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
  const { fieldInfo, cells, chartType } = context;
  if (isCombinationChartType(chartType)) {
    return {};
  }
  const cellNew = { ...getCell(cells) };

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
    cells: [cellNew]
  };
};

const patchField: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
  const { fieldInfo, cells, chartType } = context;
  if (isCombinationChartType(chartType)) {
    return {};
  }
  const fieldNames = fieldInfo.map(field => field.fieldName);
  const cellNew = { ...getCell(cells) };
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
    cells: [cellNew]
  };
};

const patchColorField: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
  const { chartType, fieldInfo, cells } = context;
  if (isCombinationChartType(chartType)) {
    return {};
  }
  const cellNew = { ...getCell(cells) };
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
    cells: [cellNew],
    chartType: chartTypeNew
  };
};

const patchRadarChart: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
  const { chartType, cells } = context;
  if (isCombinationChartType(chartType)) {
    return {};
  }

  if (chartType === ChartType.RadarChart.toUpperCase()) {
    const cellNew = {
      x: getCell(cells).angle,
      y: getCell(cells).value,
      color: getCell(cells).color
    };

    return {
      cells: [cellNew]
    };
  }
  return context;
};

const patchBoxPlot: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
  const { chartType, cells } = context;
  if (isCombinationChartType(chartType)) {
    return {};
  }

  if (chartType === ChartType.BoxPlot.toUpperCase()) {
    const { x, min, q1, median, q3, max } = getCell(cells) as any;
    const cellNew = {
      x,
      y: [min, q1, median, q3, max].filter(Boolean)
    };
    return {
      cells: [cellNew]
    };
  }
  return context;
};

const patchDifferentMeasureLevel: Transformer<PatchContext, any> = (context: PatchContext) => {
  //if the difference in the level of two measures in cartesian chart is enormous, use Dual-axis chart
  const { chartType, cells, dataset } = context;
  if (isCombinationChartType(chartType)) {
    return {};
  }
  const chartTypeNew = chartType;
  const cellNew = { ...getCell(cells) };
  const datasetNew = dataset;
  if (chartTypeNew === ChartType.BarChart.toUpperCase()) {
    if (isValidDataset(datasetNew) && isArray(cellNew.y) && cellNew.y.length === 2) {
      //The maximum value within the indicators/the smallest value within the Q1 (lower quartile) of the indicators is greater than 100 (different index values are not on the same magnitude level), use a dual-axis chart.
      const measureSet = cellNew.y.map(y => {
        return datasetNew.map(data => parseFloat(data[y] as string)).filter(Boolean);
      });
      let minQ1 = Math.min(
        ...measureSet.map(measureValues => {
          const Q1 = dataUtils.calQuantile({ data: measureValues }, 0.25);
          return Math.abs(Q1);
        })
      );
      let maxMax = Math.max(...measureSet.map(measureValues => Math.max(...measureValues)));

      if (minQ1 === 0) {
        minQ1 = 1;
      }
      if (maxMax === 0) {
        maxMax = 1;
      }

      if (maxMax / minQ1 > 100) {
        return {
          chartType: ChartType.DualAxisChart.toUpperCase()
        };
      }
    }
  }
  return context;
};

const patchFoldField: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
  const { chartType, cells, fieldInfo, dataset } = context;
  if (isCombinationChartType(chartType)) {
    return {};
  }
  const chartTypeNew = chartType.toUpperCase();
  const cellNew = { ...getCell(cells) };
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
    cells: [cellNew],
    dataset: datasetNew
  };
};

const patchDualAxisChart: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
  const { chartType, cells } = context;
  if (isCombinationChartType(chartType)) {
    return {};
  }
  const cellNew: any = { ...getCell(cells) };
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

  return { cells: [cellNew] };
};

const patchDynamicBarChart: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
  const { chartType, cells, fieldInfo } = context;
  if (isCombinationChartType(chartType)) {
    return {};
  }
  const cellNew = {
    ...getCell(cells)
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
    cells: [cellNew],
    chartType: chartTypeNew
  };
};

const patchArrayField: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (context: PatchContext) => {
  const { cells, chartType } = context;
  if (isCombinationChartType(chartType)) {
    return {};
  }
  const cellNew = {
    ...getCell(cells)
  };
  //only x, y and color field can be array
  Object.keys(cellNew).forEach(key => {
    if (key !== 'x' && key !== 'y' && key !== 'color' && isArray(cellNew[key])) {
      cellNew[key] = cellNew[key][0];
    }
  });

  return {
    cells: [cellNew]
  };
};

const calculateUsage: Transformer<PatchContext, any> = (context: PatchContext) => {
  const { fieldMapTokenUsage, chartTypeTokenUsage } = context;
  const usage = calculateTokenUsage([fieldMapTokenUsage, chartTypeTokenUsage]);

  return {
    usage
  };
};

const patchSingleColumnCombinationChart: Transformer<PatchContext, Partial<GenerateFieldMapOutput>> = (
  context: PatchContext
) => {
  const { chartType, cells, subChartType } = context;
  if (
    COMBINATION_CHART_LIST.some(combinationChartType => {
      return chartType.toUpperCase() === combinationChartType.toUpperCase();
    })
  ) {
    const cellsNew: Cell[] = [...cells];
    const subChartTypeNew: CombinationBasicChartType[] = [...subChartType];
    const datasetNew: VMindDataset[] = [];

    const patchers = GenerateFieldMapTaskNodeMeta.patcher.filter(patch => {
      return patch.name !== 'patchSingleColumnCombinationChart';
    });
    const minLength = Math.min(cells.length, subChartType.length);
    for (let index = 0; index < minLength; index++) {
      const input = {
        ...context,
        chartType: subChartType[index].toString() as ChartType,
        cells: [getCell(cells, index)]
      };
      const result = patchers.reduce((pre, pipeline) => {
        const res = pipeline(pre);
        return { ...pre, ...res } as any;
      }, input);
      subChartTypeNew[index] = result.chartType.toString() as CombinationBasicChartType;
      cellsNew[index] = getCell(result.cells);
      datasetNew[index] = result.dataset;
    }

    return {
      subChartType: subChartTypeNew,
      cells: cellsNew,
      datasetsForCombinationChart: datasetNew
    };
  }
  return {};
};

export const patchPipelines: Transformer<PatchContext, Partial<GenerateFieldMapOutput>>[] = [
  addChartSource as any,
  calculateUsage,
  patchNullField,
  patchNeedColor,
  patchNeedSize,
  patchField,
  patchColorField,
  patchRadarChart,
  patchBoxPlot,
  patchDifferentMeasureLevel,
  patchFoldField,
  patchDualAxisChart,
  patchDynamicBarChart,
  patchArrayField,
  patchRangeColumnChart,
  patchLinearProgressChart,
  patchBasicHeatMapChart,
  patchCartesianXField,
  patchSingleColumnCombinationChart,
  patchDynamicScatterPlotChart
];
