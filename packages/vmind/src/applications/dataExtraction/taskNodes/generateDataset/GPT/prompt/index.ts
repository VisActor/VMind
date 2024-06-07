import { Prompt } from '../../../../../../base/tools/prompt';
import { dataExtractionPrompt } from './template';
import type { DataExtractionContext, DataExtractionOutput } from '../../../../../types'


const patchDataExtractionInput = (userInput: string) => {
  if (userInput === '') {
    return 'Please sort out the most comprehensive table data based on the original text content input. ' +
      'Users will use your data to draw a chart';
  } else {
    return userInput;
  }
};

export class GPTDataExtractionPrompt extends Prompt<DataExtractionContext> {
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
    const patchedUserInput = patchDataExtractionInput(userInput);

    const dataExtractionMessage = `User's Command: ${patchedUserInput}\n Original Text: ${dataText}`;

    return dataExtractionMessage;
  }
}
