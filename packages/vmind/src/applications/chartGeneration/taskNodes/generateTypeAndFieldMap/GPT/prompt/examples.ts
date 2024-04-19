/* eslint-disable max-len */
export const lineChartExample1 = (showThoughts: boolean) => `User Input: 帮我展示降雨量变化趋势.
Data field description: [
{
"id": "日期",
"description": "Represents the current month, which is a date.",
"type": "string",
"role": "dimension"
},
{
"id": "降雨量",
"description": "Represents the rainfall in the current month, which is a number.",
"type": "int",
"role": "measure"
}
]

Response:
\`\`\`
{${showThoughts ? '\n"thought": "Your thoughts",' : ''}
"CHART_TYPE": "Line Chart",
"FIELD_MAP": {
"x": "日期",
"y": "降雨量"
}${
  showThoughts
    ? ',\n"REASON": "User wants to show the trend of the rainfall, which is suitable for displaying with a line chart. The \'日期\' is used as the x-axis because it\'s a date, and the 降雨量 is used as the y-axis because it\'s a number. This chart can show the trend of rainfall."'
    : ''
}
}
\`\`\``;

export const lineChartExample2 = (showThoughts: boolean) => `User Input: 帮我绘制图表, 时长20s.
Data field description: [
{
"id": "日期",
"description": "Represents the current month, which is a date.",
"type": "date",
"role": "dimension"
},
{
"id": "降雨量",
"description": "Represents the rainfall in the current month, which is a number.",
"type": "int",
"role": "measure"
}
]

Response:
\`\`\`
{${showThoughts ? '\n"thought": "Your thoughts",' : ''}"CHART_TYPE": "Line Chart",
"FIELD_MAP": {
"x": "日期",
"y": "降雨量"
}${
  showThoughts
    ? ',\n"REASON": "User did not show their intention about the data in their input. The data has two fields and it contains a date field, so Line Chart is best suitable to show the data. The field \'日期\' is used as the x-axis because it\'s a date, and the 降雨量 is used as the y-axis because it\'s a number. The duration is 20s but we just ignore it."'
    : ''
}
}
\`\`\``;

export const pieChartExample1 = (
  showThoughts: boolean
) => `User Input: 帮我展示各手机品牌的市场占有率, 赛博朋克风格, 时长5s
Data field description: [
{
"id": "品牌名称",
"description": "Represents the name of the mobile phone brand, which is a string.",
"type": "string",
"role": "dimension"
},
{
"id": "市场份额",
"description": "Represents the market share of the brand, which is a percentage.",
"type": "float",
"role": "measure"
}
]

Response:
\`\`\`
{${showThoughts ? '\n"thought": "Your thoughts",' : ''}
"CHART_TYPE": "Pie Chart",
"FIELD_MAP": {
"angle": "市场份额",
"color": "品牌名称"
}${
  showThoughts
    ? ',\n"REASON": "The data contains the market share, and the user wants to show percentage data, which is suitable for displaying with a pie chart. The 市场份额 is used as the angle of the pie chart to show the market share of each brand. The 品牌名称 is used as the color to distinguish different brands. The duration is 5s but we just ignore it."'
    : ''
}
}
\`\`\``;

export const dynamicBarChart1 = (showThoughts: boolean) => `User Input: 帮我展示历届奥运会各国金牌数量的对比.
Data field description: [
{
"id": "country",
"description": "Represents the name of the country, which is a string.",
"type": "string",
"role": "dimension"
},
{
"id": "金牌数量",
"description": "Represents the number of gold medals won by the country in the current year, which is an integer.",
"type": "int",
"role": "measure"
},
{
"id": "year",
"description": "Represents the current year, which is a date.",
"type": "string",
"role": "dimension"
}
]

Response:
\`\`\`
{${showThoughts ? '\n"thought": "Your thoughts",' : ''}
"CHART_TYPE": "Dynamic Bar Chart",
"FIELD_MAP": {
"x": "country",
"y": "金牌数量",
"time": "year"
}${
  showThoughts
    ? ",\n\"REASON\": \"The data contains the year, country, and medal count, and the user's intention contains 'comparison', which is suitable for drawing a dynamic bar chart that changes over time to show the comparison of gold medal counts of various countries in each Olympic Games.The 'country' field is used as the x-axis of the bar chart, and '金牌数量' is used as the y-axis to show the comparison of gold medal counts of various countries in the current year.The 'year' field is used as the time field of the dynamic bar chart to show the comparison of gold medal counts of various countries at different years.\""
    : ''
}
}
\`\`\``;

export const barChartExample1 = (showThoughts: boolean) => `User Input: 帮我展示不同区域各商品销售额。
Data field description: [
{
"id":"商品名称",
"type":"string",
"role":"dimension"
},
{
"id":"region",
"type":"string",
"role":"dimension"
},
{
"id":"销售额",
"type":"int",
"role":"measure"
}
]

Response:
\`\`\`
{${showThoughts ? '\n"thought": "Your thoughts",' : ''}
"CHART_TYPE": "Bar Chart",
"FIELD_MAP": {
"x": "商品名称",
"y": "销售额"
}${
  showThoughts
    ? ",\n\"REASON\": \"User wants to show the sales of different products in different regions, which is suitable for displaying with a bar chart. The '商品名称' is used as the x-axis because it's a string field, and the '销售额' is used as the y - axis because it's a number field. The 'region' field can be used to distinguish different regions, but since the user did not specify the color channel, we will not use it.\""
    : ''
}
}
\`\`\``;
