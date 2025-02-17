import type { LLMManage } from '../../core/llm';
import { Schedule } from '../../schedule';
import type { ILLMOptions } from '../../types';
import { AtomName, Model } from '../../types';

export const getData2ChartSchedule = (llm: LLMManage, options: ILLMOptions) => {
  const useChartAdvisor = llm.options.model === Model.CHART_ADVISOR || !llm.options?.headers;
  if (useChartAdvisor) {
    return new Schedule([AtomName.CHART_GENERATE], {
      base: { llm },
      chartGenerate: { useChartAdvisor: true }
    });
  }
  return new Schedule([AtomName.DATA_QUERY, AtomName.CHART_GENERATE], {
    base: { llm, showThoughts: options?.showThoughts },
    chartCommand: { useDataTable: true }
  });
};
