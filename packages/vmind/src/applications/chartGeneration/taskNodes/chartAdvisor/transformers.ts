import { TaskError, VMindDataset, VizSchema } from 'src/typings';
import { chartTypeMap, getCell, typeMap } from './utils';
import { ChartType, chartAdvisor } from '@visactor/chart-advisor';
import { Transformer } from 'src/base/tools/transformer';
import { ChartAdvisorContext, ChartAdvisorOutput } from './types';

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
const chartAdvisorHandler = (schema: Partial<VizSchema>, dataset: any[]) => {
  const advisorResult = getAdvisedChartList(schema, dataset);
  const result = advisorResult.scores.find((d: any) => availableChartTypeList.includes(d.chartType));
  return {
    chartType: chartTypeMap(result.chartType).toUpperCase(),
    cell: getCell(result.cell),
    dataset: result.dataset
  };
};

export const chartAdvisorTransformer: Transformer<ChartAdvisorContext, ChartAdvisorOutput> = (
  context: ChartAdvisorContext
) => {
  const { vizSchema, dataset } = context;
  // call rule-based method to get recommended chart type and fieldMap(cell)
  const advisorResult = chartAdvisorHandler(vizSchema, dataset);
  const chartType = advisorResult.chartType;
  const cell = advisorResult.cell;
  const datasetAdvisor = advisorResult.dataset as VMindDataset;
  const chartSource = 'chartAdvisor';

  return { chartType: chartType.toUpperCase(), cell, dataset: datasetAdvisor, chartSource };
};

export const chartGenerationErrorWrapper: Transformer<ChartAdvisorContext & ChartAdvisorOutput, ChartAdvisorOutput> = (
  context: ChartAdvisorContext & ChartAdvisorOutput
) => {
  const { error } = context as unknown as TaskError;
  if (error) {
    return chartAdvisorTransformer(context);
  }
  return context as ChartAdvisorOutput;
};
