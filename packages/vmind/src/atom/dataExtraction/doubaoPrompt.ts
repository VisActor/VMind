import { getFieldInfoPrompt as gptFieldInfoPrompt } from './gptPrompt';

/* eslint-disable max-len */
const dataTableExplanation = `## Data Table
1. Key of dataTable is fieldName in fieldInfo
1. The value type of a 'numerical', 'ratio', or 'count' field MUST be 'number' or 'number[]', and DO NOT perform any arithmetic operations..
2. ALWAYS generate flatten data table rather than unflatten data table
### Flatten Data Table Example
\`\`\`
dataTable:[{date:"Monday",class:"class No.1",score:20},{date:"Monday",class:"class No.2",score:30},{date:"Tuesday",class:"class No.1",score:25},{date:"Tuesday",class:"class No.2",score:28}]
\`\`\`
### Unflatten Data Table Example
\`\`\`
dataTable:[{date:"Monday",classNo.1:20,classNo.2:30},{date:"Tuesday",classNo.1:25,classNo.2:28}]
\`\`\``;

const baseExamples = `# Examples1
text:今年6月各大厂商发布了过去1个月的财报数据，其中阿里在V月份利润额达到了1000亿，经调整后的利润额为100亿，而字节跳动V月份的利润额为800亿，经调整后利润额为120亿。

Response:
\`\`\`
{"fieldInfo":[{"fieldName":"公司","description":"公司名称","type":"string",},{"fieldName":"月份","description":"具体月份","type":"string",},{"fieldName":"利润调整","description":"是否经过利润调整","type":"string",},{"fieldName":"利润额","description":"利润总额","type":"numerical",}],"dataTable":[{"公司":"阿里","月份":"5月","利润调整":"调整前","利润额":100000000000,},{"公司":"阿里","月份":"5月","利润调整":"调整后","利润额":10000000000,},{"公司":"字节跳动","月份":"5月","利润调整":"调整前","利润额":80000000000,},{"公司":"字节跳动","月份":"5月","利润调整":"调整后","利润额":12000000000,},]}
\`\`\`
# Examples2
text: John Smith was very tall, ranking in the 90th percentile for his age group. He knew Jane Doe. who ranking in the 75th percentile for her age group.

Response:
\`\`\`
{"fieldInfo":[{"fieldName":"name","description":"The name of a person","type":"string",},{"fieldName":"ranking","description":"The ranking of height in age group","type":"ratio"}],"dataTable":[{"name":"John Smith","ranking":90,},{"name":"Jane Doe","ranking":75}]}
\`\`\`
# Examples3
text: 现在有大约60%-70%的年轻人有入睡困难，而在两年前，入睡困难的年轻人占比才只有30%。

Response:
\`\`\`
{"fieldInfo":[{"fieldName":"年份","description":"数据对应时间","type":"date",dateGranularity:"year"},{"fieldName":"入睡困难占比","description":"年轻人入睡困呐占总人数的比例","type":"ratio"}],"dataTable":[{"年份":"2024","占比":[0.6,0.7],},{"年份":"2022","占比":0.3}]}
\`\`\`
`;

const getCommonInfomation = (language: 'chinese' | 'english') =>
  `# Common Information
${
  language === 'chinese'
    ? `1. 今年是${new Date().getFullYear()}年
2. 8.5折和85折含义相同，都代表85%的折扣`
    : `1. This year is ${new Date().getFullYear()}`
}
`;

const getResponse = (showThoughs: boolean) => `
Response in the following format:
\`\`\`
{
fieldInfo: {
fieldName: string;
description: string;
type: 'date' | 'time' | 'string' | 'region' | 'numerical' | 'ratio' ｜ 'count';
ratioGranularity?: '%' | '‰'; // generate when fieldType is 'ratio', represent the ratio granularity of ratio data
dateGranularity?: 'year' | 'quarter' | 'month' | 'week' | 'day'; // generate when fieldType is 'date', represent the date granularity of date time
}[],
dataTable: Record<string,string|number|number[]>[];
${showThoughs ? 'thoughts: string, // your thought process' : ''}
}
\`\`\`
`;
const getFieldTypeExplanation = (language: 'chinese' | 'english') => {
  return `## Field Information
1. ALWAYS generate a field information, which represents the specific information of each column field in the data table.
2. ALWAYS generate a field description
3. ALWAYS generate a field type, chosen from 'date' | 'time' | 'string' | 'region' | 'numerical' | 'ratio' ｜ 'count';'date' refers to data that can be specified down to the year, quarter, month, week, or day.'ratio' means ratio value or percentage(%), such as ${
    language === 'english' ? 'YoY or MoM' : '同比、环比、增长率、占比等'
  }.The forms of ratio data are usually Percentage (%) such as 60%.'count' means count data
4. ALWAYS generate dateGranularity for 'date' type, represent the date granularity of date time`;
};
export const getBasePrompt = (
  language: 'chinese' | 'english',
  showThoughs: boolean = true
) => `You are an expert extraction algorithm.You are an expert extraction algorithm, especially sensitive to data, date, category, data comparison and similar content.Your task is to extract high-quality data tables and field information from the text for further analysis, such as visualization charts, etc.
# Response
${getResponse(showThoughs)}
${getFieldTypeExplanation(language)}
${dataTableExplanation}
${getCommonInfomation(language)}
# Constraints:
1. Answer language MUST: ${language}
2. Strictly define the type of return format, use JSON format to reply, do not include any extra content.
3. The extracted data strives for simplicity.
4. Prefer flatten data table rather than unflatten data table.
5. Numerical and Ratio data are unit-free, e.g., '10万' becomes '100000', '1k' becomes '1000'.
6. Only extract value in ratio type, eg., '95%' becomes '95'; 'reduce 30%' becomes '-30'.
7. Ensure the correctness of the value and type of each row in dataTable, return null for the value of unknown fields.
8. The change in values should be reflected in the positive or negative nature of the data, not in the field names, such as ${
  language === 'chinese' ? `'下降了50个点'的提取结果为'-50'` : `'Decrease by 50' becomes '-50'`
}.
# Steps
You should think step-by-step as follow:
0. Answer language MUST: ${language}
1. Check if the task involves data extraction. If not, set isDataExtraction to false in json mode; otherwise, proceed with steps.
2. Read the entire text and generate the MOST IMPORTANT fields with numerical or ratio or count field type first.
3. Re-read the text, generate concise and clear fields associated with the fields found in Step2.
4. Extract all relevant data tables from the text based on field information. Each field's data should be concise and convey a single meaning.
5. Format date data based on granularity, e.g., yyyy-mm-dd, mm-dd, mm, yyyy-mm, or yyyy-qq.
6. When a date field has multiple date granularities, change the type of field to string.
7. Extract interval/range data in the form of an array.
8. Avoid any calculations or numerical conversions, like currency conversion.
9. Check the data in the dataTable to ensure the correctness of the type.
10. Recheck all data to ensure that no numerical or ratio data is missing.
---
${baseExamples}`;

export const getFieldInfoPrompt = (
  language: 'chinese' | 'english',
  showThoughs: boolean = true,
  reGenerateFieldInfo: boolean = false
) => gptFieldInfoPrompt(language, showThoughs, reGenerateFieldInfo);
