import { Prompt } from '../../../../../../base/tools/prompt';
import type { DataExtractionContext, DataExtractionOutput } from '../../../../../types'
import { dataExtractionPrompt } from "./template";

const patchDataExtractionInput = (userInput: string) => {
  if (userInput === '') {
    return 'Please sort out the most comprehensive table data based on the original text content input. ' +
      'Users will use your data to draw a chart';
  } else {
    return userInput;
  }
};

export class SkylarkDataExtractionPrompt extends Prompt<DataExtractionContext> {
  constructor() {
    super('');
  }
  getSystemPrompt(context: DataExtractionContext) {
    const { llmOptions , chartTypeList} = context;
    const getDatasetPrompt = dataExtractionPrompt(llmOptions.showThoughts ?? true, chartTypeList);
    return getDatasetPrompt;
  }

  getUserPrompt(context: DataExtractionContext): string {
    const { userInput, dataText } = context;
    const patchedInput = patchDataExtractionInput(userInput);

    const dataExtractionMessage = `User's Command: ${patchedInput}\n Original Text: ${dataText}`;
    return dataExtractionMessage;
  }
}
