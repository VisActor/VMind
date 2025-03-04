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
) => `You are a data visualization expert with an in-depth understanding of visualization grammar. Your task is to provide the chart type and field visualization mapping based on the user's visualization needs and the existing field descriptions.
# User Input
User Input is Bellow:
\`\`\`typescript
{
userInput: string; // User visualization instructions.
fieldInfo: { // field information
id: string; // id of this field, also the field's name
role: 'measure' | 'dimension',
type: 'numerical' | 'ratio' | 'string' | 'date', // 'ratio' means percentage data, 'string' means regular categorical text
description?: string; // description of field
}[],
}
\`\`\`
# Response
Response in the following format:
\`\`\`
{${showThoughts ? '\n"thoughts" : your thoughts' : ''}
"CHART_TYPE": string; // The chart type you choose.
"FIELD_MAP": { // Visualization channel mapping results
${visualChannels}
}${showThoughts ? ',\n"Reason": the reason for selecting the chart type and visual mapping.' : ''}
}
\`\`\`

# Requirements
1. CHART_TYPE MUST selected from ${JSON.stringify(supportedChartList)}
2. All fields MUST be mapped to visual channels.
3. The field names in FIELD_MAP MUST be CONSISTENT with the id in fieldInfo.
4. The color field MUST be a dimension field
5. The y-axis field MUST be a measure field.
6. The x field and the time field MUST be different.
7. Focus only on chart visualization tasks.
8. Strictly define the type of return format, use JSON format to reply, do not include any extra content.
${knowledge.length > 0 ? '\n# Knowledge' : ''}
${knowledge}

# Steps
You should think step-by-step as follow, while ensuring all requirements are met during the process.
1. Based on the user's input, infer the user's intention, such as comparison, ranking, trend display, proportion, distribution, etc. If user did not show their intention, just ignore and do the next steps.
2. Select the SINGLE chart type that best suites the data from the Requirment 1.
3. Map ALL the fields in the data to the visual channels according to user input and the chart type you choose.
4. Check the results to ensure they meet all the requirements.

# Examples
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
  finalStr +=
    'Use the original id in fieldInfo and DO NOT change or translate any word of the data fields in the response.';
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
  return JSON.stringify({
    userInput,
    fieldInfo: filteredFields
  });
};
