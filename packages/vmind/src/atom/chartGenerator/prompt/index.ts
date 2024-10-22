import { pick, uniqArray } from '@visactor/vutils';
import {
  chartGenerationConstraints,
  chartKnowledgeDict,
  defaultExamples,
  getCartesianCoordinateSystemKnowledge,
  getNeedColorAndSizeKnowledge,
  visualChannelInfoMap
} from './knowledges';
import { getStrFromArray } from '../../../utils/common';
import type { ChartType } from '../../../types';
import type { VisualChannel } from '../type';
import type { VizSchema } from '../../type';

/* eslint-disable max-len */
const ChartAdvisorPromptEnglish = (
  showThoughts: boolean,
  supportedChartList: string[],
  knowledge: string,
  visualChannels: string,
  constraints: string,
  examples: string
) => `You are an expert in data visualization.
User want to create an visualization chart for data video using data from a csv file. Ignore the duration in User Input.
Your task is:
1. Based on the user's input, infer the user's intention, such as comparison, ranking, trend display, proportion, distribution, etc. If user did not show their intention, just ignore and do the next steps.
2. Select the single chart type that best suites the data from the list of supported charts. Supported chart types: ${JSON.stringify(
  supportedChartList
)}.
3. Map all the fields in the data to the visual channels according to user input and the chart type you choose. Don't use non-existent fields. Only use existing fields without further processing. If the existing fields can't meet user's intention, just use the most related fields.
${knowledge.length > 0 ? '\nKnowledge' : ''}
${knowledge}

Let's think step by step. ${showThoughts ? 'Fill your thoughts in {thought}.' : ''}

Response in the following format:

\`\`\`
{${showThoughts ? '\n"thought" : your thoughts' : ''}
"CHART_TYPE": the chart type you choose. Supported chart types: ${JSON.stringify(supportedChartList)}.
"FIELD_MAP": { // Visual channels and the fields mapped to them
${visualChannels}
}${showThoughts ? ',\n"Reason": the reason for selecting the chart type and visual mapping.' : ''}
}
\`\`\`

Don't provide further explanations for your results.

Constraints:
${constraints}

Here are some examples:

${examples}
`;

export const getPrompt = (propsChartList: ChartType[], showThoughts: boolean = true) => {
  const chartTypeList = propsChartList.filter(v => !!chartKnowledgeDict[v]);
  const sortedChartTypeList = chartTypeList.sort((a, b) => chartKnowledgeDict[a].index - chartKnowledgeDict[b].index);

  const chartKnowledge = sortedChartTypeList.reduce(
    (res, chartType) => {
      const { knowledge } = chartKnowledgeDict[chartType];
      return [...res, ...(knowledge ?? [])];
    },
    [getNeedColorAndSizeKnowledge(chartTypeList), getCartesianCoordinateSystemKnowledge(chartTypeList)]
  );

  const knowledgeStr = getStrFromArray(chartKnowledge);

  const visualChannels = sortedChartTypeList.reduce((res, chartType) => {
    const { visualChannels } = chartKnowledgeDict[chartType];
    return [...res, ...visualChannels];
  }, []);

  const visualChannelsStr = uniqArray(visualChannels)
    .map((channel: VisualChannel) => `"${channel}": ${visualChannelInfoMap[channel](sortedChartTypeList)}`)
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
};

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

export const revisedUserInput = (query: string, vizSchema: VizSchema) => {
  const userInput = patchUserInput(query);

  const filteredFields = vizSchema.fields
    .filter(
      field => field.visible
      //usefulFields.includes(field.fieldName)
    )
    .map(field => ({
      ...pick(field, ['id', 'description', 'type', 'role'])
    }));
  return `User Input: ${userInput}\nData field description: ${JSON.stringify(filteredFields)}`;
};
