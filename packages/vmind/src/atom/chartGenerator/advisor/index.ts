import type { ChartType } from '@visactor/chart-advisor';
import { chartAdvisor } from '@visactor/chart-advisor';

import type { GenerateChartCellContext } from '../type';
import { isValidDataTable } from '../../../utils/dataTable';
import { chartTypeMap, getCell, typeMap, VMindChartTypeMap } from '../utils';
import type { VizSchema } from '../../type';
import { ChartType as VMindChartType } from '../../../types';
import type { DataTable } from '../../../types';
/**
 * call @visactor/chart-advisor to get the list of advised charts
 * sorted by scores of each chart type
 * @param schema
 * @param dataset
 * @returns
 */
const getAdvisedChartList = (schema: Partial<VizSchema>, dataset: DataTable) => {
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
  const advisorResult = chartAdvisor({ originDataset: dataset as any, dimensionList, measureList, aliasMap });
  return advisorResult;
};

const getAdvisedListTransformer = (context: GenerateChartCellContext) => {
  const { vizSchema, dataTable, chartTypeList } = context;
  const chartSource = 'chartAdvisor';

  if (!isValidDataTable(dataTable)) {
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
  const { scores } = getAdvisedChartList(vizSchema, dataTable);
  const availableChartTypeList = chartTypeList.reduce(
    (res, chartType) => [...res, ...(VMindChartTypeMap?.[chartType] ?? [])],
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

export const getCellContextByAdvisor = (context: GenerateChartCellContext) => {
  const advisorResult = getAdvisedListTransformer(context);
  const { advisedList, chartSource, usage } = advisorResult;
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
