/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartGeneratorCtx } from '../../types/atom';
import { AtomName } from '../../types/atom';
import type { BaseOptions } from '../type';
import { BaseAtom } from '../base';
import { merge } from '@visactor/vutils';
import type { LLMMessage } from '../../types/llm';
import { DEFAULT_MAP_OPTION, SUPPORTED_CHART_LIST } from './const';
import { getPrompt, revisedUserInput } from './prompt';
import { getContextAfterRevised } from './llmResultRevise';
import { getVizSchema } from './vizSchema';
import { checkChartTypeAndCell } from './utils';
import { getChartSpecWithContext } from './spec';

export class ChartGeneratorAtom extends BaseAtom<ChartGeneratorCtx, BaseOptions> {
  name = AtomName.CHART_GENERATE;

  isLLMAtom = true;

  useChartAdvisor: boolean;

  constructor(context: ChartGeneratorCtx, option: BaseOptions) {
    super(context, option);
  }

  buildDefaultContext(context: ChartGeneratorCtx): ChartGeneratorCtx {
    return merge(
      {},
      {
        dataTable: [],
        fieldInfo: [],
        chartTypeList: SUPPORTED_CHART_LIST,
        basemapOption: DEFAULT_MAP_OPTION
      },
      context
    );
  }
  updateContext(context: ChartGeneratorCtx) {
    this.context = super.updateContext(context);
    this.context.vizSchema = getVizSchema(this.context);
    return this.context;
  }

  getLLMMessages(query?: string): LLMMessage[] {
    const { chartTypeList, command } = this.context;
    const { showThoughts } = this.options;
    const addtionContent = this.getHistoryLLMMessages(query);
    return [
      {
        role: 'system',
        content: getPrompt(chartTypeList, showThoughts)
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
    let newContext: ChartGeneratorCtx = { ...this.context, chartType: CHART_TYPE, cell: FIELD_MAP };
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

  protected _runWithOutLLM(): ChartGeneratorCtx {
    if (this.useChartAdvisor) {
      // @todo
    }
    const newContext = {
      ...this.context,
      ...getChartSpecWithContext(this.context)
    };
    this.updateContext(newContext);
    return getChartSpecWithContext(this.context);
  }
}
