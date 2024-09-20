/* eslint-disable max-len */
const dataTableExplanation = `# Data Table Explanation
1. ALWAYS generate flatten data table rather than unflatten data table
## Flatten Data Table Example
\`\`\`
dataTable: [{ date: "Monday", class: "class No.1", score: 20 },{ date: "Monday", class: "class No.2", score: 30 },{ date: "Tuesday", class: "class No.1", score: 25 },{ date: "Tuesday", class: "class No.2", score: 28 }]
\`\`\`
## Unflatten Data Table Example
\`\`\`
dataTable: [{date: "Monday", class No.1: 20, class No.2: 30},{date: "Tuesday", class No.1: 25, class No.2: 28}]
\`\`\``;

const baseExamples = `# Examples1
提取文本如下：:今年6月各大厂商发布了过去1个月的财报数据，其中阿里在V月份利润额达到了1000亿，经调整后的利润额为100亿，而字节跳动V月份的利润额为800亿，经调整后利润额为120亿。

Response:
\`\`\`
{"fieldInfo:":[{"fieldName":"公司","description":"公司名称","fieldType":"string",},{"fieldName":"月份","description":"具体月份","fieldType":"string",},{"fieldName":"利润调整","description":"是否经过利润调整","fieldType":"string",},{"fieldName":"利润额","description":"利润总额","fieldType":"numerical",}],"dataTable":[{"公司":"阿里","月份":"5月","利润调整":"调整前","利润额":100000000000,},{"公司":"阿里","月份":"5月","利润调整":"调整后","利润额":10000000000,},{"公司":"字节跳动","月份":"5月","利润调整":"调整前","利润额":80000000000,},{"公司":"字节跳动","月份":"5月","利润调整":"调整后","利润额":12000000000,},]}
\`\`\`
# Examples2
Extracted text is bellow:: John Smith was very tall, ranking in the 90th percentile for his age group. He knew Jane Doe. who ranking in the 75th percentile for her age group.

Response:
\`\`\`
{"fieldInfo:":[{"fieldName":"name","description":"The name of a person","fieldType":"string",},{"fieldName":"ranking","description":"The ranking of height in age group","fieldType":"ratio"}],"dataTable":[{"name":"John Smith","ranking":90,},{"name":"Jane Doe","ranking":75}]}
\`\`\`
# Examples3
提取文本如下：: 现在有大约60%-70%的年轻人有入睡困难，而在两年前，入睡困难的年轻人占比才只有30%。

Response:
\`\`\`
{"fieldInfo:":[{"fieldName":"年份","description":"数据对应时间","fieldType":"date",dateGranularity:"year"},{"fieldName":"入睡困难占比","description":"年轻人入睡困呐占总人数的比例","fieldType":"ratio"}],"dataTable":[{"年份":"2024","占比":[0.6,0.7],},{"年份":"2022","占比":0.3}]}
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

const getFieldTypeExplanation = (language: 'chinese' | 'english') => {
  return `field type explanation is below: Date data refers to data that can be specified down to the year, quarter, month, week, or day.'ratio' means ratio value or percentage(%), such as ${
    language === 'english' ? 'YoY or MoM' : '同比、环比、增长率、占比等'
  }.The forms of ratio data are usually Percentage (%) such as 60%.'count' means count data`;
};
export const getBasePrompt = (
  language: 'chinese' | 'english',
  showThoughs: boolean = true
) => `You are an expert extraction algorithm.You are an expert extraction algorithm, especially sensitive to data, dates data, category, data comparison and similar content.Your task is to extract high-quality data tables and field information from the text for further analysis, such as visualization charts, etc.
# Field Information Explanation
1. ALWAYS generate a field information, which represents the specific information of each column field in the data table.
2. ALWAYS generate a field description
3. ALWAYS generate a field type, chosen from 'date' | 'time' | 'string' | 'region' | 'numerical' | 'ratio' ｜ 'count';${getFieldTypeExplanation(
  language
)}
${dataTableExplanation}
${getCommonInfomation(language)}
# Steps
You should think step-by-step as follow:

0. using language answer: ${language}
1. Determine whether the current task is related to data extraction.
2. If not, return isDataExtraction is false in json mode; If yes, continue follow Steps
3. Read the entire text and fields with numerical or ratio or count field type first.
4. Read all text again and generate field information associated  with the fields found in Step3.The newly generated fields are all simple.
5. Read all text and extract all corresponding data table based on the field information. The data corresponding to a field should always be concise, and a field should express only one meaning.
6. When a date field contains data with multiple date granularities, convert the fieldType to string.
7. Only use numbers that appear in the text, Do not perform any calculations or numerical conversion such as currency conversion calculation.
8. Assume the data is incomplete, then reconsider and execute the task again.

Response in the following format:
\`\`\`
{
isDataExtraction: boolean; // current task is data extraction or not
${showThoughs ? 'thoughts: string, // your thought process' : ''}
fieldInfo: {
fieldName: string; //name of the field.
description?: string; //description of the field. 
fieldType?: 'date' | 'time' | 'string' | 'region' | 'numerical' | 'ratio' ｜ 'count'; // type of field
dateGranularity?: 'year' | 'quarter' | 'month' | 'week' | 'day'; // generate when fieldType is 'date', represent the date granularity of date time
}[],
dataTable: Record<string,string|number|number[]>[]; // Extracted data set, key of dataTable is fieldName in fieldInfo; The type is number[] if and only if current data is range data.
}
\`\`\`
${baseExamples}
---

You only need to return the JSON in your response directly to the user.Finish your tasks in one-step.
# Constraints:
1. Strictly define the type of return format, use JSON format to reply, do not include any extra content.
2. The numbers in the dataset do not carry any units.
3. Only extract value in ratio type, such as '95%' --> '95'; 'reduce 30%' --> '-30'
4. If you do not know the value of an field, return null for the field's value.
5. If it is a date field, standardize the data format according to the date granularity into forms such as the following: yyyy-mm-dd | mm-dd | mm | yyyy-mm | yyyy-qq.
6. The change in values should be reflected in the positive or negative nature of the data, not in the field names.`;

export const getFieldInfoPrompt = (
  language: 'chinese' | 'english',
  showThoughs: boolean = true,
  reGenerateFieldInfo: boolean = false
) => `You are an expert extraction algorithm and are highly sensitive to comparative data, trend data, date data and similar information.Only extract relevant information from the text. Your goal is to extract structured information from the user's input that matches the form described below. When extracting information please make sure it matches the type information exactly.
The definition of the field information is as follows.
\`\`\`
fieldInfo: {
fieldName: string; //name of the field.
description?: string; //description of the field. 
fieldType?: 'date' | 'time' | 'string' | 'region' | 'numerical' | 'ratio' ｜ 'count'; // type of field;${getFieldTypeExplanation(
  language
)}
dataExample?: (string | number)[] // data example of this field
}[]
\`\`\`

${getCommonInfomation(language)}
You should think step-by-step as follow:
# Steps
0. using language answer: ${language}
1. Determine whether the current task is related to data extraction.
2. If not, return isDataExtraction is false in json mode; If yes, continue follow Steps
3. Read all text and extract all corresponding data table based on the field information.
4. Adjust the data to ensure consistency within the same field especially time field.
5. Only use numbers that appear in the text, Do not perform any calculations or numerical conversion such as currency conversion calculation.
6. Assume the data is incomplete, then reconsider and execute the task again.

# Respones
Response in the following format:
\`\`\`
{
isDataExtraction: boolean; // current task is data extraction or not
${showThoughs ? 'thoughts: string, // your thought process' : ''}
${
  reGenerateFieldInfo
    ? `fieldInfo: {
  fieldName: string; //name of the field.
  description?: string; //description of the field. 
  fieldType?: 'date' | 'time' | 'string' | 'region' | 'numerical' | 'ratio' ｜ 'count'; // type of field
  dateGranularity?: 'year' | 'quarter' | 'month' | 'week' | 'day'; // generate when fieldType is 'date', represent the date granularity of date time
  }[]`
    : ''
}
dataTable: Record\<string,string|number\>[]; // Extracted data set, key of dataTable is fieldName in user's fieldInfo
}
\`\`\`

# Examples1:
提取文本如下：:今年6月各大厂商发布了过去1个月的财报数据，其中阿里在V月份利润额达到了1000亿，经调整后的利润额为100亿，而字节跳动V月份的利润额为800亿，经调整后利润额为120亿。
\`\`\`
{"fieldInfo:":[{"fieldName":"公司","description":"公司名称","fieldType":"string",},{"fieldName":"月份","description":"具体月份","fieldType":"string",},{"fieldName":"利润调整","description":"是否经过利润调整","fieldType":"string",},{"fieldName":"利润额","description":"利润总额","fieldType":"numerical",}]}
\`\`\`
Response:
\`\`\`
{"dataTable":[{"公司":"阿里","月份":"5月","利润调整":"调整前","利润额":100000000000,},{"公司":"阿里","月份":"5月","利润调整":"调整后","利润额":10000000000,},{"公司":"字节跳动","月份":"5月","利润调整":"调整前","利润额":80000000000,},{"公司":"字节跳动","月份":"5月","利润调整":"调整后","利润额":12000000000}]}
\`\`\`
# Examples2:

Extracted text is bellow: John Smith was very tall, ranking in the 90th percentile for his age group. He knew Jane Doe. who ranking in the 75th percentile for her age group.
\`\`\`
{"fieldInfo:":[{"fieldName":"name","description":"The name of a person","fieldType":"string","dataExample":["Roy","Stepen Curry","张三","李四"]},{"fieldName":"ranking","description":"The ranking of height in age group","fieldType":"ratio","dataExample": [10, 80]]}}]}
\`\`\`
Response:
\`\`\`
{"dataTable":[{"name":"John Smith","ranking":90,},{"name":"Jane Doe","ranking":75}]}
----------------------------------

You only need to return the JSON in your response directly to the user.
Finish your tasks in one-step.
# Constraints:
1. Strictly define the type of return format, use JSON format to reply, do not include any extra content.
2. The numbers in the dataset do not carry any units.
3. Only use numbers that appear in the text.
4. Only extract value in ratio type, such as '95%' --> '95'; 'reduce 30%' --> '-30'
5. If you do not know the value of an field, return null for the field's value.
6. If it is a date field, standardize the data format according to the date granularity into forms such as the following: yyyy-mm-dd | mm-dd | mm | yyyy-mm | yyyy-qq.
7. The change in values should be reflected in the positive or negative nature of the data, not in the field names.
`;
