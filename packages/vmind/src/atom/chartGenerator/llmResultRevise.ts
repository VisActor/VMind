import { FOLD_NAME, FOLD_VALUE } from '@visactor/chart-advisor';
import { isArray } from '@visactor/vutils';
import { getDataListByField } from '../../utils/field';
import { foldDataTableByYField } from '../../utils/dataTable';
import { replaceAll } from '../../utils/text';
import { ChartType } from '../../types';
import type { GenerateChartCellContext } from './type';
import { isValidData } from '../../utils/common';
import {
  DataRole,
  DataType,
  getFieldsByDataType,
  getFieldsByRoleType,
  getRemainedFields,
  isValidDataTable
} from '@visactor/generate-vchart';

export const getContextAfterRevised = (context: GenerateChartCellContext) => {
  const revisedFuncList = [
    patchChartType,
    patchAxisField,
    patchColorField,
    patchLabelField,
    patchYField,
    patchPieChart,
    patchDynamicBarChart
  ];
  let newContext = { ...context };
  revisedFuncList.forEach(func => {
    newContext = {
      ...newContext,
      ...func(newContext)
    };
  });
  return newContext;
};

export const patchChartType = (context: GenerateChartCellContext) => {
  const { chartType, chartTypeList } = context;
  const chartTypeNew: ChartType = replaceAll(replaceAll(chartType, '/', ''), '-', ' ') as ChartType;

  if (!chartTypeList.includes(chartTypeNew)) {
    console.error('Unsupported Chart Type. Please Change User Input');
    return {
      error: 'Unsupported Chart Type. Please Change User Input'
    };
  }

  return { chartType: chartTypeNew.toUpperCase() as ChartType };
};

export const patchAxisField = (context: GenerateChartCellContext) => {
  const { cell } = context;

  const cellNew: any = { ...cell };

  // patch the "axis" field to x
  if (cellNew.axis && (!cellNew.x || !cellNew.y)) {
    if (!cellNew.x) {
      cellNew.x = cellNew.axis;
    } else if (!cellNew.y) {
      cellNew.y = cellNew.axis;
    }
  }

  return {
    cell: cellNew
  };
};

export const patchColorField = (context: GenerateChartCellContext) => {
  const { cell } = context;
  const cellNew = { ...cell, color: cell.color ?? cell.category };

  return {
    cell: cellNew
  };
};

export const patchLabelField = (context: GenerateChartCellContext) => {
  const { cell } = context;

  const cellNew: any = { ...cell };
  //patch the "label" fields to color
  if (cellNew.label && (!cellNew.color || cellNew.color.length === 0)) {
    cellNew.color = cellNew.label;
  }

  return {
    cell: cellNew
  };
};

export const patchYField = (context: GenerateChartCellContext) => {
  const { chartType, cell, dataTable, fieldInfo } = context;
  let cellNew = { ...cell };
  const { x, y } = cellNew;
  let chartTypeNew = chartType;
  let datasetNew = dataTable;

  // When there are multiple y-axis fields, the processing methods are:
  // 1. For box plot, the chart type is not corrected.
  // 2. For bar chart or line chart, the chart type is corrected to double axis chart.
  // 3. In other cases, the chart type is corrected to scatter plot.

  if (y && isArray(y) && y.length > 1) {
    if (
      chartTypeNew === ChartType.BoxPlot.toUpperCase() ||
      (chartTypeNew === ChartType.DualAxisChart.toUpperCase() && y.length === 2) ||
      (chartTypeNew === ChartType.RangeColumnChart.toUpperCase() && y.length === 2)
    ) {
      return {
        ...context
      };
    }

    if (
      (chartTypeNew === ChartType.BarChart.toUpperCase() || chartTypeNew === ChartType.LineChart.toUpperCase()) &&
      y.length === 2
    ) {
      return {
        ...context,
        chartType: ChartType.DualAxisChart.toUpperCase()
      };
    }
    if (
      chartTypeNew === ChartType.BarChart.toUpperCase() ||
      chartTypeNew === ChartType.LineChart.toUpperCase() ||
      chartTypeNew === ChartType.DualAxisChart.toUpperCase() ||
      chartTypeNew === ChartType.RadarChart.toUpperCase()
    ) {
      //use fold to visualize more than 2 y fields
      // @todo @czx fieldInfo adjust sync
      if (isValidDataTable(datasetNew)) {
        datasetNew = foldDataTableByYField(datasetNew, y, fieldInfo);
        cellNew.y = FOLD_VALUE.toString();
        cellNew.color = FOLD_NAME.toString();
      }
    } else {
      chartTypeNew = <ChartType>ChartType.ScatterPlot.toUpperCase();
      cellNew = {
        ...cell,
        x: y[0],
        y: y[1],
        color: typeof x === 'string' ? x : x[0]
      };
    }
  }

  return {
    chartType: chartTypeNew,
    cell: cellNew,
    dataTable: datasetNew
  };
};

export const patchPieChart = (context: GenerateChartCellContext) => {
  const { chartType, cell, fieldInfo, dataTable } = context;
  const cellNew = { ...cell };

  if (chartType === ChartType.RoseChart.toUpperCase()) {
    cellNew.angle = cellNew.radius ?? cellNew.size ?? cellNew.angle;
  }

  //Pie chart must have color field and the angle field
  if (chartType === ChartType.PieChart.toUpperCase() || chartType === ChartType.RoseChart.toUpperCase()) {
    if (!cellNew.color || !cellNew.angle) {
      const remainedFields = getRemainedFields(cellNew, fieldInfo);

      if (!cellNew.color) {
        //No color fields are assigned, select a discrete field from the remaining fields as color field
        const colorField = getFieldsByRoleType(remainedFields, DataRole.DIMENSION);
        if (colorField) {
          cellNew.color = colorField.fieldName;
        } else if (remainedFields?.[0]) {
          cellNew.color = remainedFields[0]?.fieldName;
        }
      }
      if (!cellNew.angle) {
        //no angle field are assigned, select a continuous field from the remaining field to assign to the angle
        const angleField = getFieldsByDataType(remainedFields, [DataType.FLOAT, DataType.INT]);
        if (angleField) {
          cellNew.angle = angleField.fieldName;
        } else {
          cellNew.angle = remainedFields?.[0].fieldName;
        }
      }
    }
    const colorField = isArray(cellNew.color) ? cellNew.color[0] : cellNew.color;
    const angleField = isArray(cellNew.angle) ? cellNew.angle[0] : cellNew.angle;
    const validDataItem = dataTable.filter(dataItem => {
      return isValidData(dataItem[colorField]) && isValidData(dataItem[angleField]) && Number(dataItem[angleField]) > 0;
    });
    if (validDataItem.length < 2) {
      const colorFieldInfo = fieldInfo.find(info => info.fieldName === colorField);
      return {
        chartType:
          colorFieldInfo?.type === DataType.DATE ? ChartType.LineChart.toUpperCase() : ChartType.BarChart.toUpperCase(),
        cell: {
          x: colorField,
          y: angleField
        }
      };
    }
  }
  return {
    cell: cellNew
  };
};

export const patchDynamicBarChart = (context: GenerateChartCellContext) => {
  const { chartType, cell, fieldInfo, dataTable } = context;
  const cellNew = { ...cell };
  let chartTypeNew = chartType;

  if (chartType === ChartType.DynamicBarChart.toUpperCase()) {
    if (!cell.time || cell.time === '' || cell.time.length === 0) {
      const remainedFields = getRemainedFields(cellNew, fieldInfo);

      //Dynamic bar chart does not have a time field, choose a discrete field as time.
      const timeField = getFieldsByDataType(remainedFields, [DataType.DATE]);
      if (timeField) {
        cellNew.time = timeField.fieldName;
      } else {
        const stringField = getFieldsByDataType(remainedFields, [DataType.STRING]);
        if (stringField) {
          cellNew.time = stringField.fieldName;
        } else {
          //no available field, set chart type to bar chart
          chartTypeNew = <ChartType>ChartType.BarChart.toUpperCase();
        }
      }
    }
  }
  if (cellNew.time) {
    const timeData = getDataListByField(dataTable, cellNew.time);
    if ((timeData.length < 7 && !cellNew.color) || cellNew.x === cellNew.time) {
      // transfer dynamic bar chart to bar chart
      chartTypeNew =
        cellNew.x !== cellNew.time
          ? <ChartType>ChartType.BarChart.toUpperCase()
          : <ChartType>ChartType.LineChart.toUpperCase();
      cellNew.color = cellNew.x !== cellNew.time ? cellNew.x : undefined;
      cellNew.x = cellNew.time;
      cellNew.time = undefined;
    }
  }

  return {
    cell: cellNew,
    chartType: chartTypeNew
  };
};
