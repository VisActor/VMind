import { Cell, DataItem, DataType, ROLE, SimpleFieldInfo } from 'src/typings';
import { VIDEO_LENGTH_BY_CHART_TYPE, DEFAULT_VIDEO_LENGTH } from './constants';
import { FOLD_NAME, FOLD_VALUE, fold } from '@visactor/chart-advisor';

export const detectAxesType = (values: any[], field: string) => {
  const isNumber = values.every(d => !d[field] || !isNaN(Number(d[field])));
  if (isNumber) {
    return 'linear';
  } else {
    return 'band';
  }
};

export const CARTESIAN_CHART_LIST = [
  'Dynamic Bar Chart',
  'Bar Chart',
  'Line Chart',
  'Scatter Plot',
  'Funnel Chart',
  'Dual Axis Chart',
  'Waterfall Chart',
  'Box Plot'
];

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

export const getRemainedFields = (cell: Cell, fieldInfo: SimpleFieldInfo[]) => {
  const usedFields = Object.values(cell).flat();
  const remainedFields = fieldInfo.filter(f => !usedFields.includes(f.fieldName));
  return remainedFields;
};

export const getFieldByRole = (fields: SimpleFieldInfo[], role: ROLE) => {
  return fields.find(f => f.role === role);
};

export const getFieldByDataType = (fields: SimpleFieldInfo[], dataTypeList: DataType[]) => {
  return fields.find(f => dataTypeList.includes(f.type));
};

export const foldDatasetByYField = (dataset: DataItem[], yFieldList: string[], fieldInfo: SimpleFieldInfo[]) => {
  const aliasMap = Object.fromEntries(fieldInfo.map(d => [d.fieldName, d.fieldName]));

  return fold(dataset as any, yFieldList, FOLD_NAME, FOLD_VALUE, aliasMap, false);
};
