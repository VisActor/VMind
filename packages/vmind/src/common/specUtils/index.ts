import type { Spec } from '../../applications/chartGeneration/taskNodes/getChartSpec/types';
import {
  data,
  dualAxisSeries,
  funnelData,
  legend,
  sankeyData,
  sequenceData,
  wordCloudData
} from '../../applications/chartGeneration/taskNodes/getChartSpec/VChart/transformers';
import { isArray } from 'lodash';
import { getFieldInfoFromDataset } from '../dataProcess';
import { foldDatasetByYField } from '../utils/utils';
import { FOLD_NAME, FOLD_VALUE } from '@visactor/chart-advisor';
import { ChartType, type SimpleFieldInfo, type VMindDataset } from '../typings';
import type { Cell } from '../../applications/chartGeneration/types';

/**
 * remove the fields that is not exist in the fieldInfo from cell
 * @param cell
 * @param fieldInfo
 * @returns
 */
const removeInvalidFieldFromCell = (cell: Cell, fieldInfo: SimpleFieldInfo[]) => {
  const fieldList = fieldInfo.map(f => f.fieldName);
  const cellNew = {
    ...cell
  };
  Object.keys(cellNew).forEach(key => {
    const fields = cellNew[key];
    if (isArray(fields)) {
      const filteredFields = fields.filter(field => fieldList.includes(field));
      cellNew[key] = filteredFields.length === 0 ? undefined : filteredFields;
    } else {
      cellNew[key] = fieldList.includes(fields) ? fields : undefined;
    }
  });
  return cellNew;
};

/**
 * Auto generate cell from a spec template
 * @param spec
 * @returns
 */
export const getCellFromSpec = (spec: Spec) => {
  if (!spec) {
    return {};
  }
  const { type } = spec;
  if (type === 'bar' && spec.player) {
    //dynamic bar chart
    const time = spec.timeField;
    const x = spec.yField;
    const y = spec.xField;
    const color = spec.seriesField;
    return { time, x, y, color };
  }
  if (['bar', 'line'].includes(type)) {
    const x = spec.xField;
    const y = spec.yField;
    const color = spec.seriesField;
    return { x, y, color };
  }
  if ('radar' === type) {
    return {
      x: spec.categoryField,
      y: spec.valueField,
      color: spec.seriesField
    };
  }
  if (['pie', 'rose'].includes(type)) {
    return {
      color: spec.categoryField,
      angle: spec.valueField
    };
  }
  if ('scatter' === type) {
    return {
      color: spec.seriesField,
      size: spec.sizeField,
      x: spec.xField,
      y: spec.yField
    };
  }
  if ('boxPlot' === type) {
    return {
      x: spec.xField,
      y: [spec.minField, spec.q1Field, spec.medianField, spec.q3Field, spec.maxField].filter(Boolean)
    };
  }
  if ('common' === type) {
    //dual-axis chart
    const series = spec.series ?? [];
    return {
      x: series[0]?.xField,
      y: [series[0]?.yField, series[1]?.yField].filter(Boolean)
    };
  }
  if (type === 'wordCloud') {
    return {
      color: spec.nameField,
      size: spec.valueField
    };
  }
  if (type === 'funnel') {
    return {
      x: spec.categoryField,
      y: spec.valueField
    };
  }
  if ('waterfall' === type) {
    return {
      x: spec.xField,
      y: spec.yField
    };
  }
  if (type === 'sankey') {
    return {
      source: spec.sourceField,
      target: spec.targetField,
      value: spec.valueField
    };
  }
  return {};
};

/**
 * fill the spec template with dataset
 * @param template
 * @param dataset
 * @param totalTime
 * @returns
 */
export const fillSpecTemplateWithData = (template: Spec, dataset: VMindDataset, totalTime?: number) => {
  const { type } = template;
  const fieldInfo = getFieldInfoFromDataset(dataset);
  const tempCell = getCellFromSpec(template);

  const cell = removeInvalidFieldFromCell(tempCell, fieldInfo);
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

export const getDatasetFromSpec = (spec: any) => {
  if (!spec) {
    return [];
  }
  return spec.data.map((d: any) => d.values).flat(2);
};

/**
 * extract vmind chart type from spec
 * @param spec
 * @returns
 */
export const getChartTypeFromSpec = (spec: any): ChartType => {
  if (!spec) {
    return undefined;
  }
  const { type } = spec;
  if (type === 'bar') {
    return ChartType.BarChart;
  }
  if (type === 'line') {
    return ChartType.LineChart;
  }
  if (type === 'pie') {
    return ChartType.PieChart;
  }
  if (type === 'wordCloud') {
    return ChartType.WordCloud;
  }
  if (type === 'scatter') {
    return ChartType.ScatterPlot;
  }
  if (type === 'funnel') {
    return ChartType.FunnelChart;
  }
  if (type === 'rose') {
    return ChartType.RoseChart;
  }
  if (type === 'radar') {
    return ChartType.RadarChart;
  }
  if (type === 'sankey') {
    return ChartType.SankeyChart;
  }
  if (type === 'waterfall') {
    return ChartType.WaterFallChart;
  }
  if (type === 'boxPlot') {
    return ChartType.BoxPlot;
  }
  if (type === 'common') {
    //check if the common chart is dual-axis chart
    const { series } = spec;
    if (series.length === 2 && series.every((s: any) => s.type === 'bar' || s.type === 'line')) {
      return ChartType.DualAxisChart;
    }
    if (series.length === 1) {
      return getChartTypeFromSpec(series[0]);
    }
  }
  //unsupported spec
  return undefined;
};
