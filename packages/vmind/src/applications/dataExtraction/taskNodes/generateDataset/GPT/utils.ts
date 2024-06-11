import JSON5 from 'json5';
import type { LLMResponse } from '../../../../../common/typings';
import type { Parser } from '../../../../../base/tools/parser';
import type { Requester } from '../../../../../base/tools/requester';
import { parseGPTResponse, requestGPT } from '../../../../../common/utils/gpt';
import type { DataItem, SimpleFieldInfo } from '../../../../../common/typings';
import type { DataExtractionContext, DataExtractionOutput } from '../../../../types';
import { getFieldInfoFromDataset } from '../../../../../common/dataProcess';
import { isArray } from '@visactor/vutils';

type DataExtractionResponse = {
  dataset: DataItem[];
  instruction: string;
  thoughts?: string;
  usage: any;
};

const parseGPTExtractionResponse = (response: string) => {
  const instruction = response.match(/instruction:\n?```(.*?)```/s)[1];
  const datasetStr = response.match(/dataset:\n?```(.*?)```/s)[1];
  let dataset = [];
  try {
    const tempDataset = JSON5.parse(datasetStr);
    if (isArray(tempDataset)) {
      dataset = tempDataset;
    } else {
      dataset = tempDataset.dataset;
    }
  } catch (e) {
    //fieldInfoStr is not a json string; try to wrap it with []
    dataset = JSON5.parse(`[${datasetStr}]`);
  }
  const fieldInfo: SimpleFieldInfo[] = getFieldInfoFromDataset(dataset);
  return {
    instruction,
    dataset,
    fieldInfo
  };
};

export const parseDataExtractionResponse: Parser<LLMResponse, DataExtractionOutput> = (gptResponse: LLMResponse) => {
  const dataExtractionResponse: DataExtractionResponse = parseGPTResponse(gptResponse);
  const { instruction, dataset: responseDataset } = dataExtractionResponse;
  if (!instruction || !responseDataset) {
    //try to parse the response with another format
    const choices = gptResponse.choices;
    const content = choices[0].message.content;
    return {
      ...parseGPTExtractionResponse(content),
      usage: gptResponse.usage
    };
  }
  return { instruction, dataset: responseDataset, fieldInfo: getFieldInfoFromDataset(responseDataset) };
};

export const dataExtractionRequestLLM: Requester<DataExtractionContext> = async (
  prompt: string,
  dataExtractionMessage: string,
  context: DataExtractionContext
) => {
  const { llmOptions } = context;
  const requestFunc = llmOptions.customRequestFunc?.dataExtraction ?? requestGPT;
  const DataExtractionPrompt = prompt;
  const dataProcessRes = await requestFunc(DataExtractionPrompt, dataExtractionMessage, llmOptions);
  return dataProcessRes;
};
