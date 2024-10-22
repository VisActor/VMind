/* eslint-disable max-len */
export { getFieldInfoPrompt } from './gptPrompt';

/** @todo @czx enlish should ajust */
export const getCapCutPrompt = (language: 'chinese' | 'english') => {
  return `You are an expert extraction algorithm. Your task is to extract data according to the requirements.
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
ratioGranularity?: '%' | '‰'; // generate when fieldType is 'ratio', represent the ratio granularity of ratio data
}[],
dataTable: Record<string,string|number>[]; // Key of dataTable is fieldName in fieldInfo
}[]
}
\`\`\`
### dataset
The text may contain multiple unrelated data tables, forming an array.
### fieldInfo
FieldInfo represents the specific information of each column field in the data table.
1. MUST generate ratioGranularity when 'isRatio' is true.
2. Measures MUST generate unit.
### dataTable
1. Key of dataTable MUST be fieldName in fieldInfo
2. The value type of measure field MUST be 'number'.
  
# Requirements
## General Requirements
1. Strictly define the type of return format, use JSON format to reply, do not include any extra content.
2. Ensuring data accuracy, making sure the correspondence between numerical and dimensional data is precise and error-free.
3. Extract as many data tables as possible, ensuring the completeness of metric values.
4. Data extraction should directly extract data from the text without any calculation or inference.
5. For vague data expressions, extract only the numerical values.
6. Only extract dimensions with simple values and simplify the expression of dimensions and their values to speed up the response.
7. FieldNames are very concise, without unit information or data change sign information.
8. Only extract data for ratio data., eg., '95%' becomes '95'; 'reduce 30%' becomes '-30'.
## DataTable Requirements
The number of dimensions and measures in a data table can ONLY BE ONE of the following scenarios:
1. ONE measure, and ONE or TWO dimensions.
2. Two measures and ONE dimension.
3. ONLY measures, NO dimensions.

# Steps
You should think step-by-step as follow, while ensuring all requirements are met during the process.
1. Check if the task involves data extraction. If not, set isDataExtraction to false in json mode; otherwise, proceed with steps.
2. Read the text and think carefully, generate k(k>=1) data tables as much as possible and generate summary for them.
3. Traverse these k tables, executing steps 4 to 9 for each table.
4. Extract key measure fields and dimension fields based on the summary and DataTable Requirements.
5. Check the current number of dimensions. If it exceeds 2, MUST split and return to Step 3.
6. Check dimensions and measures; if BOTH exceed 1, MUST split the table and return to Step 3.
7. Extract data tables from the text based on fields and requirements.
8. Ensure the correctness of the value and type of each row in dataTable, return null for the value of unknown fields.
9. Recheck all data to ensure that no numerical or ratio data is missing.
10. Generate a concise, clear final answer in ${language} with correct JSON format.
---
# Examples1
text:今年6月各大厂商发布了过去1个月的财报数据，其中阿里在V月份利润额达到了1000亿元，经调整后的利润额为100亿元，而字节跳动V月份的利润额为800亿元，经调整后利润额为120亿元。

Response:
\`\`\`
{"dataset": [{"summary": "各大厂商的财报数据", "textRange":["今年6月各","120亿元。"], "fieldInfo":[{"fieldName":"公司","type":"dimension"},{"fieldName":"调整前利润额","type":"measure", "unit": "亿元"},{"fieldName":"调整后利润额","type":"measure", "unit": "亿元"}],"dataTable":[{"公司":"阿里","调整前利润额":1000, "调整后利润额": 100},{"公司":"字节跳动","调整前利润额":800, "调整后利润额": 120}]}]}
\`\`\`

# Examples2
text: 现在有大约60%-70%的年轻人有入睡困难，而在两年前，入睡困难的年轻人占比才只有30%多。在这30%多的年轻人中，其中60%是女性，40%是男性。

Response:
\`\`\`
{"dataset":[{"summary":"年轻人入睡困难占比变化","textRange": ["现在有大约", "30%多。"],"fieldInfo":[{"fieldName":"年份","type":"dimension",},{"fieldName":"入睡困难占比","type":"measure","isRatio":true,"ratioGranularity": "%"}],"dataTable":[{"年份":"现在","占比":60},{"年份":"两年前","占比":30}]},{"summary":"入睡困难分布","textRange": ["在这30%", "40%是男性。"],"fieldInfo":[{"fieldName":"性别","type":"dimension"},{"fieldName":"占比","type":"measure","isRatio":true, "ratioGranularity": "%"}],"dataTable":[{"性别":"男","占比":60},{"性别":"女","占比":40}]}]}
\`\`\``;
};

export const getCapCutPromptInGpt = (language: 'chinese' | 'english') => {
  return `You are an expert extraction algorithm, especially sensitive to data, date, category, data comparison and similar content.Your task is to extract data according to the requirements.
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
ratioGranularity?: '%' | '‰'; // generate when fieldType is 'ratio', represent the ratio granularity of ratio data
isDate?: boolean; //'date' refers to data that can be specified down to the year, quarter, month, week, or day.
}[],
dataTable: Record<string,string|number|number[]>[]; // Key of dataTable is fieldName in fieldInfo
}[]
}
\`\`\`
### dataset
The text may contain multiple unrelated data tables. Therefore, the dataset is an array. Each element, containing fieldInfo and dataTable, represents the header information and data of a data table.
### fieldInfo
FieldInfo represents the specific information of each column field in the data table.
1. MUST generate ratioGranularity when 'isRatio' is true.
2. Measures MUST generate unit.
### dataTable
The data tables are ultimately used for statistical chart display.
1. Key of dataTable is fieldName in fieldInfo
2. The value type of measure field MUST be 'number', unless it is interval data, in which case use 'number[]'.

# Requirements
## General Requirements
1. Strictly define the type of return format, use JSON format to reply, do not include any extra content.
2. Ensuring data accuracy, making sure the correspondence between numerical and dimensional data is precise and error-free.
3. Data extraction should directly extract data from the text without any calculation or inference.
4. For vague data expressions, extract only the numerical values; if expressed as a range, treat it as interval data.
5. Only extract dimensions with simple values.
6. FieldNames are very concise, without unit information or data change sign information.
7. Only extract data for ratio data., eg., '95%' becomes '95'; 'reduce 30%' becomes '-30'.
## DataTable Requirements
The number of dimensions and measures in a data table can ONLY BE ONE of the following scenarios:
1. ONE measure, and ONE or TWO dimensions.
2. Two measures and ONE dimension.
3. Multiple measures and ZERO dimension.

# Steps
You should think step-by-step as follow, while ensuring all requirements are met during the process.
1. Read the entire text to find the key measure fields.
2. Reread the text, split it into k(k>=1) data tables based on measure fields.
3. Traverse these k tables, executing steps 4 to 9 for each table.
4. Extract dimension fields based on the current summary and measure fields and DataTable Requirements.
5. Check the current number of dimensions. If it exceeds 2, split and return to Step 3.
6. Check dimensions and measures; if both exceed 1, split the table and return to Step 3.
7. Extract data tables from the text based on field and requirements.
8. Extract interval/range data in the form of an array.
9. Ensure the correctness of the value and type of each row in dataTable, return null for the value of unknown fields.
10. Generate a concise, clear final answer in ${language} with correct JSON format.
---
# Examples1
text:今年6月各大厂商发布了过去1个月的财报数据，其中阿里在V月份利润额达到了1000亿元，经调整后的利润额为100亿元，而字节跳动V月份的利润额为800亿元，经调整后利润额为120亿元。

Response:
\`\`\`
{"dataset": [{"summary": "各大厂商的财报数据", "textRange":["今年6月各","120亿元。"], "fieldInfo":[{"fieldName":"公司","type":"dimension"},{"fieldName":"调整前利润额","type":"measure", "unit": "亿元"},{"fieldName":"调整后利润额","type":"measure", "unit": "亿元"}],"dataTable":[{"公司":"阿里","调整前利润额":1000, "调整后利润额": 100},{"公司":"字节跳动","调整前利润额":800, "调整后利润额": 120}]}]}
\`\`\`

# Examples2
text: 现在有大约60%-70%的年轻人有入睡困难，而在两年前，入睡困难的年轻人占比才只有30%多。在这30%多的年轻人中，其中60%是女性，40%是男性。

Response:
\`\`\`
{"dataset":[{"summary":"年轻人入睡困难占比变化","textRange": ["现在有大约", "30%多。"],"fieldInfo":[{"fieldName":"年份","type":"dimension",},{"fieldName":"入睡困难占比","type":"measure","isRatio":true,"ratioGranularity": "%"}],"dataTable":[{"年份":"2024","占比":[60,70]},{"年份":"2022","占比":30}]},{"summary":"入睡困难分布","textRange": ["在这30%", "%是男性。"],"fieldInfo":[{"fieldName":"性别","type":"dimension"},{"fieldName":"占比","type":"measure","isRatio":true, "ratioGranularity": "%"}],"dataTable":[{"性别":"男","占比":60},{"性别":"女","占比":40}]}]}
\`\`\``;
};
