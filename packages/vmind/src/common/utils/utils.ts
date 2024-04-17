import type { DataItem, DataType, ROLE, SimpleFieldInfo, VMindDataset } from 'src/common/typings';
import { FOLD_NAME, FOLD_VALUE, fold } from '@visactor/chart-advisor';
import type { Cell } from 'src/applications/chartGeneration/types';
import {
  DEFAULT_VIDEO_LENGTH,
  VIDEO_LENGTH_BY_CHART_TYPE
} from 'src/applications/chartGeneration/taskNodes/getChartSpec/VChart/constants';
import type { Spec } from 'src/applications/chartGeneration/taskNodes/getChartSpec/types';
import {
  data,
  dualAxisSeries,
  funnelData,
  legend,
  sankeyData,
  sequenceData,
  wordCloudData
} from 'src/applications/chartGeneration/taskNodes/getChartSpec/VChart/transformers';
import { isArray } from 'lodash';

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

export const fillSpecTemplateWithData = (
  template: Spec,
  dataset: VMindDataset,
  cell: Cell,
  fieldInfo: SimpleFieldInfo[],
  totalTime?: number
) => {
  const { type } = template;
  const cellNew = { ...cell };

  const context: any = {
    spec: template,
    dataset,
    cell: cellNew,
    totalTime
  };

  if (type === 'bar' && template.player) {
    //dynamic bar chart
    const { spec } = sequenceData(context);
    return spec;
  }
  if (['bar', 'line'].includes(type)) {
    let datasetNew = dataset;

    if (isArray(cellNew.y) && cellNew.y.length > 1) {
      //bar chart and line chart can visualize multiple y fields
      datasetNew = foldDatasetByYField(datasetNew, cellNew.y, fieldInfo);
      cellNew.y = FOLD_VALUE.toString();
      cellNew.color = FOLD_NAME.toString();
      template.yField = cellNew.y;
      template.seriesField = cellNew.color;
      template.xField = isArray(template.xField)
        ? [...template.xField, cellNew.color]
        : [template.xField, cellNew.color];
    }

    const contextNew: any = {
      spec: template,
      dataset: datasetNew,
      cell: cellNew,
      totalTime
    };
    const { spec: spec1 } = data(contextNew);
    const { spec } = legend({ ...contextNew, spec: spec1 });

    return spec;
  }
  if (['pie', 'scatter', 'rose', 'radar', 'waterfall', 'boxPlot'].includes(type)) {
    const { spec } = data(context);
    return spec;
  }
  if ('common' === type) {
    //dual-axis chart
    const { spec: spec1 } = data(context);
    const { spec: spec2 } = legend({ ...context, spec: spec1 });

    const { spec } = dualAxisSeries({ ...context, spec: spec2 });
    return spec;
  }
  if (type === 'wordCloud') {
    const { spec } = wordCloudData(context);
    return spec;
  }
  if (type === 'funnel') {
    const { spec } = funnelData(context);
    return spec;
  }
  if (type === 'sankey') {
    const { spec } = sankeyData(context);
    return spec;
  }
  const { spec } = data(context);
  return spec;
};
