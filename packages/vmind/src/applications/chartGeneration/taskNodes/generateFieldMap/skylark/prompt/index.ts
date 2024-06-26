import { Prompt } from '../../../../../../base/tools/prompt';
import type { GenerateFieldMapContext } from '../../types';
import { ChartFieldInfo } from './knowledge';
import { getStrFromArray, getStrFromDict } from '../../../../../../common/utils/utils';
import { getFieldMapPrompt } from './template';

export class FieldMapGenerationPrompt extends Prompt<GenerateFieldMapContext> {
  constructor() {
    super('');
  }
  getSystemPrompt(context: GenerateFieldMapContext) {
    const { chartType, llmOptions } = context;

    //call skylark to get field map result.
    const { visualChannels, responseDescription, knowledge } = ChartFieldInfo[chartType.toUpperCase()];
    const visualChannelInfoStr = getStrFromDict(visualChannels);
    const channelResponseStr = getStrFromDict(responseDescription);
    const fieldMapKnowledgeStr = getStrFromArray(knowledge);
    const fieldMapPrompt = getFieldMapPrompt(
      chartType,
      visualChannelInfoStr,
      channelResponseStr,
      fieldMapKnowledgeStr,
      llmOptions.showThoughts ?? true
    );
    return fieldMapPrompt;
  }
  getUserPrompt(context: GenerateFieldMapContext): string {
    const { userInput, fieldInfo } = context;
    const userMessage = `User's Command: ${userInput}\nData field description: ${JSON.stringify(fieldInfo)}`;
    return userMessage;
  }
}
