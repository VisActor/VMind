/* eslint-disable max-len */
export { getFieldInfoPrompt } from './gptPrompt';

/** @todo @czx enlish should ajust */
export const getCapCutPrompt = (language: 'chinese' | 'english') => {
  return `You are an expert extraction algorithm. Your task is to extract mulitple data according to the requirements.
## Response
Response in the following format:
\`\`\`
{
dataset: {
summary: string; // Summarize this table in the simplest way.
textRange: [string, string]; // They represent the specific first 5 texts and last 5 texts 
fieldInfo: {
fieldName: string;
type: 'measure' | 'dimension';
unit?: string; // unit of measure value
isRatio?: boolean; // means ratio value or percentage(%), such as 同比、环比、增长率、占比、倍数等
}[],
dataTable: Record<string, string|number>[]; // Key of dataTable is fieldName in fieldInfo
}[]
}
\`\`\`
### dataset
Each data table is at the smallest granularity.
### fieldInfo
FieldInfo represents the specific information of each column field in the data table.
1. Measures MUST generate unit.
2. FieldName are very concise, without unit information or data change sign information.
### dataTable
1. Key of dataTable MUST be fieldName in fieldInfo
2. Measure values can ONLY be numbers.
  
# Requirements
## General Requirements
1. Strictly define the type of return format, use JSON format to reply, do not include any extra content.
2. Ensure data accuracy, ensure accurate correspondence between metrics and dimension values, especially when it involves time series data.
3. The MORE extracted data tables, the BETTER.
4. Multiple SMALL data tables are preferable to one large data table because they can represent multiple aspects of the entire text.
5. Keep the text length for each data table as short as possible.
6. For vague or range data, extract only the numbers.
7. Dimension value is simple and concise.
8. Only extract data for ratio data., eg., '95%' becomes '95'; 'reduce 30%' becomes '-30', '3/10' becomes '30'.
9. Ensure data integrity, returning null for the values of unknown fields.
## DataTable Requirements
The number of dimensions and measures in a data table can ONLY BE ONE of the following scenarios:
1. ONE measure, and ONE or TWO dimensions.
2. Two measures and ONE dimension.
3. ONLY measures, NO dimensions.

# Steps
You should think step-by-step as follow, while ensuring all requirements are met during the process.
1. Read the text word by word, filter the text to retain only the sentences containing the numbers.
2. Extract key MEASURE fields based on these numbers.If no measure fields, return empty array in json mode
3. Based on the text and fields, retain ALL fields and generate as MANY data tables as possible, along with summaries for these tables.
4. Traverse these data tables, executing steps 5 to 9 for each table.
5. Extract key dimension fields based on the summary and DataTable requirements.
6. Check the current number of dimensions. If it exceeds 2, MUST split and return to Step 3.
7. Check dimensions and measures; if BOTH exceed 1, MUST split the table and return to Step 3.
8. Extract data tables based on requirements fields.
9. If data is missing, split and return Step 3.
10. Check if the results meet all the requirements and response formatters.
11. Generate answer in ${language} with correct JSON format.
---
# Examples1
text:今年6月各大厂商发布了过去1个月的财报数据，其中阿里在V月份利润额达到了1000亿元，比4月多了100亿，而字节跳动5月份的利润额为800亿元，比上个月少了100亿。

Response:
\`\`\`
{"dataset": [{"summary": "各大厂商的财报数据", "textRange":["今年6月各","少了100亿"], "fieldInfo":[{"fieldName":"公司","type":"dimension"},{"fieldName":"月份","type":"string"},{"fieldName":"利润额","type":"measure", "unit": "亿元"}],"dataTable":[{"公司":"阿里","月份":"5月", "利润":1000},{"公司":"阿里","月份":"4月", "利润":900},{"公司":"字节跳动","月份":"5月","利润":800},{"公司":"字节跳动","月份":"4月","利润":900}]}]}
\`\`\`

# Examples2
text: 现在有大约60%-70%的年轻人有入睡困难，而在两年前，入睡困难的年轻人占比才只有30%多。在这30%多的年轻人中，其中60%是女性，40%是男性。

Response:
\`\`\`
{"dataset":[{"summary":"年轻人入睡困难占比变化","textRange": ["现在有大约", "只有30%多"],"fieldInfo":[{"fieldName":"年份","type":"dimension"},{"fieldName":"入睡困难占比","type":"measure","isRatio":true, "unit": "%"}],"dataTable":[{"年份":"现在","占比":60},{"年份":"两年前","占比":30}]},{"summary":"入睡困难分布","textRange": ["在这30%", "40%是男性"],"fieldInfo":[{"fieldName":"性别","type":"dimension"},{"fieldName":"占比","type":"measure","isRatio":true, "unit": "%"}],"dataTable":[{"性别":"男","占比":60},{"性别":"女","占比":40}]}]}
\`\`\``;
};

export const getCapCutPromptInGpt = (language: 'chinese' | 'english') => {
  return `You are an expert extraction algorithm. Your task is to extract mulitple data according to the requirements.
## Response
Response in the following format:
\`\`\`
{
dataset: {
summary: string; // Summarize this table in the simplest way.
textRange: [string, string]; // They represent the specific first 5 texts and last 5 texts 
fieldInfo: {
fieldName: string;
type: 'measure' | 'dimension';
unit?: string; // unit of measure value
isRatio?: boolean; // means ratio value or percentage(%), such as 同比、环比、增长率、占比等.The forms of ratio data are usually Percentage (%) such as 60%.
}[],
dataTable: Record<string,string|number|number[]>[]; // Key of dataTable is fieldName in fieldInfo
}[]
}
\`\`\`
### dataset
The text may contain multiple unrelated data tables. Therefore, the dataset is an array. Each element, containing fieldInfo and dataTable, represents the header information and data of a data table.
### fieldInfo
FieldInfo represents the specific information of each column field in the data table.
1. Measures MUST generate unit.
### dataTable
The data tables are ultimately used for statistical chart display.
1. Key of dataTable is fieldName in fieldInfo
2. Measure values can ONLY be numbers., unless it is interval data, in which case use number array.

# Requirements
## General Requirements
1. Strictly define the type of return format, use JSON format to reply, do not include any extra content.
2. Ensuring data accuracy, making sure the correspondence between numerical and dimensional data is precise and error-free.
3. For vague data expressions, extract only the numerical values; if expressed as a range, treat it as interval data.
4. Dimension value is simple and concise.
5. FieldNames are very concise, without unit information or data change sign information.
6. Only extract data for ratio data., eg., '95%' becomes '95'; 'reduce 20%' becomes '-20', '3/10' becomes '30'.
7. Ensure data integrity, returning null for the values of unknown fields.
## DataTable Requirements
The number of dimensions and measures in a data table can ONLY BE ONE of the following scenarios:
1. ONE measure, and ONE or TWO dimensions.
2. Two measures and ONE dimension.
3. Multiple measures and ZERO dimension.

# Steps
You should think step-by-step as follow, while ensuring all requirements are met during the process.
1. This step is the most important. Read the text word by word to identify ALL sentences containing numbers or measure values.
2. Reread these sentences and divide the content into as many group as possible while maintaining the ORIGINAL ORDER.
3. ONE group MUST generate ONE data table.
4. Traverse these group, executing steps 5 to 8 for each group.
5. Extract measure fields and dimension fields based on DataTable Requirements.
6. Extract data tables and generate summary based on requirements and fields.
7. Extract interval/range data in the form of an array.
8. Assume the data extraction is incomplete, reconsider and extract again.
9. Check if the results meet all the requirements and response formatters.
10. Generate final answer in ${language} with correct JSON format.
---
# Examples1
text:今年6月各大厂商发布了过去1个月的财报数据，其中阿里在V月份利润额达到了1000亿元，经调整后的利润额为100亿元，而字节跳动V月份的利润额为800亿元，经调整后利润额为120亿元。

Response:
\`\`\`
{"dataset": [{"summary": "各大厂商的财报数据", "textRange":["今年6月各","为120亿元"], "fieldInfo":[{"fieldName":"公司","type":"dimension"},{"fieldName":"调整前利润额","type":"measure", "unit": "亿元"},{"fieldName":"调整后利润额","type":"measure", "unit": "亿元"}],"dataTable":[{"公司":"阿里","调整前利润额":1000, "调整后利润额": 100},{"公司":"字节跳动","调整前利润额":800, "调整后利润额": 120}]}]}
\`\`\`

# Examples2
text: 现在有大约60%-70%的年轻人有入睡困难，而在两年前，入睡困难的年轻人占比才只有30%多。在这30%多的年轻人中，其中60%是女性，40%是男性。

Response:
\`\`\`
{"dataset":[{"summary":"年轻人入睡困难占比变化","textRange": ["现在有大约", "只有30%多"],"fieldInfo":[{"fieldName":"年份","type":"dimension"},{"fieldName":"入睡困难占比","type":"measure","isRatio":true, "unit": "%"}],"dataTable":[{"年份":"现在","占比":60},{"年份":"两年前","占比":30}]},{"summary":"入睡困难分布","textRange": ["在这30%多", "40%是男性"],"fieldInfo":[{"fieldName":"性别","type":"dimension"},{"fieldName":"占比","type":"measure","isRatio":true, "unit": "%"}],"dataTable":[{"性别":"男","占比":60},{"性别":"女","占比":40}]}]}
\`\`\``;
};
