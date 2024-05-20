import { Prompt } from '../../../../../../base/tools/prompt';
import { ChartAdvisorPromptEnglish } from './template';
import type { GenerateChartAndFieldMapContext } from '../../types';
import { pick } from 'lodash-es';
import { getStrFromArray } from '../../../../../../common/utils/utils';
import { chartGenerationConstraints, chartKnowledgeDict, defaultExamples, visualChannelInfoMap } from './knowledges';
import { uniqArray } from '@visactor/vutils';

const patchUserInput = (userInput: string) => {
  const FULL_WIDTH_SYMBOLS = ['，', '。'];
  const HALF_WIDTH_SYMBOLS = [',', '.'];

  const BANNED_WORD_LIST = ['动态'];
  const ALLOWED_WORD_LIST = ['动态条形图', '动态柱状图', '动态柱图'];
  const PLACEHOLDER = '_USER_INPUT_PLACE_HOLDER';
  const tempStr1 = ALLOWED_WORD_LIST.reduce((prev, cur, index) => {
    return prev.split(cur).join(PLACEHOLDER + '_' + index);
  }, userInput);
  const tempStr2 = BANNED_WORD_LIST.reduce((prev, cur) => {
    return prev.split(cur).join('');
  }, tempStr1);
  const replacedStr = ALLOWED_WORD_LIST.reduce((prev, cur, index) => {
    return prev.split(PLACEHOLDER + '_' + index).join(cur);
  }, tempStr2);

  let finalStr = HALF_WIDTH_SYMBOLS.reduce((prev, cur, index) => {
    return prev.split(HALF_WIDTH_SYMBOLS[index]).join(FULL_WIDTH_SYMBOLS[index]);
  }, replacedStr);
  const lastCharacter = finalStr[finalStr.length - 1];
  if (!FULL_WIDTH_SYMBOLS.includes(lastCharacter) && !HALF_WIDTH_SYMBOLS.includes(lastCharacter)) {
    finalStr += '。';
  }
  finalStr += 'Use the original fieldName and DO NOT change or translate any word of the data fields in the response.';
  return finalStr;
};

export class GPTChartGenerationPrompt extends Prompt<GenerateChartAndFieldMapContext> {
  constructor() {
    super('');
  }
  getSystemPrompt(context: GenerateChartAndFieldMapContext) {
    const { llmOptions, chartTypeList } = context;
    const showThoughts = llmOptions.showThoughts ?? true;

    const sortedChartTypeList = chartTypeList.sort((a, b) => chartKnowledgeDict[a].index - chartKnowledgeDict[b].index);

    const chartKnowledge = sortedChartTypeList.reduce((res, chartType) => {
      const { knowledge } = chartKnowledgeDict[chartType];
      return [...res, ...(knowledge ?? [])];
    }, []);

    const knowledgeStr = getStrFromArray(chartKnowledge);

    const visualChannels = sortedChartTypeList.reduce((res, chartType) => {
      const { visualChannels } = chartKnowledgeDict[chartType];
      return [...res, ...visualChannels];
    }, []);

    const visualChannelsStr = uniqArray(visualChannels)
      .map((channel: string) => `"${channel}": ${visualChannelInfoMap[channel](sortedChartTypeList)}`)
      .join('\n');

    const constraintsStr = getStrFromArray(chartGenerationConstraints);

    const chartExamples = sortedChartTypeList.reduce((res, chartType) => {
      const { examples } = chartKnowledgeDict[chartType];
      const exampleStr = examples.map(e => e(showThoughts));
      return [...res, ...exampleStr];
    }, []);

    const examplesStr = (chartExamples.length > 0 ? chartExamples.slice(0, 4) : defaultExamples).join(
      `\n\n------------------------\n\n`
    );

    const QueryDatasetPrompt = ChartAdvisorPromptEnglish(
      showThoughts,
      chartTypeList,
      knowledgeStr,
      visualChannelsStr,
      constraintsStr,
      examplesStr
    );
    return QueryDatasetPrompt;
  }

  getUserPrompt(context: GenerateChartAndFieldMapContext): string {
    const { userInput: userInputOrigin, vizSchema } = context;
    const userInput = patchUserInput(userInputOrigin);

    const filteredFields = vizSchema.fields
      .filter(
        field => field.visible
        //usefulFields.includes(field.fieldName)
      )
      .map(field => ({
        ...pick(field, ['id', 'description', 'type', 'role'])
      }));
    const chartAdvisorMessage = `User Input: ${userInput}\nData field description: ${JSON.stringify(filteredFields)}`;
    return chartAdvisorMessage;
  }
}
