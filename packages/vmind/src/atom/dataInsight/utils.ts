/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray, isNumber } from '@visactor/vutils';
import type { Cell } from '../../types';
import { ChartType } from '../../types';
import type { DataItem } from '@visactor/generate-vchart';

export const isStackChartInAxes = (series: any[], chartType: ChartType) => {
  if (chartType !== ChartType.DualAxisChart || !series.length) {
    return false;
  }
  return series.every(
    (s: any) =>
      s?.type === series[0]?.type &&
      ((s.stack !== false && s.type === 'bar') || !!s.stack) &&
      s?.seriesField &&
      !(isArray(s.xField) && s.xField.includes(s.seriesField))
  );
};

export const isStackChart = (spec: any, chartType: ChartType, cell: Cell) => {
  const { seriesField, type, series = [], stack } = spec || {};
  if (type === 'common' && [ChartType.BarChart, ChartType.AreaChart, ChartType.LineChart].includes(chartType)) {
    return series?.every(
      (s: any) => ((s?.stack !== false && s.type === 'bar') || !!s?.stack) && !(isArray(cell.x) && cell.x.length > 1)
    );
  }
  return (
    ((stack !== false && (chartType === ChartType.BarChart || type === 'bar')) || !!stack) &&
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
