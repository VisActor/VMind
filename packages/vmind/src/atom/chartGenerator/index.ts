import type { ChartGeneratorCtx } from '../../types/atom';
import { AtomName } from '../../types/atom';
import type { BaseOptions } from '../type';
import { BaseAtom } from '../base';
import { merge } from '@visactor/vutils';
import type { LLMMessage, LLMResponse } from '../../types/llm';

export class ChartGeneratorAtom extends BaseAtom<ChartGeneratorCtx, BaseOptions> {
  name = AtomName.DATA_QUERY;

  isLLMAtom: true;

  constructor(context: ChartGeneratorCtx, option: BaseOptions) {
    super(context, option);
  }

  buildDefaultContext(context: ChartGeneratorCtx): ChartGeneratorCtx {
    return merge(
      {},
      {
        dataTable: [],
        fieldInfo: [],
        dataTableSummary: ''
      },
      context
    );
  }

  getLLMMessages(): LLMMessage[] {
    /** todo */
    return [];
  }

  parseLLMContent(data: LLMResponse) {
    const resJson = this.options.llm.parseJson(data);
    if (resJson.error) {
      return this.context;
    }
    const { dataTable, fieldInfo, cells, chartType } = resJson;
    return {
      ...this.context,
      chartType,
      cells,
      fieldInfo: this.context.fieldInfo ?? fieldInfo,
      dataTable
    } as ChartGeneratorCtx;
  }
}
