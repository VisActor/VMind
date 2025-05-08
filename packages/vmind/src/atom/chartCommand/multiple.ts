import { isArray, merge } from '@visactor/vutils';
import type { MultipleChartCommandsCtx, LLMMessage, ChartCommandOptions, BaseOptions } from '../../types';
import { AtomName } from '../../types';
import { BaseAtom } from '../base';
import { getLanguageOfText } from '../../utils/text';
import { getChartCommandPrompt } from './prompt';
import { getRoleByFieldType } from '../../utils/field';
import { isValidData } from '../../utils/common';
import { Factory } from '../../core/factory';
import type { BaseAtomConstructor } from '../../types';

export class MultipleChartCommandAtom extends BaseAtom<MultipleChartCommandsCtx, ChartCommandOptions> {
  name = AtomName.MULTIPLE_CHART_COMMAND;

  isLLMAtom = true;

  ruleList: boolean[];

  constructor(context: MultipleChartCommandsCtx, option: BaseOptions) {
    super(context, option);
  }

  buildDefaultOptions(): ChartCommandOptions {
    return {
      ...super.buildDefaultOptions(),
      useDataTable: false,
      filterByRule: true
    };
  }

  buildDefaultContext(context: MultipleChartCommandsCtx): MultipleChartCommandsCtx {
    return merge(
      {},
      {
        commands: []
      },
      context
    );
  }

  shouldRunByContextUpdate(context: MultipleChartCommandsCtx): boolean {
    return context.datasets !== this.context.datasets;
  }

  protected runBeforeLLM(): MultipleChartCommandsCtx {
    this.ruleList = this.context.datasets.map(dataset => {
      return this.options?.filterByRule ? dataset?.dataTable?.length < 2 : false;
    });
    return this.context;
  }

  protected getLLMMessages(query?: string): LLMMessage[] {
    const { datasets } = this.context;
    const language = this.options?.language ?? getLanguageOfText(datasets?.[0]?.text || datasets?.[0]?.summary);
    const addtionContent = this.getHistoryLLMMessages(query);
    return [
      {
        role: 'system',
        content: getChartCommandPrompt(language)
      },
      {
        role: 'user',
        content: JSON.stringify({
          userInput: datasets
            .filter((datasets, i) => !this.ruleList[i])
            .map(dataset => {
              const { text, summary, fieldInfo, dataTable } = dataset;
              return {
                text,
                summary,
                fieldInfo: fieldInfo.map(info => ({
                  fieldName: info.fieldName,
                  type: info.role || getRoleByFieldType(info.type),
                  dataLength: dataTable?.filter(v => isValidData(v[info.fieldName]))?.length || undefined
                })),
                dataTable: this.options?.useDataTable ? JSON.stringify(dataTable) : undefined
              };
            })
        })
      },
      ...addtionContent
    ];
  }

  protected parseLLMContent(resJson: any): MultipleChartCommandsCtx {
    const { commands = [] } = resJson;
    if (!isArray(commands) || commands.length === 0) {
      console.error("Can't generate chart command in this case");
      return {
        ...this.context,
        commands: this.context.datasets.map(v => '')
      };
    }
    const res = [];
    let commandIndex = 0;
    for (let i = 0; i < this.context.datasets.length; i++) {
      const isRule = this.ruleList[i];
      if (isRule) {
        res.push('');
      } else {
        res.push(commands[commandIndex++]);
      }
    }
    return {
      ...this.context,
      commands: res
    };
  }
}

export const registerMultipleChartCommandAtom = () => {
  Factory.registerAtom(
    AtomName.MULTIPLE_CHART_COMMAND,
    MultipleChartCommandAtom as unknown as BaseAtomConstructor<MultipleChartCommandsCtx, ChartCommandOptions>
  );
};
