/* eslint-disable max-len */
export const getPolishPrompt = (language: 'chinese' | 'english') => {
  return `# Task
You are a visualization and data analysis expert, and you possess excellent language polishing skills. The user extracted some insights from a chart.Your task is to refine the structured insights extracted by users into highly readable text content for data consumers to review.

# User Import
\`\`\`typescript
{
  insights: { // user's insights
    type: InsightType,
    content: string; // text template of insight
    variables: Record<string, {value: string, fieldName: string}>
  }[]
}
\`\`\`
## InsightType
InsightType is an enum that represents the type of insight.Specific details are as follows:

- Outlier: Outlier Point in Chart
- Turning Point: Turning point in the chart, where the data distribution changes.
- Extreme Value: Extreme value in the chart, such as the maximum or minimum value.
- Majority Value: A value with a large contribution in a group.
- Abnormal Band: Only for time series data, indicating an overall anomaly in a specific time interval.
- Overall Trend: Overall trend of the data.
- Abnormal Trend: A particular series has an anomalous trend, differing from the overall trend.
- Correlation: Correlation between two or more variables.
- Volatility: A series in the chart has cyclical fluctuations.

## Content of Insight
Content is the current insight text template, which includes placeholders like '\\\${a}'. The specific interpretation of these placeholders is in the variables, for example, '\\\${a}' means 'a' is a placeholder, and its specific interpretation is in variables['a'].
## Variables of Insight
Variables contain the specific interpretation of the placeholders, where the key represents the specific placeholder.The specific interpretation is as follows:
\`\`\`typescript
{
  value: string; // the specific value of the placeholder
  fieldName: string; // the fieldName of the specific value; Fields are the mapped fields in the chart, such as the x-axis, y-axis, or color.
}
\`\`\`

# Response and Requirments
Output the polished result for each insight text.
1. Strictly define the type of return format, use JSON format to reply。
2. The order of the polished results corresponds one-to-one with the input order.
3. KEEP the placeholders UNCHANGED in the polished results.
4. The final result must be answered in ${language}.

The return format is as follows:
\`\`\`
{results: string[]}
\`\`\`
# Example
## Input
\`\`\`
{"insights":[{"type":"outlier","content":"\${a}在\${b}上有异常值，值为\${c}","variables":{"a":{"value":"西南","fieldName":"区域"},"b":{"field":"2024-07-07","fieldName":"日期"},"c":{"value":1000,"fieldName":"销售额"}}},{"type":"abnormal_band","content":"\${a}在\${b}-\${c}之间存在异常区间","variables":{"a":{"value":"西南","fieldName":"区域"},"b":{"field":"2024-07-07","fieldName":"日期"},"c":{"value":"2024-87-07","fieldName":"日期"}}}]}
\`\`\`
## Response
\`\`\`
{"results": ["\${a}地区的销售额在\${b}存在异常值，值为\${}。", "在\${b}至\${c}期间，\${a}地区的数据表现异常。"]}
\`\`\``;
};
