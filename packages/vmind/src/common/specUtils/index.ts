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
import { isArray, isString, uniqArray } from '@visactor/vutils';
import { getFieldInfoFromDataset } from '../dataProcess';
import { foldDatasetByYField } from '../utils/utils';
import {
  FOLD_NAME,
  FOLD_VALUE,
  COLOR_FIELD,
  FOLD_VALUE_MAIN,
  FOLD_VALUE_SUB,
  GROUP_FIELD
} from '@visactor/chart-advisor';
import type { DataItem } from '../typings';
import { ChartType, type SimpleFieldInfo, type VMindDataset } from '../typings';
import type { Cell } from '../../applications/chartGeneration/types';

/**
 * remove the fields that is not exist in the fieldInfo from cell
 * @param cell
 * @param fieldInfo
 * @returns
 */
const removeInvalidFieldFromCell = (cell: Cell, fieldInfo: SimpleFieldInfo[]) => {
  const fieldList = fieldInfo
    .map(f => f.fieldName)
    .concat([
      FOLD_NAME.toString(),
      FOLD_VALUE.toString(),
      FOLD_VALUE_MAIN.toString(),
      FOLD_VALUE_SUB.toString(),
      COLOR_FIELD.toString(),
      GROUP_FIELD.toString()
    ]);
  const cellNew: any = {
    ...cell
  };
  Object.keys(cellNew).forEach(key => {
    const fields = cellNew[key];
    if (isArray(fields)) {
      const filteredFields = fields.filter(field => fieldList.includes(field));
      cellNew[key] = filteredFields.length === 0 ? undefined : filteredFields;
    } else if (isString(fields)) {
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
      y: uniqArray([series[0]?.yField, series[1]?.yField].filter(Boolean))
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
export const fillSpecTemplateWithData = (
  template: Spec,
  dataset: VMindDataset,
  propsCell?: any,
  totalTime?: number
) => {
  const { type } = template;
  const fieldInfo = getFieldInfoFromDataset(dataset);
  const tempCell = propsCell ?? getCellFromSpec(template);

  let cellNew = { ...tempCell };
  let datasetNew = dataset;

  //check if the spec is generated using fold dataset
  const hasFold = isArray(cellNew.y)
    ? cellNew.y[0] === FOLD_VALUE.toString() ||
      (cellNew.y[0] === FOLD_VALUE_MAIN.toString() && cellNew.y[1] === FOLD_VALUE_SUB.toString())
    : cellNew.y === FOLD_VALUE.toString();

  cellNew = removeInvalidFieldFromCell(cellNew, fieldInfo);

  const context: any = {
    spec: template,
    dataset: datasetNew,
    cells: [cellNew],
    totalTime
  };

  if (type === 'bar' && template.player) {
    //dynamic bar chart
    const { spec } = sequenceData(context);
    return spec;
  }
  if (['bar', 'line'].includes(type)) {
    if (hasFold) {
      //bar chart and line chart can visualize multiple y fields
      const { foldInfo } = cellNew;
      const { foldMap } = foldInfo;
      datasetNew = foldDatasetByYField(datasetNew, Object.keys(foldMap), fieldInfo);
    }

    if (cellNew.color === COLOR_FIELD.toString()) {
      const { cartesianInfo } = cellNew;
      const colorFields = cartesianInfo.fieldList;
      datasetNew = datasetNew.map((data: DataItem) => {
        const colorItem = colorFields.map((field: string) => data[field]).join('-');
        return {
          ...data,
          [COLOR_FIELD]: colorItem
        };
      });
    }

    const contextNew: any = {
      spec: template,
      dataset: datasetNew,
      cells: [cellNew],
      totalTime
    };
    const { spec: spec1 } = data(contextNew);
    const { spec } = legend({ ...contextNew, spec: spec1 });
    return spec;
  }
  if (['pie', 'scatter', 'rose', 'radar', 'waterfall', 'boxPlot'].includes(type)) {
    if (hasFold) {
      const { foldInfo } = cellNew;
      const { foldMap } = foldInfo;
      datasetNew = foldDatasetByYField(datasetNew, Object.keys(foldMap), fieldInfo);
    }
    if (cellNew.color === COLOR_FIELD.toString()) {
      const { cartesianInfo } = cellNew;
      const colorFields = cartesianInfo.fieldList;
      datasetNew = datasetNew.map((data: DataItem) => {
        const colorItem = colorFields.map((field: string) => data[field]).join('-');
        return {
          ...data,
          [COLOR_FIELD]: colorItem
        };
      });
    }

    const contextNew: any = {
      spec: template,
      dataset: datasetNew,
      cells: [cellNew],
      totalTime
    };
    const { spec } = data(contextNew);
    return spec;
  }
  if ('common' === type) {
    //dual-axis chart
    let mainSeriesData = datasetNew;
    let subSeriesData = datasetNew;

    if (hasFold) {
      //bar chart and line chart can visualize multiple y fields
      const { foldInfo } = cellNew;
      const { foldMap } = foldInfo;
      mainSeriesData = foldDatasetByYField(
        datasetNew,
        [Object.keys(foldMap)[0]],
        fieldInfo,
        FOLD_NAME,
        FOLD_VALUE_MAIN
      );
      subSeriesData = foldDatasetByYField(datasetNew, [Object.keys(foldMap)[1]], fieldInfo, FOLD_NAME, FOLD_VALUE_SUB);
    }

    const { spec: spec1 } = data(context);
    const { spec: finalSpec } = legend({ ...context, spec: spec1 });

    //const { spec } = dualAxisSeries({ ...context, spec: spec2 });
    const { cartesianInfo, y } = cellNew;
    if (finalSpec.series && finalSpec.series[0]) {
      finalSpec.series[0].seriesField = COLOR_FIELD;

      const colorFields = cartesianInfo ? cartesianInfo.fieldList : undefined;
      finalSpec.series[0].data = {
        id: finalSpec.data.id + '_bar',
        values: mainSeriesData.map((d: any) => {
          const colorItem = isArray(colorFields) ? colorFields.map((field: string) => d[field]).join('-') : y[0];
          return { ...d, [COLOR_FIELD]: colorItem };
        })
      };
    }
    if (finalSpec.series && finalSpec.series[1]) {
      finalSpec.series[1].seriesField = COLOR_FIELD;

      const colorFields = cartesianInfo ? cartesianInfo.fieldList : undefined;
      finalSpec.series[1].data = {
        id: finalSpec.data.id + '_line',
        values: subSeriesData.map((d: any) => {
          const colorItem = isArray(colorFields) ? colorFields.map((field: string) => d[field]).join('-') : y[1];
          return { ...d, [COLOR_FIELD]: colorItem };
        })
      };
    }
    return finalSpec;
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
