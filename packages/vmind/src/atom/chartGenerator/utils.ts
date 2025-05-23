import { isArray } from '@visactor/vutils';
import type { DataTypeName } from '@visactor/chart-advisor';
import { ChartType } from '@visactor/chart-advisor';
import type { Cell, FieldInfo } from '../../types';
import { ChartType as VMindChartType } from '../../types';
import type { ChartGeneratorCtx } from '../../types';
import { DEFAULT_VIDEO_LENGTH, VIDEO_LENGTH_BY_CHART_TYPE } from './spec/constants';

export { getVChartTypeByVmind } from './spec/chartTypeUtils';

/**
 * Generate a vizSchema from fieldInfo
 * @param fieldInfo SimpleFieldInfo[] - An array of field information, each element contains the field name, description, type, and role, etc.
 * @returns Partial<VizSchema> - Returns a partial VizSchema object, containing the transformed field information.
 */
export const getVizSchema = (context: ChartGeneratorCtx) => {
  const { fieldInfo } = context;
  return {
    fields:
      fieldInfo &&
      fieldInfo.map(d => ({
        id: d.fieldName,
        alias: d.fieldName,
        description: d.description,
        visible: true,
        type: d.type,
        role: d.role,
        location: d.role
      }))
  };
};

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

export const VMindChartTypeMap: Record<string, ChartType[]> = {
  [VMindChartType.BarChart]: [
    ChartType.COLUMN,
    ChartType.COLUMN_PERCENT,
    ChartType.COLUMN_PARALLEL,
    ChartType.BAR,
    ChartType.BAR_PERCENT,
    ChartType.BAR_PARALLEL
  ],
  [VMindChartType.LineChart]: [ChartType.LINE, ChartType.AREA, ChartType.AREA_PERCENT],
  [VMindChartType.AreaChart]: [ChartType.AREA, ChartType.AREA_PERCENT],
  [VMindChartType.PieChart]: [ChartType.PIE, ChartType.ANNULAR],
  [VMindChartType.RoseChart]: [ChartType.ROSE],
  [VMindChartType.ScatterPlot]: [ChartType.SCATTER],
  [VMindChartType.DualAxisChart]: [ChartType.DUAL_AXIS],
  [VMindChartType.WordCloud]: [ChartType.WORD_CLOUD],
  [VMindChartType.FunnelChart]: [ChartType.FUNNEL],
  [VMindChartType.SankeyChart]: [ChartType.SANKEY],
  [VMindChartType.RadarChart]: [ChartType.RADAR]
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
  const result: any = {};
  keys.forEach(key => {
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
  if (Array.isArray(cell[channel]) && cell[channel].length >= count) {
    // channel is a array
    return true;
  }
  console.error(`cell mismatch channel '${channel}'`);
  return false;
};

export const checkChartTypeAndCell = (chartType: string, cell: any, fieldInfo: FieldInfo[]): boolean => {
  const fieldList = fieldInfo.map(f => f.fieldName);
  const cellFields: (string | string[])[] = Object.values(cell);
  cellFields.forEach((cellField: string | string[]) => {
    if (!cellField) {
      return;
    }
    if (isArray(cellField)) {
      if (!cellField.every(f => f && fieldList.includes(f))) {
        console.warn(`missing field ${cellField}`);
        //throw `missing field ${cellField}`;
      }
    } else {
      if (cellField && !fieldList.includes(cellField)) {
        console.warn(`missing field ${cellField}`);
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

export const estimateVideoTime = (chartType: string, spec: any, parsedTime?: number) => {
  //估算视频长度
  if (chartType === 'DYNAMIC BAR CHART') {
    const frameNumber = spec.player.specs.length;
    const duration = spec.player.interval;
    return {
      totalTime: parsedTime ?? frameNumber * duration,
      frameArr: parsedTime
        ? Array.from(new Array(frameNumber).keys()).map(n => Number(parsedTime / frameNumber))
        : Array.from(new Array(frameNumber).keys()).map(n => duration)
    };
  }

  // chartType不是真实的图表类型，转一次
  const map: Record<string, string> = {
    'PIE CHART': 'pie',
    'WORD CLOUD': 'wordCloud'
  };
  return {
    totalTime: parsedTime ?? VIDEO_LENGTH_BY_CHART_TYPE[map[chartType]] ?? DEFAULT_VIDEO_LENGTH,
    frameArr: []
  };
};
