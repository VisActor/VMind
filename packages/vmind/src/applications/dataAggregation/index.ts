import type { LLMManage } from '../../core/llm';
import type { ILLMOptions } from '../../types';
import { AtomName } from '../../types';
import { Schedule } from '../../schedule';

export const getDataQuerySchedule = (llm: LLMManage, options: ILLMOptions) => {
  return new Schedule([AtomName.DATA_QUERY], {
    base: { llm, showThoughts: options?.showThoughts }
  });
};
