import { Prompt } from '../../../../../../base/tools/prompt';
import type { GenerateFieldMapContext } from '../../types';
import { ChartFieldInfo } from './knowledge';
import {
  getStrFromArray,
  getStrFromDict,
  getYAMLArrayStrFromDict,
  getYAMLStrFromArray
} from '../../../../../../common/utils/utils';
import { getFieldMapPrompt } from './template';

export class FieldMapGenerationPrompt extends Prompt<GenerateFieldMapContext> {
  constructor() {
    super('');
  }
  getSystemPrompt(context: GenerateFieldMapContext) {
    const { chartType, llmOptions, subChartType } = context;

    const chartTypeList = subChartType && subChartType.length !== 0 ? subChartType : [chartType];
    const infoMap: any = {
      visualChannelInfoStrMap: {},
      channelResponseStrArray: [],
      fieldMapKnowledgeStrArray: []
    };
    chartTypeList.forEach(chartType => {
      const { visualChannels, responseDescription, knowledge } = ChartFieldInfo[chartType.toUpperCase()];
      infoMap.visualChannelInfoStrMap[chartType] = getStrFromDict(visualChannels);
      infoMap.channelResponseStrArray.push(getYAMLArrayStrFromDict(responseDescription));
      infoMap.fieldMapKnowledgeStrArray.push(...knowledge);
    });
    //call skylark to get field map result.
    const visualChannelInfoStr = getStrFromDict(infoMap.visualChannelInfoStrMap);
    const channelResponseStr = getYAMLStrFromArray(infoMap.channelResponseStrArray);
    const fieldMapKnowledgeStr = getStrFromArray(Array.from(new Set(infoMap.fieldMapKnowledgeStrArray)));
    const fieldMapPrompt = getFieldMapPrompt(
      chartType,
      subChartType,
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
