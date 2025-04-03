import type { LLMManage } from '../../core/llm';
import type { ILLMOptions } from '../../types';
import { AtomName } from '../../types';
import { Schedule } from '../../schedule';

export const getDataInsightSchedule = (llm: LLMManage, options: ILLMOptions) => {
  return new Schedule([AtomName.DATA_INSIGHT, AtomName.SPEC_INSIGHT], {
    base: { llm, showThoughts: options?.showThoughts }
  });
};
