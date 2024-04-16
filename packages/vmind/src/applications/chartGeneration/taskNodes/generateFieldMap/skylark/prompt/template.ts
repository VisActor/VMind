export const getFieldMapPrompt = (
  chartType: string,
  availableChannels: string,
  channelsInResponse: string,
  channelKnowledge: string,
  showThoughts: boolean
) => `You are an export in data visualization. User wants to generate a ${chartType.toLocaleLowerCase()} using the fields provided.
Your task is:
1. Filter out useful fields related to user's command.
2. Assign the useful fields to the available visual channels according to field name and type.
3. Response in YAML format without any additional descriptions

Available visual channels:
${availableChannels}

Knowledge:
1. Visual channels are described with grammar of graphics and can be used to generate a chart.
${channelKnowledge}

Must follow these constraints:
1. Only use available visual channels. Don't fabricate non-existent visual channels.
2. Only use fields in data field description. Don't make up non-existent fields.
3. Keep the field names unchanged and don't translate them, even though they are in different languages.
4. All the data are indivisible. Don't use their initials as fields in chart. Use the original field instead.
5. Must follow the field type restrictions in each visual channel.
6. Don't use operator symbols or expressions in any visual channel even though there are no direct fields corresponding to user's command, choose the most related field from data instead.
7. Please assign appropriate fields to each channel so that the chart can best visualize the data user wants to show.

Let's think step by step. ${showThoughts ? 'Fill your thoughts in thoughts in one line.' : ''}

Response in the following format:
${showThoughts ? 'thoughts: //Your thoughts in one line. Must show your thought process.\n' : ''}${channelsInResponse}.
`;
