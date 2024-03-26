import { isArray, isNil } from 'lodash';
import {
  CARTESIAN_CHART_LIST,
  detectAxesType,
  foldDatasetByYField,
  getFieldByDataType,
  getFieldByRole,
  getRemainedFields
} from '../../common/vizDataToSpec/utils';
import { Cell, DataItem, DataType, PatchContext, PatchPipeline, ROLE, SimpleFieldInfo } from '../../typings';
import { execPipeline } from '../../common/utils';
import { FOLD_NAME, FOLD_VALUE } from '@visactor/chart-advisor';

export const patchUserInput = (userInput: string) => {
  const FULL_WIDTH_SYMBOLS = ['，', '。'];
  const HALF_WIDTH_SYMBOLS = [',', '.'];

  const BANNED_WORD_LIST = ['动态'];
  const ALLOWED_WORD_LIST = ['动态条形图', '动态柱状图', '动态柱图'];
  const PLACEHOLDER = '_USER_INPUT_PLACE_HOLDER';
  const tempStr1 = ALLOWED_WORD_LIST.reduce((prev, cur, index) => {
    return prev.split(cur).join(PLACEHOLDER + '_' + index);
  }, userInput);
  const tempStr2 = BANNED_WORD_LIST.reduce((prev, cur) => {
    return prev.split(cur).join('');
  }, tempStr1);
  const replacedStr = ALLOWED_WORD_LIST.reduce((prev, cur, index) => {
    return prev.split(PLACEHOLDER + '_' + index).join(cur);
  }, tempStr2);

  let finalStr = HALF_WIDTH_SYMBOLS.reduce((prev, cur, index) => {
    return prev.split(HALF_WIDTH_SYMBOLS[index]).join(FULL_WIDTH_SYMBOLS[index]);
  }, replacedStr);
  const lastCharacter = finalStr[finalStr.length - 1];
  if (!FULL_WIDTH_SYMBOLS.includes(lastCharacter) && !HALF_WIDTH_SYMBOLS.includes(lastCharacter)) {
    finalStr += '。';
  }
  finalStr += 'Use the original fieldName and DO NOT change or translate any word of the data fields in the response.';
  return finalStr;
};

const patchAxisField: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
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
    ...context,
    cell: cellNew
  };
};

const patchColorField: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
  const { cell } = context;
  const cellNew = { ...cell, color: cell.color ?? cell.category };

  return {
    ...context,
    cell: cellNew
  };
};

const patchLabelField: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
  const { cell } = context;

  const cellNew: any = { ...cell };
  //patch the "label" fields to color
  if (cellNew.label && (!cellNew.color || cellNew.color.length === 0)) {
    cellNew.color = cellNew.label;
  }

  return {
    ...context,
    cell: cellNew
  };
};

const patchYField: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
  const { chartType, cell, dataset, fieldInfo } = context;
  let cellNew = { ...cell };
  const { x, y } = cellNew;
  let chartTypeNew = chartType;
  let datasetNew = dataset;

  // y轴字段有多个时，处理方式:
  // 1. 图表类型为: 箱型图, 图表类型不做矫正
  // 2. 图表类型为: 柱状图 或 折线图, 图表类型矫正为双轴图
  // 3. 其他情况, 图表类型矫正为散点图
  if (y && isArray(y) && y.length > 1) {
    if (chartTypeNew === 'BOX PLOT' || (chartTypeNew === 'DUAL AXIS CHART' && y.length === 2)) {
      return {
        ...context
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
    ...context,
    chartType: chartTypeNew,
    cell: cellNew,
    dataset: datasetNew
  };
};

const patchBoxPlot: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
  const { chartType, cell } = context;
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

  return { ...context, cell: cellNew };
};

const patchDualAxis: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
  const { chartType, cell } = context;
  const cellNew: any = { ...cell };
  //Dual-axis drawing yLeft and yRight

  if (chartType === 'DUAL AXIS CHART' && cellNew.yLeft && cellNew.yRight) {
    cellNew.y = [cellNew.yLeft, cellNew.yRight];
  }

  return { ...context, cell: cellNew };
};

const patchPieChart: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
  const { chartType, cell, fieldInfo } = context;
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
  return { ...context, cell: cellNew };
};

const patchWordCloud: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
  //Word cloud must have color fields and size fields
  const { chartType, cell, fieldInfo } = context;
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
  return { ...context, cell: cellNew };
};

const patchDynamicBarChart: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
  const { chartType, cell, fieldInfo } = context;
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

  return { ...context, cell: cellNew };
};

const patchCartesianXField: PatchPipeline = (context: PatchContext, _originalContext: PatchContext) => {
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
  return { ...context, cell: cellNew };
};

const patchPipelines = [
  patchAxisField,
  patchColorField,
  patchLabelField,
  patchYField,
  patchBoxPlot,
  patchDualAxis,
  patchPieChart,
  patchWordCloud,
  patchDynamicBarChart,
  patchCartesianXField
];

export const patchChartTypeAndCell = (
  chartTypeRes: string,
  cellRes: Cell,
  dataset: DataItem[],
  fieldInfo: SimpleFieldInfo[]
) => {
  // At some point, due to the unclear intention of the user's input, fields may lack fields in Cell returned by GPT.
  // At this time, you need to make up according to the rules

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
