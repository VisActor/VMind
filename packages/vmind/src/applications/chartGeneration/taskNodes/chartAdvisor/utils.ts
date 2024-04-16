import { ChartType, DataTypeName } from '@visactor/chart-advisor';
import { Cell } from '../../types';
import { SimpleFieldInfo } from 'src/common/typings';
import { isArray } from 'lodash';

export const typeMap = (type: string): DataTypeName => {
  if (['string'].includes(type)) {
    return 'string';
  } else if (['date', 'datetime', 'time'].includes(type)) {
    return 'date';
  } else if (['int', 'float'].includes(type)) {
    return 'number';
  }
  return 'string';
};

export const chartTypeMap = (advisorChartType: ChartType) => {
  if (
    [
      ChartType.COLUMN,
      ChartType.COLUMN_PERCENT,
      ChartType.COLUMN_PARALLEL,
      ChartType.BAR,
      ChartType.BAR_PERCENT,
      ChartType.BAR_PARALLEL
    ].includes(advisorChartType)
  ) {
    return 'Bar Chart';
  } else if ([ChartType.LINE, ChartType.AREA, ChartType.AREA_PERCENT].includes(advisorChartType)) {
    return 'Line Chart';
  } else if ([ChartType.PIE, ChartType.ANNULAR].includes(advisorChartType)) {
    return 'Pie Chart';
  } else if (ChartType.ROSE === advisorChartType) {
    return 'Rose Chart';
  } else if (ChartType.SCATTER === advisorChartType) {
    return 'Scatter Plot';
  } else if (ChartType.DUAL_AXIS === advisorChartType) {
    return 'Dual Axis Chart';
  } else if (ChartType.WORD_CLOUD === advisorChartType) {
    return 'Word Cloud';
  } else if (ChartType.FUNNEL === advisorChartType) {
    return 'Funnel Chart';
  } else if (ChartType.SANKEY === advisorChartType) {
    return 'Sankey Chart';
  } else if (ChartType.RADAR === advisorChartType) {
    return 'Radar Chart';
  }
  throw 'no matched chart type ' + advisorChartType;
};

export const getCell = (cell: any): Cell => {
  const keys = Object.keys(cell);
  const result: Cell = {};
  keys.forEach((key: string) => {
    const channel = cell[key];
    if (Array.isArray(channel) && channel.length === 1) {
      result[key] = String(channel[0]);
    } else {
      result[key] = Array.isArray(channel) ? channel.map(c => String(c)) : channel;
    }
  });
  return result;
};

const checkChannel = (cell: any, channel: string, count = 1) => {
  if (count === 1 && typeof cell[channel] === 'string') {
    // channel exist and is a string
    return true;
  }
  if (Array.isArray(cell[channel]) && cell[channel].length === count) {
    // channel is a array
    return true;
  } else {
    console.error(`cell mismatch channel '${channel}'`);
    return false;
  }
};

export const checkChartTypeAndCell = (chartType: string, cell: any, fieldInfo: SimpleFieldInfo[]): boolean => {
  const fieldList = fieldInfo.map(f => f.fieldName);
  const cellFields: (string | string[])[] = Object.values(cell);
  cellFields.forEach((cellField: string | string[]) => {
    if (!cellField) {
      return;
    }
    if (isArray(cellField)) {
      if (!cellField.every(f => f && fieldList.includes(f))) {
        console.error(`missing field ${cellField}`);
        //throw `missing field ${cellField}`;
      }
    } else {
      if (cellField && !fieldList.includes(cellField)) {
        console.error(`missing field ${cellField}`);
        //throw `missing field ${cellField}`;
      }
    }
  });
  let checkChannelResult = true;
  switch (chartType) {
    case 'BAR CHART':
    case 'LINE CHART':
      checkChannelResult = checkChannel(cell, 'x') && checkChannel(cell, 'y');
      break;
    case 'DUAL AXIS CHART':
      checkChannelResult = checkChannel(cell, 'x') && checkChannel(cell, 'y', 2);
      break;
    default:
      //console.warn('Unchecked Chart Type', chartType);
      break;
  }
  return checkChannelResult;
};
