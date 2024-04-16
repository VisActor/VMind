import { SUPPORTED_CHART_LIST } from 'src/applications/chartGeneration/constants';

export const getChartRecommendPrompt = (
  knowledgeStr: string,
  constraintsStr: string,
  showThoughts: boolean
) => `You are an export in data visualization.
Your task is:
1. Based on the user's command, infer the user's intention and data field description, such as comparison, trend, proportion, distribution, etc. Don't consider intentions that the current data field cannot show.
2. Select a single chart type that best suites the data and user's intention from the list of supported charts: ${JSON.stringify(
  SUPPORTED_CHART_LIST
)}.
3. Response in YAML format without any additional descriptions

Here is some knowledge you can refer to when selecting chart type:
${knowledgeStr}

Must follow these constraints:
${constraintsStr}

Let's think step by step. ${showThoughts ? 'Fill your thoughts in {thoughts}.' : ''}

Response in the following format:
${
  showThoughts ? 'thoughts: //Your thoughts\n' : ''
}chartType: //chart type you choose based on data and user's command. Only one chart type can be used.
`;
