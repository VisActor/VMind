import type { LLMManage } from '../../core/llm';
import { Schedule } from '../../schedule';
import type { ILLMOptions } from '../../types';
import { AtomName } from '../../types';

export const getText2DataSchedule = (llm: LLMManage, options: ILLMOptions) => {
  return new Schedule([AtomName.DATA_EXTRACT, AtomName.DATA_CLEAN], {
    base: { llm, showThoughts: options?.showThoughts }
  });
};

export const getText2MultipleDataSchedule = (llm: LLMManage, options: ILLMOptions) => {
  return new Schedule([AtomName.DATA_EXTRACT, AtomName.MULTIPLE_DATA_CLEAN], {
    base: { llm, showThoughts: options?.showThoughts }
  });
};

export const getText2ChartSchedule = (llm: LLMManage, options: ILLMOptions) => {
  return new Schedule(
    [AtomName.DATA_EXTRACT, AtomName.DATA_CLEAN, AtomName.DATA_QUERY, AtomName.CHART_COMMAND, AtomName.CHART_GENERATE],
    {
      base: { llm, showThoughts: options?.showThoughts },
      chartGenerate: { useChartRule: true }
    }
  );
};
