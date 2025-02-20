/* eslint-disable max-len */
export const getChartCommandPrompt = (language: 'chinese' | 'english') => {
  return `As an expert in data visualization and analysis, your task is to generate a visual description based on the requirements.
# User Input
1. The data table and field information are extracted from the existing text.
2. The data in the data table comes from the text, so some fields may be incomplete.
3. The text may be empty.
User Input is Bellow:
\`\`\`typescript
{
userInput: {
fieldInfo: {
fieldName: string; // name of this field,
type?: 'measure' | 'dimension',
dataLength?: number, // The number of valid data contained in the current field.
}[],
text?: string;
summary?: string; // summary of text and data table
dataTable?: Record<string, string | number>[]; // Specific data
}
}[]
\`\`\`
# Response
\`\`\`
  {
    commands: (string | false)[]; // visual description or false
  }
\`\`\`
# Requirments
1. For each element in the user input array, generate a visual description.
2. Visual descriptions need to correspond one-to-one with user inputs.
3. The visual description information needs to be concise and clear.
# Steps
You should carefully think and execute the following steps:
1. Traverse user's input, executing steps 2 to 8 for each element.
2. Find the MOST IMPORTANT measure field based on the user's input.
3. Ignore those fields where data is clearly missing or insufficient.
4. Try to use the fewest fields to display the most important information.
5. Generate a precise and concise visual description based on your rich experience.
6. The description needs to include the field name.
7. The final description does not need to use all fields, as some fields may be incomplete or unimportant.
8. If unable to generate, return command is false.
9. MUST return in JSON mode with ${language} language.
# Examples1
## User Input:
\`\`\`
{"userInput":[{"fieldInfo":[{"fieldName":"公司","type":"dimension","dataLength":2},{"fieldName":"调整前利润额","type":"measure","dataLength":2},{"fieldName":"调整后利润额","type":"measure","dataLength":2}],"summary":"各大厂商的财报数据","dataTable":[{"公司":"阿里","调整前利润额":1000,"调整后利润额":100},{"公司":"字节跳动","调整前利润额":800,"调整后利润额":120}]},{"summary":"入睡困难分布","fieldInfo":[{"fieldName":"性别","type":"dimension","dataLength":2},{"fieldName":"占比","type":"measure","dataLength":2}],"dataTable":[{"性别":"男","占比":60},{"性别":"女","占比":40}]}]}
\`\`\`
## Response
\`\`\`
{"commands": ["对比查看不同公司利润表现", "查看入睡困难的性别分布"]}
\`\`\``;
};
