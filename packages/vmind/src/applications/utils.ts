import type { ILLMOptions, VMindOptions } from '../types';
import { AtomName } from '../types';

export const getScheduleLLmOptions = (vmindOptions: VMindOptions): ILLMOptions => {
  const { customRequestFunc = {}, ...others } = vmindOptions;
  const llmCustomOptions: ILLMOptions['customRequestFunc'] = {};
  Object.keys(customRequestFunc).forEach(oldName => {
    switch (oldName) {
      case 'dataExtraction':
        llmCustomOptions[AtomName.DATA_EXTRACT] = customRequestFunc[oldName];
      case 'dataQuery':
        llmCustomOptions[AtomName.DATA_QUERY] = customRequestFunc[oldName];
        break;
      case 'chartCommand':
        llmCustomOptions[AtomName.CHART_COMMAND] = customRequestFunc[oldName];
        break;
      case 'chartAdvisor':
        llmCustomOptions[AtomName.CHART_GENERATE] = customRequestFunc[oldName];
        break;
      case 'IntelligentInsight':
        llmCustomOptions[AtomName.DATA_INSIGHT] = customRequestFunc[oldName];
        break;
      default:
        break;
    }
  });
  return {
    ...others,
    customRequestFunc: llmCustomOptions
  };
};
