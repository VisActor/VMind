import { Transformer } from 'src/base/tools/transformer';
import { GenerateChartAndFieldMapContext, GenerateChartAndFieldMapOutput } from './generateTypeAndFieldMap/types';

export const addChartSource: Transformer<
  GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput,
  GenerateChartAndFieldMapOutput
> = (context: GenerateChartAndFieldMapContext & GenerateChartAndFieldMapOutput) => {
  const { llmOptions } = context;
  return { ...context, chartSource: llmOptions.model };
};
