import type { VMindDataset, VizSchema } from '../../../../common/typings';
import { VMindChartTypeMap, chartTypeMap, checkChartTypeAndCell, getCell, typeMap } from './utils';
import type { ChartType } from '@visactor/chart-advisor';
import { chartAdvisor } from '@visactor/chart-advisor';
import type { Transformer } from '../../../../base/tools/transformer';
import type { ChartAdvisorContext, ChartAdvisorOutput } from './types';
import type { Cell } from '../../types';
import { isValidDataset } from '../../../../common/dataProcess';
import { ChartType as VMindChartType } from '../../../../common/typings';
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

type getAdvisedListOutput = {
  chartSource: string;
  advisedList: {
    chartType: string;
    cell: Cell;
    dataset: VMindDataset;
    score: number;
  }[];
  usage: any;
};

export const getAdvisedListTransformer: Transformer<ChartAdvisorContext, getAdvisedListOutput> = (
  context: ChartAdvisorContext
) => {
  const { vizSchema, dataset, chartTypeList } = context;
  const chartSource = 'chartAdvisor';

  if (!isValidDataset(dataset)) {
    return {
      advisedList: [],
      chartSource,
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    };
  }
  // call rule-based method to get recommended chart type and fieldMap(cell)
  const { scores } = getAdvisedChartList(vizSchema, dataset);
  const availableChartTypeList = chartTypeList.reduce(
    (res, chartType) => [...res, ...(VMindChartTypeMap[chartType] ?? [])],
    []
  );
  const advisedList = scores
    .filter((d: any) => availableChartTypeList.includes(d.chartType) && d.score - 0 >= 0.00000001)
    .map((result: any) => ({
      chartType: chartTypeMap(result.chartType as unknown as ChartType).toUpperCase(),
      cell: getCell(result.cell),
      dataset: result.dataset,
      score: result.score
    }));

  return {
    advisedList,
    chartSource,
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }
  };
};

const getTop1AdvisedChart: Transformer<getAdvisedListOutput, ChartAdvisorOutput> = (context: getAdvisedListOutput) => {
  const { advisedList, chartSource, usage } = context;
  // call rule-based method to get recommended chart type and fieldMap(cell)
  if (advisedList.length === 0) {
    return {
      chartType: VMindChartType.BarChart.toUpperCase() as VMindChartType,
      cell: {},
      dataset: undefined,
      chartSource,
      usage
    };
  }
  const result = advisedList[0];
  return {
    chartType: result.chartType as VMindChartType,
    cell: getCell(result.cell),
    dataset: result.dataset,
    chartSource,
    usage
  };
};

const chartAdvisorHandler = (context: ChartAdvisorContext & ChartAdvisorOutput) => {
  const advisorResult = getAdvisedListTransformer(context);
  return getTop1AdvisedChart(advisorResult);
};

export const chartGenerationErrorWrapper: Transformer<ChartAdvisorContext & ChartAdvisorOutput, ChartAdvisorOutput> = (
  context: ChartAdvisorContext & ChartAdvisorOutput
) => {
  const { error, chartType, fieldInfo, cell } = context as any;
  if (error || !checkChartTypeAndCell(chartType, cell, fieldInfo)) {
    console.warn('LLM generation error, use rule generation.');
    return chartAdvisorHandler(context);
  }
  return context as ChartAdvisorOutput;
};
