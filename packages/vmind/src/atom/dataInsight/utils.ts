/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray, merge, uniqArray } from '@visactor/vutils';
import type { Cell, DataCell, DataTable } from '../../types';
import { ChartType } from '../../types';

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
    //check if the common chart is dual-axis chart
    const { series } = spec;
    if (series.length === 2 && series.every((s: any) => s.type === 'bar' || s.type === 'line')) {
      return ChartType.DualAxisChart;
    }
    const typeList = uniqArray(series.map((s: any) => s.type));
    if (typeList.length === 1) {
      return getChartTypeFromSpec(series[0], vchartType);
    }
  }
  //unsupported spec
  return undefined;
};

export const getDatasetFromSpec = (spec: any) => {
  if (!spec) {
    return [];
  }
  return spec.data.map((d: any) => d.values).flat(2);
};

export const getFieldMappingFromSpec = (spec: any) => {
  if (!spec) {
    return {};
  }
  let res = {};
  spec.data.forEach((d: any) => {
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
export const getCellFromSpec = (spec: any, chartType?: string) => {
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
    const seriesField = uniqArray(series.map((s: any) => s?.seriesField).filter((v: string) => !!v));
    return {
      x: series[0]?.xField,
      y: uniqArray([series[0]?.yField, series[1]?.yField].filter(Boolean)),
      color: seriesField?.length === 1 ? seriesField[0] : undefined
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

export const revisedCell = (cell: Cell, dataset: DataTable) => {
  const { color } = cell;
  const colorField = isArray(color) ? color[0] : color;
  if (colorField) {
    const colorList = uniqArray(dataset.map(d => d[colorField])) as DataCell[];
    if (colorList.length <= 1) {
      cell.color = undefined;
    }
  }
  return cell;
};

export const isStackChart = (spec: any) => {
  const { stack, xField = [], seriesField } = spec || {};
  return stack && !(isArray(xField) && xField.length === 2 && seriesField && xField[1] !== seriesField);
};

export const isPercentChart = (spec: any) => {
  return !!spec?.percent;
};
