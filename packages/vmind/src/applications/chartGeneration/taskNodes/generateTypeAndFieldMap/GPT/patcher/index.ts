import { FOLD_NAME, FOLD_VALUE } from '@visactor/chart-advisor';
import { isArray, isNil } from '@visactor/vutils';
import ChartGenerationTaskNodeGPTMeta from '../index';
import type { Cell } from '../../../../types';

import type { Transformer } from '../../../../../../base/tools/transformer';
import {
  foldDatasetByYField,
  getFieldByDataType,
  getFieldByRole,
  getFieldsByDataType,
  getRemainedFields
} from '../../../../../../common/utils/utils';
import type { CombinationBasicChartType, VMindDataset } from '../../../../../../common/typings';
import { ChartType, DataType, ROLE } from '../../../../../../common/typings';
import type { GenerateChartAndFieldMapContext, GenerateChartAndFieldMapOutput } from '../../types';
import { isValidDataset } from '../../../../../../common/dataProcess';
import {
  NEED_COLOR_FIELD_CHART_LIST,
  NEED_SIZE_FIELD_CHART_LIST,
  CARTESIAN_CHART_LIST,
  NEED_COLOR_AND_SIZE_CHART_LIST,
  COMBINATION_CHART_LIST
} from '../../../../constants';

export const patchAxisField: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
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
    //...context,
    cell: cellNew
  };
};

export const patchColorField: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  const { cell } = context;
  const cellNew = { ...cell, color: cell.color ?? cell.category };

  return {
    //...context,
    cell: cellNew
  };
};

export const patchLabelField: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  const { cell } = context;

  const cellNew: any = { ...cell };
  //patch the "label" fields to color
  if (cellNew.label && (!cellNew.color || cellNew.color.length === 0)) {
    cellNew.color = cellNew.label;
  }

  return {
    //...context,
    cell: cellNew
  };
};

export const patchYField: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  const { chartType, cell, dataset, fieldInfo } = context;
  let cellNew = { ...cell };
  const { x, y } = cellNew;
  let chartTypeNew = chartType;
  let datasetNew = dataset;

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
      chartTypeNew === ChartType.BarChart.toUpperCase() ||
      chartTypeNew === ChartType.LineChart.toUpperCase() ||
      chartTypeNew === ChartType.DualAxisChart.toUpperCase() ||
      chartTypeNew === ChartType.RadarChart.toUpperCase()
    ) {
      //use fold to visualize more than 2 y fields
      if (isValidDataset(datasetNew)) {
        datasetNew = foldDatasetByYField(datasetNew, y, fieldInfo);
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
    //...context,
    chartType: chartTypeNew,
    cell: cellNew,
    dataset: datasetNew
  };
};

export const patchBoxPlot: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  const { chartType, cell } = context;
  const cellNew = {
    ...cell
  };
  const { y } = cellNew;
  if (chartType === ChartType.BoxPlot.toUpperCase()) {
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

  return {
    //...context,
    cell: cellNew
  };
};

export const patchDualAxis: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  const { chartType, cell } = context;
  const cellNew: any = { ...cell };
  //Dual-axis drawing yLeft and yRight

  if (chartType === ChartType.DualAxisChart.toUpperCase()) {
    cellNew.y = [cellNew.y, cellNew.yLeft, cellNew.yRight, cellNew.y1, cellNew.y2].filter(Boolean).flat();
  }

  return {
    //...context,
    cell: cellNew
  };
};

export const patchPieChart: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  const { chartType, cell, fieldInfo } = context;
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
  return {
    //...context,
    cell: cellNew
  };
};

export const patchWordCloud: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  //Word cloud must have color fields and size fields
  const { chartType, cell, fieldInfo } = context;
  const cellNew = { ...cell };

  if (chartType === ChartType.WordCloud.toUpperCase()) {
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
  return {
    //...context,
    cell: cellNew
  };
};

export const patchDynamicBarChart: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  const { chartType, cell, fieldInfo } = context;
  const cellNew = { ...cell };
  let chartTypeNew = chartType;

  if (chartType === ChartType.DynamicBarChart.toUpperCase()) {
    if (!cell.time || cell.time === '' || cell.time.length === 0) {
      const remainedFields = getRemainedFields(cellNew, fieldInfo);

      //Dynamic bar chart does not have a time field, choose a discrete field as time.
      const timeField = getFieldByDataType(remainedFields, [DataType.DATE]);
      if (timeField) {
        cellNew.time = timeField.fieldName;
      } else {
        const stringField = getFieldByDataType(remainedFields, [DataType.STRING]);
        if (stringField) {
          cellNew.time = stringField.fieldName;
        } else {
          //no available field, set chart type to bar chart
          chartTypeNew = <ChartType>ChartType.BarChart.toUpperCase();
        }
      }
    }
  }

  return {
    //...context,
    cell: cellNew,
    chartType: chartTypeNew
  };
};

export const patchCartesianXField: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  const { chartType, cell, fieldInfo } = context;
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
  return {
    //...context,
    cell: cellNew
  };
};

export const patchNeedColor: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  const { chartType, cell, fieldInfo } = context;
  const cellNew: any = { ...cell };
  if (
    NEED_COLOR_FIELD_CHART_LIST.some(needColorFieldChartType => needColorFieldChartType.toUpperCase() === chartType) ||
    NEED_COLOR_AND_SIZE_CHART_LIST.some(needColorFieldChartType => needColorFieldChartType.toUpperCase() === chartType)
  ) {
    let colorField;
    if (CARTESIAN_CHART_LIST.every(cartesianChartType => cartesianChartType.toUpperCase() !== chartType)) {
      colorField = [cellNew.color, cellNew.x, cellNew.label, (cellNew as any).sets].filter(Boolean);
    } else {
      colorField = [cellNew.color];
    }
    if (colorField.length !== 0) {
      cellNew.color = colorField[0];
    } else {
      const remainedFields = getRemainedFields(cellNew, fieldInfo);
      const colorField = getFieldByRole(remainedFields, ROLE.DIMENSION);
      if (colorField) {
        cellNew.color = colorField.fieldName;
      } else {
        cellNew.color = remainedFields[0].fieldName;
      }
    }
  }
  return {
    cell: cellNew
  };
};

export const patchNeedSize: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  const { chartType, cell, fieldInfo } = context;
  const cellNew: any = { ...cell };
  if (
    NEED_SIZE_FIELD_CHART_LIST.some(needSizeFieldChartType => needSizeFieldChartType.toUpperCase() === chartType) ||
    NEED_COLOR_AND_SIZE_CHART_LIST.some(needSizeFieldChartType => needSizeFieldChartType.toUpperCase() === chartType)
  ) {
    const sizeField = [cellNew.size, cellNew.value, cellNew.y, cellNew.radius, cellNew.angle].filter(Boolean).flat();
    if (sizeField.length !== 0) {
      cellNew.size = sizeField[0];
    } else {
      const remainedFields = getRemainedFields(cellNew, fieldInfo);
      const sizeField = getFieldByRole(remainedFields, ROLE.MEASURE);
      if (sizeField) {
        cellNew.size = sizeField.fieldName;
      } else {
        cellNew.size = remainedFields[0].fieldName;
      }
    }
  }
  return {
    cell: cellNew
  };
};

export const patchRangeColumnChart: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  // Range Column Chart's y field must length == 2
  const { chartType, cell, fieldInfo } = context;
  const cellNew = { ...cell };
  const remainedFields = getRemainedFields(cellNew, fieldInfo);
  const numericFields = getFieldsByDataType(remainedFields, [DataType.FLOAT, DataType.INT]);
  if (chartType === ChartType.RangeColumnChart.toUpperCase()) {
    if (cellNew.y && cellNew.y instanceof Array && cellNew.y.length === 2) {
      return { cell: cellNew };
    }
    if (numericFields.length >= 2) {
      cellNew.y = [numericFields[0].fieldName, numericFields[1].fieldName];
    } else {
      throw Error(
        'The y-axis of the range column chart requires two numeric fields, ' +
          'but the result of data aggregation does not have two numeric fields'
      );
    }
  }
  return {
    //...context,
    cell: cellNew
  };
};

export const patchLinearProgressChart: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  const { chartType, cell, fieldInfo } = context;
  const cellNew = { ...cell };
  if (chartType === ChartType.LinearProgress.toUpperCase()) {
    const xField = [cellNew.x, cellNew.color].filter(Boolean).flat();
    if (xField.length !== 0) {
      cellNew.x = xField[0];
    } else {
      const remainedFields = getRemainedFields(cellNew, fieldInfo);
      const xField = getFieldByRole(remainedFields, ROLE.DIMENSION);
      if (xField) {
        cellNew.x = xField.fieldName;
      } else {
        cellNew.x = remainedFields[0].fieldName;
      }
    }

    const yField = [cellNew.y, cellNew.size, cellNew.value, cellNew.radius, cellNew.angle].filter(Boolean).flat();
    if (yField.length !== 0) {
      cellNew.y = yField[0];
    } else {
      const remainedFields = getRemainedFields(cellNew, fieldInfo);
      const yField = getFieldByRole(remainedFields, ROLE.MEASURE);
      if (yField) {
        cellNew.y = yField.fieldName;
      } else {
        cellNew.y = remainedFields[0].fieldName;
      }
    }
  }
  return {
    //...context,
    cell: cellNew
  };
};

export const patchBasicHeatMapChart: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  const { chartType, cell, fieldInfo } = context;
  const cellNew: any = { ...cell };
  if (chartType === ChartType.BasicHeatMap.toUpperCase()) {
    const colorField = [cellNew.x, cellNew.y, cellNew.label, cellNew.color].filter(Boolean).flat();
    if (colorField.length >= 2) {
      cellNew.x = colorField[0];
      cellNew.y = colorField[1];
    } else {
      const remainedFields = getRemainedFields(cellNew, fieldInfo);
      const colorField = getFieldsByDataType(remainedFields, [DataType.STRING]);
      if (colorField.length >= 2) {
        cellNew.x = colorField[0];
        cellNew.y = colorField[1];
      } else {
        cellNew.x = remainedFields[0].fieldName;
        cellNew.y = remainedFields[1].fieldName;
      }
    }
  }
  return {
    cell: cellNew
  };
};

export const patchSingleColumnCombinationChart: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  Partial<GenerateChartAndFieldMapOutput>
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  const { chartType, cells, subChartType } = context;
  if (
    COMBINATION_CHART_LIST.some(combinationChartType => {
      return chartType.toUpperCase() === combinationChartType.toUpperCase();
    })
  ) {
    const cellsNew: Cell[] = [...cells];
    const subChartTypeNew: CombinationBasicChartType[] = [...subChartType];
    const datasetNew: VMindDataset[] = [];

    const patchers = ChartGenerationTaskNodeGPTMeta.patcher.filter(patch => {
      return patch.name !== 'patchSingleColumnCombinationChart';
    });

    subChartType.forEach((chartType, index) => {
      const input = { ...context, chartType, cell: cells[index] };
      const result = patchers.reduce((pre, pipeline) => {
        const res = pipeline(pre);
        return { ...pre, ...res } as any;
      }, input);
      subChartTypeNew[index] = result.chartType;
      cellsNew[index] = result.cell;
      datasetNew[index] = result.dataset;
    });

    return {
      subChartType: subChartTypeNew,
      cells: cellsNew,
      datasets: datasetNew
    };
  }
  return {};
};
