import { array, isArray, isString, merge, uniqArray } from '@visactor/vutils';
import { ChartType } from '../types';
import type { DataItem, DataTable, DataCell, Cell, FieldInfo } from '../types';
import { getFieldInfoFromDataset } from './field';
import {
  COLOR_FIELD,
  FOLD_NAME,
  FOLD_VALUE,
  FOLD_VALUE_MAIN,
  FOLD_VALUE_SUB,
  GROUP_FIELD
} from '@visactor/chart-advisor';
import {
  data,
  funnelData,
  legend,
  sankeyData,
  sequenceData,
  wordCloudData
} from '../atom/chartGenerator/spec/transformers';
import { foldDataTableByYField, foldDatasetByYField } from './dataTable';

/**
 * extract vmind chart type from spec
 * @param spec
 * @returns
 */
export const getChartTypeFromSpec = (spec: any, vchartType?: string): ChartType => {
  if (!spec) {
    return undefined;
  }
  const type = vchartType ?? spec?.type;
  if (type === 'bar') {
    return ChartType.BarChart;
  }
  if (type === 'line') {
    return ChartType.LineChart;
  }
  if (type === 'area') {
    return ChartType.AreaChart;
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
    const { series } = spec;
    const typeList = uniqArray(series.map((s: any) => s.type));
    if (typeList.length === 1) {
      return getChartTypeFromSpec(series[0], vchartType);
    }
    if (series.length > 1 && series.every((s: any) => s.type === 'bar' || s.type === 'line' || s.type === 'area')) {
      //check if the common chart is dual-axis chart
      return ChartType.DualAxisChart;
    }
  }
  //unsupported spec
  return undefined;
};

export const getDatasetFromSpec = (spec: any) => {
  if (!spec) {
    return [];
  }
  const originSpecData = array(spec.data);
  return originSpecData.map((d: any) => d.values).flat(2);
};

export const getFieldMappingFromSpec = (spec: any) => {
  if (!spec) {
    return {};
  }
  let res = {};
  array(spec.data).forEach((d: any) => {
    if (d?.fields) {
      res = merge(res, d.fields);
    }
  });
  return res;
};

/**
 * Auto generate cell from a spec template
 * @param spec
 * @returns
 */
export const getCellFromSpec = (spec: any, vmindChartType?: ChartType): Cell => {
  if (!spec) {
    return {};
  }
  const { type, direction } = spec;
  const isTransposed = direction === 'horizontal';
  if (type === 'bar' && spec.player) {
    //dynamic bar chart
    const time = spec.timeField;
    const x = spec.yField;
    const y = spec.xField;
    const color = spec.seriesField;
    return { time, x, y, color, isTransposed };
  }
  if (['bar', 'line', 'area'].includes(type)) {
    const x = spec.xField;
    const y = spec.yField;
    const color = spec.seriesField;
    return { x, y, color, isTransposed };
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
      x: spec.categoryField,
      y: spec.valueField,
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
    if ([ChartType.BarChart, ChartType.AreaChart, ChartType.LineChart].includes(vmindChartType)) {
      // single-chart parsed by common type
      return {
        x: uniqArray(
          spec.series
            .map((s: any) => s.xField)
            .filter((xField: string) => !!xField)
            .flat()
        ),
        y: uniqArray(
          spec.series
            .map((s: any) => s.yField)
            .filter((yField: string) => !!yField)
            .flat()
        ),
        color: spec.series[0].seriesField,
        isTransposed: isTransposed || spec.series.every((s: any) => s.direction === 'horizontal')
      };
    }
    //dual-axis chart
    const series = spec.series ?? [];
    if (vmindChartType === ChartType.DualAxisChart) {
      const seriesField = uniqArray(series.map((s: any) => s?.seriesField).filter((v: string) => !!v));
      return {
        x: series[0]?.xField,
        y: uniqArray([series[0]?.yField, series[1]?.yField].filter(Boolean)),
        color: seriesField?.length === 1 ? seriesField[0] : undefined,
        isTransposed
      };
    }
    return getCellFromSpec(series[0], vmindChartType);
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
      y: spec.yField,
      color: spec?.seriesField
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

export const revisedCell = (cell: Cell, dataset: DataTable) => {
  const { color } = cell;
  const colorField = isArray(color) ? color[0] : color;
  if (colorField) {
    const colorList = uniqArray(dataset.map(d => d[colorField])) as DataCell[];
    if (colorList.length <= 1) {
      cell.color = undefined;
    }
  }
  if (cell.isTransposed) {
    const temp = cell.x;
    cell.x = cell.y;
    cell.y = temp;
  }
  return cell;
};

/**
 * remove the fields that is not exist in the fieldInfo from cell
 * @param cell
 * @param fieldInfo
 * @returns
 */
const removeInvalidFieldFromCell = (cell: Cell, fieldInfo: FieldInfo[]) => {
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
 * fill the spec template with dataset
 * @param template
 * @param dataset
 * @param totalTime
 * @returns
 */
export const fillSpecTemplateWithData = (template: any, dataset: DataTable, propsCell?: any, totalTime?: number) => {
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
      datasetNew = foldDataTableByYField(datasetNew, Object.keys(foldMap), fieldInfo);
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
