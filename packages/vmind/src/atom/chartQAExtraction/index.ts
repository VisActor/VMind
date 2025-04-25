import { AtomName } from '../../types/atom';
import type { BaseOptions } from '../../types';
import { BaseAtom } from '../base';
import type { LLMMessage } from '../../types/llm';
import type { ChartQAExtractionCtx } from '../../types';
import { getSystemPrompt } from './prompt';
import { parseLLMJson } from '../../utils/json';
import { Factory } from '../../core/factory';
import type { BaseAtomConstructor } from '../../types';

export class ChartQAExtraction extends BaseAtom<ChartQAExtractionCtx, BaseOptions> {
  name = AtomName.CHART_QA_EXTRACTION;

  isLLMAtom = true;

  constructor(context: ChartQAExtractionCtx, option: BaseOptions) {
    super(context, option);
  }

  getLLMMessages(query?: string): LLMMessage[] {
    const { text } = this.context;
    return [
      {
        role: 'system',
        content: getSystemPrompt(this.options.language)
      },
      {
        role: 'user',
        content: text
      }
    ];
  }

  parseLLMContent(resJson: any): ChartQAExtractionCtx {
    const { answerDSL, keyList, explanation } = resJson;
    if (!answerDSL) {
      console.error('Answer is Empty');
      return {
        ...this.context,
        error: 'Answer is Empty'
      };
    }
    const jsonRes = parseLLMJson(answerDSL);
    if (!jsonRes.error) {
      return {
        ...this.context,
        keyList,
        explanation,
        answer: jsonRes
      };
    }
    return {
      ...this.context,
      keyList,
      explanation,
      answer: answerDSL
    };
  }
}

export const registerChartQAExtractionAtom = () => {
  Factory.registerAtom(
    AtomName.CHART_QA_EXTRACTION,
    ChartQAExtraction as unknown as BaseAtomConstructor<ChartQAExtractionCtx, BaseOptions>
  );
};
