/**
 * @todo @666haiwen optimize and expand with old develop branch feat/v1_develop
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartGeneratorCtx, LLMMessage, BaseAtomConstructor } from '../../types';
import { AtomName } from '../../types/atom';
import { BaseAtom } from '../base';
import { merge } from '@visactor/vutils';
import { SUPPORTED_CHART_LIST } from './const';
import { getPrompt, revisedUserInput } from './prompt';
import { getContextAfterRevised } from './llmResultRevise';
import { checkChartTypeAndCell, getVizSchema } from './utils';
import { getChartSpecWithContext } from './spec';
import { getCellContextBySimpleVChartSpec, getRuleLLMContent } from './rule';
import { getCellContextByAdvisor } from './advisor';
import type { ChartType } from '../../types';
import type { GenerateChartCellContext, ChartGeneratorOptions } from './type';
import { Factory } from '../../core/factory';
import { getFieldInfoFromDataset } from '@visactor/generate-vchart';

export class ChartGeneratorAtom extends BaseAtom<ChartGeneratorCtx, ChartGeneratorOptions> {
  name = AtomName.CHART_GENERATE;

  isLLMAtom = true;

  private _generateType: 'rule' | 'llm' | 'simpleSpec' | 'chartAdvistor' = 'llm';

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
        fieldInfo: []
      },
      context
    );
  }

  buildDefaultOptions(): ChartGeneratorOptions {
    return {
      ...super.buildDefaultOptions(),
      useChartAdvisor: false,
      chartTypeList: SUPPORTED_CHART_LIST,
      unsupportChartTypeList: [],
      useChartRule: false
    };
  }

  updateContext(context: Partial<ChartGeneratorCtx>) {
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
    const { CHART_TYPE, FIELD_MAP, thoughts, stackOrPercent, transpose } = resJson;
    let newContext: GenerateChartCellContext = {
      ...this.context,
      thoughts,
      chartType: CHART_TYPE,
      cell: FIELD_MAP,
      chartTypeList: this.finalChartTypeList,
      stackOrPercent,
      transpose
    };
    newContext = getContextAfterRevised(newContext);
    const { error, chartType, fieldInfo, cell } = newContext as any;

    if (error || !checkChartTypeAndCell(chartType, cell, fieldInfo)) {
      console.warn('LLM generation error, use rule generation.');
      delete (newContext as any).error;
      delete (newContext as any).message;
    }
    return newContext;
  }

  protected runBeforeLLM(): ChartGeneratorCtx {
    const { dataTable, fieldInfo, simpleVChartSpec } = this.context;

    if (simpleVChartSpec) {
      this.isLLMAtom = false;
      this._generateType = 'simpleSpec';
      const { ctx, mockLLMContent } = getCellContextBySimpleVChartSpec(simpleVChartSpec);
      this.updateContext(ctx);
      this.updateContext(this.parseLLMContent(mockLLMContent));
    } else {
      if (!fieldInfo || fieldInfo.length === 0) {
        this.updateContext({
          fieldInfo: getFieldInfoFromDataset(dataTable)
        });
      }
      if ((dataTable.length > 1 || !this.options.useChartRule) && !simpleVChartSpec) {
        this._generateType = this.options.useChartAdvisor ? 'chartAdvistor' : 'llm';
        this.isLLMAtom = this._generateType === 'llm';

        return this.context;
      }

      this.isLLMAtom = false;
      this._generateType = 'rule';
      const ruleResJson = getRuleLLMContent(this.context);
      if (ruleResJson) {
        this.updateContext(this.parseLLMContent(ruleResJson));
      } else {
        this.updateContext({
          cell: null
        } as any);
      }
    }

    return this.context;
  }

  protected runWithLLMError(error: string): ChartGeneratorCtx {
    super._runWithOutLLM();
    this._generateType = 'chartAdvistor';
    return this._runWithOutLLM();
  }

  protected _runWithOutLLM(): ChartGeneratorCtx {
    this.isLLMAtom = true;

    if (this._generateType === 'rule' && !this.context.cell) {
      /** use table */
      this.context.spec = null;
      return this.context;
    }
    const additionalCtx = {
      chartTypeList: this.finalChartTypeList,
      basemapOption: this.options?.basemapOption,
      totalTime: this.options?.animationDuration,
      colors: this.options?.colorPalette,
      chartTheme: this.options?.theme
    };
    if (this._generateType === 'chartAdvistor' || this.options.useChartAdvisor) {
      // @todo
      const { cell, dataset, chartType, advisedList, usage } = getCellContextByAdvisor({
        ...this.context,
        ...additionalCtx
      });
      this.context = {
        ...this.context,
        usage,
        cell,
        dataTable: dataset,
        chartType,
        chartAdvistorRes: advisedList.map(item => {
          const tmpContext = merge({}, this.context, {
            cell: item.cell,
            dataTable: item.dataset,
            chartType: item.chartType
          });
          return {
            chartType: item.chartType as ChartType,
            score: item.score,
            spec: getChartSpecWithContext({ ...tmpContext, ...additionalCtx }).spec
          };
        })
      };
    } else {
      this.context.chartAdvistorRes = [];
    }
    const newContext = {
      ...this.context,
      ...getChartSpecWithContext({ ...this.context, ...additionalCtx })
    };
    this.updateContext(newContext);
    return newContext;
  }
}

export const registerChartGeneratorAtom = () => {
  Factory.registerAtom(
    AtomName.CHART_GENERATE,
    ChartGeneratorAtom as unknown as BaseAtomConstructor<ChartGeneratorCtx, ChartGeneratorOptions>
  );
};
