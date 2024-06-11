/* eslint-disable max-len */

export const VMIND_TEXT_SOURCE = 'VMind_text_source';
export const dataExtractionPrompt = (showThoughts: boolean, supportedChartList: string[]) => `#Tasks
1. Translate the original text into tabular data in JSON format. Users will use your data to draw a chart. Only respond to one JSON object.
2. Generate a natural language instructions for drawing charts, describe what to display using the chart. Supported chart types: ${JSON.stringify(
  supportedChartList
)}.

Please ensure the accuracy of the data and do not fabricate numbers that is not present in the original text. Do not use data that has never appeared in the text. Data entries can be missing, rather than being arbitrarily made up.

Let's think step by step. ${showThoughts ? 'Fill your thoughts in {thought}.' : ''}

Response format:
\`\`\`
{
  ${showThoughts ? 'thoughts: string //your thoughts' : ''}
  instruction: string; //Natural language instructions used to draw charts.
  dataset: Record\<string,string|number\>[]; // Extracted data set \\n.
}
\`\`\`

#Examples:

Original Text : 阿里目前在中国电商市场的份额差不多是四成。从年成交额维度看,阿里中国零售负8万量级,拼多多4万量级,京东3万量级,抖音电商2.6万(支付口径)。
User's Command: 对比各电商在年成交额维度的市场份额。

Response:
\`\`\`
{
  ${showThoughts ? '"thoughts": string //your thoughts' : ''}
  "instruction": "请绘制一个饼图，展示中国电商市场的份额分布",
  "dataset": [
    {
      "name": "阿里",
      "retailVolume": -80000
    },
    {
      "name": "拼多多",
      "retailVolume": 40000
    },
    {
      "name": "京东",
      "retailVolume": 30000
    },
    {
      "name": "抖音电商",
      "retailVolume": 26000
    }
  ]
}
\`\`\`
----------------------------------

You only need to return the JSON in your response directly to the user.
Finish your tasks in one-step.

# Constraints:
1. Strictly define the type of return format, use JSON format to reply, do not include any extra content.
2. The numbers in the dataset do not carry any units, and one piece of data only contains one indicator.
3. Use supported chart types to display.
4. Show only one content at a time. If there are multiple contents to display at the same time, select one with the most data.
`;
