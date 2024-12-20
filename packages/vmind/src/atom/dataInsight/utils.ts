/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray, isNumber, merge, uniqArray } from '@visactor/vutils';
import type { Cell, DataCell, DataItem, DataTable } from '../../types';
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
    const { series } = spec;
    const typeList = uniqArray(series.map((s: any) => s.type));
    if (typeList.length === 1) {
      return getChartTypeFromSpec(series[0], vchartType);
    }
    if (series.length > 1 && series.every((s: any) => s.type === 'bar' || s.type === 'line')) {
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

export const isStackChart = (spec: any, chartType: ChartType, cell: Cell) => {
  const { seriesField, type, series = [], stack } = spec || {};
  if (type === 'common' && [ChartType.BarChart, ChartType.AreaChart, ChartType.LineChart].includes(chartType)) {
    return series?.every((s: any) => !!s?.stack && !(isArray(cell.x) && cell.x.length > 1));
  }
  return (
    ((stack !== false && chartType === ChartType.BarChart) || !!stack) &&
    seriesField &&
    !(isArray(cell.x) && cell.x.includes(seriesField))
  );
};

export const isPercentChart = (spec: any, chartType: ChartType, cell: Cell) => {
  const { type, series = [], seriesField } = spec || {};
  if (type === 'common' && [ChartType.BarChart, ChartType.AreaChart, ChartType.LineChart].includes(chartType)) {
    return series?.every((s: any) => !!s?.percent);
  }
  return !!spec?.percent && !(seriesField && isArray(cell.x) && cell.x.includes(seriesField));
};

const getYSeries = (series: any, yField: string) => {
  return (series ?? []).find((s: any) => s.yField === yField || (isArray(s.yField) && s.yField.includes(yField)));
};

export const isStackSeries = (spec: any, yField: string) => {
  const ySeries = getYSeries(spec?.series, yField);
  if (ySeries) {
    const { xField, seriesField, type, stack } = ySeries;
    return (
      ((stack !== false && type === 'bar') || !!stack) &&
      seriesField &&
      !(isArray(xField) && xField.includes(seriesField))
    );
  }
  return false;
};

export const isPercenSeries = (spec: any, yField: string) => {
  const ySeries = getYSeries(spec?.series, yField);
  if (ySeries) {
    const { percent, seriesField, xField } = ySeries;
    return !!percent && !(seriesField && isArray(xField) && xField.includes(seriesField));
  }
  return false;
};

export const sumDimensionValues = (
  dataset: DataItem[],
  measureId: string | number,
  getValue = (v: number) => Math.abs(v)
) => {
  let validCount = 0;
  const sum = dataset.reduce((prev, cur) => {
    const numValue = Number(cur[measureId]);
    const isValidNumber = isNumber(numValue) && !isNaN(numValue) && cur[measureId] !== '';
    const value = isValidNumber ? getValue(numValue) : 0;
    if (isValidNumber) {
      validCount++;
    }
    return prev + value;
  }, 0);
  // if all of value is invalid number, return null
  return validCount > 0 ? sum : null;
};
