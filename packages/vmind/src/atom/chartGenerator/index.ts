/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartGeneratorCtx } from '../../types/atom';
import { AtomName } from '../../types/atom';
import type { ChartGeneratorOptions } from '../type';
import { BaseAtom } from '../base';
import { merge } from '@visactor/vutils';
import type { LLMMessage } from '../../types/llm';
import { DEFAULT_MAP_OPTION, SUPPORTED_CHART_LIST } from './const';
import { getPrompt, revisedUserInput } from './prompt';
import { getContextAfterRevised } from './llmResultRevise';
import { checkChartTypeAndCell, getVizSchema } from './utils';
import { getChartSpecWithContext } from './spec';
import { getRuleLLMContent } from './spec/rule';
import { getCellContextByAdvisor } from './advisor';
import type { ChartType } from '../../types';
import type { GenerateChartCellContext } from './type';

export class ChartGeneratorAtom extends BaseAtom<ChartGeneratorCtx, ChartGeneratorOptions> {
  name = AtomName.CHART_GENERATE;

  isLLMAtom = true;

  useRule = false;

  useChartAdvisor: boolean;

  finalChartTypeList: ChartType[];

  constructor(context: ChartGeneratorCtx, option: ChartGeneratorOptions) {
    super(context, option);
    this.setFinalChartTypeList();
  }

  setFinalChartTypeList() {
    const { chartTypeList, unsupportChartTypeList } = this.options;
    this.finalChartTypeList = chartTypeList.filter(v => !unsupportChartTypeList.includes(v));
  }

  buildDefaultContext(context: ChartGeneratorCtx): ChartGeneratorCtx {
    return merge(
      {},
      {
        dataTable: [],
        fieldInfo: [],
        basemapOption: DEFAULT_MAP_OPTION
      },
      context
    );
  }

  buildDefaultOptions(): ChartGeneratorOptions {
    return {
      useChartAdvisor: false,
      chartTypeList: SUPPORTED_CHART_LIST,
      unsupportChartTypeList: []
    };
  }

  updateContext(context: ChartGeneratorCtx) {
    this.context = super.updateContext(context);
    this.context.vizSchema = getVizSchema(this.context);
    return this.context;
  }

  updateOptions(options: ChartGeneratorOptions): void {
    super.updateOptions(options);
    this.setFinalChartTypeList();
  }

  getLLMMessages(query?: string): LLMMessage[] {
    const { command } = this.context;
    const { showThoughts } = this.options;
    const addtionContent = this.getHistoryLLMMessages(query);
    return [
      {
        role: 'system',
        content: getPrompt(this.finalChartTypeList, showThoughts)
      },
      {
        role: 'user',
        content: revisedUserInput(command, this.context.vizSchema)
      },
      ...addtionContent
    ];
  }

  parseLLMContent(resJson: any) {
    const { CHART_TYPE, FIELD_MAP } = resJson;
    let newContext: GenerateChartCellContext = {
      ...this.context,
      chartType: CHART_TYPE,
      cell: FIELD_MAP,
      chartTypeList: this.finalChartTypeList
    };
    newContext = getContextAfterRevised(newContext);
    const { error, chartType, fieldInfo, cell } = newContext as any;
    this.useChartAdvisor = false;
    if (error || !checkChartTypeAndCell(chartType, cell, fieldInfo)) {
      console.warn('LLM generation error, use rule generation.');
      this.useChartAdvisor = true;
      delete (newContext as any).error;
      delete (newContext as any).message;
    }
    return newContext;
  }

  protected runBeforeLLM(): ChartGeneratorCtx {
    const { dataTable } = this.context;
    this.useRule = false;
    if (this.options.useChartAdvisor) {
      this.isLLMAtom = false;
    }
    if (dataTable.length > 1) {
      return this.context;
    }
    this.isLLMAtom = false;
    this.useRule = true;
    const ruleResJson = getRuleLLMContent(this.context);
    if (ruleResJson) {
      this.updateContext(this.parseLLMContent(ruleResJson));
    } else {
      this.updateContext({
        cell: null
      } as any);
    }
    return this.context;
  }

  protected _runWithOutLLM(): ChartGeneratorCtx {
    this.isLLMAtom = true;
    if (this.useRule && !this.context.cell) {
      /** use table */
      this.context.spec = null;
      return this.context;
    }
    if (!this.useRule && (this.useChartAdvisor || this.options.useChartAdvisor)) {
      // @todo
      const { cell, dataset, chartType } = getCellContextByAdvisor({
        ...this.context,
        chartTypeList: this.finalChartTypeList
      });
      this.context = {
        ...this.context,
        cell,
        dataTable: dataset,
        chartType
      };
    }
    const newContext = {
      ...this.context,
      ...getChartSpecWithContext({ ...this.context, chartTypeList: this.finalChartTypeList })
    };
    this.updateContext(newContext);
    return newContext;
  }
}
