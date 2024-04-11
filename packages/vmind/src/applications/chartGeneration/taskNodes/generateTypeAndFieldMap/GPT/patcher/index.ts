import { FOLD_NAME, FOLD_VALUE } from '@visactor/chart-advisor';
import { isArray, isNil } from 'lodash';
import {
  GenerateChartAndFieldMapContext,
  GenerateChartAndFieldMapOutput
} from 'src/applications/chartGeneration/types';
import { Transformer } from 'src/base/tools/transformer';
import {
  CARTESIAN_CHART_LIST,
  foldDatasetByYField,
  getFieldByDataType,
  getFieldByRole,
  getRemainedFields
} from 'src/common/utils/utils';
import { DataType, ROLE } from 'src/typings';

export const patchAxisField: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  GenerateChartAndFieldMapContext,
  GenerateChartAndFieldMapOutput
> = (
  input: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  context: GenerateChartAndFieldMapContext
) => {
  const { cell } = input;

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
    ...input,
    cell: cellNew
  };
};

export const patchColorField: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  GenerateChartAndFieldMapContext,
  GenerateChartAndFieldMapOutput
> = (
  input: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  context: GenerateChartAndFieldMapContext
) => {
  const { cell } = input;
  const cellNew = { ...cell, color: cell.color ?? cell.category };

  return {
    ...input,
    cell: cellNew
  };
};

export const patchLabelField: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  GenerateChartAndFieldMapContext,
  GenerateChartAndFieldMapOutput
> = (
  input: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  context: GenerateChartAndFieldMapContext
) => {
  const { cell } = input;

  const cellNew: any = { ...cell };
  //patch the "label" fields to color
  if (cellNew.label && (!cellNew.color || cellNew.color.length === 0)) {
    cellNew.color = cellNew.label;
  }

  return {
    ...input,
    cell: cellNew
  };
};

export const patchYField: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  GenerateChartAndFieldMapContext,
  GenerateChartAndFieldMapOutput
> = (
  input: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  context: GenerateChartAndFieldMapContext
) => {
  const { chartType, cell, dataset, fieldInfo } = input;
  let cellNew = { ...cell };
  const { x, y } = cellNew;
  let chartTypeNew = chartType;
  let datasetNew = dataset;

  // When there are multiple y-axis fields, the processing methods are:
  // 1. For box plot, the chart type is not corrected.
  // 2. For bar chart or line chart, the chart type is corrected to double axis chart.
  // 3. In other cases, the chart type is corrected to scatter plot.

  if (y && isArray(y) && y.length > 1) {
    if (chartTypeNew === 'BOX PLOT' || (chartTypeNew === 'DUAL AXIS CHART' && y.length === 2)) {
      return {
        ...input
      };
    }

    if (chartTypeNew === 'BAR CHART' || chartTypeNew === 'LINE CHART' || chartTypeNew === 'DUAL AXIS CHART') {
      //use fold to visualize more than 2 y fields
      datasetNew = foldDatasetByYField(datasetNew, y, fieldInfo);
      cellNew.y = FOLD_VALUE.toString();
      cellNew.color = FOLD_NAME.toString();
    } else {
      chartTypeNew = 'SCATTER PLOT';
      cellNew = {
        ...cell,
        x: y[0],
        y: y[1],
        color: typeof x === 'string' ? x : x[0]
      };
    }
  }

  return {
    ...input,
    chartType: chartTypeNew,
    cell: cellNew,
    dataset: datasetNew
  };
};

export const patchBoxPlot: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  GenerateChartAndFieldMapContext,
  GenerateChartAndFieldMapOutput
> = (
  input: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  context: GenerateChartAndFieldMapContext
) => {
  const { chartType, cell } = input;
  const cellNew = {
    ...cell
  };
  const { y } = cellNew;
  if (chartType === 'BOX PLOT') {
    if (typeof y === 'string' && y.split(',').length > 1) {
      cellNew.y = y.split(',').map(str => str.trim());
    } else if (isNil(y) || y.length === 0) {
      const {
        lower_whisker,
        lowerWhisker,
        min,
        lower,
        lowerBox,
        lower_box,
        q1,
        lower_quartile,
        lowerQuartile,
        midline,
        median,
        q3,
        upperBox,
        upper_box,
        upper_quartile,
        upperQuartile,
        upper_whisker,
        upperWhisker,
        max,
        upper
      } = cellNew as any;

      cellNew.y = [
        lower_whisker,
        lowerWhisker,
        min,
        lower,
        lowerBox,
        lower_box,
        q1,
        lower_quartile,
        lowerQuartile,
        midline,
        median,
        q3,
        upperBox,
        upper_box,
        upper_quartile,
        upperQuartile,
        upper_whisker,
        upperWhisker,
        max,
        upper
      ].filter(Boolean);
    }
  }

  return { ...input, cell: cellNew };
};

export const patchDualAxis: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  GenerateChartAndFieldMapContext,
  GenerateChartAndFieldMapOutput
> = (
  input: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  context: GenerateChartAndFieldMapContext
) => {
  const { chartType, cell } = input;
  const cellNew: any = { ...cell };
  //Dual-axis drawing yLeft and yRight

  if (chartType === 'DUAL AXIS CHART' && cellNew.yLeft && cellNew.yRight) {
    cellNew.y = [cellNew.yLeft, cellNew.yRight];
  }

  return { ...input, cell: cellNew };
};

export const patchPieChart: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  GenerateChartAndFieldMapContext,
  GenerateChartAndFieldMapOutput
> = (
  input: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  context: GenerateChartAndFieldMapContext
) => {
  const { chartType, cell, fieldInfo } = input;
  const cellNew = { ...cell };

  if (chartType === 'ROSE CHART') {
    cellNew.angle = cellNew.radius ?? cellNew.size ?? cellNew.angle;
  }

  //Pie chart must have color field and the angle field
  if (chartType === 'PIE CHART' || chartType === 'ROSE CHART') {
    if (!cellNew.color || !cellNew.angle) {
      const remainedFields = getRemainedFields(cellNew, fieldInfo);

      if (!cellNew.color) {
        //No color fields are assigned, select a discrete field from the remaining fields as color field
        const colorField = getFieldByRole(remainedFields, ROLE.DIMENSION);
        if (colorField) {
          cellNew.color = colorField.fieldName;
        } else {
          cellNew.color = remainedFields[0].fieldName;
        }
      }
      if (!cellNew.angle) {
        //no angle field are assigned, select a continuous field from the remaining field to assign to the angle
        const angleField = getFieldByDataType(remainedFields, [DataType.FLOAT, DataType.INT]);
        if (angleField) {
          cellNew.angle = angleField.fieldName;
        } else {
          cellNew.angle = remainedFields[0].fieldName;
        }
      }
    }
  }
  return { ...input, cell: cellNew };
};

export const patchWordCloud: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  GenerateChartAndFieldMapContext,
  GenerateChartAndFieldMapOutput
> = (
  input: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  context: GenerateChartAndFieldMapContext
) => {
  //Word cloud must have color fields and size fields
  const { chartType, cell, fieldInfo } = input;
  const cellNew = { ...cell };

  if (chartType === 'WORD CLOUD') {
    if (!cellNew.size || !cellNew.color || cellNew.color === cellNew.size) {
      const remainedFields = getRemainedFields(cellNew, fieldInfo);

      if (!cellNew.size || cellNew.size === cellNew.color) {
        const newSize = (cellNew as any).weight ?? (cellNew as any).fontSize;
        if (newSize) {
          cellNew.size = newSize;
        } else {
          const sizeField = getFieldByDataType(remainedFields, [DataType.INT, DataType.FLOAT]);
          if (sizeField) {
            cellNew.size = sizeField.fieldName;
          } else {
            cellNew.size = remainedFields[0].fieldName;
          }
        }
      }
      if (!cellNew.color) {
        const newColor = (cellNew as any).text ?? (cellNew as any).word ?? (cellNew as any).label ?? cellNew.x;
        if (newColor) {
          cellNew.color = newColor;
        } else {
          const colorField = getFieldByRole(remainedFields, ROLE.DIMENSION);
          if (colorField) {
            cellNew.color = colorField.fieldName;
          } else {
            cellNew.color = remainedFields[0].fieldName;
          }
        }
      }
    }
  }
  return { ...input, cell: cellNew };
};

export const patchDynamicBarChart: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  GenerateChartAndFieldMapContext,
  GenerateChartAndFieldMapOutput
> = (
  input: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  context: GenerateChartAndFieldMapContext
) => {
  const { chartType, cell, fieldInfo } = input;
  const cellNew = { ...cell };

  if (chartType === 'DYNAMIC BAR CHART') {
    if (!cell.time || cell.time === '' || cell.time.length === 0) {
      const remainedFields = getRemainedFields(cellNew, fieldInfo);

      //动态条形图没有time字段，选择一个离散字段作为time
      const timeField = getFieldByDataType(remainedFields, [DataType.DATE]);
      if (timeField) {
        cellNew.time = timeField.fieldName;
      } else {
        cellNew.time = remainedFields[0].fieldName;
      }
    }
  }

  return { ...input, cell: cellNew };
};

export const patchCartesianXField: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  GenerateChartAndFieldMapContext,
  GenerateChartAndFieldMapOutput
> = (
  input: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  context: GenerateChartAndFieldMapContext
) => {
  const { chartType, cell, fieldInfo } = input;
  const cellNew = { ...cell };

  //Cartesian chart must have X field
  if (CARTESIAN_CHART_LIST.map(chart => chart.toUpperCase()).includes(chartType)) {
    if (!cellNew.x) {
      const remainedFields = getRemainedFields(cellNew, fieldInfo);
      //没有分配x字段，从剩下的字段里选择一个离散字段分配到x上
      const xField = getFieldByRole(remainedFields, ROLE.DIMENSION);
      if (xField) {
        cellNew.x = xField.fieldName;
      } else {
        cellNew.x = remainedFields[0].fieldName;
      }
    }
  }
  return { ...input, cell: cellNew };
};
