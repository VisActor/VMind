import { chartAdvisor, DataTypeName, ChartType } from '@visactor/chart-advisor';
import { Cell, DataItem, VizSchema } from '../../typings';
import { getFieldInfoFromDataset } from '../dataProcess';
import { getSchemaFromFieldInfo } from '../schema';

export const getAdvisedChartsWithDataset = (dataset: DataItem[]) => {
  const fieldInfo = getFieldInfoFromDataset(dataset);
  const schema = getSchemaFromFieldInfo(fieldInfo);
  const { scores } = getAdvisedChartList(schema, dataset);
  return scores
    .filter((d: any) => availableChartTypeList.includes(d.chartType) && d.score - 0 >= 0.00000001)
    .map((result: any) => ({
      chartType: chartTypeMap(result.chartType).toUpperCase(),
      cell: getCell(result.cell),
      dataset: result.dataset
    }));
};

/**
 * call @visactor/chart-advisor to get the list of advised charts
 * sorted by scores of each chart type
 * @param schema
 * @param dataset
 * @returns
 */
const getAdvisedChartList = (schema: Partial<VizSchema>, dataset: any[]) => {
  const dimensionList: any = schema.fields
    .filter(d => d.role === 'dimension')
    .map(d => ({
      uniqueId: d.id,
      type: typeMap(d.type)
    }));
  const measureList: any = schema.fields
    .filter(d => d.role === 'measure')
    .map(d => ({
      uniqueId: d.id,
      type: typeMap(d.type)
    }));
  const aliasMap = Object.fromEntries(schema.fields.map(d => [d.id, d.alias]));
  const advisorResult = chartAdvisor({ originDataset: dataset, dimensionList, measureList, aliasMap });
  return advisorResult;
};
/**
 * get one recommended chart type using @visactor/chart-advisor
 * @param schema
 * @param dataset
 * @returns
 */
export const chartAdvisorHandler = (schema: Partial<VizSchema>, dataset: any[]) => {
  const advisorResult = getAdvisedChartList(schema, dataset);
  const result = advisorResult.scores.find((d: any) => availableChartTypeList.includes(d.chartType));
  return {
    chartType: chartTypeMap(result.chartType).toUpperCase(),
    cell: getCell(result.cell),
    dataset: result.dataset
  };
};

const typeMap = (type: string): DataTypeName => {
  if (['string'].includes(type)) {
    return 'string';
  } else if (['date', 'datetime', 'time'].includes(type)) {
    return 'date';
  } else if (['int', 'float'].includes(type)) {
    return 'number';
  }
  return 'string';
};

const availableChartTypeList = [
  ChartType.COLUMN,
  ChartType.COLUMN_PERCENT,
  ChartType.COLUMN_PARALLEL,
  ChartType.BAR,
  ChartType.BAR_PERCENT,
  ChartType.BAR_PARALLEL,
  ChartType.LINE,
  ChartType.AREA,
  ChartType.AREA_PERCENT,
  ChartType.PIE,
  ChartType.ANNULAR,
  ChartType.ROSE,
  ChartType.SCATTER,
  ChartType.DUAL_AXIS,
  ChartType.WORD_CLOUD,
  ChartType.FUNNEL,
  ChartType.SANKEY,
  ChartType.RADAR
];

const chartTypeMap = (advisorChartType: ChartType) => {
  if (
    [
      ChartType.COLUMN,
      ChartType.COLUMN_PERCENT,
      ChartType.COLUMN_PARALLEL,
      ChartType.BAR,
      ChartType.BAR_PERCENT,
      ChartType.BAR_PARALLEL
    ].includes(advisorChartType)
  ) {
    return 'Bar Chart';
  } else if ([ChartType.LINE, ChartType.AREA, ChartType.AREA_PERCENT].includes(advisorChartType)) {
    return 'Line Chart';
  } else if ([ChartType.PIE, ChartType.ANNULAR].includes(advisorChartType)) {
    return 'Pie Chart';
  } else if (ChartType.ROSE === advisorChartType) {
    return 'Rose Chart';
  } else if (ChartType.SCATTER === advisorChartType) {
    return 'Scatter Plot';
  } else if (ChartType.DUAL_AXIS === advisorChartType) {
    return 'Dual Axis Chart';
  } else if (ChartType.WORD_CLOUD === advisorChartType) {
    return 'Word Cloud';
  } else if (ChartType.FUNNEL === advisorChartType) {
    return 'Funnel Chart';
  } else if (ChartType.SANKEY === advisorChartType) {
    return 'Sankey Chart';
  } else if (ChartType.RADAR === advisorChartType) {
    return 'Radar Chart';
  }
  throw 'no matched chart type';
};

const getCell = (cell: any): Cell => {
  const keys = Object.keys(cell);
  const result: Cell = {};
  keys.forEach((key: string) => {
    const channel = cell[key];
    if (Array.isArray(channel) && channel.length === 1) {
      result[key] = String(channel[0]);
    } else {
      result[key] = Array.isArray(channel) ? channel.map(c => String(c)) : channel;
    }
  });
  return result;
};
