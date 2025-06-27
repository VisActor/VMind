import { array } from '@visactor/vutils';
import { color, data, discreteLegend } from './common';
import { isValidDataTable } from '../utils/data';
import { GenerateChartInput } from '../types/transform';

export const boxPlotField = (context: GenerateChartInput) => {
  const { cell, dataTable, spec } = context;
  const { x, y } = cell;
  const data = isValidDataTable(dataTable) ? (dataTable as { [key: string]: number }[]) : [];
  // assign x field
  spec.xField = x;
  // assign y field
  // 1. sort y field according to its value
  array(y).sort((a, b) => data[0]?.[a] ?? 0 - data[0]?.[b] ?? 0);
  const yFieldsLen = y.length;
  // 2. Map the maximum, minimum, median, and upper and lower quartiles respectively according to numerical value.
  spec.minField = y[0]; // Minimum value field: the field with the smallest value.
  spec.q1Field = y[Math.min(1, yFieldsLen - 1)]; // Lower quartile field: the field with the second smallest value.
  spec.medianField = y[Math.floor((yFieldsLen - 1) / 2)]; // Median: the field with a value in the middle.
  spec.q3Field = y[Math.max(0, yFieldsLen - 2)]; // Upper quartile field: the field with the second highest value.
  spec.maxField = y[yFieldsLen - 1]; // Maximum value field: the field with the highest value.
  return { spec };
};

export const pipelineBoxPlot = [data, color, boxPlotField, discreteLegend];
