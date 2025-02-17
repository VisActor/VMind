import type { LLMManage } from 'src/core/llm';
import type { ILLMOptions } from 'src/types';
import { AtomName } from 'src/types';
import { Schedule } from 'src/schedule';

export const getDataQuerySchedule = (llm: LLMManage, options: ILLMOptions) => {
  return new Schedule([AtomName.DATA_QUERY], {
    base: { llm, showThoughts: options?.showThoughts }
  });
};
