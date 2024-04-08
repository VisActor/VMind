import { convertNumberField, getDataset, parseCSVData } from '../../common/dataProcess';
import { getFieldDomain, readTopNLine } from '../../common/dataProcess/utils';
import { ILLMOptions, SimpleFieldInfo } from '../../typings';
import { parseGPTResponse, requestGPT } from '../../taskNode/utils';
import { DataProcessPromptEnglish } from './prompts';

/*
 ** call GPT to parse csv data
 **get the fieldInfo from csv file
 */
export const parseCSVDataWithGPT = async (csvFile: string, userInput: string, options: ILLMOptions | undefined) => {
  const DATA_TOP_N = 5; //取csv文件的前多少条数据
  const topNCSVFile = readTopNLine(csvFile, DATA_TOP_N);
  const dataProcessMessage = `CSV file content:\n${topNCSVFile}\nUser Input: ${userInput}`;

  const requestFunc = options.customRequestFunc?.dataProcess ?? requestGPT;

  const dataProcessRes = await requestFunc(DataProcessPromptEnglish, dataProcessMessage, options);

  const dataProcessResJson = parseGPTResponse(dataProcessRes);
  const { dataset } = getDataset(csvFile);
  if (!dataProcessResJson.error) {
    const fieldInfo = dataProcessResJson['FIELD_INFO'].map((field: SimpleFieldInfo) => {
      //add domain for fields
      const { fieldName, role } = field;
      const domain = getFieldDomain(dataset, fieldName, role);
      return {
        ...field,
        domain
      };
    });
    return {
      fieldInfo,
      videoDuration: dataProcessResJson['VIDEO_DURATION'],
      colorPalette: dataProcessResJson['COLOR_PALETTE'],
      usefulFields: dataProcessResJson['USEFUL_FIELDS'],
      dataset: convertNumberField(dataset, fieldInfo),
      error: dataProcessResJson['error'],
      thought: dataProcessResJson['thought'],
      usage: dataProcessRes['usage']
    };
  } else {
    //传统方法做兜底
    const { fieldInfo } = parseCSVData(csvFile);
    console.error('gpt parse data error!');
    return { fieldInfo, dataset };
  }
};
