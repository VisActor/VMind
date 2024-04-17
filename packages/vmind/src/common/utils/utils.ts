import type { DataItem, DataType, ROLE, SimpleFieldInfo } from 'src/common/typings';
import { FOLD_NAME, FOLD_VALUE, fold } from '@visactor/chart-advisor';
import type { Cell } from 'src/applications/chartGeneration/types';
import {
  DEFAULT_VIDEO_LENGTH,
  VIDEO_LENGTH_BY_CHART_TYPE
} from 'src/applications/chartGeneration/taskNodes/getChartSpec/VChart/constants';

export const detectAxesType = (values: any[], field: string) => {
  const isNumber = values.every(d => !d[field] || !isNaN(Number(d[field])));
  if (isNumber) {
    return 'linear';
  }
  return 'band';
};

export const calculateTokenUsage = (usageList: any[]) => {
  const totalUsage = {
    completion_tokens: 0,
    prompt_tokens: 0,
    total_tokens: 0
  };
  usageList.filter(Boolean).forEach(usage => {
    totalUsage.completion_tokens += usage.completion_tokens ?? 0;
    totalUsage.prompt_tokens += usage.prompt_tokens ?? 0;
    totalUsage.total_tokens += usage.total_tokens ?? 0;
  });
  return totalUsage;
};

export const replaceAll = (originStr: string, replaceStr: string, newStr: string) => {
  return originStr.split(replaceStr).join(newStr);
};

export const execPipeline = <PipelineContext>(
  src: any,
  pipes: ((src: any, context: PipelineContext) => any)[],
  context: PipelineContext
) =>
  pipes.reduce((pre: any, pipe: (src: any, context: PipelineContext) => any) => {
    const result = pipe(pre, context);
    return result;
  }, src);

export const matchJSONStr = (str: string) => {
  const first = str.indexOf('{');
  const last = str.lastIndexOf('}');
  const result = str.substring(first, last + 1);
  return result && result.length > 0 ? result : str;
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

export function getObjectProperties(e: Error): {} {
  const properties: any = {};

  for (const prop of Object.getOwnPropertyNames(e)) {
    properties[prop] = (e as any)[prop];
  }

  return properties;
}

const KNOWLEDGE_START_INDEX = 1;
export const getStrFromArray = (array: string[]) =>
  array.map((item, index) => `${index + KNOWLEDGE_START_INDEX}. ${item}`).join('\n');

export const getStrFromDict = (dict: Record<string, string>) =>
  Object.keys(dict)
    .map(key => `${key}: ${dict[key]}`)
    .join('\n');
